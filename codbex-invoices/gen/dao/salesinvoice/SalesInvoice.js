const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");
const EntityUtils = require("codbex-invoices/gen/dao/utils/EntityUtils");

let dao = daoApi.create({
	table: "CODBEX_SALESINVOICE",
	properties: [
		{
			name: "Id",
			column: "SALESINVOICE_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Name",
			column: "SALESINVOICE_NAME",
			type: "VARCHAR",
			required: true
		},
 {
			name: "Number",
			column: "SALESINVOICE_NUMBER",
			type: "VARCHAR",
		},
 {
			name: "Date",
			column: "SALESINVOICE_DATE",
			type: "DATE",
		},
 {
			name: "Customer",
			column: "SALESINVOICE_CUSTOMERID",
			type: "INTEGER",
		},
 {
			name: "Due",
			column: "SALESINVOICE_DUE",
			type: "DATE",
		},
 {
			name: "Conditions",
			column: "SALESINVOICE_CONDITIONS",
			type: "VARCHAR",
		},
 {
			name: "Currency",
			column: "SALESINVOICE_CURRENCY",
			type: "VARCHAR",
		},
 {
			name: "Amount",
			column: "SALESINVOICE_AMOUNT",
			type: "DOUBLE",
		},
 {
			name: "Discount",
			column: "SALESINVOICE_DISCOUNT",
			type: "DOUBLE",
		},
 {
			name: "VAT",
			column: "SALESINVOICE_VAT",
			type: "DOUBLE",
		},
 {
			name: "Total",
			column: "SALESINVOICE_TOTAL",
			type: "DOUBLE",
		},
 {
			name: "Status",
			column: "SALESINVOICE_STATUS",
			type: "INTEGER",
		},
 {
			name: "SalesOrder",
			column: "SALESINVOICE_SALESORDERID",
			type: "INTEGER",
		},
 {
			name: "Operator",
			column: "SALESINVOICE_OPERATOR",
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
		table: "CODBEX_SALESINVOICE",
		key: {
			name: "Id",
			column: "SALESINVOICE_ID",
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
		table: "CODBEX_SALESINVOICE",
		key: {
			name: "Id",
			column: "SALESINVOICE_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_SALESINVOICE",
		key: {
			name: "Id",
			column: "SALESINVOICE_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_SALESINVOICE"');
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
	producer.queue("codbex-invoices/salesinvoice/SalesInvoice/" + operation).send(JSON.stringify(data));
}