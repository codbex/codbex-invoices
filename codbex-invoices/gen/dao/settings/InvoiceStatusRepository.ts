import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface InvoiceStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface InvoiceStatusCreateEntity {
    readonly Name?: string;
}

export interface InvoiceStatusUpdateEntity extends InvoiceStatusCreateEntity {
    readonly Id: number;
}

export interface InvoiceStatusEntityOptions {
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
    $select?: (keyof InvoiceStatusEntity)[],
    $sort?: string | (keyof InvoiceStatusEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface InvoiceStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<InvoiceStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class InvoiceStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_INVOICESTATUS",
        properties: [
            {
                name: "Id",
                column: "INVOICESTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "INVOICESTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(InvoiceStatusRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: InvoiceStatusEntityOptions): InvoiceStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): InvoiceStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: InvoiceStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_INVOICESTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "INVOICESTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: InvoiceStatusUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_INVOICESTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "INVOICESTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: InvoiceStatusCreateEntity | InvoiceStatusUpdateEntity): number {
        const id = (entity as InvoiceStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as InvoiceStatusUpdateEntity);
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
            table: "CODBEX_INVOICESTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "INVOICESTATUS_ID",
                value: id
            }
        });
    }

    public count(): number {
        return this.dao.count();
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__INVOICESTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: InvoiceStatusEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices/settings/InvoiceStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.queue("codbex-invoices/settings/InvoiceStatus").send(JSON.stringify(data));
    }
}