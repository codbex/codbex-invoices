import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('SalesInvoiceItemEntity')
@Table('CODBEX_SALESINVOICEITEM')
@Documentation('SalesInvoiceItem entity mapping')
export class SalesInvoiceItemEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'SALESINVOICEITEM_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('SalesInvoice')
    @Column({
        name: 'SALESINVOICEITEM_SALESINVOICE',
        type: 'integer',
    })
    public SalesInvoice!: number;

    @Documentation('Name')
    @Column({
        name: 'SALESINVOICEITEM_NAME',
        type: 'string',
        length: 300,
    })
    public Name!: string;

    @Documentation('Quantity')
    @Column({
        name: 'SALESINVOICEITEM_QUANTITY',
        type: 'double',
    })
    public Quantity!: number;

    @Documentation('UoM')
    @Column({
        name: 'SALESINVOICEITEM_UOM',
        type: 'integer',
    })
    public UoM!: number;

    @Documentation('Price')
    @Column({
        name: 'SALESINVOICEITEM_PRICE',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
    })
    public Price!: number;

    @Documentation('Net')
    @Column({
        name: 'SALESINVOICEITEM_NET',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
    })
    public Net?: number;

    @Documentation('VATRate')
    @Column({
        name: 'SALESINVOICEITEM_VATRATE',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        defaultValue: `20`,
    })
    public VATRate?: number;

    @Documentation('VAT')
    @Column({
        name: 'SALESINVOICEITEM_VAT',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
    })
    public VAT?: number;

    @Documentation('Gross')
    @Column({
        name: 'SALESINVOICEITEM_GROSS',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
    })
    public Gross?: number;

    @Documentation('CreatedAt')
    @Column({
        name: 'SALESINVOICEITEM_CREATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @CreatedAt()
    public CreatedAt?: Date;

    @Documentation('CreatedBy')
    @Column({
        name: 'SALESINVOICEITEM_CREATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @CreatedBy()
    public CreatedBy?: string;

}

(new SalesInvoiceItemEntity());
