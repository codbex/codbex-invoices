import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { PurchaseInvoicePaymentEntity } from './PurchaseInvoicePaymentEntity'

@Component('PurchaseInvoicePaymentRepository')
export class PurchaseInvoicePaymentRepository extends Repository<PurchaseInvoicePaymentEntity> {

    constructor() {
        super((PurchaseInvoicePaymentEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<PurchaseInvoicePaymentEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-invoices-PurchaseInvoice-PurchaseInvoicePayment', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-invoices-PurchaseInvoice-PurchaseInvoicePayment').send(JSON.stringify(data));
    }
}
