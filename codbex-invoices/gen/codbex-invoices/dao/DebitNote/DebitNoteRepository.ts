import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";
// custom imports
import { NumberGeneratorService } from "/codbex-number-generator/service/generator";

export interface DebitNoteEntity {
    readonly Id: number;
    Number?: string;
    Date: Date;
    PurchaseInvoice: number;
}

export interface DebitNoteCreateEntity {
    readonly Date: Date;
    readonly PurchaseInvoice: number;
}

export interface DebitNoteUpdateEntity extends DebitNoteCreateEntity {
    readonly Id: number;
}

export interface DebitNoteEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Number?: string | string[];
            Date?: Date | Date[];
            PurchaseInvoice?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Number?: string | string[];
            Date?: Date | Date[];
            PurchaseInvoice?: number | number[];
        };
        contains?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            PurchaseInvoice?: number;
        };
        greaterThan?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            PurchaseInvoice?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            PurchaseInvoice?: number;
        };
        lessThan?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            PurchaseInvoice?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            PurchaseInvoice?: number;
        };
    },
    $select?: (keyof DebitNoteEntity)[],
    $sort?: string | (keyof DebitNoteEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface DebitNoteEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<DebitNoteEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface DebitNoteUpdateEntityEvent extends DebitNoteEntityEvent {
    readonly previousEntity: DebitNoteEntity;
}

export class DebitNoteRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_DEBITNOTE",
        properties: [
            {
                name: "Id",
                column: "DEBITNOTE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Number",
                column: "DEBITNOTE_NUMBER",
                type: "VARCHAR",
            },
            {
                name: "Date",
                column: "DEBITNOTE_DATE",
                type: "DATE",
                required: true
            },
            {
                name: "PurchaseInvoice",
                column: "DEBITNOTE_PURCHASEINVOICE",
                type: "INTEGER",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(DebitNoteRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: DebitNoteEntityOptions): DebitNoteEntity[] {
        return this.dao.list(options).map((e: DebitNoteEntity) => {
            EntityUtils.setDate(e, "Date");
            return e;
        });
    }

    public findById(id: number): DebitNoteEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        return entity ?? undefined;
    }

    public create(entity: DebitNoteCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        // @ts-ignore
        (entity as DebitNoteEntity).Number = new NumberGeneratorService().generate(12);
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_DEBITNOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "DEBITNOTE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: DebitNoteUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_DEBITNOTE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "DEBITNOTE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: DebitNoteCreateEntity | DebitNoteUpdateEntity): number {
        const id = (entity as DebitNoteUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as DebitNoteUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_DEBITNOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "DEBITNOTE_ID",
                value: id
            }
        });
    }

    public count(options?: DebitNoteEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_DEBITNOTE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: DebitNoteEntityEvent | DebitNoteUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices-DebitNote-DebitNote", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-invoices-DebitNote-DebitNote").send(JSON.stringify(data));
    }
}
