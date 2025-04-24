import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface PurchaseInvoiceStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface PurchaseInvoiceStatusCreateEntity {
    readonly Name?: string;
}

export interface PurchaseInvoiceStatusUpdateEntity extends PurchaseInvoiceStatusCreateEntity {
    readonly Id: number;
}

export interface PurchaseInvoiceStatusEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        contains?: {
            Id?: number;
            Name?: string;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
    },
    $select?: (keyof PurchaseInvoiceStatusEntity)[],
    $sort?: string | (keyof PurchaseInvoiceStatusEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
}

interface PurchaseInvoiceStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<PurchaseInvoiceStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface PurchaseInvoiceStatusUpdateEntityEvent extends PurchaseInvoiceStatusEntityEvent {
    readonly previousEntity: PurchaseInvoiceStatusEntity;
}

export class PurchaseInvoiceStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_PURCHASEINVOICESTATUS",
        properties: [
            {
                name: "Id",
                column: "PURCHASEINVOICESTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "PURCHASEINVOICESTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(PurchaseInvoiceStatusRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: PurchaseInvoiceStatusEntityOptions = {}): PurchaseInvoiceStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): PurchaseInvoiceStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: PurchaseInvoiceStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_PURCHASEINVOICESTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEINVOICESTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: PurchaseInvoiceStatusUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_PURCHASEINVOICESTATUS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "PURCHASEINVOICESTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: PurchaseInvoiceStatusCreateEntity | PurchaseInvoiceStatusUpdateEntity): number {
        const id = (entity as PurchaseInvoiceStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as PurchaseInvoiceStatusUpdateEntity);
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
            table: "CODBEX_PURCHASEINVOICESTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEINVOICESTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: PurchaseInvoiceStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PURCHASEINVOICESTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: PurchaseInvoiceStatusEntityEvent | PurchaseInvoiceStatusUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices-Settings-PurchaseInvoiceStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-invoices-Settings-PurchaseInvoiceStatus").send(JSON.stringify(data));
    }
}
