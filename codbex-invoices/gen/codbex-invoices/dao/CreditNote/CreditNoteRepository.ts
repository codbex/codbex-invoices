import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";
// custom imports
import { NumberGeneratorService } from "/codbex-number-generator/service/generator";

export interface CreditNoteEntity {
    readonly Id: number;
    Number: string;
    Date: Date;
    SalesInvoice?: number;
    NewNet: number;
}

export interface CreditNoteCreateEntity {
    readonly Date: Date;
    readonly SalesInvoice?: number;
    readonly NewNet: number;
}

export interface CreditNoteUpdateEntity extends CreditNoteCreateEntity {
    readonly Id: number;
}

export interface CreditNoteEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Number?: string | string[];
            Date?: Date | Date[];
            SalesInvoice?: number | number[];
            NewNet?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Number?: string | string[];
            Date?: Date | Date[];
            SalesInvoice?: number | number[];
            NewNet?: number | number[];
        };
        contains?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            SalesInvoice?: number;
            NewNet?: number;
        };
        greaterThan?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            SalesInvoice?: number;
            NewNet?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            SalesInvoice?: number;
            NewNet?: number;
        };
        lessThan?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            SalesInvoice?: number;
            NewNet?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            SalesInvoice?: number;
            NewNet?: number;
        };
    },
    $select?: (keyof CreditNoteEntity)[],
    $sort?: string | (keyof CreditNoteEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface CreditNoteEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<CreditNoteEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface CreditNoteUpdateEntityEvent extends CreditNoteEntityEvent {
    readonly previousEntity: CreditNoteEntity;
}

export class CreditNoteRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_NOTE",
        properties: [
            {
                name: "Id",
                column: "CREDITNOTE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Number",
                column: "CREDITNOTE_NUMBER",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Date",
                column: "CREDITNOTE_DATE",
                type: "DATE",
                required: true
            },
            {
                name: "SalesInvoice",
                column: "CREDITNOTE_SALESINVOICE",
                type: "INTEGER",
            },
            {
                name: "NewNet",
                column: "NOTE_NEWNET",
                type: "DECIMAL",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(CreditNoteRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: CreditNoteEntityOptions): CreditNoteEntity[] {
        return this.dao.list(options).map((e: CreditNoteEntity) => {
            EntityUtils.setDate(e, "Date");
            return e;
        });
    }

    public findById(id: number): CreditNoteEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        return entity ?? undefined;
    }

    public create(entity: CreditNoteCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        // @ts-ignore
        (entity as CreditNoteEntity).Number = new NumberGeneratorService().generate(6);
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_NOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "CREDITNOTE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: CreditNoteUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_NOTE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "CREDITNOTE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: CreditNoteCreateEntity | CreditNoteUpdateEntity): number {
        const id = (entity as CreditNoteUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as CreditNoteUpdateEntity);
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
            table: "CODBEX_NOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "CREDITNOTE_ID",
                value: id
            }
        });
    }

    public count(options?: CreditNoteEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_CREDITNOTE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: CreditNoteEntityEvent | CreditNoteUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices-CreditNote-CreditNote", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-invoices-CreditNote-CreditNote").send(JSON.stringify(data));
    }
}
