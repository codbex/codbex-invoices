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
		const optionsSalesInvoiceMap = new Map();
		params.optionsSalesInvoice.forEach(e => optionsSalesInvoiceMap.set(e.value, e));
		$scope.optionsSalesInvoice = Array.from(optionsSalesInvoiceMap.values());
		const optionsCustomerPaymentMap = new Map();
		params.optionsCustomerPayment.forEach(e => optionsCustomerPaymentMap.set(e.value, e));
		$scope.optionsCustomerPayment = Array.from(optionsCustomerPaymentMap.values());
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
		Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.SalesInvoicePayment.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
		lastSearchValuesSalesInvoice.clear();
		allValuesSalesInvoice.length = 0;
		lastSearchValuesCustomerPayment.clear();
		allValuesCustomerPayment.length = 0;
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'SalesInvoicePayment-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};

	const lastSearchValuesSalesInvoice = new Set();
	const allValuesSalesInvoice = [];
	let loadMoreOptionsSalesInvoiceCounter = 0;
	$scope.optionsSalesInvoiceLoading = false;
	$scope.optionsSalesInvoiceHasMore = true;

	$scope.loadMoreOptionsSalesInvoice = () => {
		const limit = 20;
		$scope.optionsSalesInvoiceLoading = true;
		$http.get(`/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/SalesInvoiceController.ts?$limit=${limit}&$offset=${++loadMoreOptionsSalesInvoiceCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesSalesInvoice.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesSalesInvoice.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsSalesInvoice.find(o => o.value === e.value)) {
					$scope.optionsSalesInvoice.push(e);
				}
			})
			$scope.optionsSalesInvoiceHasMore = resultValues.length > 0;
			$scope.optionsSalesInvoiceLoading = false;
		}, (error) => {
			$scope.optionsSalesInvoiceLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'SalesInvoice',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsSalesInvoiceChange = (event) => {
		if (allValuesSalesInvoice.length === 0) {
			allValuesSalesInvoice.push(...$scope.optionsSalesInvoice);
		}
		if (event.originalEvent.target.value === '') {
			allValuesSalesInvoice.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsSalesInvoice = allValuesSalesInvoice;
			$scope.optionsSalesInvoiceHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsSalesInvoiceHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesSalesInvoice).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/SalesInvoiceController.ts/search', {
					conditions: [
						{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesSalesInvoice.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Name
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesSalesInvoice.push(e);
						}
					});
					$scope.optionsSalesInvoice = allValuesSalesInvoice.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'SalesInvoice',
						message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesSalesInvoice.add(event.originalEvent.target.value);
			}
		}
	};

	const lastSearchValuesCustomerPayment = new Set();
	const allValuesCustomerPayment = [];
	let loadMoreOptionsCustomerPaymentCounter = 0;
	$scope.optionsCustomerPaymentLoading = false;
	$scope.optionsCustomerPaymentHasMore = true;

	$scope.loadMoreOptionsCustomerPayment = () => {
		const limit = 20;
		$scope.optionsCustomerPaymentLoading = true;
		$http.get(`/services/ts/codbex-payments/gen/codbex-payments/api/CustomerPayment/CustomerPaymentController.ts?$limit=${limit}&$offset=${++loadMoreOptionsCustomerPaymentCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesCustomerPayment.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesCustomerPayment.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsCustomerPayment.find(o => o.value === e.value)) {
					$scope.optionsCustomerPayment.push(e);
				}
			})
			$scope.optionsCustomerPaymentHasMore = resultValues.length > 0;
			$scope.optionsCustomerPaymentLoading = false;
		}, (error) => {
			$scope.optionsCustomerPaymentLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'CustomerPayment',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsCustomerPaymentChange = (event) => {
		if (allValuesCustomerPayment.length === 0) {
			allValuesCustomerPayment.push(...$scope.optionsCustomerPayment);
		}
		if (event.originalEvent.target.value === '') {
			allValuesCustomerPayment.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsCustomerPayment = allValuesCustomerPayment;
			$scope.optionsCustomerPaymentHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsCustomerPaymentHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesCustomerPayment).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-payments/gen/codbex-payments/api/CustomerPayment/CustomerPaymentController.ts/search', {
					conditions: [
						{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesCustomerPayment.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Name
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesCustomerPayment.push(e);
						}
					});
					$scope.optionsCustomerPayment = allValuesCustomerPayment.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'CustomerPayment',
						message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesCustomerPayment.add(event.originalEvent.target.value);
			}
		}
	};

	function isText(keycode) {
		if ((keycode >= 48 && keycode <= 90) || (keycode >= 96 && keycode <= 111) || (keycode >= 186 && keycode <= 222) || [8, 46, 173].includes(keycode)) return true;
		return false;
	}

});