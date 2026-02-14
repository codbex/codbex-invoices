import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

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
        nullable: true,
    })
    public Type?: number;

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
        nullable: true,
    })
    public Net?: number;

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
        nullable: true,
    })
    public Gross?: number;

    @Documentation('Discount')
    @Column({
        name: 'SALESINVOICE_DISCOUNT',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        defaultValue: `0`,
        nullable: true,
    })
    public Discount?: number;

    @Documentation('Taxes')
    @Column({
        name: 'SALESINVOICE_TAXES',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        defaultValue: `0`,
        nullable: true,
    })
    public Taxes?: number;

    @Documentation('VAT')
    @Column({
        name: 'SALESINVOICE_VAT',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        nullable: true,
    })
    public VAT?: number;

    @Documentation('Total')
    @Column({
        name: 'SALESINVOICE_TOTAL',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        defaultValue: `0`,
        nullable: true,
    })
    public Total?: number;

    @Documentation('Paid')
    @Column({
        name: 'SALESINVOICE_PAID',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        defaultValue: `0`,
        nullable: true,
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

    @Documentation('Document')
    @Column({
        name: 'SALESINVOICE_DOCUMENT',
        type: 'string',
        length: 200,
        nullable: true,
    })
    public Document?: string;

    @Documentation('Company')
    @Column({
        name: 'SALESINVOICE_COMPANY',
        type: 'integer',
        nullable: true,
    })
    public Company?: number;

    @Documentation('Name')
    @Column({
        name: 'SALESINVOICE_NAME',
        type: 'string',
        length: 200,
        nullable: true,
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

}

(new SalesInvoiceEntity());
