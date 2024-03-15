import { SalesInvoiceRepository } from "../../gen/dao/salesinvoice/SalesInvoiceRepository";
import { SalesInvoicePaymentRepository } from "../../gen/dao/salesinvoice/SalesInvoicePaymentRepository";

export const trigger = (event) => {
    const SalesInvoiceDao = new SalesInvoiceRepository();
    const SalesInvoicePaymentDao = new SalesInvoicePaymentRepository();
    const item = event.entity;

    const items = SalesInvoicePaymentDao.findAll({
        $filter: {
            equals: {
                SalesInvoice: item.SalesInvoice
            }
        }
    });

    let amount = 0;

    for (let i = 0; i < items.length; i++) {
        if (items[i].Amount) {
            amount += items[i].Amount;
        }
    }

    const header = SalesInvoiceDao.findById(item.SalesInvoice);

    header.Paid = amount

    SalesInvoiceDao.update(header);
}