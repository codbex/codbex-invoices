import { Query, NamedQueryParameter } from "@aerokit/sdk/db";

export interface CASHFLOW {
    readonly 'Net Cashflow': number;
    readonly 'Date': Date;
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
            SELECT
              SUM(t.TRANSACTION_AMOUNT) AS "Net Cashflow",
              DATE_TRUNC('day', t.TRANSACTION_DATE) AS "Date"
            FROM (
              SELECT
                SALESINVOICE_DATE AS TRANSACTION_DATE,
                SALESINVOICE_NET  AS TRANSACTION_AMOUNT
              FROM CODBEX_SALESINVOICE
            
              UNION ALL
            
              SELECT
                PURCHASEINVOICE_DATE AS TRANSACTION_DATE,
                -PURCHASEINVOICE_NET AS TRANSACTION_AMOUNT
              FROM CODBEX_PURCHASEINVOICE
            ) t
            GROUP BY DATE_TRUNC('day', t.TRANSACTION_DATE)
            ORDER BY "Date" DESC
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: CASHFLOWFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT
                  SUM(t.TRANSACTION_AMOUNT) AS "Net Cashflow",
                  DATE_TRUNC('day', t.TRANSACTION_DATE) AS "Date"
                FROM (
                  SELECT
                    SALESINVOICE_DATE AS TRANSACTION_DATE,
                    SALESINVOICE_NET  AS TRANSACTION_AMOUNT
                  FROM CODBEX_SALESINVOICE
                
                  UNION ALL
                
                  SELECT
                    PURCHASEINVOICE_DATE AS TRANSACTION_DATE,
                    -PURCHASEINVOICE_NET AS TRANSACTION_AMOUNT
                  FROM CODBEX_PURCHASEINVOICE
                ) t
                GROUP BY DATE_TRUNC('day', t.TRANSACTION_DATE)
                ORDER BY "Date" DESC
            )
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}
