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
		$scope.optionsPurchaseInvoice = params.optionsPurchaseInvoice;
		$scope.optionsSupplierPayment = params.optionsSupplierPayment;
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
		if (entity.PurchaseInvoice !== undefined) {
			filter.$filter.equals.PurchaseInvoice = entity.PurchaseInvoice;
		}
		if (entity.SupplierPayment !== undefined) {
			filter.$filter.equals.SupplierPayment = entity.SupplierPayment;
		}
		if (entity.Amount !== undefined) {
			filter.$filter.equals.Amount = entity.Amount;
		}
		Dialogs.postMessage({ topic: 'codbex-invoices.PurchaseInvoice.PurchaseInvoicePayment.entitySearch', data: {
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
		Dialogs.closeWindow({ id: 'PurchaseInvoicePayment-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});