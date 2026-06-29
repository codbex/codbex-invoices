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
@Table(name = "CODBEX_DEDUCTION")
@Documentation("Deduction entity mapping")
public class DeductionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DEDUCTION_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "DEDUCTION_DEDUCTIONINVOICE", nullable = true)
    @Documentation("DeductionInvoice")
    public Integer DeductionInvoice;

    @Column(name = "DEDUCTION_ADVANCEINVOICE", nullable = true)
    @Documentation("AdvanceInvoice")
    public Integer AdvanceInvoice;

}
