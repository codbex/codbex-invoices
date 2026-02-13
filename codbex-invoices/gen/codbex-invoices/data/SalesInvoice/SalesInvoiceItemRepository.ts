import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { SalesInvoiceItemEntity } from './SalesInvoiceItemEntity'

@Component('SalesInvoiceItemRepository')
export class SalesInvoiceItemRepository extends Repository<SalesInvoiceItemEntity> {

    constructor() {
        super((SalesInvoiceItemEntity as EntityConstructor));
    }

    public override create(entity: SalesInvoiceItemEntity): string | number {
        entity.Net = entity["Quantity"] * entity["Price"];
        entity.VAT = entity["Net"] * entity["VATRate"] / 100;
        entity.Gross = entity["Net"] + entity["VAT"];
        return super.create(entity);
    }

    public override upsert(entity: SalesInvoiceItemEntity): string | number {
        entity.Net = entity["Quantity"] * entity["Price"];
        entity.VAT = entity["Net"] * entity["VATRate"] / 100;
        entity.Gross = entity["Net"] + entity["VAT"];
        entity.Net = entity["Quantity"] * entity["Price"];
        entity.VAT = entity["Net"] * entity["VATRate"] / 100;
        entity.Gross = entity["Net"] + entity["VAT"];
        return super.upsert(entity);
    }

    protected override async triggerEvent(data: EntityEvent<SalesInvoiceItemEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-invoices-SalesInvoice-SalesInvoiceItem', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-invoices-SalesInvoice-SalesInvoiceItem').send(JSON.stringify(data));
    }
}
