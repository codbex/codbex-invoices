import { PurchaseInvoiceRepository } from "../../gen/codbex-invoices/dao/PurchaseInvoice/PurchaseInvoiceRepository";
import { PurchaseInvoicePaymentRepository } from "../../gen/codbex-invoices/dao/PurchaseInvoice/PurchaseInvoicePaymentRepository";
import { SupplierPaymentRepository } from "codbex-payments/gen/codbex-payments/dao/SupplierPayment/SupplierPaymentRepository";

export const trigger = (event) => {

    const PurchaseInvoiceDao = new PurchaseInvoiceRepository();
    const PurchaseInvoicePaymentDao = new PurchaseInvoicePaymentRepository();
    const SupplierPaymentDao = new SupplierPaymentRepository();

    let item = event.entity;
    const operation = event.operation;

    if (operation == "create") {

        const supplierPayment = SupplierPaymentDao.findById(item.SupplierPayment);

        item.Amount = Math.min(supplierPayment.Amount, item.Amount);

        PurchaseInvoicePaymentDao.update(item);
    }

    const items = PurchaseInvoicePaymentDao.findAll({
        $filter: {
            equals: {
                PurchaseInvoice: item.PurchaseInvoice
            }
        }
    });

    let amount = 0;
    items.forEach(item => amount += item.Amount);

    const purchaseInvoice = PurchaseInvoiceDao.findById(item.PurchaseInvoice);
    purchaseInvoice.Paid = amount;
    purchaseInvoice.Status = purchaseInvoice.Paid >= purchaseInvoice.Total ? 6 : 5;


    PurchaseInvoiceDao.update(purchaseInvoice);
}
