const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");

let dao = daoApi.create({
	table: "CODBEX_PURCHASEINVOICEITEM",
	properties: [
		{
			name: "Id",
			column: "PURCHASEINVOICEITEM_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "PurchaseInvoice",
			column: "PURCHASEINVOICEITEM_PURCHASEINVOICE",
			type: "INTEGER",
		},
 {
			name: "UoM",
			column: "PURCHASEINVOICEITEM_UOM",
			type: "INTEGER",
		},
 {
			name: "Product",
			column: "PURCHASEINVOICEITEM_PRODUCT",
			type: "INTEGER",
		},
 {
			name: "Quantity",
			column: "PURCHASEINVOICEITEM_QUANTITY",
			type: "DOUBLE",
		},
 {
			name: "Price",
			column: "PURCHASEINVOICEITEM_PRICE",
			type: "DOUBLE",
		},
 {
			name: "Amount",
			column: "PURCHASEINVOICEITEM_AMOUNT",
			type: "DOUBLE",
		},
 {
			name: "Discount",
			column: "PURCHASEINVOICEITEM_DISCOUNT",
			type: "DOUBLE",
		},
 {
			name: "VAT",
			column: "PURCHASEINVOICEITEM_VAT",
			type: "DOUBLE",
		},
 {
			name: "Total",
			column: "PURCHASEINVOICEITEM_TOTAL",
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
		table: "CODBEX_PURCHASEINVOICEITEM",
		key: {
			name: "Id",
			column: "PURCHASEINVOICEITEM_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_PURCHASEINVOICEITEM",
		key: {
			name: "Id",
			column: "PURCHASEINVOICEITEM_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_PURCHASEINVOICEITEM",
		key: {
			name: "Id",
			column: "PURCHASEINVOICEITEM_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PURCHASEINVOICEITEM"');
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
	producer.queue("codbex-invoices/entities/PurchaseInvoiceItem/" + operation).send(JSON.stringify(data));
}