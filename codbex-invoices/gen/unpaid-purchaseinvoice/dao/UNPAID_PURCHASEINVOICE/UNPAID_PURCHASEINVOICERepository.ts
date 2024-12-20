import { Query, NamedQueryParameter } from "sdk/db";

export interface UNPAID_PURCHASEINVOICE {
    readonly 'purchaseinvoiceNumber': string;
    readonly 'purchaseinvoiceOriginalnumber': string;
    readonly 'purchaseinvoicePurchaseinvoicetype': number;
    readonly 'purchaseinvoiceDate': Date;
    readonly 'purchaseinvoiceDue': Date;
    readonly 'purchaseinvoiceTotal': number;
    readonly 'purchaseinvoicePaid': number;
    readonly 'purchaseinvoiceStatus': number;
    readonly 'purchaseinvoiceName': string;
}

export interface UNPAID_PURCHASEINVOICEFilter {
}

export interface UNPAID_PURCHASEINVOICEPaginatedFilter extends UNPAID_PURCHASEINVOICEFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class UNPAID_PURCHASEINVOICERepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: UNPAID_PURCHASEINVOICEPaginatedFilter): UNPAID_PURCHASEINVOICE[] {
        const sql = `
            SELECT codbexPurchaseinvoice.PURCHASEINVOICE_NUMBER as "purchaseinvoiceNumber", codbexPurchaseinvoice.PURCHASEINVOICE_ORIGINALNUMBER as "purchaseinvoiceOriginalnumber", codbexPurchaseinvoice.PURCHASEINVOICE_PURCHASEINVOICETYPE as "purchaseinvoicePurchaseinvoicetype", codbexPurchaseinvoice.PURCHASEINVOICE_DATE as "purchaseinvoiceDate", codbexPurchaseinvoice.PURCHASEINVOICE_DUE as "purchaseinvoiceDue", codbexPurchaseinvoice.PURCHASEINVOICE_TOTAL as "purchaseinvoiceTotal", codbexPurchaseinvoice.PURCHASEINVOICE_PAID as "purchaseinvoicePaid", codbexPurchaseinvoice.PURCHASEINVOICE_STATUS as "purchaseinvoiceStatus", codbexPurchaseinvoice.PURCHASEINVOICE_NAME as "purchaseinvoiceName"
            FROM CODBEX_PURCHASEINVOICE as codbexPurchaseinvoice
            WHERE codbexPurchaseinvoice.PURCHASEINVOICE_TOTAL > codbexPurchaseinvoice.PURCHASEINVOICE_PAID
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: UNPAID_PURCHASEINVOICEFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT codbexPurchaseinvoice.PURCHASEINVOICE_NUMBER as "purchaseinvoiceNumber", codbexPurchaseinvoice.PURCHASEINVOICE_ORIGINALNUMBER as "purchaseinvoiceOriginalnumber", codbexPurchaseinvoice.PURCHASEINVOICE_PURCHASEINVOICETYPE as "purchaseinvoicePurchaseinvoicetype", codbexPurchaseinvoice.PURCHASEINVOICE_DATE as "purchaseinvoiceDate", codbexPurchaseinvoice.PURCHASEINVOICE_DUE as "purchaseinvoiceDue", codbexPurchaseinvoice.PURCHASEINVOICE_TOTAL as "purchaseinvoiceTotal", codbexPurchaseinvoice.PURCHASEINVOICE_PAID as "purchaseinvoicePaid", codbexPurchaseinvoice.PURCHASEINVOICE_STATUS as "purchaseinvoiceStatus", codbexPurchaseinvoice.PURCHASEINVOICE_NAME as "purchaseinvoiceName"
                FROM CODBEX_PURCHASEINVOICE as codbexPurchaseinvoice
                WHERE codbexPurchaseinvoice.PURCHASEINVOICE_TOTAL > codbexPurchaseinvoice.PURCHASEINVOICE_PAID
            )
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}