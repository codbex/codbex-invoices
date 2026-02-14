import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('DeductionEntity')
@Table('CODBEX_DEDUCTION')
@Documentation('Deduction entity mapping')
export class DeductionEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'DEDUCTION_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('DeductionInvoice')
    @Column({
        name: 'DEDUCTION_DEDUCTIONINVOICE',
        type: 'integer',
        nullable: true,
    })
    public DeductionInvoice?: number;

    @Documentation('AdvanceInvoice')
    @Column({
        name: 'DEDUCTION_ADVANCEINVOICE',
        type: 'integer',
        nullable: true,
    })
    public AdvanceInvoice?: number;

}

(new DeductionEntity());
