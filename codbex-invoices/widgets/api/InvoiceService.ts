import { SalesInvoiceRepository as SalesInvoiceDao } from "../../../codbex-invoices/gen/codbex-invoices/data/SalesInvoice/SalesInvoiceRepository";
import { PurchaseInvoiceRepository as PurchaseInvoiceDao } from "../../../codbex-invoices/gen/codbex-invoices/data/PurchaseInvoice/PurchaseInvoiceRepository";


import { Controller, Get, Documentation } from "@aerokit/sdk/http";
import { Operator } from "@aerokit/sdk/db";

@Controller
@Documentation("codbex-invoices - Widgets API")
class InvoiceService {

    private readonly salesInvoiceDao;
    private readonly purchaseInvoiceDao;

    constructor() {
        this.salesInvoiceDao = new SalesInvoiceDao();
        this.purchaseInvoiceDao = new PurchaseInvoiceDao();
    }

    @Get("/invoiceData")
    @Documentation("Invoice data for widgets")
    public invoiceData() {

        let salesInvoiceTotal = 0;
        let purchaseInvoiceTotal = 0;
        let unpaidSalesInvoicesTotal = 0;
        let unpaidPurchaseInvoiceTotal = 0;
        let receivableTotalNotDue = 0;
        let receivableTotalDue = 0;
        let payableTotalNotDue = 0;
        let payableTotalDue = 0;
        const currentDate = new Date();

        const allSalesInvoices = this.salesInvoiceDao.findAll({});
        allSalesInvoices.forEach(salesInvoice => {
            salesInvoiceTotal += salesInvoice.Total ?? 0;
        });

        const allPurchaseInvoices = this.purchaseInvoiceDao.findAll({});
        allPurchaseInvoices.forEach(purchaseInvoice => {
            purchaseInvoiceTotal += purchaseInvoice.Total ?? 0;
        });

        const unpaidSalesInvoicesCount = this.salesInvoiceDao.count({
            conditions: [
                {
                    propertyName: "SalesInvoiceStatus",
                    operator: Operator.NE,
                    value: 6
                }
            ]
        });

        const salesInvoicesNotDue = this.salesInvoiceDao.findAll({
            conditions: [
                {
                    propertyName: "Due",
                    operator: Operator.GE,
                    value: currentDate
                },
                {
                    propertyName: "SalesInvoiceStatus",
                    operator: Operator.NE,
                    value: 6
                }
            ]
        });

        salesInvoicesNotDue.forEach(salesInvoice => {
            receivableTotalNotDue += salesInvoice.Total ?? 0;
            unpaidSalesInvoicesTotal += salesInvoice.Total ?? 0;
        });

        const salesInvoicesDue = this.salesInvoiceDao.findAll({
            conditions: [
                {
                    propertyName: "Due",
                    operator: Operator.LT,
                    value: currentDate
                },
                {
                    propertyName: "SalesInvoiceStatus",
                    operator: Operator.NE,
                    value: 6
                }
            ]
        });

        salesInvoicesDue.forEach(salesInvoice => {
            receivableTotalDue += salesInvoice.Total ?? 0;
            unpaidSalesInvoicesTotal += salesInvoice.Total ?? 0;
        });

        const purchaseInvoicesNotDue = this.purchaseInvoiceDao.findAll({
            conditions: [
                {
                    propertyName: "Due",
                    operator: Operator.GE,
                    value: currentDate
                },
                {
                    propertyName: "PurchaseInvoiceStatus",
                    operator: Operator.NE,
                    value: 6
                }
            ]
        });

        const unpaidPurchaseInvoicesCount = this.purchaseInvoiceDao.count({
            conditions: [
                {
                    propertyName: "PurchaseInvoiceStatus",
                    operator: Operator.NE,
                    value: 6
                }
            ]
        });

        purchaseInvoicesNotDue.forEach(purchaseInvoice => {
            payableTotalNotDue += purchaseInvoice.Total ?? 0;
            unpaidPurchaseInvoiceTotal += purchaseInvoice.Total ?? 0;
        });

        const purchaseInvoicesDue = this.purchaseInvoiceDao.findAll({
            conditions: [
                {
                    propertyName: "Due",
                    operator: Operator.LT,
                    value: currentDate
                },
                {
                    propertyName: "PurchaseInvoiceStatus",
                    operator: Operator.NE,
                    value: 6
                }
            ]
        });

        purchaseInvoicesDue.forEach(purchaseInvoice => {
            payableTotalDue += purchaseInvoice.Total ?? 0;
            unpaidPurchaseInvoiceTotal += purchaseInvoice.Total ?? 0;
        });

        return {
            SalesInvoiceTotal: salesInvoiceTotal,
            PurchaseInvoiceTotal: purchaseInvoiceTotal,
            UnpaidSalesInvoicesCount: unpaidSalesInvoicesCount,
            UnpaidPurchaseInvoicesCount: unpaidPurchaseInvoicesCount,
            UnpaidSalesInvoiceTotal: unpaidSalesInvoicesTotal,
            UnpaidPurchaseInvoiceTotal: unpaidPurchaseInvoiceTotal,
            ReceivableCurrent: receivableTotalNotDue,
            ReceivableOverdue: receivableTotalDue,
            PayablesCurrent: payableTotalNotDue,
            PayablesOverdue: payableTotalDue
        };
    }
}
