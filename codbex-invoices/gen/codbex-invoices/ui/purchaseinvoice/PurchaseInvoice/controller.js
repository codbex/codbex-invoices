angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-invoices.purchaseinvoice.PurchaseInvoice';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-invoices/gen/codbex-invoices/api/purchaseinvoice/PurchaseInvoiceService.ts";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', 'Extensions', function ($scope, $http, messageHub, entityApi, Extensions) {

		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataOffset = 0;
		$scope.dataLimit = 10;
		$scope.action = "select";

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-invoices-custom-action').then(function (response) {
			$scope.pageActions = response.filter(e => e.perspective === "purchaseinvoice" && e.view === "PurchaseInvoice" && (e.type === "page" || e.type === undefined));
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
		//-----------------Custom Actions-------------------//

		function refreshData() {
			$scope.dataReset = true;
			$scope.dataPage--;
		}

		function resetPagination() {
			$scope.dataReset = true;
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.selectedEntity = null;
				$scope.action = "select";
			});
		});

		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			refreshData();
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
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {};
			}
			$scope.selectedEntity = null;
			entityApi.count(filter).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("PurchaseInvoice", `Unable to count PurchaseInvoice: '${response.message}'`);
					return;
				}
				if (response.data) {
					$scope.dataCount = response.data;
				}
				$scope.dataPages = Math.ceil($scope.dataCount / $scope.dataLimit);
				filter.$offset = ($scope.dataPage - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				if ($scope.dataReset) {
					filter.$offset = 0;
					filter.$limit = $scope.dataPage * $scope.dataLimit;
				}

				entityApi.search(filter).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("PurchaseInvoice", `Unable to list/filter PurchaseInvoice: '${response.message}'`);
						return;
					}
					if ($scope.data == null || $scope.dataReset) {
						$scope.data = [];
						$scope.dataReset = false;
					}

					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
						if (e.Due) {
							e.Due = new Date(e.Due);
						}
					});

					$scope.data = $scope.data.concat(response.data);
					$scope.dataPage++;
				});
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.postMessage("entitySelected", {
				entity: entity,
				selectedMainEntityId: entity.Id,
				optionsType: $scope.optionsType,
				optionsSupplier: $scope.optionsSupplier,
				optionsCurrency: $scope.optionsCurrency,
				optionsPaymentMethod: $scope.optionsPaymentMethod,
				optionsSentMethod: $scope.optionsSentMethod,
				optionsStatus: $scope.optionsStatus,
				optionsOperator: $scope.optionsOperator,
				optionsCompany: $scope.optionsCompany,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			$scope.action = "create";

			messageHub.postMessage("createEntity", {
				entity: {},
				optionsType: $scope.optionsType,
				optionsSupplier: $scope.optionsSupplier,
				optionsCurrency: $scope.optionsCurrency,
				optionsPaymentMethod: $scope.optionsPaymentMethod,
				optionsSentMethod: $scope.optionsSentMethod,
				optionsStatus: $scope.optionsStatus,
				optionsOperator: $scope.optionsOperator,
				optionsCompany: $scope.optionsCompany,
			});
		};

		$scope.updateEntity = function () {
			$scope.action = "update";
			messageHub.postMessage("updateEntity", {
				entity: $scope.selectedEntity,
				optionsType: $scope.optionsType,
				optionsSupplier: $scope.optionsSupplier,
				optionsCurrency: $scope.optionsCurrency,
				optionsPaymentMethod: $scope.optionsPaymentMethod,
				optionsSentMethod: $scope.optionsSentMethod,
				optionsStatus: $scope.optionsStatus,
				optionsOperator: $scope.optionsOperator,
				optionsCompany: $scope.optionsCompany,
			});
		};

		$scope.deleteEntity = function () {
			let id = $scope.selectedEntity.Id;
			messageHub.showDialogAsync(
				'Delete PurchaseInvoice?',
				`Are you sure you want to delete PurchaseInvoice? This action cannot be undone.`,
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
							messageHub.showAlertError("PurchaseInvoice", `Unable to delete PurchaseInvoice: '${response.message}'`);
							return;
						}
						refreshData();
						$scope.loadPage($scope.dataPage, $scope.filter);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		$scope.openFilter = function (entity) {
			messageHub.showDialogWindow("PurchaseInvoice-filter", {
				entity: $scope.filterEntity,
				optionsType: $scope.optionsType,
				optionsSupplier: $scope.optionsSupplier,
				optionsCurrency: $scope.optionsCurrency,
				optionsPaymentMethod: $scope.optionsPaymentMethod,
				optionsSentMethod: $scope.optionsSentMethod,
				optionsStatus: $scope.optionsStatus,
				optionsOperator: $scope.optionsOperator,
				optionsCompany: $scope.optionsCompany,
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsType = [];
		$scope.optionsSupplier = [];
		$scope.optionsCurrency = [];
		$scope.optionsPaymentMethod = [];
		$scope.optionsSentMethod = [];
		$scope.optionsStatus = [];
		$scope.optionsOperator = [];
		$scope.optionsCompany = [];


		$http.get("/services/ts/codbex-invoices/gen/codbex-invoices/api/settings/PurchaseInvoiceTypeService.ts").then(function (response) {
			$scope.optionsType = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierService.ts").then(function (response) {
			$scope.optionsSupplier = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts").then(function (response) {
			$scope.optionsCurrency = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Code
				}
			});
		});

		$http.get("/services/ts/codbex-methods/gen/codbex-methods/api/PaymentMethod/PaymentMethodService.ts").then(function (response) {
			$scope.optionsPaymentMethod = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-methods/gen/codbex-methods/api/SentMethod/SentMethodService.ts").then(function (response) {
			$scope.optionsSentMethod = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-invoices/gen/codbex-invoices/api/settings/PurchaseInvoiceStatusService.ts").then(function (response) {
			$scope.optionsStatus = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts").then(function (response) {
			$scope.optionsOperator = response.data.map(e => {
				return {
					value: e.Id,
					text: e.FirstName
				}
			});
		});

		$http.get("/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts").then(function (response) {
			$scope.optionsCompany = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$scope.optionsTypeValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsType.length; i++) {
				if ($scope.optionsType[i].value === optionKey) {
					return $scope.optionsType[i].text;
				}
			}
			return null;
		};
		$scope.optionsSupplierValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsSupplier.length; i++) {
				if ($scope.optionsSupplier[i].value === optionKey) {
					return $scope.optionsSupplier[i].text;
				}
			}
			return null;
		};
		$scope.optionsCurrencyValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsCurrency.length; i++) {
				if ($scope.optionsCurrency[i].value === optionKey) {
					return $scope.optionsCurrency[i].text;
				}
			}
			return null;
		};
		$scope.optionsPaymentMethodValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsPaymentMethod.length; i++) {
				if ($scope.optionsPaymentMethod[i].value === optionKey) {
					return $scope.optionsPaymentMethod[i].text;
				}
			}
			return null;
		};
		$scope.optionsSentMethodValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsSentMethod.length; i++) {
				if ($scope.optionsSentMethod[i].value === optionKey) {
					return $scope.optionsSentMethod[i].text;
				}
			}
			return null;
		};
		$scope.optionsStatusValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsStatus.length; i++) {
				if ($scope.optionsStatus[i].value === optionKey) {
					return $scope.optionsStatus[i].text;
				}
			}
			return null;
		};
		$scope.optionsOperatorValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsOperator.length; i++) {
				if ($scope.optionsOperator[i].value === optionKey) {
					return $scope.optionsOperator[i].text;
				}
			}
			return null;
		};
		$scope.optionsCompanyValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsCompany.length; i++) {
				if ($scope.optionsCompany[i].value === optionKey) {
					return $scope.optionsCompany[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
