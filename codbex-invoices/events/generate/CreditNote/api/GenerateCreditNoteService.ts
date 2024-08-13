import { SalesInvoiceRepository as SalesInvoiceDao } from "../../../../codbex-invoices/gen/codbex-invoices/dao/salesinvoice/SalesInvoiceRepository";
import { Controller, Get } from "sdk/http";

@Controller
class GenerateSalesInvoiceService {

    private readonly salesInvoiceDao;

    constructor() {
        this.salesInvoiceDao = new SalesInvoiceDao();
    }

    @Get("/salesInvoiceData/:salesInvoiceId")
    public salesInvoiceData(_: any, ctx: any) {
        const salesInvoiceId = ctx.pathParameters.salesInvoiceId;

        let salesInvoice = this.salesInvoiceDao.findById(salesInvoiceId);
        let date = new Date();

        return {
            "Date": date,
            "SalesInvoice": salesInvoice.Id,
            "Customer": salesInvoice.Customer,
            "Currency": salesInvoice.Currency,
            "Taxes": salesInvoice.Taxes,
            "PaymentMethod": salesInvoice.PaymentMethod,
            "Company": salesInvoice.Company
        };
    }
}
