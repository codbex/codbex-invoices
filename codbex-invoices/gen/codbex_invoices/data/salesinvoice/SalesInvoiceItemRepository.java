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
        entity.Net = java.math.BigDecimal.valueOf(entity.Quantity).multiply(entity.Price);
        entity.VAT = entity.Net.multiply(entity.VATRate).divide(java.math.BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
        entity.Gross = entity.Net.add(entity.VAT);
        return super.save(entity);
    }

    @Override
    public SalesInvoiceItemEntity update(SalesInvoiceItemEntity entity) {
        entity.Net = java.math.BigDecimal.valueOf(entity.Quantity).multiply(entity.Price);
        entity.VAT = entity.Net.multiply(entity.VATRate).divide(java.math.BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
        entity.Gross = entity.Net.add(entity.VAT);
        return super.update(entity);
    }
}
