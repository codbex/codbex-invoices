package gen.codbex_invoices.data.purchaseinvoice;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;
import org.eclipse.dirigible.sdk.utils.Calc;

@Repository
public class PurchaseInvoiceItemRepository extends JavaRepository<PurchaseInvoiceItemEntity> {

    public PurchaseInvoiceItemRepository() {
        super(PurchaseInvoiceItemEntity.class);
    }

    @Override
    public PurchaseInvoiceItemEntity save(PurchaseInvoiceItemEntity entity) {
        entity.Net = Calc.eval("java.math.BigDecimal.valueOf(entity.Quantity).multiply(entity.Price)", entity, 2);
        entity.VAT = Calc.eval("entity.Net.multiply(entity.VATRate).divide(java.math.BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP)", entity, 2);
        entity.Gross = Calc.eval("entity.Net.add(entity.VAT)", entity, 2);
        PurchaseInvoiceItemEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-invoices-PurchaseInvoice-PurchaseInvoiceItem", Json.stringify(saved));
        return saved;
    }

    @Override
    public PurchaseInvoiceItemEntity update(PurchaseInvoiceItemEntity entity) {
        entity.Net = Calc.eval("java.math.BigDecimal.valueOf(entity.Quantity).multiply(entity.Price)", entity, 2);
        entity.VAT = Calc.eval("entity.Net.multiply(entity.VATRate).divide(java.math.BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP)", entity, 2);
        entity.Gross = Calc.eval("entity.Net.add(entity.VAT)", entity, 2);
        PurchaseInvoiceItemEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-invoices-PurchaseInvoice-PurchaseInvoiceItem-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "PurchaseInvoiceItem-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public PurchaseInvoiceItemEntity updateWithoutEvent(PurchaseInvoiceItemEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(PurchaseInvoiceItemEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-invoices-PurchaseInvoice-PurchaseInvoiceItem-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        PurchaseInvoiceItemEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-invoices-PurchaseInvoice-PurchaseInvoiceItem-deleted", Json.stringify(entity));
        }
    }
}
