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
    header.Net = Math.round(net * 100) / 100;
    header.VAT = Math.round(vat * 100) / 100;
    header.Gross = Math.round(gross * 100) / 100;

    total = header.Gross - (header.Gross * header.Discount / 100) + (header.Gross * header.Taxes / 100) + header.VAT;
    header.Total = total.toFixed(2);

    header.Name = header.Name.substring(0, header.Name.lastIndexOf("/") + 1) + header.Total;

    SalesInvoiceDao.update(header);
}