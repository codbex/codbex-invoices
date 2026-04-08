angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		if (params?.entity?.CreatedAtFrom) {
			params.entity.CreatedAtFrom = new Date(params.entity.CreatedAtFrom);
		}
		if (params?.entity?.CreatedAtTo) {
			params.entity.CreatedAtTo = new Date(params.entity.CreatedAtTo);
		}
		if (params?.entity?.UpdatedAtFrom) {
			params.entity.UpdatedAtFrom = new Date(params.entity.UpdatedAtFrom);
		}
		if (params?.entity?.UpdatedAtTo) {
			params.entity.UpdatedAtTo = new Date(params.entity.UpdatedAtTo);
		}
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
		if (entity.CreatedAtFrom) {
			const condition = { propertyName: 'CreatedAt', operator: 'GE', value: entity.CreatedAtFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CreatedAtTo) {
			const condition = { propertyName: 'CreatedAt', operator: 'LE', value: entity.CreatedAtTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CreatedBy) {
			const condition = { propertyName: 'CreatedBy', operator: 'LIKE', value: `%${entity.CreatedBy}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UpdatedAtFrom) {
			const condition = { propertyName: 'UpdatedAt', operator: 'GE', value: entity.UpdatedAtFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UpdatedAtTo) {
			const condition = { propertyName: 'UpdatedAt', operator: 'LE', value: entity.UpdatedAtTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UpdatedBy) {
			const condition = { propertyName: 'UpdatedBy', operator: 'LIKE', value: `%${entity.UpdatedBy}%` };
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