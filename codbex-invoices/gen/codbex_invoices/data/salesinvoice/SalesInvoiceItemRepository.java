package gen.codbex_invoices.data.salesinvoice;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;
import org.eclipse.dirigible.sdk.utils.Calc;

@Repository
public class SalesInvoiceItemRepository extends JavaRepository<SalesInvoiceItemEntity> {

    public SalesInvoiceItemRepository() {
        super(SalesInvoiceItemEntity.class);
    }

    @Override
    public SalesInvoiceItemEntity save(SalesInvoiceItemEntity entity) {
        entity.Net = Calc.eval("java.math.BigDecimal.valueOf(entity.Quantity).multiply(entity.Price)", entity, 2);
        entity.VAT = Calc.eval("entity.Net.multiply(entity.VATRate).divide(java.math.BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP)", entity, 2);
        entity.Gross = Calc.eval("entity.Net.add(entity.VAT)", entity, 2);
        SalesInvoiceItemEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-invoices-SalesInvoice-SalesInvoiceItem", Json.stringify(saved));
        return saved;
    }

    @Override
    public SalesInvoiceItemEntity update(SalesInvoiceItemEntity entity) {
        entity.Net = Calc.eval("java.math.BigDecimal.valueOf(entity.Quantity).multiply(entity.Price)", entity, 2);
        entity.VAT = Calc.eval("entity.Net.multiply(entity.VATRate).divide(java.math.BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP)", entity, 2);
        entity.Gross = Calc.eval("entity.Net.add(entity.VAT)", entity, 2);
        SalesInvoiceItemEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-invoices-SalesInvoice-SalesInvoiceItem-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "SalesInvoiceItem-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public SalesInvoiceItemEntity updateWithoutEvent(SalesInvoiceItemEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(SalesInvoiceItemEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-invoices-SalesInvoice-SalesInvoiceItem-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        SalesInvoiceItemEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-invoices-SalesInvoice-SalesInvoiceItem-deleted", Json.stringify(entity));
        }
    }
}
