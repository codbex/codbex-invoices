import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface SalesInvoiceEntity {
    readonly Id: number;
    Number: string;
    Date: Date;
    Due?: Date;
    Customer: number;
    Net?: number;
    Currency?: number;
    Gross?: number;
    Discount?: number;
    Taxes?: number;
    VAT?: number;
    Total?: number;
    Conditions?: string;
    PaymentMethod?: number;
    SentMethod?: number;
    Status?: number;
    Operator?: number;
    Document?: string;
    Company?: number;
    Name?: string;
    UUID?: string;
    Reference?: string;
}

export interface SalesInvoiceCreateEntity {
    readonly Number: string;
    readonly Date: Date;
    readonly Due?: Date;
    readonly Customer: number;
    readonly Net?: number;
    readonly Currency?: number;
    readonly Gross?: number;
    readonly Discount?: number;
    readonly Taxes?: number;
    readonly VAT?: number;
    readonly Total?: number;
    readonly Conditions?: string;
    readonly PaymentMethod?: number;
    readonly SentMethod?: number;
    readonly Status?: number;
    readonly Operator?: number;
    readonly Document?: string;
    readonly Company?: number;
    readonly UUID?: string;
    readonly Reference?: string;
}

export interface SalesInvoiceUpdateEntity extends SalesInvoiceCreateEntity {
    readonly Id: number;
}

export interface SalesInvoiceEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Number?: string | string[];
            Date?: Date | Date[];
            Due?: Date | Date[];
            Customer?: number | number[];
            Net?: number | number[];
            Currency?: number | number[];
            Gross?: number | number[];
            Discount?: number | number[];
            Taxes?: number | number[];
            VAT?: number | number[];
            Total?: number | number[];
            Conditions?: string | string[];
            PaymentMethod?: number | number[];
            SentMethod?: number | number[];
            Status?: number | number[];
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
            Customer?: number | number[];
            Net?: number | number[];
            Currency?: number | number[];
            Gross?: number | number[];
            Discount?: number | number[];
            Taxes?: number | number[];
            VAT?: number | number[];
            Total?: number | number[];
            Conditions?: string | string[];
            PaymentMethod?: number | number[];
            SentMethod?: number | number[];
            Status?: number | number[];
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
            Customer?: number;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Discount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Conditions?: string;
            PaymentMethod?: number;
            SentMethod?: number;
            Status?: number;
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
            Customer?: number;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Discount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Conditions?: string;
            PaymentMethod?: number;
            SentMethod?: number;
            Status?: number;
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
            Customer?: number;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Discount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Conditions?: string;
            PaymentMethod?: number;
            SentMethod?: number;
            Status?: number;
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
            Customer?: number;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Discount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Conditions?: string;
            PaymentMethod?: number;
            SentMethod?: number;
            Status?: number;
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
            Customer?: number;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Discount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Conditions?: string;
            PaymentMethod?: number;
            SentMethod?: number;
            Status?: number;
            Operator?: number;
            Document?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
    },
    $select?: (keyof SalesInvoiceEntity)[],
    $sort?: string | (keyof SalesInvoiceEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface SalesInvoiceEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SalesInvoiceEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class SalesInvoiceRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_SALESINVOICE",
        properties: [
            {
                name: "Id",
                column: "SALESINVOICE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Number",
                column: "SALESINVOICE_NUMBER",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Date",
                column: "SALESINVOICE_DATE",
                type: "DATE",
                required: true
            },
            {
                name: "Due",
                column: "SALESINVOICE_DUE",
                type: "DATE",
            },
            {
                name: "Customer",
                column: "SALESINVOICE_CUSTOMER",
                type: "INTEGER",
                required: true
            },
            {
                name: "Net",
                column: "SALESINVOICE_NET",
                type: "DOUBLE",
            },
            {
                name: "Currency",
                column: "SALESINVOICE_CURRENCY",
                type: "INTEGER",
            },
            {
                name: "Gross",
                column: "SALESINVOICE_GROSS",
                type: "DOUBLE",
            },
            {
                name: "Discount",
                column: "SALESINVOICE_DISCOUNT",
                type: "DOUBLE",
            },
            {
                name: "Taxes",
                column: "SALESINVOICE_TAXES",
                type: "DOUBLE",
            },
            {
                name: "VAT",
                column: "SALESINVOICE_VAT",
                type: "DOUBLE",
            },
            {
                name: "Total",
                column: "SALESINVOICE_TOTAL",
                type: "DOUBLE",
            },
            {
                name: "Conditions",
                column: "SALESINVOICE_CONDITIONS",
                type: "VARCHAR",
            },
            {
                name: "PaymentMethod",
                column: "SALESINVOICE_PAYMENTMETHOD",
                type: "INTEGER",
            },
            {
                name: "SentMethod",
                column: "SALESINVOICE_SENTMETHOD",
                type: "INTEGER",
            },
            {
                name: "Status",
                column: "SALESINVOICE_STATUS",
                type: "INTEGER",
            },
            {
                name: "Operator",
                column: "SALESINVOICE_OPERATOR",
                type: "INTEGER",
            },
            {
                name: "Document",
                column: "SALESINVOICE_DOCUMENT",
                type: "VARCHAR",
            },
            {
                name: "Company",
                column: "SALESINVOICE_COMPANY",
                type: "INTEGER",
            },
            {
                name: "Name",
                column: "SALESINVOICE_NAME",
                type: "VARCHAR",
            },
            {
                name: "UUID",
                column: "SALESINVOICE_UUID",
                type: "VARCHAR",
            },
            {
                name: "Reference",
                column: "SALESINVOICE_REFERENCE",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(SalesInvoiceRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: SalesInvoiceEntityOptions): SalesInvoiceEntity[] {
        return this.dao.list(options).map((e: SalesInvoiceEntity) => {
            EntityUtils.setDate(e, "Date");
            EntityUtils.setDate(e, "Due");
            return e;
        });
    }

    public findById(id: number): SalesInvoiceEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        EntityUtils.setDate(entity, "Due");
        return entity ?? undefined;
    }

    public create(entity: SalesInvoiceCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        EntityUtils.setLocalDate(entity, "Due");
        // @ts-ignore
        (entity as SalesInvoiceEntity).Name = entity['Number'] + '/' + entity['Date'] + '/' + entity["Total"];;
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_SALESINVOICE",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESINVOICE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: SalesInvoiceUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // EntityUtils.setLocalDate(entity, "Due");
        // @ts-ignore
        (entity as SalesInvoiceEntity).Name = entity['Number'] + '/' + entity['Date'] + '/' + entity["Total"];;
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_SALESINVOICE",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESINVOICE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: SalesInvoiceCreateEntity | SalesInvoiceUpdateEntity): number {
        const id = (entity as SalesInvoiceUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SalesInvoiceUpdateEntity);
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
            table: "CODBEX_SALESINVOICE",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESINVOICE_ID",
                value: id
            }
        });
    }

    public count(): number {
        return this.dao.count();
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__SALESINVOICE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SalesInvoiceEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices/salesinvoice/SalesInvoice", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.queue("codbex-invoices/salesinvoice/SalesInvoice").send(JSON.stringify(data));
    }
}