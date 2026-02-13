import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { PurchaseInvoiceTypeEntity } from './PurchaseInvoiceTypeEntity'

@Component('PurchaseInvoiceTypeRepository')
export class PurchaseInvoiceTypeRepository extends Repository<PurchaseInvoiceTypeEntity> {

    constructor() {
        super((PurchaseInvoiceTypeEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<PurchaseInvoiceTypeEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-invoices-Settings-PurchaseInvoiceType', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-invoices-Settings-PurchaseInvoiceType').send(JSON.stringify(data));
    }
}
