import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface PurchaseInvoiceEntity {
    readonly Id: number;
    Number: string;
    Date: Date;
    Due?: Date;
    Supplier: number;
    Net?: number;
    Currency: number;
    Gross?: number;
    Discount?: number;
    Taxes?: number;
    VAT?: number;
    Total?: number;
    Conditions?: string;
    SentMethods?: number;
    PurchaseInvoiceStatus: number;
    Operator?: number;
    Document?: string;
    Company?: number;
    Name?: string;
    UUID?: string;
    Reference?: string;
}

export interface PurchaseInvoiceCreateEntity {
    readonly Number: string;
    readonly Date: Date;
    readonly Due?: Date;
    readonly Supplier: number;
    readonly Net?: number;
    readonly Currency: number;
    readonly Gross?: number;
    readonly Discount?: number;
    readonly Taxes?: number;
    readonly VAT?: number;
    readonly Total?: number;
    readonly Conditions?: string;
    readonly SentMethods?: number;
    readonly PurchaseInvoiceStatus: number;
    readonly Operator?: number;
    readonly Document?: string;
    readonly Company?: number;
    readonly Reference?: string;
}

export interface PurchaseInvoiceUpdateEntity extends PurchaseInvoiceCreateEntity {
    readonly Id: number;
}

export interface PurchaseInvoiceEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Number?: string | string[];
            Date?: Date | Date[];
            Due?: Date | Date[];
            Supplier?: number | number[];
            Net?: number | number[];
            Currency?: number | number[];
            Gross?: number | number[];
            Discount?: number | number[];
            Taxes?: number | number[];
            VAT?: number | number[];
            Total?: number | number[];
            Conditions?: string | string[];
            SentMethods?: number | number[];
            PurchaseInvoiceStatus?: number | number[];
            Operator?: number | number[];
            Document?: string | string[];
            Company?: number | number[];
            Name?: string | string[];
            UUID?: string | string[];
            Reference?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Number?: string | string[];
            Date?: Date | Date[];
            Due?: Date | Date[];
            Supplier?: number | number[];
            Net?: number | number[];
            Currency?: number | number[];
            Gross?: number | number[];
            Discount?: number | number[];
            Taxes?: number | number[];
            VAT?: number | number[];
            Total?: number | number[];
            Conditions?: string | string[];
            SentMethods?: number | number[];
            PurchaseInvoiceStatus?: number | number[];
            Operator?: number | number[];
            Document?: string | string[];
            Company?: number | number[];
            Name?: string | string[];
            UUID?: string | string[];
            Reference?: string | string[];
        };
        contains?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Due?: Date;
            Supplier?: number;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Discount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Conditions?: string;
            SentMethods?: number;
            PurchaseInvoiceStatus?: number;
            Operator?: number;
            Document?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
        greaterThan?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Due?: Date;
            Supplier?: number;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Discount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Conditions?: string;
            SentMethods?: number;
            PurchaseInvoiceStatus?: number;
            Operator?: number;
            Document?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Due?: Date;
            Supplier?: number;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Discount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Conditions?: string;
            SentMethods?: number;
            PurchaseInvoiceStatus?: number;
            Operator?: number;
            Document?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
        lessThan?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Due?: Date;
            Supplier?: number;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Discount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Conditions?: string;
            SentMethods?: number;
            PurchaseInvoiceStatus?: number;
            Operator?: number;
            Document?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Due?: Date;
            Supplier?: number;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Discount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Conditions?: string;
            SentMethods?: number;
            PurchaseInvoiceStatus?: number;
            Operator?: number;
            Document?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
    },
    $select?: (keyof PurchaseInvoiceEntity)[],
    $sort?: string | (keyof PurchaseInvoiceEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface PurchaseInvoiceEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<PurchaseInvoiceEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class PurchaseInvoiceRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_PURCHASEINVOICE",
        properties: [
            {
                name: "Id",
                column: "PURCHASEINVOICE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Number",
                column: "PURCHASEINVOICE_NUMBER",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Date",
                column: "PURCHASEINVOICE_DATE",
                type: "DATE",
                required: true
            },
            {
                name: "Due",
                column: "PURCHASEINVOICE_DUE",
                type: "DATE",
            },
            {
                name: "Supplier",
                column: "PURCHASEINVOICE_SUPPLIER",
                type: "INTEGER",
                required: true
            },
            {
                name: "Net",
                column: "PURCHASEINVOICE_NET",
                type: "DOUBLE",
            },
            {
                name: "Currency",
                column: "PURCHASEINVOICE_CURRENCY",
                type: "INTEGER",
                required: true
            },
            {
                name: "Gross",
                column: "PURCHASEINVOICE_GROSS",
                type: "DOUBLE",
            },
            {
                name: "Discount",
                column: "PURCHASEINVOICE_DISCOUNT",
                type: "DOUBLE",
            },
            {
                name: "Taxes",
                column: "PURCHASEINVOICE_TAXES",
                type: "DOUBLE",
            },
            {
                name: "VAT",
                column: "PURCHASEINVOICE_VAT",
                type: "DOUBLE",
            },
            {
                name: "Total",
                column: "PURCHASEINVOICE_TOTAL",
                type: "DOUBLE",
            },
            {
                name: "Conditions",
                column: "PURCHASEINVOICE_CONDITIONS",
                type: "VARCHAR",
            },
            {
                name: "SentMethods",
                column: "PURCHASEINVOICE_SENTMETHODS",
                type: "INTEGER",
            },
            {
                name: "PurchaseInvoiceStatus",
                column: "PURCHASEINVOICE_PURCHASEINVOICESTATUS",
                type: "INTEGER",
                required: true
            },
            {
                name: "Operator",
                column: "PURCHASEINVOICE_OPERATOR",
                type: "INTEGER",
            },
            {
                name: "Document",
                column: "PURCHASEINVOICE_DOCUMENT",
                type: "VARCHAR",
            },
            {
                name: "Company",
                column: "PURCHASEINVOICE_COMPANY",
                type: "INTEGER",
            },
            {
                name: "Name",
                column: "PURCHASEINVOICE_NAME",
                type: "VARCHAR",
            },
            {
                name: "UUID",
                column: "PURCHASEINVOICE_UUID",
                type: "VARCHAR",
            },
            {
                name: "Reference",
                column: "PURCHASEINVOICE_REFERENCE",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(PurchaseInvoiceRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: PurchaseInvoiceEntityOptions): PurchaseInvoiceEntity[] {
        return this.dao.list(options).map((e: PurchaseInvoiceEntity) => {
            EntityUtils.setDate(e, "Date");
            EntityUtils.setDate(e, "Due");
            return e;
        });
    }

    public findById(id: number): PurchaseInvoiceEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        EntityUtils.setDate(entity, "Due");
        return entity ?? undefined;
    }

    public create(entity: PurchaseInvoiceCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        EntityUtils.setLocalDate(entity, "Due");
        // @ts-ignore
        (entity as PurchaseInvoiceEntity).Name = entity["Number"] + "/" + new Date(entity["Date"]).toISOString().slice(0, 10) + "/" + (typeof entity["Total"] !== 'undefined') ? value : 0;;
        // @ts-ignore
        (entity as PurchaseInvoiceEntity).UUID = require("sdk/utils/uuid").random();
        if (!entity.Total) {
            entity.Total = "0";
        }
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_PURCHASEINVOICE",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEINVOICE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: PurchaseInvoiceUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // EntityUtils.setLocalDate(entity, "Due");
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_PURCHASEINVOICE",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEINVOICE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: PurchaseInvoiceCreateEntity | PurchaseInvoiceUpdateEntity): number {
        const id = (entity as PurchaseInvoiceUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as PurchaseInvoiceUpdateEntity);
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
            table: "CODBEX_PURCHASEINVOICE",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEINVOICE_ID",
                value: id
            }
        });
    }

    public count(options?: PurchaseInvoiceEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(options?: PurchaseInvoiceEntityOptions): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__PURCHASEINVOICE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: PurchaseInvoiceEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices/purchaseinvoice/PurchaseInvoice", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.queue("codbex-invoices/purchaseinvoice/PurchaseInvoice").send(JSON.stringify(data));
    }
}