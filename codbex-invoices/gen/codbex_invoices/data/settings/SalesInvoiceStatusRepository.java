package gen.codbex_invoices.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class SalesInvoiceStatusRepository extends JavaRepository<SalesInvoiceStatusEntity> {

    public SalesInvoiceStatusRepository() {
        super(SalesInvoiceStatusEntity.class);
    }
}
