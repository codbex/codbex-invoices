import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('SalesInvoicePaymentEntity')
@Table('CODBEX_SALESINVOICEPAYMENT')
@Documentation('SalesInvoicePayment entity mapping')
export class SalesInvoicePaymentEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'SALESINVOICEPAYMENT_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('SalesInvoice')
    @Column({
        name: 'SALESINVOICEPAYMENT_SALESINVOICE',
        type: 'integer',
        nullable: true,
    })
    public SalesInvoice?: number;

    @Documentation('CustomerPayment')
    @Column({
        name: 'SALESINVOICEPAYMENT_CUSTOMERPAYMENT',
        type: 'integer',
        nullable: true,
    })
    public CustomerPayment?: number;

    @Documentation('Amount')
    @Column({
        name: 'SALESINVOICEPAYMENT_AMOUNT',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
    })
    public Amount!: number;

}

(new SalesInvoicePaymentEntity());
