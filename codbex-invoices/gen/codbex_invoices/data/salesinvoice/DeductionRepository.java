package gen.codbex_invoices.data.salesinvoice;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class DeductionRepository extends JavaRepository<DeductionEntity> {

    public DeductionRepository() {
        super(DeductionEntity.class);
    }
}
