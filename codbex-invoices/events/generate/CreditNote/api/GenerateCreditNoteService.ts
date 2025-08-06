import { SalesInvoiceRepository as SalesInvoiceDao } from "../../../../gen/codbex-invoices/dao/SalesInvoice/SalesInvoiceRepository";
import { Controller, Get } from "sdk/http";

@Controller
class GenerateCreditNoteService {

    private readonly salesInvoiceDao;

    constructor() {
        this.salesInvoiceDao = new SalesInvoiceDao();
    }

    @Get("/salesInvoiceData/:salesInvoiceId")
    public salesInvoiceData(_: any, ctx: any) {
        const salesInvoiceId = ctx.pathParameters.salesInvoiceId;
        const salesInvoice = this.salesInvoiceDao.findById(salesInvoiceId);

        return {
            "SalesInvoice": salesInvoice
        }
    }
}