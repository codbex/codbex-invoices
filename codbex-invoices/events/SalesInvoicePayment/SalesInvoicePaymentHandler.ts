import { SalesInvoiceRepository } from "../../gen/codbex-invoices/dao/salesinvoice/SalesInvoiceRepository";
import { SalesInvoicePaymentRepository } from "../../gen/codbex-invoices/dao/salesinvoice/SalesInvoicePaymentRepository";
import { CustomerPaymentRepository } from "codbex-payments/gen/codbex-payments/dao/CustomerPayment/CustomerPaymentRepository";

export const trigger = (event) => {

    const SalesInvoiceDao = new SalesInvoiceRepository();
    const SalesInvoicePaymentDao = new SalesInvoicePaymentRepository();
    const CustomerPaymentDao = new CustomerPaymentRepository();

    let item = event.entity;
    const operation = event.operation;

    if (operation == "create") {

        const customerPayment = CustomerPaymentDao.findById(item.CustomerPayment);

        item.Amount = Math.min(customerPayment.Amount, item.Amount);

        SalesInvoicePaymentDao.update(item);
    }

    const items = SalesInvoicePaymentDao.findAll({
        $filter: {
            equals: {
                SalesInvoice: item.SalesInvoice
            }
        }
    });

    let amount = 0;
    items.forEach(item => amount += item.Amount);

    const salesInvoice = SalesInvoiceDao.findById(item.SalesInvoice);
    salesInvoice.Paid = amount;
    salesInvoice.Status = salesInvoice.Paid >= salesInvoice.Total ? 6 : 5;

    SalesInvoiceDao.update(salesInvoice);
}
