package gen.codbex_invoices.data.salesinvoice;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class DeductionRepository extends JavaRepository<DeductionEntity> {

    public DeductionRepository() {
        super(DeductionEntity.class);
    }

    @Override
    public DeductionEntity save(DeductionEntity entity) {
        DeductionEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-invoices-SalesInvoice-Deduction", Json.stringify(saved));
        return saved;
    }

    @Override
    public DeductionEntity update(DeductionEntity entity) {
        DeductionEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-invoices-SalesInvoice-Deduction-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "Deduction-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public DeductionEntity updateWithoutEvent(DeductionEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(DeductionEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-invoices-SalesInvoice-Deduction-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        DeductionEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-invoices-SalesInvoice-Deduction-deleted", Json.stringify(entity));
        }
    }
}
