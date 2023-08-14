const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");

let dao = daoApi.create({
	table: "CODBEX_SALESINVOICEITEM",
	properties: [
		{
			name: "Id",
			column: "SALESINVOICEITEM_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "SalesInvoiceid",
			column: "SALESINVOICEITEM_SALESINVOICEID",
			type: "INTEGER",
		},
 {
			name: "UoM",
			column: "SALESINVOICEITEM_UOM",
			type: "INTEGER",
		},
 {
			name: "Product",
			column: "SALESINVOICEITEM_PRODUCT",
			type: "INTEGER",
		},
 {
			name: "Quantity",
			column: "SALESINVOICEITEM_QUANTITY",
			type: "VARCHAR",
		},
 {
			name: "Price",
			column: "SALESINVOICEITEM_PRICE",
			type: "VARCHAR",
		},
 {
			name: "Amount",
			column: "SALESINVOICEITEM_AMOUNT",
			type: "VARCHAR",
		},
 {
			name: "Discount",
			column: "SALESINVOICEITEM_DISCOUNT",
			type: "DOUBLE",
		},
 {
			name: "VAT",
			column: "SALESINVOICEITEM_VAT",
			type: "VARCHAR",
		},
 {
			name: "Total",
			column: "SALESINVOICEITEM_TOTAL",
			type: "DOUBLE",
		}
]
});

exports.list = function(settings) {
	return dao.list(settings);
};

exports.get = function(id) {
	return dao.find(id);
};

exports.create = function(entity) {
	let id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_SALESINVOICEITEM",
		key: {
			name: "Id",
			column: "SALESINVOICEITEM_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_SALESINVOICEITEM",
		key: {
			name: "Id",
			column: "SALESINVOICEITEM_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_SALESINVOICEITEM",
		key: {
			name: "Id",
			column: "SALESINVOICEITEM_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_SALESINVOICEITEM"');
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
	producer.queue("codbex-invoices/entities/SalesInvoiceItem/" + operation).send(JSON.stringify(data));
}