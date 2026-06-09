package gen.codbex_invoices.data.purchaseinvoice;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class PurchaseInvoiceItemRepository extends JavaRepository<PurchaseInvoiceItemEntity> {

    public PurchaseInvoiceItemRepository() {
        super(PurchaseInvoiceItemEntity.class);
    }

    @Override
    public PurchaseInvoiceItemEntity save(PurchaseInvoiceItemEntity entity) {
        entity.Net = entity.Quantity * entity.Price;
        entity.VAT = Math.round((entity.Net * entity.VATRate / 100) * 100) / 100;
        entity.Gross = entity.Net + entity.VAT;
        return super.save(entity);
    }

    @Override
    public PurchaseInvoiceItemEntity update(PurchaseInvoiceItemEntity entity) {
        entity.Net = entity.Quantity * entity.Price;
        entity.VAT = Math.round((entity.Net * entity.VATRate / 100) * 100) / 100;
        entity.Gross = entity.Net + entity.VAT;
        return super.update(entity);
    }
}
