import { PurchaseInvoiceRepository } from "../../gen/dao/purchaseinvoice/PurchaseInvoiceRepository";
import { PurchaseInvoiceItemRepository } from "../../gen/dao/purchaseinvoice/PurchaseInvoiceItemRepository";

export const trigger = (event) => {
    const PurchaseInvoiceDao = new PurchaseInvoiceRepository();
    const PurchaseInvoiceItemDao = new PurchaseInvoiceItemRepository();
    const item = event.entity;

    const items = PurchaseInvoiceItemDao.findAll({
        $filter: {
            equals: {
                PurchaseInvoice: item.PurchaseInvoice
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

    const header = PurchaseInvoiceDao.findById(item.PurchaseInvoice);

    header.Total ??= 0;
    header.Net = Math.round(net * 100) / 100;
    header.VAT = Math.round(vat * 100) / 100;
    header.Gross = Math.round(gross * 100) / 100;

    total = header.Gross - (header.Gross * header.Discount / 100) + (header.Gross * header.Taxes / 100) + header.VAT;
    header.Total = total.toFixed(2);

    header.Name = header.Name.substring(0, header.Name.lastIndexOf("/") + 1) + header.Total;

    PurchaseInvoiceDao.update(header);
}