package gen.codbex_invoices.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class PurchaseInvoiceStatusRepository extends JavaRepository<PurchaseInvoiceStatusEntity> {

    public PurchaseInvoiceStatusRepository() {
        super(PurchaseInvoiceStatusEntity.class);
    }
}
