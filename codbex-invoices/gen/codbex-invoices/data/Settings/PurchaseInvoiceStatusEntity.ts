import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('PurchaseInvoiceStatusEntity')
@Table('CODBEX_PURCHASEINVOICESTATUS')
@Documentation('PurchaseInvoiceStatus entity mapping')
export class PurchaseInvoiceStatusEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'PURCHASEINVOICESTATUS_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Name')
    @Column({
        name: 'PURCHASEINVOICESTATUS_NAME',
        type: 'string',
        length: 20,
    })
    public Name!: string;

}

(new PurchaseInvoiceStatusEntity());
