import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { DeductionEntity } from './DeductionEntity'

@Component('DeductionRepository')
export class DeductionRepository extends Repository<DeductionEntity> {

    constructor() {
        super((DeductionEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<DeductionEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-invoices-SalesInvoice-Deduction', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-invoices-SalesInvoice-Deduction').send(JSON.stringify(data));
    }
}
