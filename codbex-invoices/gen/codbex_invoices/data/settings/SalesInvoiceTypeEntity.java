package gen.codbex_invoices.data.settings;

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
@Table(name = "CODBEX_SALESINVOICETYPE")
@Documentation("SalesInvoiceType entity mapping")
public class SalesInvoiceTypeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SALESINVOICETYPE_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "SALESINVOICETYPE_NAME", length = 20, nullable = false)
    @Documentation("Name")
    public String Name;

    @Column(name = "SALESINVOICETYPE_DIRECTION", nullable = false)
    @Documentation("Direction")
    public Integer Direction;

}
