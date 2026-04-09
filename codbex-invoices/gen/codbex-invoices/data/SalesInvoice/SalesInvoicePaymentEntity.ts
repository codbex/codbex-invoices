import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

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

    @Documentation('CreatedAt')
    @Column({
        name: 'SALESINVOICEPAYMENT_CREATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @CreatedAt()
    public CreatedAt?: Date;

    @Documentation('CreatedBy')
    @Column({
        name: 'SALESINVOICEPAYMENT_CREATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @CreatedBy()
    public CreatedBy?: string;

    @Documentation('UpdatedAt')
    @Column({
        name: 'SALESINVOICEPAYMENT_UPDATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @UpdatedAt()
    public UpdatedAt?: Date;

    @Documentation('UpdatedBy')
    @Column({
        name: 'SALESINVOICEPAYMENT_UPDATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @UpdatedBy()
    public UpdatedBy?: string;

}

(new SalesInvoicePaymentEntity());
