angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-invoices.salesinvoice.SalesInvoicePayment';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/SalesInvoicePaymentService.ts";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', 'entityApi', function ($scope, messageHub, ViewParameters, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "SalesInvoicePayment Details",
			create: "Create SalesInvoicePayment",
			update: "Update SalesInvoicePayment"
		};
		$scope.action = 'select';

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsSalesInvoice = params.optionsSalesInvoice;
			$scope.optionsCustomerPayment = params.optionsCustomerPayment;
		}

		$scope.create = function () {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.create(entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("SalesInvoicePayment", `Unable to create SalesInvoicePayment: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("SalesInvoicePayment", "SalesInvoicePayment successfully created");
			});
		};

		$scope.update = function () {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.update(id, entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("SalesInvoicePayment", `Unable to update SalesInvoicePayment: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("SalesInvoicePayment", "SalesInvoicePayment successfully updated");
			});
		};

		$scope.serviceSalesInvoice = "/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/SalesInvoiceService.ts";
		$scope.serviceCustomerPayment = "/services/ts/codbex-payments/gen/codbex-payments/api/CustomerPayment/CustomerPaymentService.ts";

		$scope.cancel = function () {
			$scope.entity = {};
			$scope.action = 'select';
			messageHub.closeDialogWindow("SalesInvoicePayment-details");
		};

	}]);