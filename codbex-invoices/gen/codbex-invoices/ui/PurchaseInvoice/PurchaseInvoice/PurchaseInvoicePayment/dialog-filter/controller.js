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
		if (entity.PurchaseInvoice !== undefined) {
			const condition = { propertyName: 'PurchaseInvoice', operator: 'EQ', value: entity.PurchaseInvoice };
			filter.$filter.conditions.push(condition);
		}
		if (entity.SupplierPayment !== undefined) {
			const condition = { propertyName: 'SupplierPayment', operator: 'EQ', value: entity.SupplierPayment };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Amount !== undefined) {
			const condition = { propertyName: 'Amount', operator: 'EQ', value: entity.Amount };
			filter.$filter.conditions.push(condition);
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