import { Query, NamedQueryParameter } from "@aerokit/sdk/db";

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
            SELECT
              CAST(PARSEDATETIME(FORMATDATETIME(t.invoice_date, 'yyyy-MM-01'), 'yyyy-MM-dd') AS DATE) AS "DATE",
              SUM(t.sales_vat) AS "SALES_VAT",
              SUM(t.purchase_vat) AS "PURCHASE_VAT",
              SUM(t.sales_vat) - SUM(t.purchase_vat) AS "PAYABLE_VAT"
            FROM (
              SELECT
                SALESINVOICE_DATE AS invoice_date,
                COALESCE(SALESINVOICE_VAT, 0) AS sales_vat,
                CAST(0 AS DECIMAL(18,2)) AS purchase_vat
              FROM CODBEX_SALESINVOICE
            
              UNION ALL
            
              SELECT
                PURCHASEINVOICE_DATE AS invoice_date,
                CAST(0 AS DECIMAL(18,2)) AS sales_vat,
                COALESCE(PURCHASEINVOICE_VAT, 0) AS purchase_vat
              FROM CODBEX_PURCHASEINVOICE
            ) t
            GROUP BY CAST(PARSEDATETIME(FORMATDATETIME(t.invoice_date, 'yyyy-MM-01'), 'yyyy-MM-dd') AS DATE)
            ORDER BY "DATE" DESC
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: MonthlyVATFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT
                  CAST(PARSEDATETIME(FORMATDATETIME(t.invoice_date, 'yyyy-MM-01'), 'yyyy-MM-dd') AS DATE) AS "DATE",
                  SUM(t.sales_vat) AS "SALES_VAT",
                  SUM(t.purchase_vat) AS "PURCHASE_VAT",
                  SUM(t.sales_vat) - SUM(t.purchase_vat) AS "PAYABLE_VAT"
                FROM (
                  SELECT
                    SALESINVOICE_DATE AS invoice_date,
                    COALESCE(SALESINVOICE_VAT, 0) AS sales_vat,
                    CAST(0 AS DECIMAL(18,2)) AS purchase_vat
                  FROM CODBEX_SALESINVOICE
                
                  UNION ALL
                
                  SELECT
                    PURCHASEINVOICE_DATE AS invoice_date,
                    CAST(0 AS DECIMAL(18,2)) AS sales_vat,
                    COALESCE(PURCHASEINVOICE_VAT, 0) AS purchase_vat
                  FROM CODBEX_PURCHASEINVOICE
                ) t
                GROUP BY CAST(PARSEDATETIME(FORMATDATETIME(t.invoice_date, 'yyyy-MM-01'), 'yyyy-MM-dd') AS DATE)
                ORDER BY "DATE" DESC
            )
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}
