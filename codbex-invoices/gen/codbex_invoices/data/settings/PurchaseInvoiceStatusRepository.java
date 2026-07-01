package gen.codbex_invoices.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class PurchaseInvoiceStatusRepository extends JavaRepository<PurchaseInvoiceStatusEntity> {

    public PurchaseInvoiceStatusRepository() {
        super(PurchaseInvoiceStatusEntity.class);
    }

    @Override
    public PurchaseInvoiceStatusEntity save(PurchaseInvoiceStatusEntity entity) {
        PurchaseInvoiceStatusEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-invoices-Settings-PurchaseInvoiceStatus", Json.stringify(saved));
        return saved;
    }

    @Override
    public PurchaseInvoiceStatusEntity update(PurchaseInvoiceStatusEntity entity) {
        PurchaseInvoiceStatusEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-invoices-Settings-PurchaseInvoiceStatus-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "PurchaseInvoiceStatus-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public PurchaseInvoiceStatusEntity updateWithoutEvent(PurchaseInvoiceStatusEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(PurchaseInvoiceStatusEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-invoices-Settings-PurchaseInvoiceStatus-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        PurchaseInvoiceStatusEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-invoices-Settings-PurchaseInvoiceStatus-deleted", Json.stringify(entity));
        }
    }
}
