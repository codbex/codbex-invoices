angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-invoices.settings.Deduction';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-invoices/gen/codbex-invoices/api/settings/DeductionService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'Extensions', 'messageHub', 'entityApi', function ($scope,  $http, Extensions, messageHub, entityApi) {

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

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-invoices-custom-action').then(function (response) {
			$scope.entityActions = response.filter(e => e.perspective === "settings" && e.view === "Deduction" && e.type === "entity");
		});

		$scope.triggerEntityAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{
					id: $scope.entity.Id
				},
				null,
				true,
				action
			);
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsDeductionInvoice = [];
				$scope.optionsAdvanceInvoice = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				$scope.entity = msg.data.entity;
				$scope.optionsDeductionInvoice = msg.data.optionsDeductionInvoice;
				$scope.optionsAdvanceInvoice = msg.data.optionsAdvanceInvoice;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsDeductionInvoice = msg.data.optionsDeductionInvoice;
				$scope.optionsAdvanceInvoice = msg.data.optionsAdvanceInvoice;
				$scope.action = 'create';
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = msg.data.entity;
				$scope.optionsDeductionInvoice = msg.data.optionsDeductionInvoice;
				$scope.optionsAdvanceInvoice = msg.data.optionsAdvanceInvoice;
				$scope.action = 'update';
			});
		});

		$scope.serviceDeductionInvoice = "/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/SalesInvoiceService.ts";
		$scope.serviceAdvanceInvoice = "/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/SalesInvoiceService.ts";

		//-----------------Events-------------------//

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("Deduction", `Unable to create Deduction: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Deduction", "Deduction successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Deduction", `Unable to update Deduction: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Deduction", "Deduction successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};
		
		//-----------------Dialogs-------------------//
		
		$scope.createDeductionInvoice = function () {
			messageHub.showDialogWindow("SalesInvoice-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createAdvanceInvoice = function () {
			messageHub.showDialogWindow("SalesInvoice-details", {
				action: "create",
				entity: {},
			}, null, false);
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshDeductionInvoice = function () {
			$scope.optionsDeductionInvoice = [];
			$http.get("/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/SalesInvoiceService.ts").then(function (response) {
				$scope.optionsDeductionInvoice = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Number
					}
				});
			});
		};
		$scope.refreshAdvanceInvoice = function () {
			$scope.optionsAdvanceInvoice = [];
			$http.get("/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/SalesInvoiceService.ts").then(function (response) {
				$scope.optionsAdvanceInvoice = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Number
					}
				});
			});
		};

		//----------------Dropdowns-----------------//	
		

	}]);