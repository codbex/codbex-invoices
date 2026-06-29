package gen.codbex_invoices.data.salesinvoice;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class SalesInvoiceRepository extends JavaRepository<SalesInvoiceEntity> {

    public SalesInvoiceRepository() {
        super(SalesInvoiceEntity.class);
    }

    @Override
    public SalesInvoiceEntity save(SalesInvoiceEntity entity) {
        entity.Number = new Generator().generateByType("Sales Invoice");
        entity.Name = entity.getNumber() + "/" + new java.text.SimpleDateFormat("yyyy-MM-dd").format(entity.getDate()) + "/" + entity.getTotal();
        entity.UUID = Uuid.random();
        return super.save(entity);
    }

    @Override
    public SalesInvoiceEntity update(SalesInvoiceEntity entity) {
        entity.Name = entity.getNumber() + "/" + new java.text.SimpleDateFormat("yyyy-MM-dd").format(entity.getDate()) + "/" + entity.getTotal();
        return super.update(entity);
    }
}
