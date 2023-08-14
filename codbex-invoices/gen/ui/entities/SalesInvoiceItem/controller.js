angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-invoices.entities.SalesInvoiceItem';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-invoices/gen/api/entities/SalesInvoiceItem.js";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', function ($scope, $http, messageHub, entityApi) {

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 20;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber) {
			$scope.dataPage = pageNumber;
			entityApi.count().then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("SalesInvoiceItem", `Unable to count SalesInvoiceItem: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				entityApi.list(offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("SalesInvoiceItem", `Unable to list SalesInvoiceItem: '${response.message}'`);
						return;
					}
					$scope.data = response.data;
				});
			});
		};
		$scope.loadPage($scope.dataPage);

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
				optionsSalesInvoiceid: $scope.optionsSalesInvoiceid,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("SalesInvoiceItem-details", {
				action: "update",
				entity: entity,
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

		$http.get("/services/js/codbex-invoices/gen/api/sales invoice/SalesInvoice.js").then(function (response) {
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
