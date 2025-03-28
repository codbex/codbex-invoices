import { SalesInvoiceRepository as SalesInvoiceDao } from "codbex-invoices/gen/codbex-invoices/dao/salesinvoice/SalesInvoiceRepository";
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
        let salesInvoice = this.salesInvoiceDao.findById(salesInvoiceId);

        return {
            "Customer": salesInvoice.Customer,
            "Currency": salesInvoice.Currency,
            "Taxes": salesInvoice.Taxes,
            "PaymentMethod": salesInvoice.PaymentMethod,
            "Company": salesInvoice.Company,
            "Type": salesInvoice.Type
        };
    }

    @Get("/salesInvoiceNet/:salesInvoiceId")
    public salesInvoiceNet(_: any, ctx: any) {
        const salesInvoiceId = ctx.pathParameters.salesInvoiceId;
        let salesInvoice = this.salesInvoiceDao.findById(salesInvoiceId);

        return {
            "Net": salesInvoice.Net
        };
    }
}
