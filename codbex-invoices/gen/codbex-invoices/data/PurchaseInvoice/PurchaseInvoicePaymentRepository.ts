import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { PurchaseInvoicePaymentEntity } from './PurchaseInvoicePaymentEntity'

@Component('PurchaseInvoicePaymentRepository')
export class PurchaseInvoicePaymentRepository extends Repository<PurchaseInvoicePaymentEntity> {

    constructor() {
        super((PurchaseInvoicePaymentEntity as EntityConstructor));
    }

    public override findById(id: string | number, options?: Options): PurchaseInvoicePaymentEntity | undefined {
        const entity = super.findById(id, options);
        if (entity) {
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
            entity.UpdatedAt = entity.UpdatedAt ? new Date(entity.UpdatedAt) : undefined;
        }
        return entity;
    }

    public override findAll(options?: Options): PurchaseInvoicePaymentEntity[] {
        const entities = super.findAll(options);
        entities.forEach(entity => {
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
            entity.UpdatedAt = entity.UpdatedAt ? new Date(entity.UpdatedAt) : undefined;
        });
        return entities;
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
