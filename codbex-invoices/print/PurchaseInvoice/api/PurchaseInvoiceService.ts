import { PurchaseInvoiceRepository as PurchaseInvoiceDao } from "../../../../codbex-invoices/gen/codbex-invoices/data/PurchaseInvoice/PurchaseInvoiceRepository";
import { PurchaseInvoiceItemRepository as PurchaseInvoiceItemDao } from "../../../../codbex-invoices/gen/codbex-invoices/data/PurchaseInvoice/PurchaseInvoiceItemRepository";
import { SupplierRepository as SupplierDao } from "../../../../codbex-partners/gen/codbex-partners/data/Suppliers/SupplierRepository";
import { CompanyRepository as CompanyDao } from "../../../../codbex-companies/gen/codbex-companies/data/Companies/CompanyRepository";
import { CityRepository as CityDao } from "../../../../codbex-cities/gen/codbex-cities/data/Settings/CityRepository";
import { CountryRepository as CountryDao } from "../../../../codbex-countries/gen/codbex-countries/data/Settings/CountryRepository";
import { PaymentMethodRepository as PaymentMethodDao } from "../../../../codbex-methods/gen/codbex-methods/data/Settings/PaymentMethodRepository";
import { SentMethodRepository as SentMethodDao } from "../../../../codbex-methods/gen/codbex-methods/data/Settings/SentMethodRepository";

import { Controller, Get, Documentation } from "@aerokit/sdk/http";
import { Operator } from "@aerokit/sdk/db";

@Controller
@Documentation("codbex-invoices - Print Purchase Invoice")
class PurchaseInvoiceService {

    private readonly purchaseInvoiceDao;
    private readonly purchaseInvoiceItemDao;
    private readonly supplierDao;
    private readonly companyDao;
    private readonly cityDao;
    private readonly countryDao;
    private readonly paymentMethodDao;
    private readonly sentMethodDao;

    constructor() {
        this.purchaseInvoiceDao = new PurchaseInvoiceDao();
        this.purchaseInvoiceItemDao = new PurchaseInvoiceItemDao();
        this.supplierDao = new SupplierDao();
        this.companyDao = new CompanyDao();
        this.cityDao = new CityDao();
        this.countryDao = new CountryDao();
        this.paymentMethodDao = new PaymentMethodDao();
        this.sentMethodDao = new SentMethodDao();
    }

    @Get("/:purchaseInvoiceId")
    @Documentation("Get purchase invoice data for printing")
    public purchaseInvoiceData(_: any, ctx: any) {
        const purchaseInvoiceId = ctx.pathParameters.purchaseInvoiceId;

        const purchaseInvoice = this.purchaseInvoiceDao.findById(purchaseInvoiceId);
        if (!purchaseInvoice) {
            return {};
        }

        const paymentMethod = purchaseInvoice.PaymentMethod
            ? this.paymentMethodDao.findById(purchaseInvoice.PaymentMethod)
            : undefined;
        const sentMethod = purchaseInvoice.SentMethod
            ? this.sentMethodDao.findById(purchaseInvoice.SentMethod)
            : undefined;

        if (paymentMethod) {
            purchaseInvoice.PaymentMethod = paymentMethod.Name;
        }

        if (sentMethod) {
            purchaseInvoice.SentMethod = sentMethod.Name;
        }

        const purchaseInvoiceItems = this.purchaseInvoiceItemDao.findAll({
            conditions: [
                {
                    propertyName: "PurchaseInvoice",
                    operator: Operator.EQ,
                    value: purchaseInvoice.Id
                }
            ]
        });

        let company;

        if (purchaseInvoice.Company) {
            company = this.companyDao.findById(purchaseInvoice.Company);

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

        const supplier = this.supplierDao.findById(purchaseInvoice.Supplier);

        return {
            purchaseInvoice: purchaseInvoice,
            purchaseInvoiceItems: purchaseInvoiceItems,
            supplier: supplier,
            company: company
        }
    }
}