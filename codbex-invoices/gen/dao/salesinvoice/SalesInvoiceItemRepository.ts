import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface SalesInvoiceItemEntity {
    readonly Id: number;
    SalesInvoice: number;
    Name: string;
    Product: number;
    Quantity: number;
    UoM: number;
    Price: number;
    Customer: number;
    Taxes?: number;
    Gross?: number;
}

export interface SalesInvoiceItemCreateEntity {
    readonly SalesInvoice: number;
    readonly Name: string;
    readonly Product: number;
    readonly Quantity: number;
    readonly UoM: number;
    readonly Price: number;
    readonly Customer: number;
    readonly Taxes?: number;
    readonly Gross?: number;
}

export interface SalesInvoiceItemUpdateEntity extends SalesInvoiceItemCreateEntity {
    readonly Id: number;
}

export interface SalesInvoiceItemEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            SalesInvoice?: number | number[];
            Name?: string | string[];
            Product?: number | number[];
            Quantity?: number | number[];
            UoM?: number | number[];
            Price?: number | number[];
            Customer?: number | number[];
            Taxes?: number | number[];
            Gross?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            SalesInvoice?: number | number[];
            Name?: string | string[];
            Product?: number | number[];
            Quantity?: number | number[];
            UoM?: number | number[];
            Price?: number | number[];
            Customer?: number | number[];
            Taxes?: number | number[];
            Gross?: number | number[];
        };
        contains?: {
            Id?: number;
            SalesInvoice?: number;
            Name?: string;
            Product?: number;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Customer?: number;
            Taxes?: number;
            Gross?: number;
        };
        greaterThan?: {
            Id?: number;
            SalesInvoice?: number;
            Name?: string;
            Product?: number;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Customer?: number;
            Taxes?: number;
            Gross?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            SalesInvoice?: number;
            Name?: string;
            Product?: number;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Customer?: number;
            Taxes?: number;
            Gross?: number;
        };
        lessThan?: {
            Id?: number;
            SalesInvoice?: number;
            Name?: string;
            Product?: number;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Customer?: number;
            Taxes?: number;
            Gross?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            SalesInvoice?: number;
            Name?: string;
            Product?: number;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Customer?: number;
            Taxes?: number;
            Gross?: number;
        };
    },
    $select?: (keyof SalesInvoiceItemEntity)[],
    $sort?: string | (keyof SalesInvoiceItemEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface SalesInvoiceItemEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SalesInvoiceItemEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class SalesInvoiceItemRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_SALESINVOICEITEM",
        properties: [
            {
                name: "Id",
                column: "SALESINVOICEITEM_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
                required: true
            },
            {
                name: "SalesInvoice",
                column: "SALESINVOICEITEM_SALESINVOICE",
                type: "INTEGER",
                required: true
            },
            {
                name: "Name",
                column: "SALESINVOICEITEM_NAME",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Product",
                column: "SALESINVOICEITEM_PRODUCT",
                type: "INTEGER",
                required: true
            },
            {
                name: "Quantity",
                column: "SALESINVOICEITEM_QUANTITY",
                type: "DOUBLE",
                required: true
            },
            {
                name: "UoM",
                column: "SALESINVOICEITEM_UOM",
                type: "INTEGER",
                required: true
            },
            {
                name: "Price",
                column: "SALESINVOICEITEM_PRICE",
                type: "DOUBLE",
                required: true
            },
            {
                name: "Customer",
                column: "PURCHASEORDER_CUSTOMER",
                type: "INTEGER",
                required: true
            },
            {
                name: "Taxes",
                column: "SALESINVOICEITEM_TAXES",
                type: "DOUBLE",
            },
            {
                name: "Gross",
                column: "SALESINVOICEITEM_GROSS",
                type: "DOUBLE",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(SalesInvoiceItemRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: SalesInvoiceItemEntityOptions): SalesInvoiceItemEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): SalesInvoiceItemEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: SalesInvoiceItemCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_SALESINVOICEITEM",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESINVOICEITEM_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: SalesInvoiceItemUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_SALESINVOICEITEM",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESINVOICEITEM_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: SalesInvoiceItemCreateEntity | SalesInvoiceItemUpdateEntity): number {
        const id = (entity as SalesInvoiceItemUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SalesInvoiceItemUpdateEntity);
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
            table: "CODBEX_SALESINVOICEITEM",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESINVOICEITEM_ID",
                value: id
            }
        });
    }

    public count(options?: SalesInvoiceItemEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(options?: SalesInvoiceItemEntityOptions): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__SALESINVOICEITEM"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SalesInvoiceItemEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices/salesinvoice/SalesInvoiceItem", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.queue("codbex-invoices/salesinvoice/SalesInvoiceItem").send(JSON.stringify(data));
    }
}