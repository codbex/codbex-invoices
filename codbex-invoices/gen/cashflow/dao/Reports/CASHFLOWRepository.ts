import { Query, NamedQueryParameter } from "sdk/db";

export interface CASHFLOW {
    readonly 'CashflowDate': string;
    readonly 'CashflowNet': number;
}

export interface CASHFLOWFilter {
}

export interface CASHFLOWPaginatedFilter extends CASHFLOWFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class CASHFLOWRepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: CASHFLOWPaginatedFilter): CASHFLOW[] {
        const sql = `
            SELECT Cashflow.CASHFLOW_DATE as "CashflowDate", Cashflow.CASHFLOW_NET as "CashflowNet"
            FROM CASHFLOW as Cashflow
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: CASHFLOWFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT Cashflow.CASHFLOW_DATE as "CashflowDate", Cashflow.CASHFLOW_NET as "CashflowNet"
                FROM CASHFLOW as Cashflow
            )
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}