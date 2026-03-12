import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('PurchaseInvoiceEntity')
@Table('CODBEX_PURCHASEINVOICE')
@Documentation('PurchaseInvoice entity mapping')
export class PurchaseInvoiceEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'PURCHASEINVOICE_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Number')
    @Column({
        name: 'PURCHASEINVOICE_NUMBER',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public Number?: string;

    @Documentation('OriginalNumber')
    @Column({
        name: 'PURCHASEINVOICE_ORIGINALNUMBER',
        type: 'string',
        length: 20,
    })
    public OriginalNumber!: string;

    @Documentation('Type')
    @Column({
        name: 'PURCHASEINVOICE_PURCHASEINVOICETYPE',
        type: 'integer',
    })
    public Type!: number;

    @Documentation('Date')
    @Column({
        name: 'PURCHASEINVOICE_DATE',
        type: 'date',
    })
    public Date!: Date;

    @Documentation('Due')
    @Column({
        name: 'PURCHASEINVOICE_DUE',
        type: 'date',
    })
    public Due!: Date;

    @Documentation('Supplier')
    @Column({
        name: 'PURCHASEINVOICE_SUPPLIER',
        type: 'integer',
    })
    public Supplier!: number;

    @Documentation('Net')
    @Column({
        name: 'PURCHASEINVOICE_NET',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
    })
    public Net!: number;

    @Documentation('Currency')
    @Column({
        name: 'PURCHASEINVOICE_CURRENCY',
        type: 'integer',
    })
    public Currency!: number;

    @Documentation('Gross')
    @Column({
        name: 'PURCHASEINVOICE_GROSS',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
    })
    public Gross!: number;

    @Documentation('Discount')
    @Column({
        name: 'PURCHASEINVOICE_DISCOUNT',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        defaultValue: `0`,
    })
    public Discount?: number;

    @Documentation('Taxes')
    @Column({
        name: 'PURCHASEINVOICE_TAXES',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        defaultValue: `0`,
    })
    public Taxes?: number;

    @Documentation('VAT')
    @Column({
        name: 'PURCHASEINVOICE_VAT',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
    })
    public VAT!: number;

    @Documentation('Total')
    @Column({
        name: 'PURCHASEINVOICE_TOTAL',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        defaultValue: `0`,
    })
    public Total?: number;

    @Documentation('Paid')
    @Column({
        name: 'PURCHASEINVOICE_PAID',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        defaultValue: `0`,
    })
    public Paid?: number;

    @Documentation('Conditions')
    @Column({
        name: 'PURCHASEINVOICE_CONDITIONS',
        type: 'string',
        length: 200,
        nullable: true,
    })
    public Conditions?: string;

    @Documentation('PaymentMethod')
    @Column({
        name: 'PURCHASEINVOICE_PAYMENTMETHOD',
        type: 'integer',
        nullable: true,
    })
    public PaymentMethod?: number;

    @Documentation('SentMethod')
    @Column({
        name: 'PURCHASEINVOICE_SENTMETHOD',
        type: 'integer',
        nullable: true,
    })
    public SentMethod?: number;

    @Documentation('Status')
    @Column({
        name: 'PURCHASEINVOICE_STATUS',
        type: 'integer',
    })
    public Status!: number;

    @Documentation('Operator')
    @Column({
        name: 'PURCHASEINVOICE_OPERATOR',
        type: 'integer',
    })
    public Operator!: number;

    @Documentation('DocumentLink')
    @Column({
        name: 'PURCHASEINVOICE_DOCUMENTLINK',
        type: 'string',
        length: 1000,
    })
    public DocumentLink!: string;

    @Documentation('Company')
    @Column({
        name: 'PURCHASEINVOICE_COMPANY',
        type: 'integer',
        nullable: true,
    })
    public Company!: number;

    @Documentation('Name')
    @Column({
        name: 'PURCHASEINVOICE_NAME',
        type: 'string',
        length: 200,
    })
    public Name?: string;

    @Documentation('UUID')
    @Column({
        name: 'PURCHASEINVOICE_UUID',
        type: 'string',
        length: 36,
    })
    public UUID?: string;

    @Documentation('Process')
    @Column({
        name: 'PURCHASEINVOICE_PROCESS',
        type: 'string',
        length: 36,
        nullable: true,
    })
    public Process?: string;

    @Documentation('Reference')
    @Column({
        name: 'PURCHASEINVOICE_REFERENCE',
        type: 'string',
        length: 36,
        nullable: true,
    })
    public Reference?: string;

}

(new PurchaseInvoiceEntity());
