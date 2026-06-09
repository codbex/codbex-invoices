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
