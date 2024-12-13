import { PurchaseInvoiceRepository } from "../../gen/codbex-invoices/dao/purchaseinvoice/PurchaseInvoiceRepository";
import { PurchaseInvoicePaymentRepository } from "../../gen/codbex-invoices/dao/purchaseinvoice/PurchaseInvoicePaymentRepository";

export const trigger = (event) => {
    const PurchaseInvoiceDao = new PurchaseInvoiceRepository();
    const PurchaseInvoicePaymentDao = new PurchaseInvoicePaymentRepository();
    const item = event.entity;

    const items = PurchaseInvoicePaymentDao.findAll({
        $filter: {
            equals: {
                PurchaseInvoice: item.PurchaseInvoice
            }
        }
    });

    let amount = 0;

    for (let i = 0; i < items.length; i++) {
        if (items[i].Amount) {
            amount += items[i].Amount;
        }
    }

    const header = PurchaseInvoiceDao.findById(item.PurchaseInvoice);

    header.Paid = amount;

    PurchaseInvoiceDao.update(header);
}