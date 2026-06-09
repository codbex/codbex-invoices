package gen.codbex_invoices.data.salesinvoice;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class SalesInvoiceItemRepository extends JavaRepository<SalesInvoiceItemEntity> {

    public SalesInvoiceItemRepository() {
        super(SalesInvoiceItemEntity.class);
    }

    @Override
    public SalesInvoiceItemEntity save(SalesInvoiceItemEntity entity) {
        entity.Net = entity.Quantity * entity.Price;
        entity.VAT = Math.round((entity.Net * entity.VATRate / 100) * 100) / 100;
        entity.Gross = entity.Net + entity.VAT;
        return super.save(entity);
    }

    @Override
    public SalesInvoiceItemEntity update(SalesInvoiceItemEntity entity) {
        entity.Net = entity.Quantity * entity.Price;
        entity.VAT = Math.round((entity.Net * entity.VATRate / 100) * 100) / 100;
        entity.Gross = entity.Net + entity.VAT;
        return super.update(entity);
    }
}
