import { Query, NamedQueryParameter } from "@aerokit/sdk/db";

export interface UNPAID_SALESINVOICE {
    readonly 'Number': string;
    readonly 'Type': number;
    readonly 'Date': Date;
    readonly 'Due': Date;
    readonly 'Total': number;
    readonly 'Paid': number;
    readonly 'Status': number;
    readonly 'Name': string;
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
            SELECT SalesInvoice.SALESINVOICE_NUMBER as "Number", SalesInvoice.SALESINVOICE_TYPE as "Type", SalesInvoice.SALESINVOICE_DATE as "Date", SalesInvoice.SALESINVOICE_DUE as "Due", SalesInvoice.SALESINVOICE_TOTAL as "Total", SalesInvoice.SALESINVOICE_PAID as "Paid", SalesInvoice.SALESINVOICE_STATUS as "Status", SalesInvoice.SALESINVOICE_NAME as "Name"
            FROM CODBEX_SALESINVOICE as SalesInvoice
            WHERE SalesInvoice.SALESINVOICE_TOTAL > SalesInvoice.SALESINVOICE_PAID
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: UNPAID_SALESINVOICEFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT SalesInvoice.SALESINVOICE_NUMBER as "Number", SalesInvoice.SALESINVOICE_TYPE as "Type", SalesInvoice.SALESINVOICE_DATE as "Date", SalesInvoice.SALESINVOICE_DUE as "Due", SalesInvoice.SALESINVOICE_TOTAL as "Total", SalesInvoice.SALESINVOICE_PAID as "Paid", SalesInvoice.SALESINVOICE_STATUS as "Status", SalesInvoice.SALESINVOICE_NAME as "Name"
                FROM CODBEX_SALESINVOICE as SalesInvoice
                WHERE SalesInvoice.SALESINVOICE_TOTAL > SalesInvoice.SALESINVOICE_PAID
            )
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}
