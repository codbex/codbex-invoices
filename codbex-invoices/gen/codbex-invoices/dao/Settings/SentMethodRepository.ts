import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface SentMethodEntity {
    readonly Id: number;
    Name?: string;
}

export interface SentMethodCreateEntity {
    readonly Name?: string;
}

export interface SentMethodUpdateEntity extends SentMethodCreateEntity {
    readonly Id: number;
}

export interface SentMethodEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        contains?: {
            Id?: number;
            Name?: string;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
    },
    $select?: (keyof SentMethodEntity)[],
    $sort?: string | (keyof SentMethodEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface SentMethodEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SentMethodEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface SentMethodUpdateEntityEvent extends SentMethodEntityEvent {
    readonly previousEntity: SentMethodEntity;
}

export class SentMethodRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_SENTMETHOD",
        properties: [
            {
                name: "Id",
                column: "SENTMETHOD_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "SENTMETHOD_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(SentMethodRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: SentMethodEntityOptions): SentMethodEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): SentMethodEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: SentMethodCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_SENTMETHOD",
            entity: entity,
            key: {
                name: "Id",
                column: "SENTMETHOD_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: SentMethodUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_SENTMETHOD",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "SENTMETHOD_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: SentMethodCreateEntity | SentMethodUpdateEntity): number {
        const id = (entity as SentMethodUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SentMethodUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_SENTMETHOD",
            entity: entity,
            key: {
                name: "Id",
                column: "SENTMETHOD_ID",
                value: id
            }
        });
    }

    public count(options?: SentMethodEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_SENTMETHOD"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SentMethodEntityEvent | SentMethodUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices-Settings-SentMethod", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-invoices-Settings-SentMethod").send(JSON.stringify(data));
    }
}
