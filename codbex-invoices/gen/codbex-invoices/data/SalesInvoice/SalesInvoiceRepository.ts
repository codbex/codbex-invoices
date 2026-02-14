import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { SalesInvoiceEntity } from './SalesInvoiceEntity'
// custom imports
import { NumberGeneratorService } from "/codbex-number-generator/service/generator";

@Component('SalesInvoiceRepository')
export class SalesInvoiceRepository extends Repository<SalesInvoiceEntity> {

    constructor() {
        super((SalesInvoiceEntity as EntityConstructor));
    }

    public override create(entity: SalesInvoiceEntity): string | number {
        entity.Number = new NumberGeneratorService().generate(5);
        entity.Name = entity["Number"] + "/" + new Date(entity["Date"]).toISOString().slice(0, 10) + "/" + entity["Total"];
        entity.UUID = require("sdk/utils/uuid").random();
        return super.create(entity);
    }

    public override upsert(entity: SalesInvoiceEntity): string | number {
        entity.Number = new NumberGeneratorService().generate(5);
        entity.Name = entity["Number"] + "/" + new Date(entity["Date"]).toISOString().slice(0, 10) + "/" + entity["Total"];
        entity.UUID = require("sdk/utils/uuid").random();
        return super.upsert(entity);
    }

    protected override async triggerEvent(data: EntityEvent<SalesInvoiceEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-invoices-SalesInvoice-SalesInvoice', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-invoices-SalesInvoice-SalesInvoice').send(JSON.stringify(data));
    }
}
