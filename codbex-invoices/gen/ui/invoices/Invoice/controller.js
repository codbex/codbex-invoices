angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-invoices.invoices.Invoice';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-invoices/gen/api/invoices/Invoice.js";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', function ($scope, $http, messageHub, entityApi) {

		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataOffset = 0;
		$scope.dataLimit = 10;
		$scope.action = "select";

		function refreshData() {
			$scope.dataReset = true;
			$scope.dataPage--;
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
			$scope.loadPage();
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			refreshData();
			$scope.loadPage();
		});
		//-----------------Events-------------------//

		$scope.loadPage = function () {
			$scope.selectedEntity = null;
			entityApi.count().then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Invoice", `Unable to count Invoice: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				$scope.dataPages = Math.ceil($scope.dataCount / $scope.dataLimit);
				let offset = ($scope.dataPage - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				if ($scope.dataReset) {
					offset = 0;
					limit = $scope.dataPage * $scope.dataLimit;
				}
				entityApi.list(offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("Invoice", `Unable to list Invoice: '${response.message}'`);
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
		$scope.loadPage($scope.dataPage);

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.postMessage("entitySelected", {
				entity: entity,
				selectedMainEntityId: entity.Id,
				optionsOperator: $scope.optionsOperator,
				optionsBuyer: $scope.optionsBuyer,
				optionsSeller: $scope.optionsSeller,
				optionsType: $scope.optionsType,
				optionsCurrency: $scope.optionsCurrency,
				optionsOrder: $scope.optionsOrder,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			$scope.action = "create";

			messageHub.postMessage("createEntity", {
				entity: {},
				optionsOperator: $scope.optionsOperator,
				optionsBuyer: $scope.optionsBuyer,
				optionsSeller: $scope.optionsSeller,
				optionsType: $scope.optionsType,
				optionsCurrency: $scope.optionsCurrency,
				optionsOrder: $scope.optionsOrder,
			});
		};

		$scope.updateEntity = function () {
			$scope.action = "update";
			messageHub.postMessage("updateEntity", {
				entity: $scope.selectedEntity,
				optionsOperator: $scope.optionsOperator,
				optionsBuyer: $scope.optionsBuyer,
				optionsSeller: $scope.optionsSeller,
				optionsType: $scope.optionsType,
				optionsCurrency: $scope.optionsCurrency,
				optionsOrder: $scope.optionsOrder,
			});
		};

		$scope.deleteEntity = function () {
			let id = $scope.selectedEntity.Id;
			messageHub.showDialogAsync(
				'Delete Invoice?',
				`Are you sure you want to delete Invoice? This action cannot be undone.`,
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
							messageHub.showAlertError("Invoice", `Unable to delete Invoice: '${response.message}'`);
							return;
						}
						refreshData();
						$scope.loadPage($scope.dataPage);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsOperator = [];
		$scope.optionsBuyer = [];
		$scope.optionsSeller = [];
		$scope.optionsType = [];
		$scope.optionsCurrency = [];
		$scope.optionsOrder = [];

		$http.get("/services/js/codbex-invoices/gen/api/entities/Employee.js").then(function (response) {
			$scope.optionsOperator = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-invoices/gen/api/entities/Partner.js").then(function (response) {
			$scope.optionsBuyer = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-invoices/gen/api/entities/Partner.js").then(function (response) {
			$scope.optionsSeller = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-invoices/gen/api/settings/InvoiceType.js").then(function (response) {
			$scope.optionsType = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-invoices/gen/api/entities/Currency.js").then(function (response) {
			$scope.optionsCurrency = response.data.map(e => {
				return {
					value: e.Code,
					text: e.Code
				}
			});
		});

		$http.get("/services/js/codbex-invoices/gen/api/entities/Order.js").then(function (response) {
			$scope.optionsOrder = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Number
				}
			});
		});
		$scope.optionsOperatorValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsOperator.length; i++) {
				if ($scope.optionsOperator[i].value === optionKey) {
					return $scope.optionsOperator[i].text;
				}
			}
			return null;
		};
		$scope.optionsBuyerValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsBuyer.length; i++) {
				if ($scope.optionsBuyer[i].value === optionKey) {
					return $scope.optionsBuyer[i].text;
				}
			}
			return null;
		};
		$scope.optionsSellerValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsSeller.length; i++) {
				if ($scope.optionsSeller[i].value === optionKey) {
					return $scope.optionsSeller[i].text;
				}
			}
			return null;
		};
		$scope.optionsTypeValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsType.length; i++) {
				if ($scope.optionsType[i].value === optionKey) {
					return $scope.optionsType[i].text;
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
		$scope.optionsOrderValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsOrder.length; i++) {
				if ($scope.optionsOrder[i].value === optionKey) {
					return $scope.optionsOrder[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
