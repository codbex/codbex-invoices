angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-invoices.purchaseinvoice.PurchaseInvoiceItem';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-invoices/gen/api/purchaseinvoice/PurchaseInvoiceItemService.ts";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'entityApi', function ($scope, messageHub, entityApi) {

		$scope.entity = {};
		$scope.formErrors = {};

		if (window != null && window.frameElement != null && window.frameElement.hasAttribute("data-parameters")) {
			let dataParameters = window.frameElement.getAttribute("data-parameters");
			if (dataParameters) {
				let params = JSON.parse(dataParameters);
				$scope.entity = params.entity ?? {};
				$scope.selectedMainEntityKey = params.selectedMainEntityKey;
				$scope.selectedMainEntityId = params.selectedMainEntityId;
				$scope.optionsPurchaseInvoice = params.optionsPurchaseInvoice;
				$scope.optionsProduct = params.optionsProduct;
				$scope.optionsUoM = params.optionsUoM;
			}
		}

		$scope.isValid = function (isValid, property) {
			$scope.formErrors[property] = !isValid ? true : undefined;
			for (let next in $scope.formErrors) {
				if ($scope.formErrors[next] === true) {
					$scope.isFormValid = false;
					return;
				}
			}
			$scope.isFormValid = true;
		};

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
			if (entity.PurchaseInvoice) {
				filter.$filter.equals.PurchaseInvoice = entity.PurchaseInvoice;
			}
			if (entity.Name) {
				filter.$filter.contains.Name = entity.Name;
			}
			if (entity.Product) {
				filter.$filter.equals.Product = entity.Product;
			}
			if (entity.Quantity) {
				filter.$filter.equals.Quantity = entity.Quantity;
			}
			if (entity.UoM) {
				filter.$filter.equals.UoM = entity.UoM;
			}
			if (entity.Price) {
				filter.$filter.equals.Price = entity.Price;
			}
			if (entity.Net) {
				filter.$filter.equals.Net = entity.Net;
			}
			if (entity.VAT) {
				filter.$filter.equals.VAT = entity.VAT;
			}
			if (entity.Gross) {
				filter.$filter.equals.Gross = entity.Gross;
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
			messageHub.closeDialogWindow("PurchaseInvoiceItem-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);