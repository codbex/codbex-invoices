import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface SentMethodsEntity {
    readonly Id: number;
    Name?: string;
}

export interface SentMethodsCreateEntity {
    readonly Name?: string;
}

export interface SentMethodsUpdateEntity extends SentMethodsCreateEntity {
    readonly Id: number;
}

export interface SentMethodsEntityOptions {
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
    $select?: (keyof SentMethodsEntity)[],
    $sort?: string | (keyof SentMethodsEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface SentMethodsEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SentMethodsEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class SentMethodsRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_SENTMETHODS",
        properties: [
            {
                name: "Id",
                column: "SENTMETHODS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "SENTMETHODS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(SentMethodsRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: SentMethodsEntityOptions): SentMethodsEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): SentMethodsEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: SentMethodsCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_SENTMETHODS",
            entity: entity,
            key: {
                name: "Id",
                column: "SENTMETHODS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: SentMethodsUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_SENTMETHODS",
            entity: entity,
            key: {
                name: "Id",
                column: "SENTMETHODS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: SentMethodsCreateEntity | SentMethodsUpdateEntity): number {
        const id = (entity as SentMethodsUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SentMethodsUpdateEntity);
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
            table: "CODBEX_SENTMETHODS",
            entity: entity,
            key: {
                name: "Id",
                column: "SENTMETHODS_ID",
                value: id
            }
        });
    }

    public count(options?: SentMethodsEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(options?: SentMethodsEntityOptions): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_SENTMETHODS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SentMethodsEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices/entities/SentMethods", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.queue("codbex-invoices/entities/SentMethods").send(JSON.stringify(data));
    }
}