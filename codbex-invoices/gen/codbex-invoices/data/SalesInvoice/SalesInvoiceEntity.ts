import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('SalesInvoiceEntity')
@Table('CODBEX_SALESINVOICE')
@Documentation('SalesInvoice entity mapping')
export class SalesInvoiceEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'SALESINVOICE_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Number')
    @Column({
        name: 'SALESINVOICE_NUMBER',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public Number?: string;

    @Documentation('Type')
    @Column({
        name: 'SALESINVOICE_TYPE',
        type: 'integer',
    })
    public Type!: number;

    @Documentation('Customer')
    @Column({
        name: 'SALESINVOICE_CUSTOMER',
        type: 'integer',
    })
    public Customer!: number;

    @Documentation('Date')
    @Column({
        name: 'SALESINVOICE_DATE',
        type: 'date',
    })
    public Date!: Date;

    @Documentation('Due')
    @Column({
        name: 'SALESINVOICE_DUE',
        type: 'date',
    })
    public Due!: Date;

    @Documentation('Net')
    @Column({
        name: 'SALESINVOICE_NET',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
    })
    public Net!: number;

    @Documentation('Currency')
    @Column({
        name: 'SALESINVOICE_CURRENCY',
        type: 'integer',
    })
    public Currency!: number;

    @Documentation('Gross')
    @Column({
        name: 'SALESINVOICE_GROSS',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
    })
    public Gross!: number;

    @Documentation('Discount')
    @Column({
        name: 'SALESINVOICE_DISCOUNT',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        defaultValue: `0`,
    })
    public Discount?: number;

    @Documentation('Taxes')
    @Column({
        name: 'SALESINVOICE_TAXES',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        defaultValue: `0`,
    })
    public Taxes?: number;

    @Documentation('VAT')
    @Column({
        name: 'SALESINVOICE_VAT',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
    })
    public VAT!: number;

    @Documentation('Total')
    @Column({
        name: 'SALESINVOICE_TOTAL',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        defaultValue: `0`,
    })
    public Total?: number;

    @Documentation('Paid')
    @Column({
        name: 'SALESINVOICE_PAID',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        defaultValue: `0`,
    })
    public Paid?: number;

    @Documentation('Conditions')
    @Column({
        name: 'SALESINVOICE_CONDITIONS',
        type: 'string',
        length: 200,
        nullable: true,
    })
    public Conditions?: string;

    @Documentation('PaymentMethod')
    @Column({
        name: 'SALESINVOICE_PAYMENTMETHOD',
        type: 'integer',
        nullable: true,
    })
    public PaymentMethod?: number;

    @Documentation('SentMethod')
    @Column({
        name: 'SALESINVOICE_SENTMETHOD',
        type: 'integer',
        nullable: true,
    })
    public SentMethod?: number;

    @Documentation('Status')
    @Column({
        name: 'SALESINVOICE_STATUS',
        type: 'integer',
    })
    public Status!: number;

    @Documentation('Operator')
    @Column({
        name: 'SALESINVOICE_OPERATOR',
        type: 'integer',
    })
    public Operator!: number;

    @Documentation('DocumentLink')
    @Column({
        name: 'SALESINVOICE_DOCUMENTLINK',
        type: 'string',
        length: 1000,
    })
    public DocumentLink!: string;

    @Documentation('Company')
    @Column({
        name: 'SALESINVOICE_COMPANY',
        type: 'integer',
    })
    public Company!: number;

    @Documentation('Name')
    @Column({
        name: 'SALESINVOICE_NAME',
        type: 'string',
        length: 200,
    })
    public Name?: string;

    @Documentation('UUID')
    @Column({
        name: 'SALESINVOICE_UUID',
        type: 'string',
        length: 36,
    })
    public UUID?: string;

    @Documentation('Process')
    @Column({
        name: 'SALESINVOICE_PROCESS',
        type: 'string',
        length: 36,
        nullable: true,
    })
    public Process?: string;

    @Documentation('Reference')
    @Column({
        name: 'SALESINVOICE_REFERENCE',
        type: 'string',
        length: 100,
        nullable: true,
    })
    public Reference?: string;

    @Documentation('CreatedAt')
    @Column({
        name: 'SALESINVOICE_CREATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @CreatedAt()
    public CreatedAt?: Date;

    @Documentation('CreatedBy')
    @Column({
        name: 'SALESINVOICE_CREATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @CreatedBy()
    public CreatedBy?: string;

    @Documentation('UpdatedAt')
    @Column({
        name: 'SALESINVOICE_UPDATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @UpdatedAt()
    public UpdatedAt?: Date;

    @Documentation('UpdatedBy')
    @Column({
        name: 'SALESINVOICE_UPDATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @UpdatedBy()
    public UpdatedBy?: string;

}

(new SalesInvoiceEntity());
