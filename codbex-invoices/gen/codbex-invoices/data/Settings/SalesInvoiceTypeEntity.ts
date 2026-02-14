import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('SalesInvoiceTypeEntity')
@Table('CODBEX_SALESINVOICETYPE')
@Documentation('SalesInvoiceType entity mapping')
export class SalesInvoiceTypeEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'SALESINVOICETYPE_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Name')
    @Column({
        name: 'SALESINVOICETYPE_NAME',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public Name!: string;

    @Documentation('Direction')
    @Column({
        name: 'SALESINVOICETYPE_DIRECTION',
        type: 'integer',
    })
    public Direction!: number;

}

(new SalesInvoiceTypeEntity());
