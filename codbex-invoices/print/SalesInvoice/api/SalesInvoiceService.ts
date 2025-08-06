import { SalesInvoiceRepository as SalesInvoiceDao } from "../../../../codbex-invoices/gen/codbex-invoices/dao/SalesInvoice/SalesInvoiceRepository";
import { SalesInvoiceItemRepository as SalesInvoiceItemDao } from "../../../../codbex-invoices/gen/codbex-invoices/dao/SalesInvoice/SalesInvoiceItemRepository";
import { CustomerRepository as CustomerDao } from "../../../../codbex-partners/gen/codbex-partners/dao/Customers/CustomerRepository";
import { CompanyRepository as CompanyDao } from "../../../../codbex-companies/gen/codbex-companies/dao/Companies/CompanyRepository";
import { CityRepository as CityDao } from "../../../../codbex-cities/gen/codbex-cities/dao/Settings/CityRepository";
import { CountryRepository as CountryDao } from "../../../../codbex-countries/gen/codbex-countries/dao/Settings/CountryRepository";
import { PaymentMethodRepository as PaymentMethodDao } from "../../../../codbex-methods/gen/codbex-methods/dao/Settings/PaymentMethodRepository";
import { SentMethodRepository as SentMethodDao } from "../../../../codbex-methods/gen/codbex-methods/dao/Settings/SentMethodRepository";

import { Controller, Get } from "sdk/http";

@Controller
class SalesInvoiceService {

    private readonly salesInvoiceDao;
    private readonly salesInvoiceItemDao;
    private readonly customerDao;
    private readonly companyDao;
    private readonly cityDao;
    private readonly countryDao;
    private readonly paymentMethodDao;
    private readonly sentMethodDao;

    constructor() {
        this.salesInvoiceDao = new SalesInvoiceDao();
        this.salesInvoiceItemDao = new SalesInvoiceItemDao();
        this.customerDao = new CustomerDao();
        this.companyDao = new CompanyDao();
        this.cityDao = new CityDao();
        this.countryDao = new CountryDao();
        this.paymentMethodDao = new PaymentMethodDao();
        this.sentMethodDao = new SentMethodDao();
    }

    @Get("/:salesInvoiceId")
    public salesInvoiceData(_: any, ctx: any) {
        const salesInvoiceId = ctx.pathParameters.salesInvoiceId;

        let salesInvoice = this.salesInvoiceDao.findById(salesInvoiceId);

        const paymentMethod = this.paymentMethodDao.findById(salesInvoice.PaymentMethod);
        const sentMethod = this.sentMethodDao.findById(salesInvoice.SentMethod);

        salesInvoice.PaymentMethod = paymentMethod.Name;
        salesInvoice.SentMethod = sentMethod.Name;

        const salesInvoiceItems = this.salesInvoiceItemDao.findAll({
            $filter: {
                equals: {
                    SalesInvoice: salesInvoice.Id
                }
            }
        });

        let company;

        if (salesInvoice.Company) {
            company = this.companyDao.findById(salesInvoice.Company);
            const city = this.cityDao.findById(company.City);
            const country = this.countryDao.findById(company.Country);

            company.City = city.Name;
            company.Country = country.Name;
        }

        const customer = this.customerDao.findById(salesInvoice.Customer);

        return {
            salesInvoice: salesInvoice,
            salesInvoiceItems: salesInvoiceItems,
            customer: customer,
            company: company
        }
    }
}