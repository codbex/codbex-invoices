import { SalesInvoiceRepository } from "../../gen/dao/salesinvoice/SalesInvoiceRepository";
import { SalesInvoiceItemRepository } from "../../gen/dao/salesinvoice/SalesInvoiceItemRepository";

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
    for (let i = 0; i < items.length; i++) {
        if (items[i].Net) {
            net += items[i].Net;
            vat += items[i].VAT;
            gross += items[i].Gross;
        }
    }

    const header = SalesInvoiceDao.findById(item.SalesInvoice);

    // header.Discount ??= 0;
    // header.Taxes ??= 0;
    header.Net = net;
    header.VAT = vat;
    header.Gross = gross;
    header.Total = header.Gross - (header.Gross * header.Discount / 100) + (header.Gross * header.Taxes / 100) + header.VAT;
    header.Name = header.Name.substring(0, header.Name.lastIndexOf("/") + 1) + header.Total;
    SalesInvoiceDao.update(header);
}