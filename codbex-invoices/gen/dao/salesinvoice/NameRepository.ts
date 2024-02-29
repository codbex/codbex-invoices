import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface NameEntity {
    readonly Id: number;
    SalesInvoice: number;
    Name: string;
    Quantity: number;
    UoM: number;
    Price: number;
    Net: number;
    VAT: number;
    Gross: number;
}

export interface NameCreateEntity {
    readonly SalesInvoice: number;
    readonly Name: string;
    readonly Quantity: number;
    readonly UoM: number;
    readonly Price: number;
}

export interface NameUpdateEntity extends NameCreateEntity {
    readonly Id: number;
}

export interface NameEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            SalesInvoice?: number | number[];
            Name?: string | string[];
            Quantity?: number | number[];
            UoM?: number | number[];
            Price?: number | number[];
            Net?: number | number[];
            VAT?: number | number[];
            Gross?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            SalesInvoice?: number | number[];
            Name?: string | string[];
            Quantity?: number | number[];
            UoM?: number | number[];
            Price?: number | number[];
            Net?: number | number[];
            VAT?: number | number[];
            Gross?: number | number[];
        };
        contains?: {
            Id?: number;
            SalesInvoice?: number;
            Name?: string;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Net?: number;
            VAT?: number;
            Gross?: number;
        };
        greaterThan?: {
            Id?: number;
            SalesInvoice?: number;
            Name?: string;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Net?: number;
            VAT?: number;
            Gross?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            SalesInvoice?: number;
            Name?: string;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Net?: number;
            VAT?: number;
            Gross?: number;
        };
        lessThan?: {
            Id?: number;
            SalesInvoice?: number;
            Name?: string;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Net?: number;
            VAT?: number;
            Gross?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            SalesInvoice?: number;
            Name?: string;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Net?: number;
            VAT?: number;
            Gross?: number;
        };
    },
    $select?: (keyof NameEntity)[],
    $sort?: string | (keyof NameEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface NameEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<NameEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class NameRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_SALESORDER_NAME",
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
                type: "DECIMAL",
                required: true
            },
            {
                name: "Net",
                column: "SALESINVOICEITEM_NET",
                type: "DECIMAL",
                required: true
            },
            {
                name: "VAT",
                column: "SALESINVOICEITEM_VAT",
                type: "DECIMAL",
                required: true
            },
            {
                name: "Gross",
                column: "SALESINVOICEITEM_GROSS",
                type: "DECIMAL",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(NameRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: NameEntityOptions): NameEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): NameEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: NameCreateEntity): number {
        // @ts-ignore
        (entity as NameEntity).Net = entity["Quantity"] * entity["Price"];
        // @ts-ignore
        (entity as NameEntity).VAT = entity["Net"] * 0.2;
        // @ts-ignore
        (entity as NameEntity).Gross = entity["Net"] + entity["VAT"];
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_SALESORDER_NAME",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESINVOICEITEM_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: NameUpdateEntity): void {
        // @ts-ignore
        (entity as NameEntity).Net = entity["Quantity"] * entity["Price"];
        // @ts-ignore
        (entity as NameEntity).VAT = entity["Net"] * 0.2;
        // @ts-ignore
        (entity as NameEntity).Gross = entity["Net"] + entity["VAT"];
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_SALESORDER_NAME",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESINVOICEITEM_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: NameCreateEntity | NameUpdateEntity): number {
        const id = (entity as NameUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as NameUpdateEntity);
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
            table: "CODBEX_SALESORDER_NAME",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESINVOICEITEM_ID",
                value: id
            }
        });
    }

    public count(options?: NameEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(options?: NameEntityOptions): number {
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

    private async triggerEvent(data: NameEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices/salesinvoice/Name", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-invoices/salesinvoice/Name").send(JSON.stringify(data));
    }
}