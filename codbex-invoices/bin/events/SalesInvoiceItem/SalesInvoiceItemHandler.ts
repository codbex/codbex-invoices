import { SalesInvoiceRepository } from "../../gen/codbex-invoices/data/SalesInvoice/SalesInvoiceRepository";
import { SalesInvoiceItemRepository } from "../../gen/codbex-invoices/data/SalesInvoice/SalesInvoiceItemRepository";
import { SalesInvoiceItemEntity } from "../../gen/codbex-invoices/data/SalesInvoice/SalesInvoiceItemEntity";
import { EntityEvent, Operator } from "@aerokit/sdk/db";

export const validate = () => { };

export const trigger = (data: string): void => {
    const event: EntityEvent<SalesInvoiceItemEntity> = JSON.parse(data);

    const salesInvoiceDao = new SalesInvoiceRepository();
    const salesInvoiceItemDao = new SalesInvoiceItemRepository();

    const item = event.entity;

    if (!item.SalesInvoice) {
        return;
    }

    const items = salesInvoiceItemDao.findAll({
        conditions: [
            {
                propertyName: "SalesInvoice",
                operator: Operator.EQ,
                value: item.SalesInvoice
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

    const header = salesInvoiceDao.findById(item.SalesInvoice);

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

    salesInvoiceDao.update(header);
};
