import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { SalesInvoiceStatusEntity } from './SalesInvoiceStatusEntity'

@Component('SalesInvoiceStatusRepository')
export class SalesInvoiceStatusRepository extends Repository<SalesInvoiceStatusEntity> {

    constructor() {
        super((SalesInvoiceStatusEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<SalesInvoiceStatusEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-invoices-Settings-SalesInvoiceStatus', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-invoices-Settings-SalesInvoiceStatus').send(JSON.stringify(data));
    }
}
