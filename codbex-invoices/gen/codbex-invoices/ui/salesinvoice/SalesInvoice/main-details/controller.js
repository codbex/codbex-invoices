angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-invoices.salesinvoice.SalesInvoice';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/SalesInvoiceService.ts";
	}])
	.controller('PageController', ['$scope', 'Extensions', 'messageHub', 'entityApi', function ($scope, Extensions, messageHub, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "SalesInvoice Details",
			create: "Create SalesInvoice",
			update: "Update SalesInvoice"
		};
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-invoices-custom-action').then(function (response) {
			$scope.entityActions = response.filter(e => e.perspective === "salesinvoice" && e.view === "SalesInvoice" && e.type === "entity");
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
				$scope.optionsSalesInvoiceType = [];
				$scope.optionsCustomer = [];
				$scope.optionsCurrency = [];
				$scope.optionsPaymentMethod = [];
				$scope.optionsSentMethod = [];
				$scope.optionsSalesInvoiceStatus = [];
				$scope.optionsOperator = [];
				$scope.optionsCompany = [];
				$scope.optionsStore = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				if (msg.data.entity.Due) {
					msg.data.entity.Due = new Date(msg.data.entity.Due);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsSalesInvoiceType = msg.data.optionsSalesInvoiceType;
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsPaymentMethod = msg.data.optionsPaymentMethod;
				$scope.optionsSentMethod = msg.data.optionsSentMethod;
				$scope.optionsSalesInvoiceStatus = msg.data.optionsSalesInvoiceStatus;
				$scope.optionsOperator = msg.data.optionsOperator;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.optionsStore = msg.data.optionsStore;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsSalesInvoiceType = msg.data.optionsSalesInvoiceType;
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsPaymentMethod = msg.data.optionsPaymentMethod;
				$scope.optionsSentMethod = msg.data.optionsSentMethod;
				$scope.optionsSalesInvoiceStatus = msg.data.optionsSalesInvoiceStatus;
				$scope.optionsOperator = msg.data.optionsOperator;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.optionsStore = msg.data.optionsStore;
				$scope.action = 'create';
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				if (msg.data.entity.Due) {
					msg.data.entity.Due = new Date(msg.data.entity.Due);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsSalesInvoiceType = msg.data.optionsSalesInvoiceType;
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsPaymentMethod = msg.data.optionsPaymentMethod;
				$scope.optionsSentMethod = msg.data.optionsSentMethod;
				$scope.optionsSalesInvoiceStatus = msg.data.optionsSalesInvoiceStatus;
				$scope.optionsOperator = msg.data.optionsOperator;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.optionsStore = msg.data.optionsStore;
				$scope.action = 'update';
			});
		});
		//-----------------Events-------------------//

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("SalesInvoice", `Unable to create SalesInvoice: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("SalesInvoice", "SalesInvoice successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("SalesInvoice", `Unable to update SalesInvoice: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("SalesInvoice", "SalesInvoice successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};

	}]);