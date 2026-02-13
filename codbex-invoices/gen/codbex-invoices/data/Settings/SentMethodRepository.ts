import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { SentMethodEntity } from './SentMethodEntity'

@Component('SentMethodRepository')
export class SentMethodRepository extends Repository<SentMethodEntity> {

    constructor() {
        super((SentMethodEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<SentMethodEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-invoices-Settings-SentMethod', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-invoices-Settings-SentMethod').send(JSON.stringify(data));
    }
}
