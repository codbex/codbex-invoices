angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-invoices.purchaseinvoice.PurchaseInvoice';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-invoices/gen/codbex-invoices/api/purchaseinvoice/PurchaseInvoiceService.ts";
	}])
	.controller('PageController', ['$scope', 'Extensions', 'messageHub', 'entityApi', function ($scope, Extensions, messageHub, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "PurchaseInvoice Details",
			create: "Create PurchaseInvoice",
			update: "Update PurchaseInvoice"
		};
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-invoices-custom-action').then(function (response) {
			$scope.entityActions = response.filter(e => e.perspective === "purchaseinvoice" && e.view === "PurchaseInvoice" && e.type === "entity");
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
				$scope.optionsPurchaseInvoiceType = [];
				$scope.optionsSupplier = [];
				$scope.optionsCurrency = [];
				$scope.optionsPaymentMethod = [];
				$scope.optionsSentMethod = [];
				$scope.optionsStatus = [];
				$scope.optionsOperator = [];
				$scope.optionsCompany = [];
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
				$scope.optionsPurchaseInvoiceType = msg.data.optionsPurchaseInvoiceType;
				$scope.optionsSupplier = msg.data.optionsSupplier;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsPaymentMethod = msg.data.optionsPaymentMethod;
				$scope.optionsSentMethod = msg.data.optionsSentMethod;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.optionsOperator = msg.data.optionsOperator;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsPurchaseInvoiceType = msg.data.optionsPurchaseInvoiceType;
				$scope.optionsSupplier = msg.data.optionsSupplier;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsPaymentMethod = msg.data.optionsPaymentMethod;
				$scope.optionsSentMethod = msg.data.optionsSentMethod;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.optionsOperator = msg.data.optionsOperator;
				$scope.optionsCompany = msg.data.optionsCompany;
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
				$scope.optionsPurchaseInvoiceType = msg.data.optionsPurchaseInvoiceType;
				$scope.optionsSupplier = msg.data.optionsSupplier;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsPaymentMethod = msg.data.optionsPaymentMethod;
				$scope.optionsSentMethod = msg.data.optionsSentMethod;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.optionsOperator = msg.data.optionsOperator;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.action = 'update';
			});
		});

		$scope.servicePurchaseInvoiceType = "/services/ts/codbex-invoices/gen/codbex-invoices/api/settings/PurchaseInvoiceTypeService.ts";
		$scope.serviceSupplier = "/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierService.ts";
		$scope.serviceCurrency = "/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts";
		$scope.servicePaymentMethod = "/services/ts/codbex-methods/gen/codbex-methods/api/Methods/PaymentMethodService.ts";
		$scope.serviceSentMethod = "/services/ts/codbex-methods/gen/codbex-methods/api/Methods/SentMethodService.ts";
		$scope.serviceStatus = "/services/ts/codbex-invoices/gen/codbex-invoices/api/settings/PurchaseInvoiceStatusService.ts";
		$scope.serviceOperator = "/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts";
		$scope.serviceCompany = "/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts";

		//-----------------Events-------------------//

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("PurchaseInvoice", `Unable to create PurchaseInvoice: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("PurchaseInvoice", "PurchaseInvoice successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("PurchaseInvoice", `Unable to update PurchaseInvoice: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("PurchaseInvoice", "PurchaseInvoice successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};

	}]);