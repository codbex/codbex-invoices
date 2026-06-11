package gen.codbex_invoices.data.purchaseinvoice;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class PurchaseInvoiceRepository extends JavaRepository<PurchaseInvoiceEntity> {

    public PurchaseInvoiceRepository() {
        super(PurchaseInvoiceEntity.class);
    }

    @Override
    public PurchaseInvoiceEntity save(PurchaseInvoiceEntity entity) {
        entity.Number = new NumberGeneratorService().generateByType('Purchase Invoice');
        entity.Name = entity.Number + "/" + new Date(entity.Date).toISOString().slice(0, 10) + "/" + entity.Total;
        entity.UUID = entity.UUID = UUID.random();;
        return super.save(entity);
    }

    @Override
    public PurchaseInvoiceEntity update(PurchaseInvoiceEntity entity) {
        entity.Name = entity.Number + "/" + new Date(entity.Date).toISOString().slice(0, 10) + "/" + entity.Total;
        return super.update(entity);
    }
}
