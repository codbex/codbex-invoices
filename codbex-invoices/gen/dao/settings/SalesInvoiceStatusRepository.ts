import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface SalesInvoiceStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface SalesInvoiceStatusCreateEntity {
    readonly Name?: string;
}

export interface SalesInvoiceStatusUpdateEntity extends SalesInvoiceStatusCreateEntity {
    readonly Id: number;
}

export interface SalesInvoiceStatusEntityOptions {
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
    $select?: (keyof SalesInvoiceStatusEntity)[],
    $sort?: string | (keyof SalesInvoiceStatusEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface SalesInvoiceStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SalesInvoiceStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class SalesInvoiceStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_SALESINVOICESTATUS",
        properties: [
            {
                name: "Id",
                column: "SALESINVOICESTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "SALESINVOICESTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(SalesInvoiceStatusRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: SalesInvoiceStatusEntityOptions): SalesInvoiceStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): SalesInvoiceStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: SalesInvoiceStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_SALESINVOICESTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESINVOICESTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: SalesInvoiceStatusUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_SALESINVOICESTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESINVOICESTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: SalesInvoiceStatusCreateEntity | SalesInvoiceStatusUpdateEntity): number {
        const id = (entity as SalesInvoiceStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SalesInvoiceStatusUpdateEntity);
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
            table: "CODBEX_SALESINVOICESTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESINVOICESTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: SalesInvoiceStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(options?: SalesInvoiceStatusEntityOptions): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_SALESINVOICESTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SalesInvoiceStatusEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices/settings/SalesInvoiceStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.queue("codbex-invoices/settings/SalesInvoiceStatus").send(JSON.stringify(data));
    }
}