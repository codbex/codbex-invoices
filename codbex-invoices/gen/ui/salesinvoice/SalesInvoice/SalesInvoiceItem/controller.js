angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-invoices.salesinvoice.SalesInvoiceItem';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-invoices/gen/api/salesinvoice/SalesInvoiceItemService.ts";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', function ($scope, $http, messageHub, entityApi) {

		//-----------------Custom Actions-------------------//
		$http.get("/services/js/resources-core/services/custom-actions.js?extensionPoint=codbex-invoices-custom-action").then(function (response) {
			$scope.pageActions = response.data.filter(e => e.perspective === "salesinvoice" && e.view === "SalesInvoiceItem" && (e.type === "page" || e.type === undefined));
			$scope.entityActions = response.data.filter(e => e.perspective === "salesinvoice" && e.view === "SalesInvoiceItem" && e.type === "entity");
		});

		$scope.triggerPageAction = function (actionId) {
			for (const next of $scope.pageActions) {
				if (next.id === actionId) {
					messageHub.showDialogWindow("codbex-invoices-custom-action", {
						src: next.link,
					});
					break;
				}
			}
		};

		$scope.triggerEntityAction = function (actionId, selectedEntity) {
			for (const next of $scope.entityActions) {
				if (next.id === actionId) {
					messageHub.showDialogWindow("codbex-invoices-custom-action", {
						src: `${next.link}?id=${selectedEntity.Id}`,
					});
					break;
				}
			}
		};
		//-----------------Custom Actions-------------------//

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("codbex-invoices.salesinvoice.SalesInvoice.entitySelected", function (msg) {
			resetPagination();
			$scope.selectedMainEntityId = msg.data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}, true);

		messageHub.onDidReceiveMessage("codbex-invoices.salesinvoice.SalesInvoice.clearDetails", function (msg) {
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
			$scope.loadPage($scope.dataPage);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber) {
			let SalesInvoice = $scope.selectedMainEntityId;
			$scope.dataPage = pageNumber;
			entityApi.count(SalesInvoice).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("SalesInvoiceItem", `Unable to count SalesInvoiceItem: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let query = `SalesInvoice=${SalesInvoice}`;
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				entityApi.filter(query, offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("SalesInvoiceItem", `Unable to list SalesInvoiceItem: '${response.message}'`);
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
			messageHub.showDialogWindow("SalesInvoiceItem-details", {
				action: "select",
				entity: entity,
				optionsSalesInvoice: $scope.optionsSalesInvoice,
				optionsProduct: $scope.optionsProduct,
				optionsUoM: $scope.optionsUoM,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("SalesInvoiceItem-details", {
				action: "create",
				entity: {},
				selectedMainEntityKey: "SalesInvoice",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsSalesInvoice: $scope.optionsSalesInvoice,
				optionsProduct: $scope.optionsProduct,
				optionsUoM: $scope.optionsUoM,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("SalesInvoiceItem-details", {
				action: "update",
				entity: entity,
				selectedMainEntityKey: "SalesInvoice",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsSalesInvoice: $scope.optionsSalesInvoice,
				optionsProduct: $scope.optionsProduct,
				optionsUoM: $scope.optionsUoM,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete SalesInvoiceItem?',
				`Are you sure you want to delete SalesInvoiceItem? This action cannot be undone.`,
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
							messageHub.showAlertError("SalesInvoiceItem", `Unable to delete SalesInvoiceItem: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsSalesInvoice = [];
		$scope.optionsProduct = [];
		$scope.optionsUoM = [];


		$http.get("/services/ts/codbex-invoices/gen/api/salesinvoice/SalesInvoiceService.ts").then(function (response) {
			$scope.optionsSalesInvoice = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Number
				}
			});
		});

		$http.get("/services/ts/codbex-products/gen/api/Products/ProductService.ts").then(function (response) {
			$scope.optionsProduct = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-uoms/gen/api/UnitsOfMeasures/UoMService.ts").then(function (response) {
			$scope.optionsUoM = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$scope.optionsSalesInvoiceValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsSalesInvoice.length; i++) {
				if ($scope.optionsSalesInvoice[i].value === optionKey) {
					return $scope.optionsSalesInvoice[i].text;
				}
			}
			return null;
		};
		$scope.optionsProductValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsProduct.length; i++) {
				if ($scope.optionsProduct[i].value === optionKey) {
					return $scope.optionsProduct[i].text;
				}
			}
			return null;
		};
		$scope.optionsUoMValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsUoM.length; i++) {
				if ($scope.optionsUoM[i].value === optionKey) {
					return $scope.optionsUoM[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
