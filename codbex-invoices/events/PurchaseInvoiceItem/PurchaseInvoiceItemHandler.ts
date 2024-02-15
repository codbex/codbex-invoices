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

    const header = PurchaseInvoiceDao.findById(item.PurchaseInvoice);

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

    header.Net = net;
    header.VAT = vat;
    header.Gross = gross;
    header.Total = header.Gross - (header.Gross * header.Discount / 100) + (header.Gross * header.Taxes / 100) + header.VAT;
    PurchaseInvoiceDao.update(header);
}