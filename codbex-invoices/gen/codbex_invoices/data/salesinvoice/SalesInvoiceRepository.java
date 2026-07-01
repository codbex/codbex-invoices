package gen.codbex_invoices.data.salesinvoice;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;
import org.eclipse.dirigible.sdk.utils.Calc;
// custom imports
import org.eclipse.dirigible.sdk.utils;
import codbex_number_generator.gen.codbex_number_generator.service.Generator;

@Repository
public class SalesInvoiceRepository extends JavaRepository<SalesInvoiceEntity> {

    public SalesInvoiceRepository() {
        super(SalesInvoiceEntity.class);
    }

    @Override
    public SalesInvoiceEntity save(SalesInvoiceEntity entity) {
        entity.Number = new Generator().generateByType("Sales Invoice");
        entity.Name = entity.getNumber() + "/" + new java.text.SimpleDateFormat("yyyy-MM-dd").format(entity.getDate()) + "/" + entity.getTotal();
        entity.UUID = UUID.random();
        SalesInvoiceEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-invoices-SalesInvoice-SalesInvoice", Json.stringify(saved));
        return saved;
    }

    @Override
    public SalesInvoiceEntity update(SalesInvoiceEntity entity) {
        entity.Name = entity.getNumber() + "/" + new java.text.SimpleDateFormat("yyyy-MM-dd").format(entity.getDate()) + "/" + entity.getTotal();
        SalesInvoiceEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-invoices-SalesInvoice-SalesInvoice-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "SalesInvoice-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public SalesInvoiceEntity updateWithoutEvent(SalesInvoiceEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(SalesInvoiceEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-invoices-SalesInvoice-SalesInvoice-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        SalesInvoiceEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-invoices-SalesInvoice-SalesInvoice-deleted", Json.stringify(entity));
        }
    }
}
