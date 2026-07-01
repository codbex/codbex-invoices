package gen.codbex_invoices.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class SalesInvoiceTypeRepository extends JavaRepository<SalesInvoiceTypeEntity> {

    public SalesInvoiceTypeRepository() {
        super(SalesInvoiceTypeEntity.class);
    }

    @Override
    public SalesInvoiceTypeEntity save(SalesInvoiceTypeEntity entity) {
        SalesInvoiceTypeEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-invoices-Settings-SalesInvoiceType", Json.stringify(saved));
        return saved;
    }

    @Override
    public SalesInvoiceTypeEntity update(SalesInvoiceTypeEntity entity) {
        SalesInvoiceTypeEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-invoices-Settings-SalesInvoiceType-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "SalesInvoiceType-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public SalesInvoiceTypeEntity updateWithoutEvent(SalesInvoiceTypeEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(SalesInvoiceTypeEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-invoices-Settings-SalesInvoiceType-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        SalesInvoiceTypeEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-invoices-Settings-SalesInvoiceType-deleted", Json.stringify(entity));
        }
    }
}
