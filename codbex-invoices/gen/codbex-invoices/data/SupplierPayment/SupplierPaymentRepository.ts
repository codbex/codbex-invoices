import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { SupplierPaymentEntity } from './SupplierPaymentEntity'

@Component('SupplierPaymentRepository')
export class SupplierPaymentRepository extends Repository<SupplierPaymentEntity> {

    constructor() {
        super((SupplierPaymentEntity as EntityConstructor));
    }

    public override create(entity: SupplierPaymentEntity): string | number {
        entity.Name = new NumberGeneratorService().generate(21);
        entity.UUID = require("sdk/utils/uuid").random();
        return super.create(entity);
    }

    public override upsert(entity: SupplierPaymentEntity): string | number {
        entity.Name = new NumberGeneratorService().generate(21);
        entity.UUID = require("sdk/utils/uuid").random();
        return super.upsert(entity);
    }

    protected override async triggerEvent(data: EntityEvent<SupplierPaymentEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-invoices-SupplierPayment-SupplierPayment', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-invoices-SupplierPayment-SupplierPayment').send(JSON.stringify(data));
    }
}
