package gen.codbex_invoices.data.settings;

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
