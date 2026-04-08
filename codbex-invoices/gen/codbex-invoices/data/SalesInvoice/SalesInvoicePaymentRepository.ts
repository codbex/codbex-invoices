import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { SalesInvoicePaymentEntity } from './SalesInvoicePaymentEntity'

@Component('SalesInvoicePaymentRepository')
export class SalesInvoicePaymentRepository extends Repository<SalesInvoicePaymentEntity> {

    constructor() {
        super((SalesInvoicePaymentEntity as EntityConstructor));
    }

    public override findById(id: string | number, options?: Options): SalesInvoicePaymentEntity | undefined {
        const entity = super.findById(id, options);
        if (entity) {
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
            entity.UpdatedAt = entity.UpdatedAt ? new Date(entity.UpdatedAt) : undefined;
        }
        return entity;
    }

    public override findAll(options?: Options): SalesInvoicePaymentEntity[] {
        const entities = super.findAll(options);
        entities.forEach(entity => {
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
            entity.UpdatedAt = entity.UpdatedAt ? new Date(entity.UpdatedAt) : undefined;
        });
        return entities;
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
