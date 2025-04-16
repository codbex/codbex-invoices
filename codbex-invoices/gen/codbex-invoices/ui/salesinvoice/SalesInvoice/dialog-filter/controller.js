angular.module('page', ['blimpKit', 'platformView']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		if (params?.entity?.DateFrom) {
			params.entity.DateFrom = new Date(params.entity.DateFrom);
		}
		if (params?.entity?.DateTo) {
			params.entity.DateTo = new Date(params.entity.DateTo);
		}
		if (params?.entity?.DueFrom) {
			params.entity.DueFrom = new Date(params.entity.DueFrom);
		}
		if (params?.entity?.DueTo) {
			params.entity.DueTo = new Date(params.entity.DueTo);
		}
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		$scope.optionsType = params.optionsType;
		$scope.optionsCustomer = params.optionsCustomer;
		$scope.optionsCurrency = params.optionsCurrency;
		$scope.optionsPaymentMethod = params.optionsPaymentMethod;
		$scope.optionsSentMethod = params.optionsSentMethod;
		$scope.optionsStatus = params.optionsStatus;
		$scope.optionsOperator = params.optionsOperator;
		$scope.optionsCompany = params.optionsCompany;
	}

	$scope.filter = () => {
		let entity = $scope.entity;
		const filter = {
			$filter: {
				equals: {
				},
				notEquals: {
				},
				contains: {
				},
				greaterThan: {
				},
				greaterThanOrEqual: {
				},
				lessThan: {
				},
				lessThanOrEqual: {
				}
			},
		};
		if (entity.Id !== undefined) {
			filter.$filter.equals.Id = entity.Id;
		}
		if (entity.Number) {
			filter.$filter.contains.Number = entity.Number;
		}
		if (entity.Type !== undefined) {
			filter.$filter.equals.Type = entity.Type;
		}
		if (entity.Customer !== undefined) {
			filter.$filter.equals.Customer = entity.Customer;
		}
		if (entity.DateFrom) {
			filter.$filter.greaterThanOrEqual.Date = entity.DateFrom;
		}
		if (entity.DateTo) {
			filter.$filter.lessThanOrEqual.Date = entity.DateTo;
		}
		if (entity.DueFrom) {
			filter.$filter.greaterThanOrEqual.Due = entity.DueFrom;
		}
		if (entity.DueTo) {
			filter.$filter.lessThanOrEqual.Due = entity.DueTo;
		}
		if (entity.Net !== undefined) {
			filter.$filter.equals.Net = entity.Net;
		}
		if (entity.Currency !== undefined) {
			filter.$filter.equals.Currency = entity.Currency;
		}
		if (entity.Gross !== undefined) {
			filter.$filter.equals.Gross = entity.Gross;
		}
		if (entity.Discount !== undefined) {
			filter.$filter.equals.Discount = entity.Discount;
		}
		if (entity.Taxes !== undefined) {
			filter.$filter.equals.Taxes = entity.Taxes;
		}
		if (entity.VAT !== undefined) {
			filter.$filter.equals.VAT = entity.VAT;
		}
		if (entity.Total !== undefined) {
			filter.$filter.equals.Total = entity.Total;
		}
		if (entity.Paid !== undefined) {
			filter.$filter.equals.Paid = entity.Paid;
		}
		if (entity.Conditions) {
			filter.$filter.contains.Conditions = entity.Conditions;
		}
		if (entity.PaymentMethod !== undefined) {
			filter.$filter.equals.PaymentMethod = entity.PaymentMethod;
		}
		if (entity.SentMethod !== undefined) {
			filter.$filter.equals.SentMethod = entity.SentMethod;
		}
		if (entity.Status !== undefined) {
			filter.$filter.equals.Status = entity.Status;
		}
		if (entity.Operator !== undefined) {
			filter.$filter.equals.Operator = entity.Operator;
		}
		if (entity.Document) {
			filter.$filter.contains.Document = entity.Document;
		}
		if (entity.Company !== undefined) {
			filter.$filter.equals.Company = entity.Company;
		}
		if (entity.Name) {
			filter.$filter.contains.Name = entity.Name;
		}
		if (entity.UUID) {
			filter.$filter.contains.UUID = entity.UUID;
		}
		if (entity.Reference) {
			filter.$filter.contains.Reference = entity.Reference;
		}
		Dialogs.postMessage({ topic: 'codbex-invoices.salesinvoice.SalesInvoice.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		Dialogs.triggerEvent('codbex-invoices.salesinvoice.SalesInvoice.clearDetails');
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'SalesInvoice-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});