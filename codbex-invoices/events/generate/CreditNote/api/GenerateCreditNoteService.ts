import { SalesInvoiceRepository as SalesInvoiceDao } from "../../../../gen/codbex-invoices/data/SalesInvoice/SalesInvoiceRepository";

import { Controller, Get, Documentation } from "@aerokit/sdk/http";

@Controller
@Documentation("codbex-invoices - Generate Credit Note")
class GenerateCreditNoteService {
    private readonly salesInvoiceDao;

    constructor() {
        this.salesInvoiceDao = new SalesInvoiceDao();
    }

    @Get("/salesInvoiceData/:salesInvoiceId")
    @Documentation("Get Sales Invoice Data")
    public salesInvoiceData(_: any, ctx: any) {
        const salesInvoiceId = ctx.pathParameters.salesInvoiceId;
        const salesInvoice = this.salesInvoiceDao.findById(salesInvoiceId);

        return {
            "SalesInvoice": salesInvoice
        }
    }
}