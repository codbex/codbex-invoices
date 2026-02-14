import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { CustomerPaymentEntity } from './CustomerPaymentEntity'

@Component('CustomerPaymentRepository')
export class CustomerPaymentRepository extends Repository<CustomerPaymentEntity> {

    constructor() {
        super((CustomerPaymentEntity as EntityConstructor));
    }

    public override create(entity: CustomerPaymentEntity): string | number {
        entity.Name = new NumberGeneratorService().generate(20);
        entity.UUID = require("sdk/utils/uuid").random();
        return super.create(entity);
    }

    public override upsert(entity: CustomerPaymentEntity): string | number {
        entity.Name = new NumberGeneratorService().generate(20);
        entity.UUID = require("sdk/utils/uuid").random();
        return super.upsert(entity);
    }

    protected override async triggerEvent(data: EntityEvent<CustomerPaymentEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-invoices-CustomerPayment-CustomerPayment', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-invoices-CustomerPayment-CustomerPayment').send(JSON.stringify(data));
    }
}
