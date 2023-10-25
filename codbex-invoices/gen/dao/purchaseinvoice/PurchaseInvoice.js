const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");
const EntityUtils = require("codbex-invoices/gen/dao/utils/EntityUtils");

let dao = daoApi.create({
	table: "CODBEX_PURCHASEINVOICE",
	properties: [
		{
			name: "Id",
			column: "PURCHASEINVOICE_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Name",
			column: "PURCHASEINVOICE_NAME",
			type: "VARCHAR",
			required: true
		},
 {
			name: "Number",
			column: "PURCHASEINVOICE_NUMBER",
			type: "VARCHAR",
		},
 {
			name: "Date",
			column: "PURCHASEINVOICE_DATE",
			type: "DATE",
		},
 {
			name: "Supplier",
			column: "PURCHASEINVOICE_SUPPLIER",
			type: "INTEGER",
		},
 {
			name: "Due",
			column: "PURCHASEINVOICE_DUE",
			type: "DATE",
		},
 {
			name: "Conditions",
			column: "PURCHASEINVOICE_CONDITIONS",
			type: "VARCHAR",
		},
 {
			name: "Currency",
			column: "PURCHASEINVOICE_CURRENCY",
			type: "VARCHAR",
		},
 {
			name: "Amount",
			column: "PURCHASEINVOICE_AMOUNT",
			type: "DOUBLE",
		},
 {
			name: "Discount",
			column: "PURCHASEINVOICE_DISCOUNT",
			type: "DOUBLE",
		},
 {
			name: "VAT",
			column: "PURCHASEINVOICE_VAT",
			type: "DOUBLE",
		},
 {
			name: "Total",
			column: "PURCHASEINVOICE_TOTAL",
			type: "DOUBLE",
		},
 {
			name: "Status",
			column: "PURCHASEINVOICE_STATUS",
			type: "INTEGER",
		},
 {
			name: "PurchaseOrder",
			column: "PURCHASEINVOICE_PURCHASEORDER",
			type: "INTEGER",
		},
 {
			name: "Operator",
			column: "PURCHASEINVOICE_OPERATOR",
			type: "INTEGER",
		}
]
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setDate(e, "Date");
		EntityUtils.setDate(e, "Due");
		return e;
	});
};

exports.get = function(id) {
	let entity = dao.find(id);
	EntityUtils.setDate(entity, "Date");
	EntityUtils.setDate(entity, "Due");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setLocalDate(entity, "Date");
	EntityUtils.setLocalDate(entity, "Due");
	let id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_PURCHASEINVOICE",
		key: {
			name: "Id",
			column: "PURCHASEINVOICE_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	// EntityUtils.setLocalDate(entity, "Date");
	// EntityUtils.setLocalDate(entity, "Due");
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_PURCHASEINVOICE",
		key: {
			name: "Id",
			column: "PURCHASEINVOICE_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_PURCHASEINVOICE",
		key: {
			name: "Id",
			column: "PURCHASEINVOICE_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PURCHASEINVOICE"');
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

function triggerEvent(operation, data) {
	producer.queue("codbex-invoices/purchaseinvoice/PurchaseInvoice/" + operation).send(JSON.stringify(data));
}