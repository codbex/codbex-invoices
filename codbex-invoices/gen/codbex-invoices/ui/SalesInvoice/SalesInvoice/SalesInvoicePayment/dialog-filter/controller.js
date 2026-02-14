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
		$scope.optionsSalesInvoice = params.optionsSalesInvoice;
		$scope.optionsCustomerPayment = params.optionsCustomerPayment;
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
		if (entity.SalesInvoice !== undefined) {
			const condition = { propertyName: 'SalesInvoice', operator: 'EQ', value: entity.SalesInvoice };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CustomerPayment !== undefined) {
			const condition = { propertyName: 'CustomerPayment', operator: 'EQ', value: entity.CustomerPayment };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Amount !== undefined) {
			const condition = { propertyName: 'Amount', operator: 'EQ', value: entity.Amount };
			filter.$filter.conditions.push(condition);
		}
		Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.SalesInvoicePayment.entitySearch', data: {
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
		Dialogs.closeWindow({ id: 'SalesInvoicePayment-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});