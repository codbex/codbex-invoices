angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-invoices.salesinvoice.SalesInvoicePayment';
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', function ($scope, messageHub, ViewParameters) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.entity = params.entity ?? {};
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsSalesInvoice = params.optionsSalesInvoice;
			$scope.optionsCustomerPayment = params.optionsCustomerPayment;
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
			if (entity.Id !== undefined) {
				filter.$filter.equals.Id = entity.Id;
			}
			if (entity.SalesInvoice !== undefined) {
				filter.$filter.equals.SalesInvoice = entity.SalesInvoice;
			}
			if (entity.CustomerPayment !== undefined) {
				filter.$filter.equals.CustomerPayment = entity.CustomerPayment;
			}
			if (entity.Amount !== undefined) {
				filter.$filter.equals.Amount = entity.Amount;
			}
			messageHub.postMessage("entitySearch", {
				entity: entity,
				filter: filter
			});
			$scope.cancel();
		};

		$scope.resetFilter = function () {
			$scope.entity = {};
			$scope.filter();
		};

		$scope.cancel = function () {
			messageHub.closeDialogWindow("SalesInvoicePayment-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);