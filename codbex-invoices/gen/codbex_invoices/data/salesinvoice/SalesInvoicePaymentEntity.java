package gen.codbex_invoices.data.salesinvoice;

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
@Table(name = "CODBEX_SALESINVOICEPAYMENT")
@Documentation("SalesInvoicePayment entity mapping")
public class SalesInvoicePaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SALESINVOICEPAYMENT_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "SALESINVOICEPAYMENT_SALESINVOICE", nullable = true)
    @Documentation("SalesInvoice")
    public Integer SalesInvoice;

    @Column(name = "SALESINVOICEPAYMENT_CUSTOMERPAYMENT", nullable = true)
    @Documentation("CustomerPayment")
    public Integer CustomerPayment;

    @Column(name = "SALESINVOICEPAYMENT_AMOUNT", precision = 16, scale = 2, nullable = false)
    @Documentation("Amount")
    public java.math.BigDecimal Amount;

    @CreatedAt
    @Column(name = "SALESINVOICEPAYMENT_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "SALESINVOICEPAYMENT_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "SALESINVOICEPAYMENT_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "SALESINVOICEPAYMENT_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
