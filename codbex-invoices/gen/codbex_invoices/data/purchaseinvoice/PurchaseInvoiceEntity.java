package gen.codbex_invoices.data.purchaseinvoice;

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
@Table(name = "CODBEX_PURCHASEINVOICE")
@Documentation("PurchaseInvoice entity mapping")
public class PurchaseInvoiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PURCHASEINVOICE_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "PURCHASEINVOICE_NUMBER", length = 20, nullable = true, unique = true)
    @Documentation("Number")
    public String Number;

    @Column(name = "PURCHASEINVOICE_ORIGINALNUMBER", length = 20, nullable = false)
    @Documentation("OriginalNumber")
    public String OriginalNumber;

    @Column(name = "PURCHASEINVOICE_SUPPLIER", nullable = false)
    @Documentation("Supplier")
    public Integer Supplier;

    @Column(name = "PURCHASEINVOICE_PURCHASEINVOICETYPE", nullable = false)
    @Documentation("Type")
    public Integer Type;

    @Column(name = "PURCHASEINVOICE_DATE", nullable = false)
    @Documentation("Date")
    public java.time.LocalDate Date;

    @Column(name = "PURCHASEINVOICE_DUE", nullable = false)
    @Documentation("Due")
    public java.time.LocalDate Due;

    @Column(name = "PURCHASEINVOICE_NET", precision = 16, scale = 2, nullable = false)
    @Documentation("Net")
    public java.math.BigDecimal Net;

    @Column(name = "PURCHASEINVOICE_CURRENCY", nullable = false)
    @Documentation("Currency")
    public Integer Currency;

    @Column(name = "PURCHASEINVOICE_GROSS", precision = 16, scale = 2, nullable = false)
    @Documentation("Gross")
    public java.math.BigDecimal Gross;

    @Column(name = "PURCHASEINVOICE_DISCOUNT", precision = 16, scale = 2, nullable = false)
    @Documentation("Discount")
    public java.math.BigDecimal Discount;

    @Column(name = "PURCHASEINVOICE_TAXES", precision = 16, scale = 2, nullable = false)
    @Documentation("Taxes")
    public java.math.BigDecimal Taxes;

    @Column(name = "PURCHASEINVOICE_VAT", precision = 16, scale = 2, nullable = false)
    @Documentation("VAT")
    public java.math.BigDecimal VAT;

    @Column(name = "PURCHASEINVOICE_TOTAL", precision = 16, scale = 2, nullable = false)
    @Documentation("Total")
    public java.math.BigDecimal Total;

    @Column(name = "PURCHASEINVOICE_PAID", precision = 16, scale = 2, nullable = false)
    @Documentation("Paid")
    public java.math.BigDecimal Paid;

    @Column(name = "PURCHASEINVOICE_CONDITIONS", length = 200, nullable = true)
    @Documentation("Conditions")
    public String Conditions;

    @Column(name = "PURCHASEINVOICE_PAYMENTMETHOD", nullable = true)
    @Documentation("PaymentMethod")
    public Integer PaymentMethod;

    @Column(name = "PURCHASEINVOICE_SENTMETHOD", nullable = true)
    @Documentation("SentMethod")
    public Integer SentMethod;

    @Column(name = "PURCHASEINVOICE_STATUS", nullable = false)
    @Documentation("Status")
    public Integer Status;

    @Column(name = "PURCHASEINVOICE_OPERATOR", nullable = false)
    @Documentation("Operator")
    public Integer Operator;

    @Column(name = "PURCHASEINVOICE_COMPANY", nullable = false)
    @Documentation("Company")
    public Integer Company;

    @Column(name = "PURCHASEINVOICE_DOCUMENTLINK", length = 1000, nullable = false)
    @Documentation("DocumentLink")
    public String DocumentLink;

    @Column(name = "PURCHASEINVOICE_NAME", length = 200, nullable = false)
    @Documentation("Name")
    public String Name;

    @Column(name = "PURCHASEINVOICE_UUID", length = 36, nullable = false, unique = true)
    @Documentation("UUID")
    public String UUID;

    @Column(name = "PURCHASEINVOICE_PROCESS", length = 36, nullable = true)
    @Documentation("Process")
    public String Process;

    @Column(name = "PURCHASEINVOICE_REFERENCE", length = 36, nullable = true)
    @Documentation("Reference")
    public String Reference;

    @CreatedAt
    @Column(name = "PURCHASEINVOICE_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "PURCHASEINVOICE_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "PURCHASEINVOICE_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "PURCHASEINVOICE_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
