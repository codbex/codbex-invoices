import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { PurchaseInvoiceItemEntity } from './PurchaseInvoiceItemEntity'

@Component('PurchaseInvoiceItemRepository')
export class PurchaseInvoiceItemRepository extends Repository<PurchaseInvoiceItemEntity> {

    constructor() {
        super((PurchaseInvoiceItemEntity as EntityConstructor));
    }

    public override create(entity: PurchaseInvoiceItemEntity): string | number {
        entity.Net = entity["Quantity"] * entity["Price"];
        entity.VAT = entity["Net"] * entity["VATRate"] / 100;
        entity.Gross = entity["Net"] + entity["VAT"];
        return super.create(entity);
    }

    public override upsert(entity: PurchaseInvoiceItemEntity): string | number {
        entity.Net = entity["Quantity"] * entity["Price"];
        entity.VAT = entity["Net"] * entity["VATRate"] / 100;
        entity.Gross = entity["Net"] + entity["VAT"];
        entity.Net = entity["Quantity"] * entity["Price"];
        entity.VAT = entity["Net"] * entity["VATRate"] / 100;
        entity.Gross = entity["Net"] + entity["VAT"];
        return super.upsert(entity);
    }

    protected override async triggerEvent(data: EntityEvent<PurchaseInvoiceItemEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-invoices-PurchaseInvoice-PurchaseInvoiceItem', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-invoices-PurchaseInvoice-PurchaseInvoiceItem').send(JSON.stringify(data));
    }
}
