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
		$scope.optionsUoM = params.optionsUoM;
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
		if (entity.Name) {
			const condition = { propertyName: 'Name', operator: 'LIKE', value: `%${entity.Name}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Quantity !== undefined) {
			const condition = { propertyName: 'Quantity', operator: 'EQ', value: entity.Quantity };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UoM !== undefined) {
			const condition = { propertyName: 'UoM', operator: 'EQ', value: entity.UoM };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Price !== undefined) {
			const condition = { propertyName: 'Price', operator: 'EQ', value: entity.Price };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Net !== undefined) {
			const condition = { propertyName: 'Net', operator: 'EQ', value: entity.Net };
			filter.$filter.conditions.push(condition);
		}
		if (entity.VATRate !== undefined) {
			const condition = { propertyName: 'VATRate', operator: 'EQ', value: entity.VATRate };
			filter.$filter.conditions.push(condition);
		}
		if (entity.VAT !== undefined) {
			const condition = { propertyName: 'VAT', operator: 'EQ', value: entity.VAT };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Gross !== undefined) {
			const condition = { propertyName: 'Gross', operator: 'EQ', value: entity.Gross };
			filter.$filter.conditions.push(condition);
		}
		Dialogs.postMessage({ topic: 'codbex-invoices.PurchaseInvoice.PurchaseInvoiceItem.entitySearch', data: {
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
		Dialogs.closeWindow({ id: 'PurchaseInvoiceItem-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});