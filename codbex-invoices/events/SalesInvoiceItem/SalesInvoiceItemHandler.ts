import { SalesInvoiceRepository } from "../../gen/codbex-invoices/dao/salesinvoice/SalesInvoiceRepository";
import { SalesInvoiceItemRepository } from "../../gen/codbex-invoices/dao/salesinvoice/SalesInvoiceItemRepository";

export const trigger = (event) => {
    const SalesInvoiceDao = new SalesInvoiceRepository();
    const SalesInvoiceItemDao = new SalesInvoiceItemRepository();
    const item = event.entity;

    const items = SalesInvoiceItemDao.findAll({
        $filter: {
            equals: {
                SalesInvoice: item.SalesInvoice
            }
        }
    });

    let net = 0;
    let vat = 0;
    let gross = 0;
    let total = 0;

    for (let i = 0; i < items.length; i++) {
        if (items[i].Net) {
            net += items[i].Net;
            vat += items[i].VAT;
            gross += items[i].Gross;
        }
    }

    const header = SalesInvoiceDao.findById(item.SalesInvoice);

    header.Total ??= 0;
    header.Net = net;
    header.VAT = vat;
    header.Gross = gross;

    total = header.Gross - (header.Gross * header.Discount / 100) + (header.Gross * header.Taxes / 100) + header.VAT;
    header.Total = total;

    header.Name = header.Name.substring(0, header.Name.lastIndexOf("/") + 1) + header.Total;

    SalesInvoiceDao.update(header);
}