angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-invoices.salesinvoice.SalesInvoiceItem';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-invoices/gen/api/salesinvoice/SalesInvoiceItem.js";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', function ($scope, $http, messageHub, entityApi) {

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
			let SalesInvoiceid = $scope.selectedMainEntityId;
			$scope.dataPage = pageNumber;
			entityApi.count(SalesInvoiceid).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("SalesInvoiceItem", `Unable to count SalesInvoiceItem: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let query = `SalesInvoiceid=${SalesInvoiceid}`;
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
				optionsSalesInvoiceid: $scope.optionsSalesInvoiceid,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("SalesInvoiceItem-details", {
				action: "create",
				entity: {},
				selectedMainEntityKey: "SalesInvoiceid",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsSalesInvoiceid: $scope.optionsSalesInvoiceid,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("SalesInvoiceItem-details", {
				action: "update",
				entity: entity,
				selectedMainEntityKey: "SalesInvoiceid",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsSalesInvoiceid: $scope.optionsSalesInvoiceid,
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
		$scope.optionsSalesInvoiceid = [];

		$http.get("/services/js/codbex-invoices/gen/api/salesinvoice/SalesInvoice.js").then(function (response) {
			$scope.optionsSalesInvoiceid = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Number
				}
			});
		});
		$scope.optionsSalesInvoiceidValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsSalesInvoiceid.length; i++) {
				if ($scope.optionsSalesInvoiceid[i].value === optionKey) {
					return $scope.optionsSalesInvoiceid[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
