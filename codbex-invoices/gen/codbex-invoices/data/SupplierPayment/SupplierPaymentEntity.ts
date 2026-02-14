import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('SupplierPaymentEntity')
@Table('CODBEX_SUPPLIERPAYMENT')
@Documentation('SupplierPayment entity mapping')
export class SupplierPaymentEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'SUPPLIERPAYMENT_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Supplier')
    @Column({
        name: 'SUPPLIERPAYMENT_SUPPLIER',
        type: 'integer',
        nullable: true,
    })
    public Supplier?: number;

    @Documentation('Date')
    @Column({
        name: 'SUPPLIERPAYMENT_DATE',
        type: 'date',
        nullable: true,
    })
    public Date!: Date;

    @Documentation('Valor')
    @Column({
        name: 'SUPPLIERPAYMENT_VALOR',
        type: 'date',
        nullable: true,
    })
    public Valor!: Date;

    @Documentation('CompanyIBAN')
    @Column({
        name: 'SUPPLIERPAYMENT_COMPANYIBAN',
        type: 'string',
        length: 34,
        nullable: true,
    })
    public CompanyIBAN?: string;

    @Documentation('CounterpartyIBAN')
    @Column({
        name: 'SUPPLIERPAYMENT_COUNTERPARTYIBAN',
        type: 'string',
        length: 34,
        nullable: true,
    })
    public CounterpartyIBAN?: string;

    @Documentation('CounterpartyName')
    @Column({
        name: 'SUPPLIERPAYMENT_COUNTERPARTYNAME',
        type: 'string',
        length: 100,
        nullable: true,
    })
    public CounterpartyName?: string;

    @Documentation('Amount')
    @Column({
        name: 'SUPPLIERPAYMENT_AMOUNT',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        nullable: true,
    })
    public Amount!: number;

    @Documentation('Currency')
    @Column({
        name: 'SUPPLIERPAYMENT_CURRENCY',
        type: 'integer',
        nullable: true,
    })
    public Currency!: number;

    @Documentation('Reason')
    @Column({
        name: 'SUPPLIERPAYMENT_REASON',
        type: 'string',
        length: 100,
        nullable: true,
    })
    public Reason!: string;

    @Documentation('Description')
    @Column({
        name: 'SUPPLIERPAYMENT_DESCRIPTION',
        type: 'string',
        length: 100,
        nullable: true,
    })
    public Description?: string;

    @Documentation('Company')
    @Column({
        name: 'SUPPLIERPAYMENT_COMPANY',
        type: 'integer',
        nullable: true,
    })
    public Company?: number;

    @Documentation('Name')
    @Column({
        name: 'SUPPLIERPAYMENT_NAME',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public Name?: string;

    @Documentation('UUID')
    @Column({
        name: 'SUPPLIERPAYMENT_UUID',
        type: 'string',
        length: 36,
        nullable: true,
    })
    public UUID?: string;

    @Documentation('Reference')
    @Column({
        name: 'SUPPLIERPAYMENT_REFERENCE',
        type: 'string',
        length: 36,
        nullable: true,
    })
    public Reference?: string;

}

(new SupplierPaymentEntity());
