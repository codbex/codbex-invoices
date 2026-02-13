import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('PurchaseInvoiceItemEntity')
@Table('CODBEX_PURCHASEINVOICEITEM')
@Documentation('PurchaseInvoiceItem entity mapping')
export class PurchaseInvoiceItemEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'PURCHASEINVOICEITEM_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('PurchaseInvoice')
    @Column({
        name: 'PURCHASEINVOICEITEM_PURCHASEINVOICE',
        type: 'integer',
    })
    public PurchaseInvoice!: number;

    @Documentation('Name')
    @Column({
        name: 'PURCHASEINVOICEITEM_NAME',
        type: 'string',
        length: 300,
    })
    public Name!: string;

    @Documentation('Quantity')
    @Column({
        name: 'PURCHASEINVOICEITEM_QUANTITY',
        type: 'double',
    })
    public Quantity!: number;

    @Documentation('UoM')
    @Column({
        name: 'PURCHASEINVOICEITEM_UOM',
        type: 'integer',
    })
    public UoM!: number;

    @Documentation('Price')
    @Column({
        name: 'PURCHASEINVOICEITEM_PRICE',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
    })
    public Price!: number;

    @Documentation('Net')
    @Column({
        name: 'PURCHASEINVOICEITEM_NET',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        nullable: true,
    })
    public Net?: number;

    @Documentation('VATRate')
    @Column({
        name: 'PURCHASEINVOICEITEM_VATRATE',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        nullable: true,
    })
    public VATRate?: number;

    @Documentation('VAT')
    @Column({
        name: 'PURCHASEINVOICEITEM_VAT',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        nullable: true,
    })
    public VAT?: number;

    @Documentation('Gross')
    @Column({
        name: 'PURCHASEINVOICEITEM_GROSS',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        nullable: true,
    })
    public Gross?: number;

}

(new PurchaseInvoiceItemEntity());
