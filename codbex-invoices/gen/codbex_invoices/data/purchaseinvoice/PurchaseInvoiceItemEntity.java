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
@Table(name = "CODBEX_PURCHASEINVOICEITEM")
@Documentation("PurchaseInvoiceItem entity mapping")
public class PurchaseInvoiceItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PURCHASEINVOICEITEM_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "PURCHASEINVOICEITEM_PURCHASEINVOICE", nullable = false)
    @Documentation("PurchaseInvoice")
    public Integer PurchaseInvoice;

    @Column(name = "PURCHASEINVOICEITEM_NAME", length = 300, nullable = false)
    @Documentation("Name")
    public String Name;

    @Column(name = "PURCHASEINVOICEITEM_UOM", nullable = false)
    @Documentation("UoM")
    public Integer UoM;

    @Column(name = "PURCHASEINVOICEITEM_QUANTITY", nullable = false)
    @Documentation("Quantity")
    public Double Quantity;

    @Column(name = "PURCHASEINVOICEITEM_PRICE", precision = 16, scale = 2, nullable = false)
    @Documentation("Price")
    public java.math.BigDecimal Price;

    @Column(name = "PURCHASEINVOICEITEM_NET", precision = 16, scale = 2, nullable = true)
    @Documentation("Net")
    public java.math.BigDecimal Net;

    @Column(name = "PURCHASEINVOICEITEM_VATRATE", precision = 16, scale = 2, nullable = false)
    @Documentation("VATRate")
    public java.math.BigDecimal VATRate;

    @Column(name = "PURCHASEINVOICEITEM_VAT", precision = 16, scale = 2, nullable = true)
    @Documentation("VAT")
    public java.math.BigDecimal VAT;

    @Column(name = "PURCHASEINVOICEITEM_GROSS", precision = 16, scale = 2, nullable = true)
    @Documentation("Gross")
    public java.math.BigDecimal Gross;

    @CreatedAt
    @Column(name = "PURCHASEINVOICEITEM_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "PURCHASEINVOICEITEM_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "PURCHASEINVOICEITEM_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "PURCHASEINVOICEITEM_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
