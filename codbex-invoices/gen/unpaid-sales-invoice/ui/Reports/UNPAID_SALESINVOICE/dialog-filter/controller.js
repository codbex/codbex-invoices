angular.module('page', ['blimpKit', 'platformView']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
	}

	$scope.filter = () => {
		let entity = $scope.entity;
		const filter = {

		};
		Dialogs.postMessage({ topic: 'codbex-invoices.Reports.UNPAID_SALESINVOICE.entitySearch', data: {
			entity: entity,
			filter: filter
		} });
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'UNPAID_SALESINVOICE-Report-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});