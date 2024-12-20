import { Query, NamedQueryParameter } from "sdk/db";

export interface UNPAID_SALESINVOICE {
    readonly 'salesinvoiceNumber': string;
    readonly 'salesinvoiceType': number;
    readonly 'salesinvoiceDate': Date;
    readonly 'salesinvoiceDue': Date;
    readonly 'salesinvoiceTotal': number;
    readonly 'salesinvoicePaid': number;
    readonly 'salesinvoiceStatus': number;
    readonly 'salesinvoiceName': string;
}

export interface UNPAID_SALESINVOICEFilter {
}

export interface UNPAID_SALESINVOICEPaginatedFilter extends UNPAID_SALESINVOICEFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class UNPAID_SALESINVOICERepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: UNPAID_SALESINVOICEPaginatedFilter): UNPAID_SALESINVOICE[] {
        const sql = `
            SELECT codbexSalesinvoice.SALESINVOICE_NUMBER as "salesinvoiceNumber", codbexSalesinvoice.SALESINVOICE_TYPE as "salesinvoiceType", codbexSalesinvoice.SALESINVOICE_DATE as "salesinvoiceDate", codbexSalesinvoice.SALESINVOICE_DUE as "salesinvoiceDue", codbexSalesinvoice.SALESINVOICE_TOTAL as "salesinvoiceTotal", codbexSalesinvoice.SALESINVOICE_PAID as "salesinvoicePaid", codbexSalesinvoice.SALESINVOICE_STATUS as "salesinvoiceStatus", codbexSalesinvoice.SALESINVOICE_NAME as "salesinvoiceName"
            FROM CODBEX_SALESINVOICE as codbexSalesinvoice
            WHERE codbexSalesinvoice.SALESINVOICE_TOTAL > codbexSalesinvoice.SALESINVOICE_PAID
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: UNPAID_SALESINVOICEFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT codbexSalesinvoice.SALESINVOICE_NUMBER as "salesinvoiceNumber", codbexSalesinvoice.SALESINVOICE_TYPE as "salesinvoiceType", codbexSalesinvoice.SALESINVOICE_DATE as "salesinvoiceDate", codbexSalesinvoice.SALESINVOICE_DUE as "salesinvoiceDue", codbexSalesinvoice.SALESINVOICE_TOTAL as "salesinvoiceTotal", codbexSalesinvoice.SALESINVOICE_PAID as "salesinvoicePaid", codbexSalesinvoice.SALESINVOICE_STATUS as "salesinvoiceStatus", codbexSalesinvoice.SALESINVOICE_NAME as "salesinvoiceName"
                FROM CODBEX_SALESINVOICE as codbexSalesinvoice
                WHERE codbexSalesinvoice.SALESINVOICE_TOTAL > codbexSalesinvoice.SALESINVOICE_PAID
            )
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}