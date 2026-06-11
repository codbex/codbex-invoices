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
        entity.Net = java.math.BigDecimal.valueOf(entity.Quantity).multiply(entity.Price);
        entity.VAT = entity.Net.multiply(entity.VATRate).divide(java.math.BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
        entity.Gross = entity.Net.add(entity.VAT);
        return super.save(entity);
    }

    @Override
    public PurchaseInvoiceItemEntity update(PurchaseInvoiceItemEntity entity) {
        entity.Net = java.math.BigDecimal.valueOf(entity.Quantity).multiply(entity.Price);
        entity.VAT = entity.Net.multiply(entity.VATRate).divide(java.math.BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
        entity.Gross = entity.Net.add(entity.VAT);
        return super.update(entity);
    }
}
