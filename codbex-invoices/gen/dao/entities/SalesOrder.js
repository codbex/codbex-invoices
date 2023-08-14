const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");
const EntityUtils = require("codbex-invoices/gen/dao/utils/EntityUtils");

let dao = daoApi.create({
	table: "CODBEX_SALESORDER",
	properties: [
		{
			name: "Id",
			column: "SALESORDER_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Number",
			column: "ORDER_NUMBER",
			type: "VARCHAR",
		},
 {
			name: "Date",
			column: "ORDER_DATE",
			type: "DATE",
		},
 {
			name: "Conditions",
			column: "ORDER_CONDITIONS",
			type: "VARCHAR",
		},
 {
			name: "Operator",
			column: "ORDER_OPERATOR",
			type: "INTEGER",
		},
 {
			name: "Supplier",
			column: "ORDER_BUYER",
			type: "INTEGER",
		},
 {
			name: "Currency",
			column: "ORDER_CURRENCY",
			type: "VARCHAR",
		},
 {
			name: "Amount",
			column: "ORDER_AMOUNT",
			type: "DOUBLE",
		},
 {
			name: "Discount",
			column: "ORDER_DISCOUNT",
			type: "DOUBLE",
		},
 {
			name: "VAT",
			column: "ORDER_VAT",
			type: "DOUBLE",
		},
 {
			name: "Total",
			column: "ORDER_TOTAL",
			type: "DOUBLE",
		},
 {
			name: "ReferenceNumber",
			column: "ORDER_REFERENCENUMBER",
			type: "VARCHAR",
		},
 {
			name: "PurchaseInvoice",
			column: "PurchaseInvoice",
			type: "VARCHAR",
		},
 {
			name: "Status",
			column: "SALESORDER_STATUS",
			type: "INTEGER",
		}
]
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setDate(e, "Date");
		return e;
	});
};

exports.get = function(id) {
	let entity = dao.find(id);
	EntityUtils.setDate(entity, "Date");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setLocalDate(entity, "Date");
	let id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_SALESORDER",
		key: {
			name: "Id",
			column: "SALESORDER_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	// EntityUtils.setLocalDate(entity, "Date");
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_SALESORDER",
		key: {
			name: "Id",
			column: "SALESORDER_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_SALESORDER",
		key: {
			name: "Id",
			column: "SALESORDER_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_SALESORDER"');
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
	producer.queue("codbex-invoices/entities/SalesOrder/" + operation).send(JSON.stringify(data));
}