import { Query, NamedQueryParameter } from "sdk/db";

export interface MonthlyVAT {
    readonly 'Date': Date;
    readonly 'SalesVAT': number;
    readonly 'PurchaseVAT': number;
    readonly 'PayableVAT': number;
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
            SELECT MonthlyVAT.DATE as "Date", MonthlyVAT.SALES_VAT as "SalesVAT", MonthlyVAT.PURCHASE_VAT as "PurchaseVAT", MonthlyVAT.PAYABLE_VAT as "PayableVAT"
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
                SELECT MonthlyVAT.DATE as "Date", MonthlyVAT.SALES_VAT as "SalesVAT", MonthlyVAT.PURCHASE_VAT as "PurchaseVAT", MonthlyVAT.PAYABLE_VAT as "PayableVAT"
                FROM MONTHLY_VAT as MonthlyVAT
            )
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}