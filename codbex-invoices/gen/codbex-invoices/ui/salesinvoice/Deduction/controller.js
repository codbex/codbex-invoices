angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-invoices.salesinvoice.Deduction';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/DeductionService.ts";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', 'Extensions', function ($scope, $http, messageHub, entityApi, Extensions) {

		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataLimit = 20;

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-invoices-custom-action').then(function (response) {
			$scope.pageActions = response.filter(e => e.perspective === "salesinvoice" && e.view === "Deduction" && (e.type === "page" || e.type === undefined));
			$scope.entityActions = response.filter(e => e.perspective === "salesinvoice" && e.view === "Deduction" && e.type === "entity");
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
			$scope.dataLimit = 20;
		}
		resetPagination();

		//-----------------Events-------------------//
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
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			$scope.dataPage = pageNumber;
			entityApi.count(filter).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Deduction", `Unable to count Deduction: '${response.message}'`);
					return;
				}
				if (response.data) {
					$scope.dataCount = response.data;
				}
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				let request;
				if (filter) {
					filter.$offset = offset;
					filter.$limit = limit;
					request = entityApi.search(filter);
				} else {
					request = entityApi.list(offset, limit);
				}
				request.then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("Deduction", `Unable to list/filter Deduction: '${response.message}'`);
						return;
					}
					$scope.data = response.data;
				});
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.showDialogWindow("Deduction-details", {
				action: "select",
				entity: entity,
				optionsDeductionInvoice: $scope.optionsDeductionInvoice,
				optionsAdvanceInvoice: $scope.optionsAdvanceInvoice,
			});
		};

		$scope.openFilter = function (entity) {
			messageHub.showDialogWindow("Deduction-filter", {
				entity: $scope.filterEntity,
				optionsDeductionInvoice: $scope.optionsDeductionInvoice,
				optionsAdvanceInvoice: $scope.optionsAdvanceInvoice,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("Deduction-details", {
				action: "create",
				entity: {},
				optionsDeductionInvoice: $scope.optionsDeductionInvoice,
				optionsAdvanceInvoice: $scope.optionsAdvanceInvoice,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("Deduction-details", {
				action: "update",
				entity: entity,
				optionsDeductionInvoice: $scope.optionsDeductionInvoice,
				optionsAdvanceInvoice: $scope.optionsAdvanceInvoice,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete Deduction?',
				`Are you sure you want to delete Deduction? This action cannot be undone.`,
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
							messageHub.showAlertError("Deduction", `Unable to delete Deduction: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage, $scope.filter);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsDeductionInvoice = [];
		$scope.optionsAdvanceInvoice = [];


		$http.get("/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/SalesInvoiceService.ts").then(function (response) {
			$scope.optionsDeductionInvoice = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Number
				}
			});
		});

		$http.get("/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/SalesInvoiceService.ts").then(function (response) {
			$scope.optionsAdvanceInvoice = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Number
				}
			});
		});

		$scope.optionsDeductionInvoiceValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsDeductionInvoice.length; i++) {
				if ($scope.optionsDeductionInvoice[i].value === optionKey) {
					return $scope.optionsDeductionInvoice[i].text;
				}
			}
			return null;
		};
		$scope.optionsAdvanceInvoiceValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsAdvanceInvoice.length; i++) {
				if ($scope.optionsAdvanceInvoice[i].value === optionKey) {
					return $scope.optionsAdvanceInvoice[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
