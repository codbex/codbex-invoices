package gen.codbex_invoices.data.purchaseinvoice;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class PurchaseInvoicePaymentRepository extends JavaRepository<PurchaseInvoicePaymentEntity> {

    public PurchaseInvoicePaymentRepository() {
        super(PurchaseInvoicePaymentEntity.class);
    }
}
