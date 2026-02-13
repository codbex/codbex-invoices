angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
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
		$scope.optionsAdvanceInvoice = params.optionsAdvanceInvoice;
	}

	$scope.filter = () => {
		let entity = $scope.entity;
		const filter = {
			$filter: {
				conditions: [],
				sorts: [],
				limit: 20,
				offset: 0
			}
		};
		if (entity.Id !== undefined) {
			const condition = { propertyName: 'Id', operator: 'EQ', value: entity.Id };
			filter.$filter.conditions.push(condition);
		}
		if (entity.DeductionInvoice !== undefined) {
			const condition = { propertyName: 'DeductionInvoice', operator: 'EQ', value: entity.DeductionInvoice };
			filter.$filter.conditions.push(condition);
		}
		if (entity.AdvanceInvoice !== undefined) {
			const condition = { propertyName: 'AdvanceInvoice', operator: 'EQ', value: entity.AdvanceInvoice };
			filter.$filter.conditions.push(condition);
		}
		Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.Deduction.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'Deduction-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});