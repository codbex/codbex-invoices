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
		$scope.optionsSalesInvoice = params.optionsSalesInvoice;
		$scope.optionsCustomerPayment = params.optionsCustomerPayment;
	}

	$scope.filter = () => {
		let entity = $scope.entity;
		const filter = {
			$filter: {
				equals: {
				},
				notEquals: {
				},
				contains: {
				},
				greaterThan: {
				},
				greaterThanOrEqual: {
				},
				lessThan: {
				},
				lessThanOrEqual: {
				}
			},
		};
		if (entity.Id !== undefined) {
			filter.$filter.equals.Id = entity.Id;
		}
		if (entity.SalesInvoice !== undefined) {
			filter.$filter.equals.SalesInvoice = entity.SalesInvoice;
		}
		if (entity.CustomerPayment !== undefined) {
			filter.$filter.equals.CustomerPayment = entity.CustomerPayment;
		}
		if (entity.Amount !== undefined) {
			filter.$filter.equals.Amount = entity.Amount;
		}
		Dialogs.postMessage({ topic: 'codbex-invoices.salesinvoice.SalesInvoicePayment.entitySearch', data: {
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