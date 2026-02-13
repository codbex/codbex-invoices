import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { PaymentMethodEntity } from './PaymentMethodEntity'

@Component('PaymentMethodRepository')
export class PaymentMethodRepository extends Repository<PaymentMethodEntity> {

    constructor() {
        super((PaymentMethodEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<PaymentMethodEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-invoices-Settings-PaymentMethod', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-invoices-Settings-PaymentMethod').send(JSON.stringify(data));
    }
}
