package gen.codbex_invoices.data.salesinvoice;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class SalesInvoicePaymentRepository extends JavaRepository<SalesInvoicePaymentEntity> {

    public SalesInvoicePaymentRepository() {
        super(SalesInvoicePaymentEntity.class);
    }

    @Override
    public SalesInvoicePaymentEntity save(SalesInvoicePaymentEntity entity) {
        SalesInvoicePaymentEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-invoices-SalesInvoice-SalesInvoicePayment", Json.stringify(saved));
        return saved;
    }

    @Override
    public SalesInvoicePaymentEntity update(SalesInvoicePaymentEntity entity) {
        SalesInvoicePaymentEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-invoices-SalesInvoice-SalesInvoicePayment-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "SalesInvoicePayment-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public SalesInvoicePaymentEntity updateWithoutEvent(SalesInvoicePaymentEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(SalesInvoicePaymentEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-invoices-SalesInvoice-SalesInvoicePayment-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        SalesInvoicePaymentEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-invoices-SalesInvoice-SalesInvoicePayment-deleted", Json.stringify(entity));
        }
    }
}
