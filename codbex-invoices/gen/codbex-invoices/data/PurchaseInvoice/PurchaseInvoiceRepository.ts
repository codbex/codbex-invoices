import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { PurchaseInvoiceEntity } from './PurchaseInvoiceEntity'
// custom imports
import { NumberGeneratorService } from "/codbex-number-generator/service/generator";

@Component('PurchaseInvoiceRepository')
export class PurchaseInvoiceRepository extends Repository<PurchaseInvoiceEntity> {

    constructor() {
        super((PurchaseInvoiceEntity as EntityConstructor));
    }

    public override findById(id: string | number, options?: Options): PurchaseInvoiceEntity | undefined {
        const entity = super.findById(id, options);
        if (entity) {
            entity.Date = entity.Date ? new Date(entity.Date) : undefined;
            entity.Due = entity.Due ? new Date(entity.Due) : undefined;
        }
        return entity;
    }

    public override findAll(options?: Options): PurchaseInvoiceEntity[] {
        const entities = super.findAll(options);
        entities.forEach(entity => {
            entity.Date = entity.Date ? new Date(entity.Date) : undefined;
            entity.Due = entity.Due ? new Date(entity.Due) : undefined;
        });
        return entities;
    }

    public override create(entity: PurchaseInvoiceEntity): string | number {
        entity.Number = new NumberGeneratorService().generateByType('Purchase Invoice');
        entity.Name = entity["Number"] + "/" + new Date(entity["Date"]).toISOString().slice(0, 10) + "/" + entity["Total"];
        entity.UUID = require("sdk/utils/uuid").random();
        return super.create(entity);
    }

    public override upsert(entity: PurchaseInvoiceEntity): string | number {
        entity.Number = new NumberGeneratorService().generateByType('Purchase Invoice');
        entity.Name = entity["Number"] + "/" + new Date(entity["Date"]).toISOString().slice(0, 10) + "/" + entity["Total"];
        entity.UUID = require("sdk/utils/uuid").random();
        entity.Name = entity["Number"] + "/" + new Date(entity["Date"]).toISOString().slice(0, 10) + "/" + entity["Total"];
        return super.upsert(entity);
    }

    protected override async triggerEvent(data: EntityEvent<PurchaseInvoiceEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-invoices-PurchaseInvoice-PurchaseInvoice', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-invoices-PurchaseInvoice-PurchaseInvoice').send(JSON.stringify(data));
    }
}
