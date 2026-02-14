import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('SalesInvoiceStatusEntity')
@Table('CODBEX_SALESINVOICESTATUS')
@Documentation('SalesInvoiceStatus entity mapping')
export class SalesInvoiceStatusEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'SALESINVOICESTATUS_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Name')
    @Column({
        name: 'SALESINVOICESTATUS_NAME',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public Name?: string;

}

(new SalesInvoiceStatusEntity());
