angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, $http, ViewParameters) => {
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
		const optionsPurchaseInvoiceMap = new Map();
		params.optionsPurchaseInvoice.forEach(e => optionsPurchaseInvoiceMap.set(e.value, e));
		$scope.optionsPurchaseInvoice = Array.from(optionsPurchaseInvoiceMap.values());
		const optionsSupplierPaymentMap = new Map();
		params.optionsSupplierPayment.forEach(e => optionsSupplierPaymentMap.set(e.value, e));
		$scope.optionsSupplierPayment = Array.from(optionsSupplierPaymentMap.values());
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
		lastSearchValuesPurchaseInvoice.clear();
		allValuesPurchaseInvoice.length = 0;
		lastSearchValuesSupplierPayment.clear();
		allValuesSupplierPayment.length = 0;
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'PurchaseInvoicePayment-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};

	const lastSearchValuesPurchaseInvoice = new Set();
	const allValuesPurchaseInvoice = [];
	let loadMoreOptionsPurchaseInvoiceCounter = 0;
	$scope.optionsPurchaseInvoiceLoading = false;
	$scope.optionsPurchaseInvoiceHasMore = true;

	$scope.loadMoreOptionsPurchaseInvoice = () => {
		const limit = 20;
		$scope.optionsPurchaseInvoiceLoading = true;
		$http.get(`/services/ts/codbex-invoices/gen/codbex-invoices/api/PurchaseInvoice/PurchaseInvoiceController.ts?$limit=${limit}&$offset=${++loadMoreOptionsPurchaseInvoiceCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesPurchaseInvoice.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesPurchaseInvoice.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsPurchaseInvoice.find(o => o.value === e.value)) {
					$scope.optionsPurchaseInvoice.push(e);
				}
			})
			$scope.optionsPurchaseInvoiceHasMore = resultValues.length > 0;
			$scope.optionsPurchaseInvoiceLoading = false;
		}, (error) => {
			$scope.optionsPurchaseInvoiceLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'PurchaseInvoice',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsPurchaseInvoiceChange = (event) => {
		if (allValuesPurchaseInvoice.length === 0) {
			allValuesPurchaseInvoice.push(...$scope.optionsPurchaseInvoice);
		}
		if (event.originalEvent.target.value === '') {
			allValuesPurchaseInvoice.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsPurchaseInvoice = allValuesPurchaseInvoice;
			$scope.optionsPurchaseInvoiceHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsPurchaseInvoiceHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesPurchaseInvoice).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-invoices/gen/codbex-invoices/api/PurchaseInvoice/PurchaseInvoiceController.ts/search', {
					conditions: [
						{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesPurchaseInvoice.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Name
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesPurchaseInvoice.push(e);
						}
					});
					$scope.optionsPurchaseInvoice = allValuesPurchaseInvoice.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'PurchaseInvoice',
						message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesPurchaseInvoice.add(event.originalEvent.target.value);
			}
		}
	};

	const lastSearchValuesSupplierPayment = new Set();
	const allValuesSupplierPayment = [];
	let loadMoreOptionsSupplierPaymentCounter = 0;
	$scope.optionsSupplierPaymentLoading = false;
	$scope.optionsSupplierPaymentHasMore = true;

	$scope.loadMoreOptionsSupplierPayment = () => {
		const limit = 20;
		$scope.optionsSupplierPaymentLoading = true;
		$http.get(`/services/ts/codbex-payments/gen/codbex-payments/api/SupplierPayment/SupplierPaymentController.ts?$limit=${limit}&$offset=${++loadMoreOptionsSupplierPaymentCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesSupplierPayment.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesSupplierPayment.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsSupplierPayment.find(o => o.value === e.value)) {
					$scope.optionsSupplierPayment.push(e);
				}
			})
			$scope.optionsSupplierPaymentHasMore = resultValues.length > 0;
			$scope.optionsSupplierPaymentLoading = false;
		}, (error) => {
			$scope.optionsSupplierPaymentLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'SupplierPayment',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsSupplierPaymentChange = (event) => {
		if (allValuesSupplierPayment.length === 0) {
			allValuesSupplierPayment.push(...$scope.optionsSupplierPayment);
		}
		if (event.originalEvent.target.value === '') {
			allValuesSupplierPayment.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsSupplierPayment = allValuesSupplierPayment;
			$scope.optionsSupplierPaymentHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsSupplierPaymentHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesSupplierPayment).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-payments/gen/codbex-payments/api/SupplierPayment/SupplierPaymentController.ts/search', {
					conditions: [
						{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesSupplierPayment.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Name
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesSupplierPayment.push(e);
						}
					});
					$scope.optionsSupplierPayment = allValuesSupplierPayment.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'SupplierPayment',
						message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesSupplierPayment.add(event.originalEvent.target.value);
			}
		}
	};

	function isText(keycode) {
		if ((keycode >= 48 && keycode <= 90) || (keycode >= 96 && keycode <= 111) || (keycode >= 186 && keycode <= 222) || [8, 46, 173].includes(keycode)) return true;
		return false;
	}

});