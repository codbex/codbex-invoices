import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('PurchaseInvoiceTypeEntity')
@Table('CODBEX_PURCHASEINVOICETYPE')
@Documentation('PurchaseInvoiceType entity mapping')
export class PurchaseInvoiceTypeEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'PURCHASEINVOICETYPE_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Name')
    @Column({
        name: 'PURCHASEINVOICETYPE_NAME',
        type: 'string',
        length: 20,
    })
    public Name!: string;

    @Documentation('Direction')
    @Column({
        name: 'PURCHASEINVOICETYPE_DIRECTION',
        type: 'integer',
    })
    public Direction!: number;

}

(new PurchaseInvoiceTypeEntity());
