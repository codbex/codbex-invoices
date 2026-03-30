import { PurchaseInvoiceRepository } from "../../gen/codbex-invoices/data/PurchaseInvoice/PurchaseInvoiceRepository";
import { PurchaseInvoicePaymentRepository } from "../../gen/codbex-invoices/data/PurchaseInvoice/PurchaseInvoicePaymentRepository";
import { PurchaseInvoicePaymentEntity } from "../../gen/codbex-invoices/data/PurchaseInvoice/PurchaseInvoicePaymentEntity";
import { SupplierPaymentRepository } from "codbex-payments/gen/codbex-payments/data/SupplierPayment/SupplierPaymentRepository";
import { EntityEvent, Operator } from "@aerokit/sdk/db";

export const trigger = (event: EntityEvent<PurchaseInvoicePaymentEntity>): void => {
    const purchaseInvoiceDao = new PurchaseInvoiceRepository();
    const purchaseInvoicePaymentDao = new PurchaseInvoicePaymentRepository();
    const supplierPaymentDao = new SupplierPaymentRepository();

    const item = event.entity;
    const operation = event.operation;

    if (!item.PurchaseInvoice) {
        return;
    }

    if (operation === "create" && item.SupplierPayment && item.Id) {
        const dbItem = purchaseInvoicePaymentDao.findById(item.Id);
        if (!dbItem) {
            return;
        }

        const supplierPayment = supplierPaymentDao.findById(item.SupplierPayment);
        if (!supplierPayment) {
            return;
        }

        dbItem.Amount = Math.min(supplierPayment.Amount ?? 0, dbItem.Amount ?? 0);
        purchaseInvoicePaymentDao.update(dbItem);
    }


    const items = purchaseInvoicePaymentDao.findAll({
        conditions: [
            {
                propertyName: "PurchaseInvoice",
                operator: Operator.EQ,
                value: item.PurchaseInvoice
            }
        ]
    });

    let amount = 0;
    for (const row of items) {
        amount += row.Amount ?? 0;
    }

    const purchaseInvoice = purchaseInvoiceDao.findById(item.PurchaseInvoice);
    if (!purchaseInvoice) {
        return;
    }

    purchaseInvoice.Paid = amount;
    purchaseInvoice.Status = amount >= (purchaseInvoice.Total ?? 0) ? 6 : 5;

    purchaseInvoiceDao.update(purchaseInvoice);
};
