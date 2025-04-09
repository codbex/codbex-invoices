import { Query, NamedQueryParameter } from "sdk/db";

export interface UNPAID_PURCHASEINVOICE {
    readonly 'Number': string;
    readonly 'Original Number': string;
    readonly 'Type': number;
    readonly 'Date': Date;
    readonly 'Due': Date;
    readonly 'Total': number;
    readonly 'Paid': number;
    readonly 'Status': number;
    readonly 'Name': string;
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
            SELECT PurchaseInvoice.PURCHASEINVOICE_NUMBER as "Number", PurchaseInvoice.PURCHASEINVOICE_ORIGINALNUMBER as "Original Number", PurchaseInvoice.PURCHASEINVOICE_PURCHASEINVOICETYPE as "Type", PurchaseInvoice.PURCHASEINVOICE_DATE as "Date", PurchaseInvoice.PURCHASEINVOICE_DUE as "Due", PurchaseInvoice.PURCHASEINVOICE_TOTAL as "Total", PurchaseInvoice.PURCHASEINVOICE_PAID as "Paid", PurchaseInvoice.PURCHASEINVOICE_STATUS as "Status", PurchaseInvoice.PURCHASEINVOICE_NAME as "Name"
            FROM CODBEX_PURCHASEINVOICE as PurchaseInvoice
            WHERE PurchaseInvoice.PURCHASEINVOICE_TOTAL > PurchaseInvoice.PURCHASEINVOICE_PAID
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: UNPAID_PURCHASEINVOICEFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT PurchaseInvoice.PURCHASEINVOICE_NUMBER as "Number", PurchaseInvoice.PURCHASEINVOICE_ORIGINALNUMBER as "Original Number", PurchaseInvoice.PURCHASEINVOICE_PURCHASEINVOICETYPE as "Type", PurchaseInvoice.PURCHASEINVOICE_DATE as "Date", PurchaseInvoice.PURCHASEINVOICE_DUE as "Due", PurchaseInvoice.PURCHASEINVOICE_TOTAL as "Total", PurchaseInvoice.PURCHASEINVOICE_PAID as "Paid", PurchaseInvoice.PURCHASEINVOICE_STATUS as "Status", PurchaseInvoice.PURCHASEINVOICE_NAME as "Name"
                FROM CODBEX_PURCHASEINVOICE as PurchaseInvoice
                WHERE PurchaseInvoice.PURCHASEINVOICE_TOTAL > PurchaseInvoice.PURCHASEINVOICE_PAID
            )
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}