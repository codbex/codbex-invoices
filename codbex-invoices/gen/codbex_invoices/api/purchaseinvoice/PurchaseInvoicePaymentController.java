package gen.codbex_invoices.api.purchaseinvoice;

import gen.codbex_invoices.data.purchaseinvoice.PurchaseInvoicePaymentEntity;
import gen.codbex_invoices.data.purchaseinvoice.PurchaseInvoicePaymentRepository;

import org.eclipse.dirigible.components.api.security.UserFacade;
import org.eclipse.dirigible.engine.java.annotations.Documentation;
import org.eclipse.dirigible.engine.java.annotations.Inject;
import org.eclipse.dirigible.engine.java.annotations.http.Body;
import org.eclipse.dirigible.engine.java.annotations.http.Controller;
import org.eclipse.dirigible.engine.java.annotations.http.Delete;
import org.eclipse.dirigible.engine.java.annotations.http.Get;
import org.eclipse.dirigible.engine.java.annotations.http.PathParam;
import org.eclipse.dirigible.engine.java.annotations.http.Post;
import org.eclipse.dirigible.engine.java.annotations.http.Put;
import org.eclipse.dirigible.engine.java.annotations.http.QueryParam;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Controller
@Documentation("codbex-invoices - PurchaseInvoicePayment Controller")
public class PurchaseInvoicePaymentController {

    private static final Set<String> FILTER_FIELDS = Set.of("Id", "PurchaseInvoice", "SupplierPayment", "Amount", "CreatedAt", "CreatedBy", "UpdatedAt", "UpdatedBy");

    @Inject
    private PurchaseInvoicePaymentRepository repository;

    @Get
    @Documentation("List PurchaseInvoicePayment")
    public List<PurchaseInvoicePaymentEntity> getAll(@QueryParam("$limit") Integer limit,
                                      @QueryParam("$offset") Integer offset,
                                      @QueryParam("PurchaseInvoice") String PurchaseInvoice) {
        checkPermissions("read");
        int actualLimit = limit != null ? limit.intValue() : 20;
        int actualOffset = offset != null ? offset.intValue() : 0;
        List<PurchaseInvoicePaymentEntity> result;
        if (PurchaseInvoice != null) {
            Map<String, Object> params = new LinkedHashMap<>();
            params.put("PurchaseInvoice", PurchaseInvoice);
            result = repository.query("from PurchaseInvoicePaymentEntity e where e.PurchaseInvoice = :PurchaseInvoice", params);
        } else {
            result = repository.findAll(actualLimit, actualOffset);
        }
        return result;
    }

    @Get("/count")
    @Documentation("Count PurchaseInvoicePayment")
    public Map<String, Long> count() {
        checkPermissions("read");
        return Map.of("count", repository.count());
    }

    @Post("/count")
    @Documentation("Count PurchaseInvoicePayment with filter")
    public Map<String, Long> countWithFilter(@Body Map<String, Object> filter) {
        checkPermissions("read");
        return Map.of("count", (long) runFilter(filter).size());
    }

    @Post("/search")
    @Documentation("Search PurchaseInvoicePayment")
    public List<PurchaseInvoicePaymentEntity> search(@Body Map<String, Object> filter) {
        checkPermissions("read");
        List<PurchaseInvoicePaymentEntity> result = runFilter(filter);
        return result;
    }

    @Get("/{id}")
    @Documentation("Get PurchaseInvoicePayment by id")
    public PurchaseInvoicePaymentEntity getById(@PathParam("id") Integer id) {
        checkPermissions("read");
        PurchaseInvoicePaymentEntity entity = repository.findOne(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "PurchaseInvoicePayment not found"));
        return entity;
    }

    @Post
    @Documentation("Create PurchaseInvoicePayment")
    public PurchaseInvoicePaymentEntity create(@Body PurchaseInvoicePaymentEntity entity) {
        checkPermissions("write");
        validate(entity);
        return repository.save(entity);
    }

    @Put("/{id}")
    @Documentation("Update PurchaseInvoicePayment by id")
    public PurchaseInvoicePaymentEntity update(@PathParam("id") Integer id, @Body PurchaseInvoicePaymentEntity entity) {
        checkPermissions("write");
        entity.Id = id;
        validate(entity);
        return repository.update(entity);
    }

    @Delete("/{id}")
    @Documentation("Delete PurchaseInvoicePayment by id")
    public void deleteById(@PathParam("id") Integer id) {
        checkPermissions("write");
        if (repository.findOne(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "PurchaseInvoicePayment not found");
        }
        repository.deleteById(id);
    }

    private List<PurchaseInvoicePaymentEntity> runFilter(Map<String, Object> filter) {
        StringBuilder hql = new StringBuilder("from PurchaseInvoicePaymentEntity e");
        Map<String, Object> params = new LinkedHashMap<>();
        boolean first = true;
        if (filter != null && filter.get("equals") instanceof Map<?, ?> equals) {
            for (Map.Entry<?, ?> entry : equals.entrySet()) {
                String field = requireKnownField(String.valueOf(entry.getKey()));
                String paramName = "p" + params.size();
                hql.append(first ? " where e." : " and e.").append(field).append(" = :").append(paramName);
                params.put(paramName, entry.getValue());
                first = false;
            }
        }
        if (filter != null && filter.get("conditions") instanceof List<?> conditions) {
            for (Object raw : conditions) {
                if (!(raw instanceof Map<?, ?> condition)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid filter condition");
                }
                String field = requireKnownField(String.valueOf(condition.get("propertyName")));
                String operator = String.valueOf(condition.get("operator")).toUpperCase(Locale.ROOT);
                Object value = condition.get("value");
                String paramName = "p" + params.size();
                String clause = switch (operator) {
                    case "EQ" -> "e." + field + " = :" + paramName;
                    case "IN" -> {
                        if (!(value instanceof Collection<?>)) {
                            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "IN value must be a list for field: " + field);
                        }
                        yield "e." + field + " in (:" + paramName + ")";
                    }
                    case "LIKE" -> "e." + field + " like :" + paramName;
                    default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported operator: " + operator);
                };
                hql.append(first ? " where " : " and ").append(clause);
                params.put(paramName, value);
                first = false;
            }
        }
        return repository.query(hql.toString(), params);
    }

    private static String requireKnownField(String field) {
        if (!FILTER_FIELDS.contains(field)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown filter field: " + field);
        }
        return field;
    }

    private void checkPermissions(String op) {
        if ("read".equals(op) && !(UserFacade.isInRole("codbex-invoices.purchaseinvoice.PurchaseInvoicePaymentReadOnly") || UserFacade.isInRole("codbex-invoices.purchaseinvoice.PurchaseInvoicePaymentFullAccess"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        if ("write".equals(op) && !UserFacade.isInRole("codbex-invoices.purchaseinvoice.PurchaseInvoicePaymentFullAccess")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    private static void validate(PurchaseInvoicePaymentEntity entity) {
        if (entity.Amount == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Amount' property is required");
        }
        if (entity.CreatedBy != null && entity.CreatedBy.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'CreatedBy' exceeds the maximum length of 20");
        }
        if (entity.UpdatedBy != null && entity.UpdatedBy.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'UpdatedBy' exceeds the maximum length of 20");
        }
    }
}
