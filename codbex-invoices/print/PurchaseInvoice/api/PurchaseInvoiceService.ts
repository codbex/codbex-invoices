import { PurchaseInvoiceRepository as PurchaseInvoiceDao } from "../../../../codbex-invoices/gen/codbex-invoices/dao/purchaseinvoice/PurchaseInvoiceRepository";
import { PurchaseInvoiceItemRepository as PurchaseInvoiceItemDao } from "../../../../codbex-invoices/gen/codbex-invoices/dao/purchaseinvoice/PurchaseInvoiceItemRepository";
import { SupplierRepository as SupplierDao } from "../../../../codbex-partners/gen/codbex-partners/dao/Suppliers/SupplierRepository";
import { CompanyRepository as CompanyDao } from "../../../../codbex-companies/gen/codbex-companies/dao/Companies/CompanyRepository";
import { CityRepository as CityDao } from "../../../../codbex-cities/gen/codbex-cities/dao/Settings/CityRepository";
import { CountryRepository as CountryDao } from "../../../../codbex-countries/gen/codbex-countries/dao/Settings/CountryRepository";
import { PaymentMethodRepository as PaymentMethodDao } from "../../../../codbex-methods/gen/codbex-methods/dao/Settings/PaymentMethodRepository";
import { SentMethodRepository as SentMethodDao } from "../../../../codbex-methods/gen/codbex-methods/dao/Settings/SentMethodRepository";

import { Controller, Get } from "sdk/http";

@Controller
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
    public purchaseInvoiceData(_: any, ctx: any) {
        const purchaseInvoiceId = ctx.pathParameters.purchaseInvoiceId;

        let purchaseInvoice = this.purchaseInvoiceDao.findById(purchaseInvoiceId);

        console.log(JSON.stringify(purchaseInvoice));

        const paymentMethod = this.paymentMethodDao.findById(purchaseInvoice.PaymentMethod);
        const sentMethod = this.sentMethodDao.findById(purchaseInvoice.SentMethod);

        purchaseInvoice.PaymentMethod = paymentMethod.Name;
        purchaseInvoice.SentMethod = sentMethod.Name;

        const purchaseInvoiceItems = this.purchaseInvoiceItemDao.findAll({
            $filter: {
                equals: {
                    PurchaseInvoice: purchaseInvoice.Id
                }
            }
        });

        let company;

        if (purchaseInvoice.Company) {
            company = this.companyDao.findById(purchaseInvoice.Company);
            const city = this.cityDao.findById(company.City);
            const country = this.countryDao.findById(company.Country);

            company.City = city.Name;
            company.Country = country.Name;
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