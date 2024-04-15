angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-invoices.purchaseinvoice.PurchaseInvoice';
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', function ($scope, messageHub, ViewParameters) {

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
			$scope.optionsSupplier = params.optionsSupplier;
			$scope.optionsCurrency = params.optionsCurrency;
			$scope.optionsPaymentMethod = params.optionsPaymentMethod;
			$scope.optionsSentMethod = params.optionsSentMethod;
			$scope.optionsPurchaseInvoiceStatus = params.optionsPurchaseInvoiceStatus;
			$scope.optionsOperator = params.optionsOperator;
			$scope.optionsCompany = params.optionsCompany;
		}

		$scope.filter = function () {
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
			if (entity.Id) {
				filter.$filter.equals.Id = entity.Id;
			}
			if (entity.Number) {
				filter.$filter.contains.Number = entity.Number;
			}
			if (entity.OriginalNumber) {
				filter.$filter.contains.OriginalNumber = entity.OriginalNumber;
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
			if (entity.Supplier) {
				filter.$filter.equals.Supplier = entity.Supplier;
			}
			if (entity.Net) {
				filter.$filter.equals.Net = entity.Net;
			}
			if (entity.Currency) {
				filter.$filter.equals.Currency = entity.Currency;
			}
			if (entity.Gross) {
				filter.$filter.equals.Gross = entity.Gross;
			}
			if (entity.Discount) {
				filter.$filter.equals.Discount = entity.Discount;
			}
			if (entity.Taxes) {
				filter.$filter.equals.Taxes = entity.Taxes;
			}
			if (entity.VAT) {
				filter.$filter.equals.VAT = entity.VAT;
			}
			if (entity.Total) {
				filter.$filter.equals.Total = entity.Total;
			}
			if (entity.Paid) {
				filter.$filter.equals.Paid = entity.Paid;
			}
			if (entity.Conditions) {
				filter.$filter.contains.Conditions = entity.Conditions;
			}
			if (entity.PaymentMethod) {
				filter.$filter.equals.PaymentMethod = entity.PaymentMethod;
			}
			if (entity.SentMethod) {
				filter.$filter.equals.SentMethod = entity.SentMethod;
			}
			if (entity.PurchaseInvoiceStatus) {
				filter.$filter.equals.PurchaseInvoiceStatus = entity.PurchaseInvoiceStatus;
			}
			if (entity.Operator) {
				filter.$filter.equals.Operator = entity.Operator;
			}
			if (entity.Document) {
				filter.$filter.contains.Document = entity.Document;
			}
			if (entity.Company) {
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
			messageHub.postMessage("entitySearch", {
				entity: entity,
				filter: filter
			});
			messageHub.postMessage("clearDetails");
			$scope.cancel();
		};

		$scope.resetFilter = function () {
			$scope.entity = {};
			$scope.filter();
		};

		$scope.cancel = function () {
			messageHub.closeDialogWindow("PurchaseInvoice-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);