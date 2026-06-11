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
@Table(name = "CODBEX_SALESINVOICEITEM")
@Documentation("SalesInvoiceItem entity mapping")
public class SalesInvoiceItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SALESINVOICEITEM_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "SALESINVOICEITEM_SALESINVOICE", nullable = false)
    @Documentation("SalesInvoice")
    public Integer SalesInvoice;

    @Column(name = "SALESINVOICEITEM_NAME", length = 300, nullable = false)
    @Documentation("Name")
    public String Name;

    @Column(name = "SALESINVOICEITEM_UOM", nullable = false)
    @Documentation("UoM")
    public Integer UoM;

    @Column(name = "SALESINVOICEITEM_QUANTITY", nullable = false)
    @Documentation("Quantity")
    public Double Quantity;

    @Column(name = "SALESINVOICEITEM_PRICE", precision = 16, scale = 2, nullable = false)
    @Documentation("Price")
    public java.math.BigDecimal Price;

    @Column(name = "SALESINVOICEITEM_NET", precision = 16, scale = 2, nullable = false)
    @Documentation("Net")
    public java.math.BigDecimal Net;

    @Column(name = "SALESINVOICEITEM_VATRATE", precision = 16, scale = 2, nullable = false)
    @Documentation("VATRate")
    public java.math.BigDecimal VATRate;

    @Column(name = "SALESINVOICEITEM_VAT", precision = 16, scale = 2, nullable = false)
    @Documentation("VAT")
    public java.math.BigDecimal VAT;

    @Column(name = "SALESINVOICEITEM_GROSS", precision = 16, scale = 2, nullable = false)
    @Documentation("Gross")
    public java.math.BigDecimal Gross;

    @CreatedAt
    @Column(name = "SALESINVOICEITEM_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "SALESINVOICEITEM_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "SALESINVOICEITEM_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "SALESINVOICEITEM_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
