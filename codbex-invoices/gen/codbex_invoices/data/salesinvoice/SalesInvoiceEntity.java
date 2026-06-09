package gen.codbex_invoices.data.salesinvoice;

import org.eclipse.dirigible.engine.java.annotations.Column;
import org.eclipse.dirigible.engine.java.annotations.CreatedAt;
import org.eclipse.dirigible.engine.java.annotations.CreatedBy;
import org.eclipse.dirigible.engine.java.annotations.Documentation;
import org.eclipse.dirigible.engine.java.annotations.Entity;
import org.eclipse.dirigible.engine.java.annotations.GeneratedValue;
import org.eclipse.dirigible.engine.java.annotations.GenerationType;
import org.eclipse.dirigible.engine.java.annotations.Id;
import org.eclipse.dirigible.engine.java.annotations.Table;
import org.eclipse.dirigible.engine.java.annotations.UpdatedAt;
import org.eclipse.dirigible.engine.java.annotations.UpdatedBy;

@Entity
@Table(name = "CODBEX_SALESINVOICE")
@Documentation("SalesInvoice entity mapping")
public class SalesInvoiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SALESINVOICE_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "SALESINVOICE_NUMBER", length = 20, nullable = true, unique = true)
    @Documentation("Number")
    public String Number;

    @Column(name = "SALESINVOICE_CUSTOMER", nullable = false)
    @Documentation("Customer")
    public Integer Customer;

    @Column(name = "SALESINVOICE_TYPE", nullable = false)
    @Documentation("Type")
    public Integer Type;

    @Column(name = "SALESINVOICE_DATE", nullable = false)
    @Documentation("Date")
    public java.time.LocalDate Date;

    @Column(name = "SALESINVOICE_DUE", nullable = false)
    @Documentation("Due")
    public java.time.LocalDate Due;

    @Column(name = "SALESINVOICE_NET", precision = 16, scale = 2, nullable = false)
    @Documentation("Net")
    public java.math.BigDecimal Net;

    @Column(name = "SALESINVOICE_CURRENCY", nullable = false)
    @Documentation("Currency")
    public Integer Currency;

    @Column(name = "SALESINVOICE_GROSS", precision = 16, scale = 2, nullable = false)
    @Documentation("Gross")
    public java.math.BigDecimal Gross;

    @Column(name = "SALESINVOICE_DISCOUNT", precision = 16, scale = 2, nullable = false)
    @Documentation("Discount")
    public java.math.BigDecimal Discount;

    @Column(name = "SALESINVOICE_TAXES", precision = 16, scale = 2, nullable = false)
    @Documentation("Taxes")
    public java.math.BigDecimal Taxes;

    @Column(name = "SALESINVOICE_VAT", precision = 16, scale = 2, nullable = false)
    @Documentation("VAT")
    public java.math.BigDecimal VAT;

    @Column(name = "SALESINVOICE_TOTAL", precision = 16, scale = 2, nullable = false)
    @Documentation("Total")
    public java.math.BigDecimal Total;

    @Column(name = "SALESINVOICE_PAID", precision = 16, scale = 2, nullable = false)
    @Documentation("Paid")
    public java.math.BigDecimal Paid;

    @Column(name = "SALESINVOICE_CONDITIONS", length = 200, nullable = true)
    @Documentation("Conditions")
    public String Conditions;

    @Column(name = "SALESINVOICE_PAYMENTMETHOD", nullable = true)
    @Documentation("PaymentMethod")
    public Integer PaymentMethod;

    @Column(name = "SALESINVOICE_SENTMETHOD", nullable = true)
    @Documentation("SentMethod")
    public Integer SentMethod;

    @Column(name = "SALESINVOICE_STATUS", nullable = false)
    @Documentation("Status")
    public Integer Status;

    @Column(name = "SALESINVOICE_OPERATOR", nullable = false)
    @Documentation("Operator")
    public Integer Operator;

    @Column(name = "SALESINVOICE_COMPANY", nullable = false)
    @Documentation("Company")
    public Integer Company;

    @Column(name = "SALESINVOICE_DOCUMENTLINK", length = 1000, nullable = false)
    @Documentation("DocumentLink")
    public String DocumentLink;

    @Column(name = "SALESINVOICE_NAME", length = 200, nullable = false)
    @Documentation("Name")
    public String Name;

    @Column(name = "SALESINVOICE_UUID", length = 36, nullable = false, unique = true)
    @Documentation("UUID")
    public String UUID;

    @Column(name = "SALESINVOICE_PROCESS", length = 36, nullable = true)
    @Documentation("Process")
    public String Process;

    @Column(name = "SALESINVOICE_REFERENCE", length = 100, nullable = true)
    @Documentation("Reference")
    public String Reference;

    @CreatedAt
    @Column(name = "SALESINVOICE_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "SALESINVOICE_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "SALESINVOICE_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "SALESINVOICE_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
