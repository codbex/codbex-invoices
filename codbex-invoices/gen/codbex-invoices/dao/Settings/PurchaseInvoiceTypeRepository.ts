import { sql, query } from "@aerokit/sdk/db";
import { producer } from "@aerokit/sdk/messaging";
import { extensions } from "@aerokit/sdk/extensions";
import { dao as daoApi } from "@aerokit/sdk/db";

export interface PurchaseInvoiceTypeEntity {
    readonly Id: number;
    Name?: string;
    Direction: number;
}

export interface PurchaseInvoiceTypeCreateEntity {
    readonly Name?: string;
    readonly Direction: number;
}

export interface PurchaseInvoiceTypeUpdateEntity extends PurchaseInvoiceTypeCreateEntity {
    readonly Id: number;
}

export interface PurchaseInvoiceTypeEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            Direction?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Direction?: number | number[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Direction?: number;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Direction?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Direction?: number;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Direction?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Direction?: number;
        };
    },
    $select?: (keyof PurchaseInvoiceTypeEntity)[],
    $sort?: string | (keyof PurchaseInvoiceTypeEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
    $language?: string
}

export interface PurchaseInvoiceTypeEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<PurchaseInvoiceTypeEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export interface PurchaseInvoiceTypeUpdateEntityEvent extends PurchaseInvoiceTypeEntityEvent {
    readonly previousEntity: PurchaseInvoiceTypeEntity;
}

export class PurchaseInvoiceTypeRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_PURCHASEINVOICETYPE",
        properties: [
            {
                name: "Id",
                column: "PURCHASEINVOICETYPE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "PURCHASEINVOICETYPE_NAME",
                type: "VARCHAR",
            },
            {
                name: "Direction",
                column: "PURCHASEINVOICETYPE_DIRECTION",
                type: "INTEGER",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(PurchaseInvoiceTypeRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: PurchaseInvoiceTypeEntityOptions = {}): PurchaseInvoiceTypeEntity[] {
        let list = this.dao.list(options);
        return list;
    }

    public findById(id: number, options: PurchaseInvoiceTypeEntityOptions = {}): PurchaseInvoiceTypeEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: PurchaseInvoiceTypeCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_PURCHASEINVOICETYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEINVOICETYPE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: PurchaseInvoiceTypeUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_PURCHASEINVOICETYPE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "PURCHASEINVOICETYPE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: PurchaseInvoiceTypeCreateEntity | PurchaseInvoiceTypeUpdateEntity): number {
        const id = (entity as PurchaseInvoiceTypeUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as PurchaseInvoiceTypeUpdateEntity);
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
            table: "CODBEX_PURCHASEINVOICETYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEINVOICETYPE_ID",
                value: id
            }
        });
    }

    public count(options?: PurchaseInvoiceTypeEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PURCHASEINVOICETYPE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: PurchaseInvoiceTypeEntityEvent | PurchaseInvoiceTypeUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices-Settings-PurchaseInvoiceType", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-invoices-Settings-PurchaseInvoiceType").send(JSON.stringify(data));
    }
}
