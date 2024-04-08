angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-invoices.purchaseinvoice.PurchaseInvoicePayment';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-invoices/gen/api/purchaseinvoice/PurchaseInvoicePaymentService.ts";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', 'Extensions', function ($scope, $http, messageHub, entityApi, Extensions) {
		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-invoices-custom-action').then(function (response) {
			$scope.pageActions = response.filter(e => e.perspective === "purchaseinvoice" && e.view === "PurchaseInvoicePayment" && (e.type === "page" || e.type === undefined));
			$scope.entityActions = response.filter(e => e.perspective === "purchaseinvoice" && e.view === "PurchaseInvoicePayment" && e.type === "entity");
		});

		$scope.triggerPageAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{},
				null,
				true,
				action
			);
		};

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

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("codbex-invoices.purchaseinvoice.PurchaseInvoice.entitySelected", function (msg) {
			resetPagination();
			$scope.selectedMainEntityId = msg.data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}, true);

		messageHub.onDidReceiveMessage("codbex-invoices.purchaseinvoice.PurchaseInvoice.clearDetails", function (msg) {
			$scope.$apply(function () {
				resetPagination();
				$scope.selectedMainEntityId = null;
				$scope.data = null;
			});
		}, true);

		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entitySearch", function (msg) {
			resetPagination();
			$scope.filter = msg.data.filter;
			$scope.filterEntity = msg.data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber, filter) {
			let PurchaseInvoice = $scope.selectedMainEntityId;
			$scope.dataPage = pageNumber;
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {};
			}
			if (!filter.$filter) {
				filter.$filter = {};
			}
			if (!filter.$filter.equals) {
				filter.$filter.equals = {};
			}
			filter.$filter.equals.PurchaseInvoice = PurchaseInvoice;
			entityApi.count(filter).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("PurchaseInvoicePayment", `Unable to count PurchaseInvoicePayment: '${response.message}'`);
					return;
				}
				if (response.data) {
					$scope.dataCount = response.data;
				}
				filter.$offset = (pageNumber - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				entityApi.search(filter).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("PurchaseInvoicePayment", `Unable to list/filter PurchaseInvoicePayment: '${response.message}'`);
						return;
					}
					$scope.data = response.data;
				});
			});
		};

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.showDialogWindow("PurchaseInvoicePayment-details", {
				action: "select",
				entity: entity,
				optionsPurchaseInvoice: $scope.optionsPurchaseInvoice,
				optionsSupplierPayment: $scope.optionsSupplierPayment,
			});
		};

		$scope.openFilter = function (entity) {
			messageHub.showDialogWindow("PurchaseInvoicePayment-filter", {
				entity: $scope.filterEntity,
				optionsPurchaseInvoice: $scope.optionsPurchaseInvoice,
				optionsSupplierPayment: $scope.optionsSupplierPayment,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("PurchaseInvoicePayment-details", {
				action: "create",
				entity: {},
				selectedMainEntityKey: "PurchaseInvoice",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsPurchaseInvoice: $scope.optionsPurchaseInvoice,
				optionsSupplierPayment: $scope.optionsSupplierPayment,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("PurchaseInvoicePayment-details", {
				action: "update",
				entity: entity,
				selectedMainEntityKey: "PurchaseInvoice",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsPurchaseInvoice: $scope.optionsPurchaseInvoice,
				optionsSupplierPayment: $scope.optionsSupplierPayment,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete PurchaseInvoicePayment?',
				`Are you sure you want to delete PurchaseInvoicePayment? This action cannot be undone.`,
				[{
					id: "delete-btn-yes",
					type: "emphasized",
					label: "Yes",
				},
				{
					id: "delete-btn-no",
					type: "normal",
					label: "No",
				}],
			).then(function (msg) {
				if (msg.data === "delete-btn-yes") {
					entityApi.delete(id).then(function (response) {
						if (response.status != 204) {
							messageHub.showAlertError("PurchaseInvoicePayment", `Unable to delete PurchaseInvoicePayment: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage, $scope.filter);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsPurchaseInvoice = [];
		$scope.optionsSupplierPayment = [];


		$http.get("/services/ts/codbex-invoices/gen/api/purchaseinvoice/PurchaseInvoiceService.ts").then(function (response) {
			$scope.optionsPurchaseInvoice = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-payments/gen/api/SupplierPayment/SupplierPaymentService.ts").then(function (response) {
			$scope.optionsSupplierPayment = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$scope.optionsPurchaseInvoiceValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsPurchaseInvoice.length; i++) {
				if ($scope.optionsPurchaseInvoice[i].value === optionKey) {
					return $scope.optionsPurchaseInvoice[i].text;
				}
			}
			return null;
		};
		$scope.optionsSupplierPaymentValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsSupplierPayment.length; i++) {
				if ($scope.optionsSupplierPayment[i].value === optionKey) {
					return $scope.optionsSupplierPayment[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
