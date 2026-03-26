import { SalesInvoiceRepository as SalesInvoiceDao } from "../../../../codbex-invoices/gen/codbex-invoices/data/SalesInvoice/SalesInvoiceRepository";
import { SalesInvoiceItemRepository as SalesInvoiceItemDao } from "../../../../codbex-invoices/gen/codbex-invoices/data/SalesInvoice/SalesInvoiceItemRepository";
import { CustomerRepository as CustomerDao } from "../../../../codbex-partners/gen/codbex-partners/data/Customers/CustomerRepository";
import { CompanyRepository as CompanyDao } from "../../../../codbex-companies/gen/codbex-companies/data/Companies/CompanyRepository";
import { CityRepository as CityDao } from "../../../../codbex-cities/gen/codbex-cities/data/Settings/CityRepository";
import { CountryRepository as CountryDao } from "../../../../codbex-countries/gen/codbex-countries/data/Settings/CountryRepository";
import { PaymentMethodRepository as PaymentMethodDao } from "../../../../codbex-methods/gen/codbex-methods/data/Settings/PaymentMethodRepository";
import { SentMethodRepository as SentMethodDao } from "../../../../codbex-methods/gen/codbex-methods/data/Settings/SentMethodRepository";

import { Controller, Get, Documentation } from "@aerokit/sdk/http";
import { Operator } from "@aerokit/sdk/db";

@Controller
@Documentation("codbex-invoices - Print Sales Invoice")
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
    @Documentation("Get sales invoice data for printing")
    public salesInvoiceData(_: any, ctx: any) {
        const salesInvoiceId = ctx.pathParameters.salesInvoiceId;

        const salesInvoice = this.salesInvoiceDao.findById(salesInvoiceId);
        if (!salesInvoice) {
            return {};
        }

        const paymentMethod = salesInvoice.PaymentMethod
            ? this.paymentMethodDao.findById(salesInvoice.PaymentMethod)
            : undefined;
        const sentMethod = salesInvoice.SentMethod
            ? this.sentMethodDao.findById(salesInvoice.SentMethod)
            : undefined;

        if (paymentMethod) {
            salesInvoice.PaymentMethod = paymentMethod.Name;
        }

        if (sentMethod) {
            salesInvoice.SentMethod = sentMethod.Name;
        }

        const salesInvoiceItems = this.salesInvoiceItemDao.findAll({
            conditions: [
                {
                    propertyName: "SalesInvoice",
                    operator: Operator.EQ,
                    value: salesInvoice.Id
                }
            ]
        });

        let company;

        if (salesInvoice.Company) {
            company = this.companyDao.findById(salesInvoice.Company);

            if (company) {
                const city = company.City ? this.cityDao.findById(company.City) : undefined;
                const country = company.Country ? this.countryDao.findById(company.Country) : undefined;

                if (city) {
                    company.City = city.Name;
                }

                if (country) {
                    company.Country = country.Name;
                }
            }
        }

        const customer = salesInvoice.Customer
            ? this.customerDao.findById(salesInvoice.Customer)
            : undefined;

        return {
            salesInvoice,
            salesInvoiceItems,
            customer,
            company
        };
    }
}
