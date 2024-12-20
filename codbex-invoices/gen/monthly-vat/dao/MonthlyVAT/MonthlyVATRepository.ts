import { Query, NamedQueryParameter } from "sdk/db";

export interface MonthlyVAT {
    readonly 'PayableVAT': number;
    readonly 'DueDate': Date;
}

export interface MonthlyVATFilter {
}

export interface MonthlyVATPaginatedFilter extends MonthlyVATFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class MonthlyVATRepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: MonthlyVATPaginatedFilter): MonthlyVAT[] {
        const sql = `
            SELECT MonthlyVAT.PAYABLE_VAT as "PayableVAT", MonthlyVAT.DUE_DATE as "DueDate"
            FROM MONTHLY_VAT as MonthlyVAT
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: MonthlyVATFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT MonthlyVAT.PAYABLE_VAT as "PayableVAT", MonthlyVAT.DUE_DATE as "DueDate"
                FROM MONTHLY_VAT as MonthlyVAT
            )
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}