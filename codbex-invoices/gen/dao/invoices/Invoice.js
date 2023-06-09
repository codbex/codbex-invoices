const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");
const EntityUtils = require("codbex-invoices/gen/dao/utils/EntityUtils");

let dao = daoApi.create({
	table: "CODBEX_INVOICE",
	properties: [
		{
			name: "Id",
			column: "INVOICE_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Number",
			column: "INVOICE_NUMBER",
			type: "VARCHAR",
		},
 {
			name: "Date",
			column: "INVOICE_DATE",
			type: "DATE",
		},
 {
			name: "Due",
			column: "INVOICE_DUE",
			type: "DATE",
		},
 {
			name: "Conditions",
			column: "INVOICE_CONDITIONS",
			type: "VARCHAR",
		},
 {
			name: "Operator",
			column: "INVOICE_OPERATOR",
			type: "INTEGER",
		},
 {
			name: "Buyer",
			column: "INVOICE_BUYER",
			type: "INTEGER",
		},
 {
			name: "Seller",
			column: "INVOICE_SELLER",
			type: "INTEGER",
		},
 {
			name: "Type",
			column: "INVOICE_TYPE",
			type: "INTEGER",
		},
 {
			name: "Currency",
			column: "INVOICE_CURRENCY",
			type: "VARCHAR",
		},
 {
			name: "Amount",
			column: "INVOICE_AMOUNT",
			type: "DOUBLE",
		},
 {
			name: "Discount",
			column: "INVOICE_DISCOUNT",
			type: "DOUBLE",
		},
 {
			name: "VAT",
			column: "INVOICE_VAT",
			type: "DOUBLE",
		},
 {
			name: "Total",
			column: "INVOICE_TOTAL",
			type: "DOUBLE",
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
		table: "CODBEX_INVOICE",
		key: {
			name: "Id",
			column: "INVOICE_ID",
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
		table: "CODBEX_INVOICE",
		key: {
			name: "Id",
			column: "INVOICE_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_INVOICE",
		key: {
			name: "Id",
			column: "INVOICE_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_INVOICE"');
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
	producer.queue("codbex-invoices/invoices/Invoice/" + operation).send(JSON.stringify(data));
}