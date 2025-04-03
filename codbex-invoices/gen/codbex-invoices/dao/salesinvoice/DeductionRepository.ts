import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface DeductionEntity {
    readonly Id: number;
    DeductionInvoice?: number;
    AdvanceInvoice?: number;
    SalesInvoice?: number;
}

export interface DeductionCreateEntity {
    readonly DeductionInvoice?: number;
    readonly AdvanceInvoice?: number;
    readonly SalesInvoice?: number;
}

export interface DeductionUpdateEntity extends DeductionCreateEntity {
    readonly Id: number;
}

export interface DeductionEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            DeductionInvoice?: number | number[];
            AdvanceInvoice?: number | number[];
            SalesInvoice?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            DeductionInvoice?: number | number[];
            AdvanceInvoice?: number | number[];
            SalesInvoice?: number | number[];
        };
        contains?: {
            Id?: number;
            DeductionInvoice?: number;
            AdvanceInvoice?: number;
            SalesInvoice?: number;
        };
        greaterThan?: {
            Id?: number;
            DeductionInvoice?: number;
            AdvanceInvoice?: number;
            SalesInvoice?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            DeductionInvoice?: number;
            AdvanceInvoice?: number;
            SalesInvoice?: number;
        };
        lessThan?: {
            Id?: number;
            DeductionInvoice?: number;
            AdvanceInvoice?: number;
            SalesInvoice?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            DeductionInvoice?: number;
            AdvanceInvoice?: number;
            SalesInvoice?: number;
        };
    },
    $select?: (keyof DeductionEntity)[],
    $sort?: string | (keyof DeductionEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface DeductionEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<DeductionEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface DeductionUpdateEntityEvent extends DeductionEntityEvent {
    readonly previousEntity: DeductionEntity;
}

export class DeductionRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_DEDUCTION",
        properties: [
            {
                name: "Id",
                column: "DEDUCTION_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "DeductionInvoice",
                column: "DEDUCTION_DEDUCTIONINVOICE",
                type: "INTEGER",
            },
            {
                name: "AdvanceInvoice",
                column: "DEDUCTION_ADVANCEINVOICE",
                type: "INTEGER",
            },
            {
                name: "SalesInvoice",
                column: "DEDUCTION_SALESINVOICE",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(DeductionRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: DeductionEntityOptions): DeductionEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): DeductionEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: DeductionCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_DEDUCTION",
            entity: entity,
            key: {
                name: "Id",
                column: "DEDUCTION_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: DeductionUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_DEDUCTION",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "DEDUCTION_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: DeductionCreateEntity | DeductionUpdateEntity): number {
        const id = (entity as DeductionUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as DeductionUpdateEntity);
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
            table: "CODBEX_DEDUCTION",
            entity: entity,
            key: {
                name: "Id",
                column: "DEDUCTION_ID",
                value: id
            }
        });
    }

    public count(options?: DeductionEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_DEDUCTION"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: DeductionEntityEvent | DeductionUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices-salesinvoice-Deduction", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-invoices-salesinvoice-Deduction").send(JSON.stringify(data));
    }
}
