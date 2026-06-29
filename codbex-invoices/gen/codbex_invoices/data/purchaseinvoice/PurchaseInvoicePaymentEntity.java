package gen.codbex_invoices.data.purchaseinvoice;

import org.eclipse.dirigible.sdk.db.Column;
import org.eclipse.dirigible.sdk.db.CreatedAt;
import org.eclipse.dirigible.sdk.db.CreatedBy;
import org.eclipse.dirigible.sdk.platform.Documentation;
import org.eclipse.dirigible.sdk.db.Entity;
import org.eclipse.dirigible.sdk.db.GeneratedValue;
import org.eclipse.dirigible.sdk.db.GenerationType;
import org.eclipse.dirigible.sdk.db.Id;
import org.eclipse.dirigible.sdk.db.Table;
import org.eclipse.dirigible.sdk.db.UpdatedAt;
import org.eclipse.dirigible.sdk.db.UpdatedBy;

@Entity
@Table(name = "CODBEX_PURCHASEINVOICEPAYMENT")
@Documentation("PurchaseInvoicePayment entity mapping")
public class PurchaseInvoicePaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PURCHASEINVOICEPAYMENT_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "PURCHASEINVOICEPAYMENT_PURCHASEINVOICE", nullable = true)
    @Documentation("PurchaseInvoice")
    public Integer PurchaseInvoice;

    @Column(name = "PURCHASEINVOICEPAYMENT_SUPPLIERPAYMENT", nullable = true)
    @Documentation("SupplierPayment")
    public Integer SupplierPayment;

    @Column(name = "PURCHASEINVOICEPAYMENT_AMOUNT", precision = 16, scale = 2, nullable = false)
    @Documentation("Amount")
    public java.math.BigDecimal Amount;

    @CreatedAt
    @Column(name = "PURCHASEINVOICEPAYMENT_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "PURCHASEINVOICEPAYMENT_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "PURCHASEINVOICEPAYMENT_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "PURCHASEINVOICEPAYMENT_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
