package gen.codbex_invoices.data.purchaseinvoice;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;
import org.eclipse.dirigible.sdk.utils.Calc;
// custom imports
import org.eclipse.dirigible.sdk.utils;
import codbex_number_generator.gen.codbex_number_generator.service.Generator;

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
        PurchaseInvoiceEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-invoices-PurchaseInvoice-PurchaseInvoice", Json.stringify(saved));
        return saved;
    }

    @Override
    public PurchaseInvoiceEntity update(PurchaseInvoiceEntity entity) {
        entity.Name = entity.getNumber() + "/" + new java.text.SimpleDateFormat("yyyy-MM-dd").format(entity.getDate()) + "/" + entity.getTotal();
        PurchaseInvoiceEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-invoices-PurchaseInvoice-PurchaseInvoice-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "PurchaseInvoice-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public PurchaseInvoiceEntity updateWithoutEvent(PurchaseInvoiceEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(PurchaseInvoiceEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-invoices-PurchaseInvoice-PurchaseInvoice-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        PurchaseInvoiceEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-invoices-PurchaseInvoice-PurchaseInvoice-deleted", Json.stringify(entity));
        }
    }
}
