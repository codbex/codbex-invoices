package gen.codbex_invoices.api.settings;

import gen.codbex_invoices.data.settings.PurchaseInvoiceStatusEntity;
import gen.codbex_invoices.data.settings.PurchaseInvoiceStatusRepository;

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
@Documentation("codbex-invoices - PurchaseInvoiceStatus Controller")
public class PurchaseInvoiceStatusController {

    private static final Set<String> FILTER_FIELDS = Set.of("Id", "Name");

    @Inject
    private PurchaseInvoiceStatusRepository repository;

    @Get
    @Documentation("List PurchaseInvoiceStatus")
    public List<PurchaseInvoiceStatusEntity> getAll(@QueryParam("$limit") Integer limit,
                                      @QueryParam("$offset") Integer offset) {
        checkPermissions("read");
        int actualLimit = limit != null ? limit.intValue() : 20;
        int actualOffset = offset != null ? offset.intValue() : 0;
        List<PurchaseInvoiceStatusEntity> result = repository.findAll(actualLimit, actualOffset);
        return result;
    }

    @Get("/count")
    @Documentation("Count PurchaseInvoiceStatus")
    public Map<String, Long> count() {
        checkPermissions("read");
        return Map.of("count", repository.count());
    }

    @Post("/count")
    @Documentation("Count PurchaseInvoiceStatus with filter")
    public Map<String, Long> countWithFilter(@Body Map<String, Object> filter) {
        checkPermissions("read");
        return Map.of("count", (long) runFilter(filter).size());
    }

    @Post("/search")
    @Documentation("Search PurchaseInvoiceStatus")
    public List<PurchaseInvoiceStatusEntity> search(@Body Map<String, Object> filter) {
        checkPermissions("read");
        List<PurchaseInvoiceStatusEntity> result = runFilter(filter);
        return result;
    }

    @Get("/{id}")
    @Documentation("Get PurchaseInvoiceStatus by id")
    public PurchaseInvoiceStatusEntity getById(@PathParam("id") Integer id) {
        checkPermissions("read");
        PurchaseInvoiceStatusEntity entity = repository.findOne(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "PurchaseInvoiceStatus not found"));
        return entity;
    }

    @Post
    @Documentation("Create PurchaseInvoiceStatus")
    public PurchaseInvoiceStatusEntity create(@Body PurchaseInvoiceStatusEntity entity) {
        checkPermissions("write");
        validate(entity);
        return repository.save(entity);
    }

    @Put("/{id}")
    @Documentation("Update PurchaseInvoiceStatus by id")
    public PurchaseInvoiceStatusEntity update(@PathParam("id") Integer id, @Body PurchaseInvoiceStatusEntity entity) {
        checkPermissions("write");
        entity.Id = id;
        validate(entity);
        return repository.update(entity);
    }

    @Delete("/{id}")
    @Documentation("Delete PurchaseInvoiceStatus by id")
    public void deleteById(@PathParam("id") Integer id) {
        checkPermissions("write");
        if (repository.findOne(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "PurchaseInvoiceStatus not found");
        }
        repository.deleteById(id);
    }

    private List<PurchaseInvoiceStatusEntity> runFilter(Map<String, Object> filter) {
        StringBuilder hql = new StringBuilder("from PurchaseInvoiceStatusEntity e");
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
        if ("read".equals(op) && !(UserFacade.isInRole("codbex-invoices.settings.PurchaseInvoiceStatusReadOnly") || UserFacade.isInRole("codbex-invoices.settings.PurchaseInvoiceStatusFullAccess"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        if ("write".equals(op) && !UserFacade.isInRole("codbex-invoices.settings.PurchaseInvoiceStatusFullAccess")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    private static void validate(PurchaseInvoiceStatusEntity entity) {
        if (entity.Name == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Name' property is required");
        }
        if (entity.Name != null && entity.Name.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Name' exceeds the maximum length of 20");
        }
    }
}
