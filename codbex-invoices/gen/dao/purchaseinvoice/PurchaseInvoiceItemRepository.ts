import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface PurchaseInvoiceItemEntity {
    readonly Id: number;
    PurchaseInvoice: number;
    Product: number;
    Quantity: number;
    UoM?: number;
    Price: number;
    Net?: number;
    VAT?: number;
    Gross?: number;
}

export interface PurchaseInvoiceItemCreateEntity {
    readonly PurchaseInvoice: number;
    readonly Product: number;
    readonly Quantity: number;
    readonly UoM?: number;
    readonly Price: number;
}

export interface PurchaseInvoiceItemUpdateEntity extends PurchaseInvoiceItemCreateEntity {
    readonly Id: number;
}

export interface PurchaseInvoiceItemEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            PurchaseInvoice?: number | number[];
            Product?: number | number[];
            Quantity?: number | number[];
            UoM?: number | number[];
            Price?: number | number[];
            Net?: number | number[];
            VAT?: number | number[];
            Gross?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            PurchaseInvoice?: number | number[];
            Product?: number | number[];
            Quantity?: number | number[];
            UoM?: number | number[];
            Price?: number | number[];
            Net?: number | number[];
            VAT?: number | number[];
            Gross?: number | number[];
        };
        contains?: {
            Id?: number;
            PurchaseInvoice?: number;
            Product?: number;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Net?: number;
            VAT?: number;
            Gross?: number;
        };
        greaterThan?: {
            Id?: number;
            PurchaseInvoice?: number;
            Product?: number;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Net?: number;
            VAT?: number;
            Gross?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            PurchaseInvoice?: number;
            Product?: number;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Net?: number;
            VAT?: number;
            Gross?: number;
        };
        lessThan?: {
            Id?: number;
            PurchaseInvoice?: number;
            Product?: number;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Net?: number;
            VAT?: number;
            Gross?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            PurchaseInvoice?: number;
            Product?: number;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Net?: number;
            VAT?: number;
            Gross?: number;
        };
    },
    $select?: (keyof PurchaseInvoiceItemEntity)[],
    $sort?: string | (keyof PurchaseInvoiceItemEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface PurchaseInvoiceItemEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<PurchaseInvoiceItemEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class PurchaseInvoiceItemRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_PURCHASEINVOICEITEM",
        properties: [
            {
                name: "Id",
                column: "PURCHASEINVOICEITEM_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "PurchaseInvoice",
                column: "PURCHASEINVOICEITEM_PURCHASEINVOICE",
                type: "INTEGER",
                required: true
            },
            {
                name: "Product",
                column: "PURCHASEINVOICEITEM_PRODUCT",
                type: "INTEGER",
                required: true
            },
            {
                name: "Quantity",
                column: "PURCHASEINVOICEITEM_QUANTITY",
                type: "DOUBLE",
                required: true
            },
            {
                name: "UoM",
                column: "PURCHASEINVOICEITEM_UOM",
                type: "INTEGER",
            },
            {
                name: "Price",
                column: "PURCHASEINVOICEITEM_PRICE",
                type: "DECIMAL",
                required: true
            },
            {
                name: "Net",
                column: "PURCHASEINVOICEITEM_NET",
                type: "DECIMAL",
            },
            {
                name: "VAT",
                column: "PURCHASEINVOICEITEM_VAT",
                type: "DECIMAL",
            },
            {
                name: "Gross",
                column: "PURCHASEINVOICEITEM_GROSS",
                type: "DECIMAL",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(PurchaseInvoiceItemRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: PurchaseInvoiceItemEntityOptions): PurchaseInvoiceItemEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): PurchaseInvoiceItemEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: PurchaseInvoiceItemCreateEntity): number {
        // @ts-ignore
        (entity as PurchaseInvoiceItemEntity).Net = entity["Quantity"] * entity["Price"];
        // @ts-ignore
        (entity as PurchaseInvoiceItemEntity).VAT = entity["Net"] * 0.2;
        // @ts-ignore
        (entity as PurchaseInvoiceItemEntity).Gross = entity["Net"] + entity["VAT"];
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_PURCHASEINVOICEITEM",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEINVOICEITEM_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: PurchaseInvoiceItemUpdateEntity): void {
        // @ts-ignore
        (entity as PurchaseInvoiceItemEntity).Net = entity["Quantity"] * entity["Price"];
        // @ts-ignore
        (entity as PurchaseInvoiceItemEntity).VAT = entity["Net"] * 0.2;
        // @ts-ignore
        (entity as PurchaseInvoiceItemEntity).Gross = entity["Net"] + entity["VAT"];
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_PURCHASEINVOICEITEM",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEINVOICEITEM_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: PurchaseInvoiceItemCreateEntity | PurchaseInvoiceItemUpdateEntity): number {
        const id = (entity as PurchaseInvoiceItemUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as PurchaseInvoiceItemUpdateEntity);
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
            table: "CODBEX_PURCHASEINVOICEITEM",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEINVOICEITEM_ID",
                value: id
            }
        });
    }

    public count(options?: PurchaseInvoiceItemEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__PURCHASEINVOICEITEM"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: PurchaseInvoiceItemEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices-purchaseinvoice-PurchaseInvoiceItem", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-invoices-purchaseinvoice-PurchaseInvoiceItem").send(JSON.stringify(data));
    }
}
