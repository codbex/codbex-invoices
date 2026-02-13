import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('PaymentMethodEntity')
@Table('CODBEX_PAYMENTMETHOD')
@Documentation('PaymentMethod entity mapping')
export class PaymentMethodEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'PAYMENTMETHOD_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Name')
    @Column({
        name: 'PAYMENTMETHOD_NAME',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public Name?: string;

}

(new PaymentMethodEntity());
