import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface SalesInvoicePaymentEntity {
    readonly Id: number;
    SalesInvoice?: number;
    CustomerPayment?: number;
    Amount: number;
}

export interface SalesInvoicePaymentCreateEntity {
    readonly SalesInvoice?: number;
    readonly CustomerPayment?: number;
    readonly Amount: number;
}

export interface SalesInvoicePaymentUpdateEntity extends SalesInvoicePaymentCreateEntity {
    readonly Id: number;
}

export interface SalesInvoicePaymentEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            SalesInvoice?: number | number[];
            CustomerPayment?: number | number[];
            Amount?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            SalesInvoice?: number | number[];
            CustomerPayment?: number | number[];
            Amount?: number | number[];
        };
        contains?: {
            Id?: number;
            SalesInvoice?: number;
            CustomerPayment?: number;
            Amount?: number;
        };
        greaterThan?: {
            Id?: number;
            SalesInvoice?: number;
            CustomerPayment?: number;
            Amount?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            SalesInvoice?: number;
            CustomerPayment?: number;
            Amount?: number;
        };
        lessThan?: {
            Id?: number;
            SalesInvoice?: number;
            CustomerPayment?: number;
            Amount?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            SalesInvoice?: number;
            CustomerPayment?: number;
            Amount?: number;
        };
    },
    $select?: (keyof SalesInvoicePaymentEntity)[],
    $sort?: string | (keyof SalesInvoicePaymentEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
}

interface SalesInvoicePaymentEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SalesInvoicePaymentEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface SalesInvoicePaymentUpdateEntityEvent extends SalesInvoicePaymentEntityEvent {
    readonly previousEntity: SalesInvoicePaymentEntity;
}

export class SalesInvoicePaymentRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_SALESINVOICEPAYMENT",
        properties: [
            {
                name: "Id",
                column: "SALESINVOICEPAYMENT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "SalesInvoice",
                column: "SALESINVOICEPAYMENT_SALESINVOICE",
                type: "INTEGER",
            },
            {
                name: "CustomerPayment",
                column: "SALESINVOICEPAYMENT_CUSTOMERPAYMENT",
                type: "INTEGER",
            },
            {
                name: "Amount",
                column: "SALESINVOICEPAYMENT_AMOUNT",
                type: "DECIMAL",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(SalesInvoicePaymentRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: SalesInvoicePaymentEntityOptions = {}): SalesInvoicePaymentEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): SalesInvoicePaymentEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: SalesInvoicePaymentCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_SALESINVOICEPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESINVOICEPAYMENT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: SalesInvoicePaymentUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_SALESINVOICEPAYMENT",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "SALESINVOICEPAYMENT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: SalesInvoicePaymentCreateEntity | SalesInvoicePaymentUpdateEntity): number {
        const id = (entity as SalesInvoicePaymentUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SalesInvoicePaymentUpdateEntity);
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
            table: "CODBEX_SALESINVOICEPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESINVOICEPAYMENT_ID",
                value: id
            }
        });
    }

    public count(options?: SalesInvoicePaymentEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_SALESINVOICEPAYMENT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SalesInvoicePaymentEntityEvent | SalesInvoicePaymentUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices-SalesInvoice-SalesInvoicePayment", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-invoices-SalesInvoice-SalesInvoicePayment").send(JSON.stringify(data));
    }
}
