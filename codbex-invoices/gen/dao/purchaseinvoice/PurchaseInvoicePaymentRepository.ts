import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface PurchaseInvoicePaymentEntity {
    readonly Id: number;
    PurchaseInvoice?: number;
    SupplierPayment: number;
    Amount: number;
}

export interface PurchaseInvoicePaymentCreateEntity {
    readonly PurchaseInvoice?: number;
    readonly SupplierPayment: number;
    readonly Amount: number;
}

export interface PurchaseInvoicePaymentUpdateEntity extends PurchaseInvoicePaymentCreateEntity {
    readonly Id: number;
}

export interface PurchaseInvoicePaymentEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            PurchaseInvoice?: number | number[];
            SupplierPayment?: number | number[];
            Amount?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            PurchaseInvoice?: number | number[];
            SupplierPayment?: number | number[];
            Amount?: number | number[];
        };
        contains?: {
            Id?: number;
            PurchaseInvoice?: number;
            SupplierPayment?: number;
            Amount?: number;
        };
        greaterThan?: {
            Id?: number;
            PurchaseInvoice?: number;
            SupplierPayment?: number;
            Amount?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            PurchaseInvoice?: number;
            SupplierPayment?: number;
            Amount?: number;
        };
        lessThan?: {
            Id?: number;
            PurchaseInvoice?: number;
            SupplierPayment?: number;
            Amount?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            PurchaseInvoice?: number;
            SupplierPayment?: number;
            Amount?: number;
        };
    },
    $select?: (keyof PurchaseInvoicePaymentEntity)[],
    $sort?: string | (keyof PurchaseInvoicePaymentEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface PurchaseInvoicePaymentEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<PurchaseInvoicePaymentEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class PurchaseInvoicePaymentRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_PURCHASEINVOICEPAYMENT",
        properties: [
            {
                name: "Id",
                column: "PURCHASEINVOICEPAYMENT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "PurchaseInvoice",
                column: "PURCHASEINVOICEPAYMENT_PURCHASEINVOICE",
                type: "INTEGER",
            },
            {
                name: "SupplierPayment",
                column: "PURCHASEINVOICEPAYMENT_SUPPLIERPAYMENT",
                type: "INTEGER",
                required: true
            },
            {
                name: "Amount",
                column: "PURCHASEINVOICEPAYMENT_AMOUNT",
                type: "DECIMAL",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(PurchaseInvoicePaymentRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: PurchaseInvoicePaymentEntityOptions): PurchaseInvoicePaymentEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): PurchaseInvoicePaymentEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: PurchaseInvoicePaymentCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_PURCHASEINVOICEPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEINVOICEPAYMENT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: PurchaseInvoicePaymentUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_PURCHASEINVOICEPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEINVOICEPAYMENT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: PurchaseInvoicePaymentCreateEntity | PurchaseInvoicePaymentUpdateEntity): number {
        const id = (entity as PurchaseInvoicePaymentUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as PurchaseInvoicePaymentUpdateEntity);
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
            table: "CODBEX_PURCHASEINVOICEPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEINVOICEPAYMENT_ID",
                value: id
            }
        });
    }

    public count(options?: PurchaseInvoicePaymentEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PURCHASEINVOICEPAYMENT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: PurchaseInvoicePaymentEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices-purchaseinvoice-PurchaseInvoicePayment", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-invoices-purchaseinvoice-PurchaseInvoicePayment").send(JSON.stringify(data));
    }
}
