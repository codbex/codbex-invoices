import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('CustomerPaymentEntity')
@Table('CODBEX_CUSTOMERPAYMENT')
@Documentation('CustomerPayment entity mapping')
export class CustomerPaymentEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'CUSTOMERPAYMENT_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Customer')
    @Column({
        name: 'CUSTOMERPAYMENT_CUSTOMER',
        type: 'integer',
        nullable: true,
    })
    public Customer!: number;

    @Documentation('Date')
    @Column({
        name: 'CUSTOMERPAYMENT_DATE',
        type: 'date',
        nullable: true,
    })
    public Date!: Date;

    @Documentation('Valor')
    @Column({
        name: 'CUSTOMERPAYMENT_VALOR',
        type: 'date',
        nullable: true,
    })
    public Valor!: Date;

    @Documentation('CompanyIBAN')
    @Column({
        name: 'CUSTOMERPAYMENT_COMPANYIBAN',
        type: 'string',
        length: 34,
        nullable: true,
    })
    public CompanyIBAN?: string;

    @Documentation('CounterpartyIBAN')
    @Column({
        name: 'CUSTOMERPAYMENT_COUNTERPARTYIBAN',
        type: 'string',
        length: 34,
        nullable: true,
    })
    public CounterpartyIBAN?: string;

    @Documentation('CounterpartyName')
    @Column({
        name: 'CUSTOMERPAYMENT_COUNTERPARTYNAME',
        type: 'string',
        length: 100,
        nullable: true,
    })
    public CounterpartyName?: string;

    @Documentation('Amount')
    @Column({
        name: 'CUSTOMERPAYMENT_AMOUNT',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        nullable: true,
    })
    public Amount!: number;

    @Documentation('Currency')
    @Column({
        name: 'CUSTOMERPAYMENT_CURRENCY',
        type: 'integer',
        nullable: true,
    })
    public Currency!: number;

    @Documentation('Reason')
    @Column({
        name: 'CUSTOMERPAYMENT_REASON',
        type: 'string',
        length: 100,
        nullable: true,
    })
    public Reason!: string;

    @Documentation('Description')
    @Column({
        name: 'CUSTOMERPAYMENT_DESCRIPTION',
        type: 'string',
        length: 100,
        nullable: true,
    })
    public Description?: string;

    @Documentation('Company')
    @Column({
        name: 'CUSTOMERPAYMENT_COMPANY',
        type: 'integer',
        nullable: true,
    })
    public Company?: number;

    @Documentation('Name')
    @Column({
        name: 'CUSTOMERPAYMENT_NAME',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public Name?: string;

    @Documentation('UUID')
    @Column({
        name: 'CUSTOMERPAYMENT_UUID',
        type: 'string',
        length: 36,
        nullable: true,
    })
    public UUID?: string;

    @Documentation('Reference')
    @Column({
        name: 'CUSTOMERPAYMENT_REFERENCE',
        type: 'string',
        length: 36,
        nullable: true,
    })
    public Reference?: string;

    @Documentation('PaymentMethod')
    @Column({
        name: 'CUSTOMERPAYMENT_PAYMENTMETHOD',
        type: 'integer',
        nullable: true,
    })
    public PaymentMethod?: number;

}

(new CustomerPaymentEntity());
