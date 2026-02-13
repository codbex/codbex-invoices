import { sql, query } from "@aerokit/sdk/db";
import { producer } from "@aerokit/sdk/messaging";
import { extensions } from "@aerokit/sdk/extensions";
import { dao as daoApi } from "@aerokit/sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface CustomerPaymentEntity {
    readonly Id: number;
    Customer?: number;
    Date?: Date;
    Valor?: Date;
    CompanyIBAN?: string;
    CounterpartyIBAN?: string;
    CounterpartyName?: string;
    Amount?: number;
    Currency?: number;
    Reason?: string;
    Description?: string;
    Company?: number;
    Name?: string;
    UUID?: string;
    Reference?: string;
    PaymentMethod?: number;
}

export interface CustomerPaymentCreateEntity {
    readonly Customer?: number;
    readonly Date?: Date;
    readonly Valor?: Date;
    readonly CompanyIBAN?: string;
    readonly CounterpartyIBAN?: string;
    readonly CounterpartyName?: string;
    readonly Amount?: number;
    readonly Currency?: number;
    readonly Reason?: string;
    readonly Description?: string;
    readonly Company?: number;
    readonly Reference?: string;
    readonly PaymentMethod?: number;
}

export interface CustomerPaymentUpdateEntity extends CustomerPaymentCreateEntity {
    readonly Id: number;
}

export interface CustomerPaymentEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Customer?: number | number[];
            Date?: Date | Date[];
            Valor?: Date | Date[];
            CompanyIBAN?: string | string[];
            CounterpartyIBAN?: string | string[];
            CounterpartyName?: string | string[];
            Amount?: number | number[];
            Currency?: number | number[];
            Reason?: string | string[];
            Description?: string | string[];
            Company?: number | number[];
            Name?: string | string[];
            UUID?: string | string[];
            Reference?: string | string[];
            PaymentMethod?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Customer?: number | number[];
            Date?: Date | Date[];
            Valor?: Date | Date[];
            CompanyIBAN?: string | string[];
            CounterpartyIBAN?: string | string[];
            CounterpartyName?: string | string[];
            Amount?: number | number[];
            Currency?: number | number[];
            Reason?: string | string[];
            Description?: string | string[];
            Company?: number | number[];
            Name?: string | string[];
            UUID?: string | string[];
            Reference?: string | string[];
            PaymentMethod?: number | number[];
        };
        contains?: {
            Id?: number;
            Customer?: number;
            Date?: Date;
            Valor?: Date;
            CompanyIBAN?: string;
            CounterpartyIBAN?: string;
            CounterpartyName?: string;
            Amount?: number;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
            PaymentMethod?: number;
        };
        greaterThan?: {
            Id?: number;
            Customer?: number;
            Date?: Date;
            Valor?: Date;
            CompanyIBAN?: string;
            CounterpartyIBAN?: string;
            CounterpartyName?: string;
            Amount?: number;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
            PaymentMethod?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Customer?: number;
            Date?: Date;
            Valor?: Date;
            CompanyIBAN?: string;
            CounterpartyIBAN?: string;
            CounterpartyName?: string;
            Amount?: number;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
            PaymentMethod?: number;
        };
        lessThan?: {
            Id?: number;
            Customer?: number;
            Date?: Date;
            Valor?: Date;
            CompanyIBAN?: string;
            CounterpartyIBAN?: string;
            CounterpartyName?: string;
            Amount?: number;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
            PaymentMethod?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Customer?: number;
            Date?: Date;
            Valor?: Date;
            CompanyIBAN?: string;
            CounterpartyIBAN?: string;
            CounterpartyName?: string;
            Amount?: number;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
            PaymentMethod?: number;
        };
    },
    $select?: (keyof CustomerPaymentEntity)[],
    $sort?: string | (keyof CustomerPaymentEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
    $language?: string
}

export interface CustomerPaymentEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<CustomerPaymentEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export interface CustomerPaymentUpdateEntityEvent extends CustomerPaymentEntityEvent {
    readonly previousEntity: CustomerPaymentEntity;
}

export class CustomerPaymentRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_CUSTOMERPAYMENT",
        properties: [
            {
                name: "Id",
                column: "CUSTOMERPAYMENT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Customer",
                column: "CUSTOMERPAYMENT_CUSTOMER",
                type: "INTEGER",
            },
            {
                name: "Date",
                column: "CUSTOMERPAYMENT_DATE",
                type: "DATE",
            },
            {
                name: "Valor",
                column: "CUSTOMERPAYMENT_VALOR",
                type: "DATE",
            },
            {
                name: "CompanyIBAN",
                column: "CUSTOMERPAYMENT_COMPANYIBAN",
                type: "VARCHAR",
            },
            {
                name: "CounterpartyIBAN",
                column: "CUSTOMERPAYMENT_COUNTERPARTYIBAN",
                type: "VARCHAR",
            },
            {
                name: "CounterpartyName",
                column: "CUSTOMERPAYMENT_COUNTERPARTYNAME",
                type: "VARCHAR",
            },
            {
                name: "Amount",
                column: "CUSTOMERPAYMENT_AMOUNT",
                type: "DECIMAL",
            },
            {
                name: "Currency",
                column: "CUSTOMERPAYMENT_CURRENCY",
                type: "INTEGER",
            },
            {
                name: "Reason",
                column: "CUSTOMERPAYMENT_REASON",
                type: "VARCHAR",
            },
            {
                name: "Description",
                column: "CUSTOMERPAYMENT_DESCRIPTION",
                type: "VARCHAR",
            },
            {
                name: "Company",
                column: "CUSTOMERPAYMENT_COMPANY",
                type: "INTEGER",
            },
            {
                name: "Name",
                column: "CUSTOMERPAYMENT_NAME",
                type: "VARCHAR",
            },
            {
                name: "UUID",
                column: "CUSTOMERPAYMENT_UUID",
                type: "VARCHAR",
            },
            {
                name: "Reference",
                column: "CUSTOMERPAYMENT_REFERENCE",
                type: "VARCHAR",
            },
            {
                name: "PaymentMethod",
                column: "CUSTOMERPAYMENT_PAYMENTMETHOD",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(CustomerPaymentRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: CustomerPaymentEntityOptions = {}): CustomerPaymentEntity[] {
        if (options.$sort === undefined && options.$order === undefined) {
            options.$sort = "Date";
            options.$order = "DESC";
        }
        let list = this.dao.list(options).map((e: CustomerPaymentEntity) => {
            EntityUtils.setDate(e, "Date");
            EntityUtils.setDate(e, "Valor");
            return e;
        });
        return list;
    }

    public findById(id: number, options: CustomerPaymentEntityOptions = {}): CustomerPaymentEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        EntityUtils.setDate(entity, "Valor");
        return entity ?? undefined;
    }

    public create(entity: CustomerPaymentCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        EntityUtils.setLocalDate(entity, "Valor");
        // @ts-ignore
        (entity as CustomerPaymentEntity).Name = new NumberGeneratorService().generate(20);
        // @ts-ignore
        (entity as CustomerPaymentEntity).UUID = require("sdk/utils/uuid").random();
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_CUSTOMERPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "CUSTOMERPAYMENT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: CustomerPaymentUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // EntityUtils.setLocalDate(entity, "Valor");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_CUSTOMERPAYMENT",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "CUSTOMERPAYMENT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: CustomerPaymentCreateEntity | CustomerPaymentUpdateEntity): number {
        const id = (entity as CustomerPaymentUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as CustomerPaymentUpdateEntity);
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
            table: "CODBEX_CUSTOMERPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "CUSTOMERPAYMENT_ID",
                value: id
            }
        });
    }

    public count(options?: CustomerPaymentEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_CUSTOMERPAYMENT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: CustomerPaymentEntityEvent | CustomerPaymentUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-invoices-CustomerPayment-CustomerPayment", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-invoices-CustomerPayment-CustomerPayment").send(JSON.stringify(data));
    }
}
