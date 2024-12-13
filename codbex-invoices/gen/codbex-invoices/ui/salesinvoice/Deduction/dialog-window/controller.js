angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-invoices.salesinvoice.Deduction';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/DeductionService.ts";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', 'entityApi', function ($scope, messageHub, ViewParameters, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "Deduction Details",
			create: "Create Deduction",
			update: "Update Deduction"
		};
		$scope.action = 'select';

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsDeductionInvoice = params.optionsDeductionInvoice;
			$scope.optionsAdvanceInvoice = params.optionsAdvanceInvoice;
		}

		$scope.create = function () {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.create(entity).then(function (response) {
				if (response.status != 201) {
					$scope.errorMessage = `Unable to create Deduction: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("Deduction", "Deduction successfully created");
			});
		};

		$scope.update = function () {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.update(id, entity).then(function (response) {
				if (response.status != 200) {
					$scope.errorMessage = `Unable to update Deduction: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("Deduction", "Deduction successfully updated");
			});
		};

		$scope.serviceDeductionInvoice = "/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/SalesInvoiceService.ts";
		$scope.serviceAdvanceInvoice = "/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/SalesInvoiceService.ts";

		$scope.cancel = function () {
			$scope.entity = {};
			$scope.action = 'select';
			messageHub.closeDialogWindow("Deduction-details");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);