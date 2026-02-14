import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { PurchaseInvoiceStatusEntity } from './PurchaseInvoiceStatusEntity'

@Component('PurchaseInvoiceStatusRepository')
export class PurchaseInvoiceStatusRepository extends Repository<PurchaseInvoiceStatusEntity> {

    constructor() {
        super((PurchaseInvoiceStatusEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<PurchaseInvoiceStatusEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-invoices-Settings-PurchaseInvoiceStatus', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-invoices-Settings-PurchaseInvoiceStatus').send(JSON.stringify(data));
    }
}
