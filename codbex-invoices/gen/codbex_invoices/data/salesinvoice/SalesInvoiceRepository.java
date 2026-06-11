package gen.codbex_invoices.data.salesinvoice;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class SalesInvoiceRepository extends JavaRepository<SalesInvoiceEntity> {

    public SalesInvoiceRepository() {
        super(SalesInvoiceEntity.class);
    }

    @Override
    public SalesInvoiceEntity save(SalesInvoiceEntity entity) {
        entity.Number = new NumberGeneratorService().generateByType('Sales Invoice');
        entity.Name = entity.Number + "/" + new Date(entity.Date).toISOString().slice(0, 10) + "/" + entity.Total;
        entity.UUID = entity.UUID = UUID.random();;
        return super.save(entity);
    }

    @Override
    public SalesInvoiceEntity update(SalesInvoiceEntity entity) {
        entity.Name = entity.Number + "/" + new Date(entity.Date).toISOString().slice(0, 10) + "/" + entity.Total;
        return super.update(entity);
    }
}
