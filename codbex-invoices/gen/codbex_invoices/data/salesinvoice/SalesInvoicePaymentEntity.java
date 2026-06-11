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
