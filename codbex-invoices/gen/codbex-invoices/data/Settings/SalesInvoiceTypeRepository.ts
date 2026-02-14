import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { SalesInvoiceTypeEntity } from './SalesInvoiceTypeEntity'

@Component('SalesInvoiceTypeRepository')
export class SalesInvoiceTypeRepository extends Repository<SalesInvoiceTypeEntity> {

    constructor() {
        super((SalesInvoiceTypeEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<SalesInvoiceTypeEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-invoices-Settings-SalesInvoiceType', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-invoices-Settings-SalesInvoiceType').send(JSON.stringify(data));
    }
}
