import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { SalesInvoicePaymentEntity } from './SalesInvoicePaymentEntity'

@Component('SalesInvoicePaymentRepository')
export class SalesInvoicePaymentRepository extends Repository<SalesInvoicePaymentEntity> {

    constructor() {
        super((SalesInvoicePaymentEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<SalesInvoicePaymentEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-invoices-SalesInvoice-SalesInvoicePayment', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-invoices-SalesInvoice-SalesInvoicePayment').send(JSON.stringify(data));
    }
}
