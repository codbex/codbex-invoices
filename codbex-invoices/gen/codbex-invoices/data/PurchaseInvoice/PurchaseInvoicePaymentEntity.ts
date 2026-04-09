import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

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

    @Documentation('CreatedAt')
    @Column({
        name: 'PURCHASEINVOICEPAYMENT_CREATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @CreatedAt()
    public CreatedAt?: Date;

    @Documentation('CreatedBy')
    @Column({
        name: 'PURCHASEINVOICEPAYMENT_CREATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @CreatedBy()
    public CreatedBy?: string;

    @Documentation('UpdatedAt')
    @Column({
        name: 'PURCHASEINVOICEPAYMENT_UPDATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @UpdatedAt()
    public UpdatedAt?: Date;

    @Documentation('UpdatedBy')
    @Column({
        name: 'PURCHASEINVOICEPAYMENT_UPDATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @UpdatedBy()
    public UpdatedBy?: string;

}

(new PurchaseInvoicePaymentEntity());
