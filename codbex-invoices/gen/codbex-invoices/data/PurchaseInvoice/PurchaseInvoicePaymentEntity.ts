import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('PurchaseInvoicePaymentEntity')
@Table('CODBEX_PURCHASEINVOICEPAYMENT')
@Documentation('PurchaseInvoicePayment entity mapping')
export class PurchaseInvoicePaymentEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'PURCHASEINVOICEPAYMENT_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('PurchaseInvoice')
    @Column({
        name: 'PURCHASEINVOICEPAYMENT_PURCHASEINVOICE',
        type: 'integer',
        nullable: true,
    })
    public PurchaseInvoice?: number;

    @Documentation('SupplierPayment')
    @Column({
        name: 'PURCHASEINVOICEPAYMENT_SUPPLIERPAYMENT',
        type: 'integer',
        nullable: true,
    })
    public SupplierPayment?: number;

    @Documentation('Amount')
    @Column({
        name: 'PURCHASEINVOICEPAYMENT_AMOUNT',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
    })
    public Amount!: number;

}

(new PurchaseInvoicePaymentEntity());
