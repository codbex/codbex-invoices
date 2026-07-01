import { PurchaseInvoiceRepository } from "../../gen/codbex-invoices/data/PurchaseInvoice/PurchaseInvoiceRepository";
import { PurchaseInvoiceItemRepository } from "../../gen/codbex-invoices/data/PurchaseInvoice/PurchaseInvoiceItemRepository";
import { PurchaseInvoiceItemEntity } from "../../gen/codbex-invoices/data/PurchaseInvoice/PurchaseInvoiceItemEntity";
import { EntityEvent, Operator } from "@aerokit/sdk/db";

export const validate = () => { };

export const trigger = (data: string): void => {
    const event: EntityEvent<PurchaseInvoiceItemEntity> = JSON.parse(data);

    const purchaseInvoiceDao = new PurchaseInvoiceRepository();
    const purchaseInvoiceItemDao = new PurchaseInvoiceItemRepository();

    const item = event.entity;

    if (!item.PurchaseInvoice) {
        return;
    }

    const items = purchaseInvoiceItemDao.findAll({
        conditions: [
            {
                propertyName: "PurchaseInvoice",
                operator: Operator.EQ,
                value: item.PurchaseInvoice
            }
        ]
    });

    let net = 0;
    let vat = 0;
    let gross = 0;

    for (const row of items) {
        net += row.Net ?? 0;
        vat += row.VAT ?? 0;
        gross += row.Gross ?? 0;
    }

    const header = purchaseInvoiceDao.findById(item.PurchaseInvoice);

    if (!header) {
        return;
    }

    const discount = header.Discount ?? 0;
    const taxes = header.Taxes ?? 0;

    header.Net = net;
    header.VAT = vat;
    header.Gross = gross;
    header.Total = gross - (gross * discount / 100) + (gross * taxes / 100) + vat;

    if (header.Name) {
        const index = header.Name.lastIndexOf("/");
        if (index >= 0) {
            header.Name = header.Name.substring(0, index + 1) + header.Total;
        }
    }

    purchaseInvoiceDao.update(header);
};
