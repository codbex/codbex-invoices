import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface SalesInvoiceTypeEntity {
    readonly Id: number;
    Name?: string;
}

export interface SalesInvoiceTypeCreateEntity {
    readonly Name?: string;
}

export interface SalesInvoiceTypeUpdateEntity extends SalesInvoiceTypeCreateEntity {
    readonly Id: number;
}

export interface SalesInvoiceTypeEntityOptions {
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
    $select?: (keyof SalesInvoiceTypeEntity)[],
    $sort?: string | (keyof SalesInvoiceTypeEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface SalesInvoiceTypeEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SalesInvoiceTypeEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface SalesInvoiceTypeUpdateEntityEvent extends SalesInvoiceTypeEntityEvent {
    readonly previousEntity: SalesInvoiceTypeEntity;
}

export class SalesInvoiceTypeRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_SALESINVOICETYPE",
        properties: [
            {
                name: "Id",
                column: "SALESINVOICETYPE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "SALESINVOICETYPE_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(SalesInvoiceTypeRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: SalesInvoiceTypeEntityOptions): SalesInvoiceTypeEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): SalesInvoiceTypeEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: SalesInvoiceTypeCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_SALESINVOICETYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESINVOICETYPE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: SalesInvoiceTypeUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_SALESINVOICETYPE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "SALESINVOICETYPE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: SalesInvoiceTypeCreateEntity | SalesInvoiceTypeUpdateEntity): number {
        const id = (entity as SalesInvoiceTypeUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SalesInvoiceTypeUpdateEntity);
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
            table: "CODBEX_SALESINVOICETYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESINVOICETYPE_ID",
                value: id
            }
        });
    }

    public count(options?: SalesInvoiceTypeEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_SALESINVOICETYPE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SalesInvoiceTypeEntityEvent | SalesInvoiceTypeUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices-settings-SalesInvoiceType", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-invoices-settings-SalesInvoiceType").send(JSON.stringify(data));
    }
}
