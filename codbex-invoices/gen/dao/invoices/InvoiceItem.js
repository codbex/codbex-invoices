const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");

let dao = daoApi.create({
	table: "CODBEX_INVOICEITEM",
	properties: [
		{
			name: "Id",
			column: "INVOICEITEM_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Invoice",
			column: "INVOICEITEM_INVOICEID",
			type: "INTEGER",
		},
 {
			name: "Product",
			column: "INVOICEITEM_PRODUCT",
			type: "INTEGER",
		},
 {
			name: "UoM",
			column: "INVOICEITEM_UOM",
			type: "INTEGER",
		},
 {
			name: "Quantity",
			column: "INVOICEITEM_QUANTITY",
			type: "DOUBLE",
		},
 {
			name: "Price",
			column: "INVOICEITEM_PRICE",
			type: "DOUBLE",
		},
 {
			name: "Amount",
			column: "INVOICEITEM_AMOUNT",
			type: "DOUBLE",
		},
 {
			name: "Discount",
			column: "INVOICEITEM_DISCOUNT",
			type: "DOUBLE",
		},
 {
			name: "VAT",
			column: "INVOICEITEM_VAT",
			type: "DOUBLE",
		},
 {
			name: "Total",
			column: "INVOICEITEM_TOTAL",
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
		table: "CODBEX_INVOICEITEM",
		key: {
			name: "Id",
			column: "INVOICEITEM_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_INVOICEITEM",
		key: {
			name: "Id",
			column: "INVOICEITEM_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_INVOICEITEM",
		key: {
			name: "Id",
			column: "INVOICEITEM_ID",
			value: id
		}
	});
};

exports.count = function () {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_INVOICEITEM" WHERE  = ?', []);
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_INVOICEITEM"');
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
	producer.queue("codbex-invoices/invoices/InvoiceItem/" + operation).send(JSON.stringify(data));
}