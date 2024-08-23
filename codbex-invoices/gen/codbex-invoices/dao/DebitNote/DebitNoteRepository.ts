import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";
// custom imports
import { NumberGeneratorService } from "/codbex-number-generator/service/generator";

export interface DebitNoteEntity {
    readonly Id: number;
    Number?: string;
    Customer?: number;
    Date: Date;
    SalesInvoice?: number;
    Net: number;
    Currency?: number;
    VAT?: number;
    Gross?: number;
    Taxes?: number;
    Total?: number;
    PaymentMethod?: number;
    Company?: number;
}

export interface DebitNoteCreateEntity {
    readonly Customer?: number;
    readonly Date: Date;
    readonly SalesInvoice?: number;
    readonly Net: number;
    readonly Currency?: number;
    readonly Taxes?: number;
    readonly PaymentMethod?: number;
    readonly Company?: number;
}

export interface DebitNoteUpdateEntity extends DebitNoteCreateEntity {
    readonly Id: number;
}

export interface DebitNoteEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Number?: string | string[];
            Customer?: number | number[];
            Date?: Date | Date[];
            SalesInvoice?: number | number[];
            Net?: number | number[];
            Currency?: number | number[];
            VAT?: number | number[];
            Gross?: number | number[];
            Taxes?: number | number[];
            Total?: number | number[];
            PaymentMethod?: number | number[];
            Company?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Number?: string | string[];
            Customer?: number | number[];
            Date?: Date | Date[];
            SalesInvoice?: number | number[];
            Net?: number | number[];
            Currency?: number | number[];
            VAT?: number | number[];
            Gross?: number | number[];
            Taxes?: number | number[];
            Total?: number | number[];
            PaymentMethod?: number | number[];
            Company?: number | number[];
        };
        contains?: {
            Id?: number;
            Number?: string;
            Customer?: number;
            Date?: Date;
            SalesInvoice?: number;
            Net?: number;
            Currency?: number;
            VAT?: number;
            Gross?: number;
            Taxes?: number;
            Total?: number;
            PaymentMethod?: number;
            Company?: number;
        };
        greaterThan?: {
            Id?: number;
            Number?: string;
            Customer?: number;
            Date?: Date;
            SalesInvoice?: number;
            Net?: number;
            Currency?: number;
            VAT?: number;
            Gross?: number;
            Taxes?: number;
            Total?: number;
            PaymentMethod?: number;
            Company?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Number?: string;
            Customer?: number;
            Date?: Date;
            SalesInvoice?: number;
            Net?: number;
            Currency?: number;
            VAT?: number;
            Gross?: number;
            Taxes?: number;
            Total?: number;
            PaymentMethod?: number;
            Company?: number;
        };
        lessThan?: {
            Id?: number;
            Number?: string;
            Customer?: number;
            Date?: Date;
            SalesInvoice?: number;
            Net?: number;
            Currency?: number;
            VAT?: number;
            Gross?: number;
            Taxes?: number;
            Total?: number;
            PaymentMethod?: number;
            Company?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Number?: string;
            Customer?: number;
            Date?: Date;
            SalesInvoice?: number;
            Net?: number;
            Currency?: number;
            VAT?: number;
            Gross?: number;
            Taxes?: number;
            Total?: number;
            PaymentMethod?: number;
            Company?: number;
        };
    },
    $select?: (keyof DebitNoteEntity)[],
    $sort?: string | (keyof DebitNoteEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface DebitNoteEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<DebitNoteEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface DebitNoteUpdateEntityEvent extends DebitNoteEntityEvent {
    readonly previousEntity: DebitNoteEntity;
}

export class DebitNoteRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_DEBITNOTE",
        properties: [
            {
                name: "Id",
                column: "DEBITNOTE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Number",
                column: "DEBITNOTE_NUMBER",
                type: "VARCHAR",
            },
            {
                name: "Customer",
                column: "DEBITNOTE_CUSTOMER",
                type: "INTEGER",
            },
            {
                name: "Date",
                column: "DEBITNOTE_DATE",
                type: "DATE",
                required: true
            },
            {
                name: "SalesInvoice",
                column: "DEBITNOTE_SALESINVOICE",
                type: "INTEGER",
            },
            {
                name: "Net",
                column: "DEBITNOTE_NEWNET",
                type: "DECIMAL",
                required: true
            },
            {
                name: "Currency",
                column: "DEBITNOTE_CURRENCY",
                type: "INTEGER",
            },
            {
                name: "VAT",
                column: "DEBITNOTE_VAT",
                type: "DECIMAL",
            },
            {
                name: "Gross",
                column: "DEBITNOTE_GROSS",
                type: "DECIMAL",
            },
            {
                name: "Taxes",
                column: "DEBITNOTE_TAXES",
                type: "DECIMAL",
            },
            {
                name: "Total",
                column: "DEBITNOTE_TOTAL",
                type: "DECIMAL",
            },
            {
                name: "PaymentMethod",
                column: "DEBITNOTE_PAYMENTMETHOD",
                type: "INTEGER",
            },
            {
                name: "Company",
                column: "DEBITNOTE_COMPANY",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(DebitNoteRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: DebitNoteEntityOptions): DebitNoteEntity[] {
        return this.dao.list(options).map((e: DebitNoteEntity) => {
            EntityUtils.setDate(e, "Date");
            return e;
        });
    }

    public findById(id: number): DebitNoteEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        return entity ?? undefined;
    }

    public create(entity: DebitNoteCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        // @ts-ignore
        (entity as DebitNoteEntity).Number = new NumberGeneratorService().generate(12);
        // @ts-ignore
        (entity as DebitNoteEntity).VAT = entity["Net"] * 0.2;
        // @ts-ignore
        (entity as DebitNoteEntity).Gross = entity["Net"] + entity["VAT"];
        // @ts-ignore
        (entity as DebitNoteEntity).Total = entity["Net"] + entity["VAT"] + entity["Taxes"];
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_DEBITNOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "DEBITNOTE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: DebitNoteUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // @ts-ignore
        (entity as DebitNoteEntity).VAT = entity["Net"] * 0.2;
        // @ts-ignore
        (entity as DebitNoteEntity).Gross = entity["Net"] + entity["VAT"];
        // @ts-ignore
        (entity as DebitNoteEntity).Total = entity["Net"] + entity["VAT"] + entity["Taxes"];
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_DEBITNOTE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "DEBITNOTE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: DebitNoteCreateEntity | DebitNoteUpdateEntity): number {
        const id = (entity as DebitNoteUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as DebitNoteUpdateEntity);
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
            table: "CODBEX_DEBITNOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "DEBITNOTE_ID",
                value: id
            }
        });
    }

    public count(options?: DebitNoteEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_DEBITNOTE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: DebitNoteEntityEvent | DebitNoteUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices-DebitNote-DebitNote", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-invoices-DebitNote-DebitNote").send(JSON.stringify(data));
    }
}
