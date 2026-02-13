angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		if (params?.entity?.DateFrom) {
			params.entity.DateFrom = new Date(params.entity.DateFrom);
		}
		if (params?.entity?.DateTo) {
			params.entity.DateTo = new Date(params.entity.DateTo);
		}
		if (params?.entity?.DueFrom) {
			params.entity.DueFrom = new Date(params.entity.DueFrom);
		}
		if (params?.entity?.DueTo) {
			params.entity.DueTo = new Date(params.entity.DueTo);
		}
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		$scope.optionsType = params.optionsType;
		$scope.optionsSupplier = params.optionsSupplier;
		$scope.optionsCurrency = params.optionsCurrency;
		$scope.optionsPaymentMethod = params.optionsPaymentMethod;
		$scope.optionsSentMethod = params.optionsSentMethod;
		$scope.optionsStatus = params.optionsStatus;
		$scope.optionsOperator = params.optionsOperator;
		$scope.optionsCompany = params.optionsCompany;
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
		if (entity.Number) {
			const condition = { propertyName: 'Number', operator: 'LIKE', value: `%${entity.Number}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.OriginalNumber) {
			const condition = { propertyName: 'OriginalNumber', operator: 'LIKE', value: `%${entity.OriginalNumber}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Type !== undefined) {
			const condition = { propertyName: 'Type', operator: 'EQ', value: entity.Type };
			filter.$filter.conditions.push(condition);
		}
		if (entity.DateFrom) {
			const condition = { propertyName: 'Date', operator: 'GE', value: entity.DateFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.DateTo) {
			const condition = { propertyName: 'Date', operator: 'LE', value: entity.DateTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.DueFrom) {
			const condition = { propertyName: 'Due', operator: 'GE', value: entity.DueFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.DueTo) {
			const condition = { propertyName: 'Due', operator: 'LE', value: entity.DueTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Supplier !== undefined) {
			const condition = { propertyName: 'Supplier', operator: 'EQ', value: entity.Supplier };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Net !== undefined) {
			const condition = { propertyName: 'Net', operator: 'EQ', value: entity.Net };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Currency !== undefined) {
			const condition = { propertyName: 'Currency', operator: 'EQ', value: entity.Currency };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Gross !== undefined) {
			const condition = { propertyName: 'Gross', operator: 'EQ', value: entity.Gross };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Discount !== undefined) {
			const condition = { propertyName: 'Discount', operator: 'EQ', value: entity.Discount };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Taxes !== undefined) {
			const condition = { propertyName: 'Taxes', operator: 'EQ', value: entity.Taxes };
			filter.$filter.conditions.push(condition);
		}
		if (entity.VAT !== undefined) {
			const condition = { propertyName: 'VAT', operator: 'EQ', value: entity.VAT };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Total !== undefined) {
			const condition = { propertyName: 'Total', operator: 'EQ', value: entity.Total };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Paid !== undefined) {
			const condition = { propertyName: 'Paid', operator: 'EQ', value: entity.Paid };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Conditions) {
			const condition = { propertyName: 'Conditions', operator: 'LIKE', value: `%${entity.Conditions}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.PaymentMethod !== undefined) {
			const condition = { propertyName: 'PaymentMethod', operator: 'EQ', value: entity.PaymentMethod };
			filter.$filter.conditions.push(condition);
		}
		if (entity.SentMethod !== undefined) {
			const condition = { propertyName: 'SentMethod', operator: 'EQ', value: entity.SentMethod };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Status !== undefined) {
			const condition = { propertyName: 'Status', operator: 'EQ', value: entity.Status };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Operator !== undefined) {
			const condition = { propertyName: 'Operator', operator: 'EQ', value: entity.Operator };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Document) {
			const condition = { propertyName: 'Document', operator: 'LIKE', value: `%${entity.Document}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Company !== undefined) {
			const condition = { propertyName: 'Company', operator: 'EQ', value: entity.Company };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Name) {
			const condition = { propertyName: 'Name', operator: 'LIKE', value: `%${entity.Name}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UUID) {
			const condition = { propertyName: 'UUID', operator: 'LIKE', value: `%${entity.UUID}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Process) {
			const condition = { propertyName: 'Process', operator: 'LIKE', value: `%${entity.Process}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Reference) {
			const condition = { propertyName: 'Reference', operator: 'LIKE', value: `%${entity.Reference}%` };
			filter.$filter.conditions.push(condition);
		}
		Dialogs.postMessage({ topic: 'codbex-invoices.PurchaseInvoice.PurchaseInvoice.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		Dialogs.triggerEvent('codbex-invoices.PurchaseInvoice.PurchaseInvoice.clearDetails');
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'PurchaseInvoice-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});