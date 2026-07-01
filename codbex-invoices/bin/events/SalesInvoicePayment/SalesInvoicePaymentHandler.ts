import { SalesInvoiceRepository } from "../../gen/codbex-invoices/data/SalesInvoice/SalesInvoiceRepository";
import { SalesInvoicePaymentRepository } from "../../gen/codbex-invoices/data/SalesInvoice/SalesInvoicePaymentRepository";
import { SalesInvoicePaymentEntity } from "../../gen/codbex-invoices/data/SalesInvoice/SalesInvoicePaymentEntity";
import { CustomerPaymentRepository } from "codbex-payments/gen/codbex-payments/data/CustomerPayment/CustomerPaymentRepository";
import { EntityEvent, Operator } from "@aerokit/sdk/db";

export const trigger = (event: EntityEvent<SalesInvoicePaymentEntity>): void => {
    const salesInvoiceDao = new SalesInvoiceRepository();
    const salesInvoicePaymentDao = new SalesInvoicePaymentRepository();
    const customerPaymentDao = new CustomerPaymentRepository();

    const item = event.entity;
    const operation = event.operation;

    if (!item.SalesInvoice) {
        return;
    }

    if (operation === "create" && item.CustomerPayment) {
        const customerPayment = customerPaymentDao.findById(item.CustomerPayment);

        if (customerPayment && item.Id) {
            const dbItem = salesInvoicePaymentDao.findById(item.Id);

            if (!dbItem) {
                return;
            }

            dbItem.Amount = Math.min(customerPayment.Amount ?? 0, dbItem.Amount ?? 0);
            salesInvoicePaymentDao.update(dbItem);
        }
    }

    const items = salesInvoicePaymentDao.findAll({
        conditions: [
            {
                propertyName: "SalesInvoice",
                operator: Operator.EQ,
                value: item.SalesInvoice
            }
        ]
    });

    let amount = 0;
    for (const row of items) {
        amount += row.Amount ?? 0;
    }

    const salesInvoice = salesInvoiceDao.findById(item.SalesInvoice);
    if (!salesInvoice) {
        return;
    }

    salesInvoice.Paid = amount;
    salesInvoice.Status = amount >= (salesInvoice.Total ?? 0) ? 6 : 5;

    salesInvoiceDao.update(salesInvoice);
};
