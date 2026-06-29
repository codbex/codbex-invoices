package gen.codbex_invoices.data.purchaseinvoice;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class PurchaseInvoiceRepository extends JavaRepository<PurchaseInvoiceEntity> {

    public PurchaseInvoiceRepository() {
        super(PurchaseInvoiceEntity.class);
    }

    @Override
    public PurchaseInvoiceEntity save(PurchaseInvoiceEntity entity) {
        entity.Number = new Generator().generateByType("Purchase Invoice");
        entity.Name = entity.getNumber() + "/" + new java.text.SimpleDateFormat("yyyy-MM-dd").format(entity.getDate()) + "/" + entity.getTotal();
        entity.UUID = UUID.random();
        return super.save(entity);
    }

    @Override
    public PurchaseInvoiceEntity update(PurchaseInvoiceEntity entity) {
        entity.Name = entity.getNumber() + "/" + new java.text.SimpleDateFormat("yyyy-MM-dd").format(entity.getDate()) + "/" + entity.getTotal();
        return super.update(entity);
    }
}
