angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, $http, ViewParameters) => {
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
		const optionsTypeMap = new Map();
		params.optionsType.forEach(e => optionsTypeMap.set(e.value, e));
		$scope.optionsType = Array.from(optionsTypeMap.values());
		const optionsCustomerMap = new Map();
		params.optionsCustomer.forEach(e => optionsCustomerMap.set(e.value, e));
		$scope.optionsCustomer = Array.from(optionsCustomerMap.values());
		const optionsCurrencyMap = new Map();
		params.optionsCurrency.forEach(e => optionsCurrencyMap.set(e.value, e));
		$scope.optionsCurrency = Array.from(optionsCurrencyMap.values());
		const optionsPaymentMethodMap = new Map();
		params.optionsPaymentMethod.forEach(e => optionsPaymentMethodMap.set(e.value, e));
		$scope.optionsPaymentMethod = Array.from(optionsPaymentMethodMap.values());
		const optionsSentMethodMap = new Map();
		params.optionsSentMethod.forEach(e => optionsSentMethodMap.set(e.value, e));
		$scope.optionsSentMethod = Array.from(optionsSentMethodMap.values());
		const optionsStatusMap = new Map();
		params.optionsStatus.forEach(e => optionsStatusMap.set(e.value, e));
		$scope.optionsStatus = Array.from(optionsStatusMap.values());
		const optionsOperatorMap = new Map();
		params.optionsOperator.forEach(e => optionsOperatorMap.set(e.value, e));
		$scope.optionsOperator = Array.from(optionsOperatorMap.values());
		const optionsCompanyMap = new Map();
		params.optionsCompany.forEach(e => optionsCompanyMap.set(e.value, e));
		$scope.optionsCompany = Array.from(optionsCompanyMap.values());
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
		if (entity.Type !== undefined) {
			const condition = { propertyName: 'Type', operator: 'EQ', value: entity.Type };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Customer !== undefined) {
			const condition = { propertyName: 'Customer', operator: 'EQ', value: entity.Customer };
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
		if (entity.DocumentLink) {
			const condition = { propertyName: 'DocumentLink', operator: 'LIKE', value: `%${entity.DocumentLink}%` };
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
		Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.SalesInvoice.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		Dialogs.triggerEvent('codbex-invoices.SalesInvoice.SalesInvoice.clearDetails');
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
		lastSearchValuesType.clear();
		allValuesType.length = 0;
		lastSearchValuesCustomer.clear();
		allValuesCustomer.length = 0;
		lastSearchValuesCurrency.clear();
		allValuesCurrency.length = 0;
		lastSearchValuesPaymentMethod.clear();
		allValuesPaymentMethod.length = 0;
		lastSearchValuesSentMethod.clear();
		allValuesSentMethod.length = 0;
		lastSearchValuesStatus.clear();
		allValuesStatus.length = 0;
		lastSearchValuesOperator.clear();
		allValuesOperator.length = 0;
		lastSearchValuesCompany.clear();
		allValuesCompany.length = 0;
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'SalesInvoice-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};

	const lastSearchValuesType = new Set();
	const allValuesType = [];
	let loadMoreOptionsTypeCounter = 0;
	$scope.optionsTypeLoading = false;
	$scope.optionsTypeHasMore = true;

	$scope.loadMoreOptionsType = () => {
		const limit = 20;
		$scope.optionsTypeLoading = true;
		$http.get(`/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/SalesInvoiceTypeController.ts?$limit=${limit}&$offset=${++loadMoreOptionsTypeCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesType.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesType.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsType.find(o => o.value === e.value)) {
					$scope.optionsType.push(e);
				}
			})
			$scope.optionsTypeHasMore = resultValues.length > 0;
			$scope.optionsTypeLoading = false;
		}, (error) => {
			$scope.optionsTypeLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Type',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsTypeChange = (event) => {
		if (allValuesType.length === 0) {
			allValuesType.push(...$scope.optionsType);
		}
		if (event.originalEvent.target.value === '') {
			allValuesType.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsType = allValuesType;
			$scope.optionsTypeHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsTypeHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesType).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/SalesInvoiceTypeController.ts/search', {
					conditions: [
						{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesType.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Name
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesType.push(e);
						}
					});
					$scope.optionsType = allValuesType.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'Type',
						message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesType.add(event.originalEvent.target.value);
			}
		}
	};

	const lastSearchValuesCustomer = new Set();
	const allValuesCustomer = [];
	let loadMoreOptionsCustomerCounter = 0;
	$scope.optionsCustomerLoading = false;
	$scope.optionsCustomerHasMore = true;

	$scope.loadMoreOptionsCustomer = () => {
		const limit = 20;
		$scope.optionsCustomerLoading = true;
		$http.get(`/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerController.ts?$limit=${limit}&$offset=${++loadMoreOptionsCustomerCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesCustomer.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesCustomer.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsCustomer.find(o => o.value === e.value)) {
					$scope.optionsCustomer.push(e);
				}
			})
			$scope.optionsCustomerHasMore = resultValues.length > 0;
			$scope.optionsCustomerLoading = false;
		}, (error) => {
			$scope.optionsCustomerLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Customer',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsCustomerChange = (event) => {
		if (allValuesCustomer.length === 0) {
			allValuesCustomer.push(...$scope.optionsCustomer);
		}
		if (event.originalEvent.target.value === '') {
			allValuesCustomer.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsCustomer = allValuesCustomer;
			$scope.optionsCustomerHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsCustomerHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesCustomer).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerController.ts/search', {
					conditions: [
						{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesCustomer.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Name
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesCustomer.push(e);
						}
					});
					$scope.optionsCustomer = allValuesCustomer.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'Customer',
						message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesCustomer.add(event.originalEvent.target.value);
			}
		}
	};

	const lastSearchValuesCurrency = new Set();
	const allValuesCurrency = [];
	let loadMoreOptionsCurrencyCounter = 0;
	$scope.optionsCurrencyLoading = false;
	$scope.optionsCurrencyHasMore = true;

	$scope.loadMoreOptionsCurrency = () => {
		const limit = 20;
		$scope.optionsCurrencyLoading = true;
		$http.get(`/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyController.ts?$limit=${limit}&$offset=${++loadMoreOptionsCurrencyCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesCurrency.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Code
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesCurrency.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsCurrency.find(o => o.value === e.value)) {
					$scope.optionsCurrency.push(e);
				}
			})
			$scope.optionsCurrencyHasMore = resultValues.length > 0;
			$scope.optionsCurrencyLoading = false;
		}, (error) => {
			$scope.optionsCurrencyLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Currency',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsCurrencyChange = (event) => {
		if (allValuesCurrency.length === 0) {
			allValuesCurrency.push(...$scope.optionsCurrency);
		}
		if (event.originalEvent.target.value === '') {
			allValuesCurrency.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsCurrency = allValuesCurrency;
			$scope.optionsCurrencyHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsCurrencyHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesCurrency).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyController.ts/search', {
					conditions: [
						{ propertyName: 'Code', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesCurrency.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Code
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesCurrency.push(e);
						}
					});
					$scope.optionsCurrency = allValuesCurrency.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'Currency',
						message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesCurrency.add(event.originalEvent.target.value);
			}
		}
	};

	const lastSearchValuesPaymentMethod = new Set();
	const allValuesPaymentMethod = [];
	let loadMoreOptionsPaymentMethodCounter = 0;
	$scope.optionsPaymentMethodLoading = false;
	$scope.optionsPaymentMethodHasMore = true;

	$scope.loadMoreOptionsPaymentMethod = () => {
		const limit = 20;
		$scope.optionsPaymentMethodLoading = true;
		$http.get(`/services/ts/codbex-methods/gen/codbex-methods/api/Settings/PaymentMethodController.ts?$limit=${limit}&$offset=${++loadMoreOptionsPaymentMethodCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesPaymentMethod.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesPaymentMethod.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsPaymentMethod.find(o => o.value === e.value)) {
					$scope.optionsPaymentMethod.push(e);
				}
			})
			$scope.optionsPaymentMethodHasMore = resultValues.length > 0;
			$scope.optionsPaymentMethodLoading = false;
		}, (error) => {
			$scope.optionsPaymentMethodLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'PaymentMethod',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsPaymentMethodChange = (event) => {
		if (allValuesPaymentMethod.length === 0) {
			allValuesPaymentMethod.push(...$scope.optionsPaymentMethod);
		}
		if (event.originalEvent.target.value === '') {
			allValuesPaymentMethod.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsPaymentMethod = allValuesPaymentMethod;
			$scope.optionsPaymentMethodHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsPaymentMethodHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesPaymentMethod).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-methods/gen/codbex-methods/api/Settings/PaymentMethodController.ts/search', {
					conditions: [
						{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesPaymentMethod.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Name
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesPaymentMethod.push(e);
						}
					});
					$scope.optionsPaymentMethod = allValuesPaymentMethod.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'PaymentMethod',
						message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesPaymentMethod.add(event.originalEvent.target.value);
			}
		}
	};

	const lastSearchValuesSentMethod = new Set();
	const allValuesSentMethod = [];
	let loadMoreOptionsSentMethodCounter = 0;
	$scope.optionsSentMethodLoading = false;
	$scope.optionsSentMethodHasMore = true;

	$scope.loadMoreOptionsSentMethod = () => {
		const limit = 20;
		$scope.optionsSentMethodLoading = true;
		$http.get(`/services/ts/codbex-methods/gen/codbex-methods/api/Settings/SentMethodController.ts?$limit=${limit}&$offset=${++loadMoreOptionsSentMethodCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesSentMethod.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesSentMethod.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsSentMethod.find(o => o.value === e.value)) {
					$scope.optionsSentMethod.push(e);
				}
			})
			$scope.optionsSentMethodHasMore = resultValues.length > 0;
			$scope.optionsSentMethodLoading = false;
		}, (error) => {
			$scope.optionsSentMethodLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'SentMethod',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsSentMethodChange = (event) => {
		if (allValuesSentMethod.length === 0) {
			allValuesSentMethod.push(...$scope.optionsSentMethod);
		}
		if (event.originalEvent.target.value === '') {
			allValuesSentMethod.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsSentMethod = allValuesSentMethod;
			$scope.optionsSentMethodHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsSentMethodHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesSentMethod).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-methods/gen/codbex-methods/api/Settings/SentMethodController.ts/search', {
					conditions: [
						{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesSentMethod.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Name
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesSentMethod.push(e);
						}
					});
					$scope.optionsSentMethod = allValuesSentMethod.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'SentMethod',
						message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesSentMethod.add(event.originalEvent.target.value);
			}
		}
	};

	const lastSearchValuesStatus = new Set();
	const allValuesStatus = [];
	let loadMoreOptionsStatusCounter = 0;
	$scope.optionsStatusLoading = false;
	$scope.optionsStatusHasMore = true;

	$scope.loadMoreOptionsStatus = () => {
		const limit = 20;
		$scope.optionsStatusLoading = true;
		$http.get(`/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/SalesInvoiceStatusController.ts?$limit=${limit}&$offset=${++loadMoreOptionsStatusCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesStatus.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesStatus.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsStatus.find(o => o.value === e.value)) {
					$scope.optionsStatus.push(e);
				}
			})
			$scope.optionsStatusHasMore = resultValues.length > 0;
			$scope.optionsStatusLoading = false;
		}, (error) => {
			$scope.optionsStatusLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Status',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsStatusChange = (event) => {
		if (allValuesStatus.length === 0) {
			allValuesStatus.push(...$scope.optionsStatus);
		}
		if (event.originalEvent.target.value === '') {
			allValuesStatus.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsStatus = allValuesStatus;
			$scope.optionsStatusHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsStatusHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesStatus).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/SalesInvoiceStatusController.ts/search', {
					conditions: [
						{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesStatus.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Name
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesStatus.push(e);
						}
					});
					$scope.optionsStatus = allValuesStatus.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'Status',
						message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesStatus.add(event.originalEvent.target.value);
			}
		}
	};

	const lastSearchValuesOperator = new Set();
	const allValuesOperator = [];
	let loadMoreOptionsOperatorCounter = 0;
	$scope.optionsOperatorLoading = false;
	$scope.optionsOperatorHasMore = true;

	$scope.loadMoreOptionsOperator = () => {
		const limit = 20;
		$scope.optionsOperatorLoading = true;
		$http.get(`/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeController.ts?$limit=${limit}&$offset=${++loadMoreOptionsOperatorCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesOperator.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.FirstName
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesOperator.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsOperator.find(o => o.value === e.value)) {
					$scope.optionsOperator.push(e);
				}
			})
			$scope.optionsOperatorHasMore = resultValues.length > 0;
			$scope.optionsOperatorLoading = false;
		}, (error) => {
			$scope.optionsOperatorLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Operator',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsOperatorChange = (event) => {
		if (allValuesOperator.length === 0) {
			allValuesOperator.push(...$scope.optionsOperator);
		}
		if (event.originalEvent.target.value === '') {
			allValuesOperator.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsOperator = allValuesOperator;
			$scope.optionsOperatorHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsOperatorHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesOperator).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeController.ts/search', {
					conditions: [
						{ propertyName: 'FirstName', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesOperator.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.FirstName
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesOperator.push(e);
						}
					});
					$scope.optionsOperator = allValuesOperator.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'Operator',
						message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesOperator.add(event.originalEvent.target.value);
			}
		}
	};

	const lastSearchValuesCompany = new Set();
	const allValuesCompany = [];
	let loadMoreOptionsCompanyCounter = 0;
	$scope.optionsCompanyLoading = false;
	$scope.optionsCompanyHasMore = true;

	$scope.loadMoreOptionsCompany = () => {
		const limit = 20;
		$scope.optionsCompanyLoading = true;
		$http.get(`/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyController.ts?$limit=${limit}&$offset=${++loadMoreOptionsCompanyCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesCompany.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesCompany.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsCompany.find(o => o.value === e.value)) {
					$scope.optionsCompany.push(e);
				}
			})
			$scope.optionsCompanyHasMore = resultValues.length > 0;
			$scope.optionsCompanyLoading = false;
		}, (error) => {
			$scope.optionsCompanyLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Company',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsCompanyChange = (event) => {
		if (allValuesCompany.length === 0) {
			allValuesCompany.push(...$scope.optionsCompany);
		}
		if (event.originalEvent.target.value === '') {
			allValuesCompany.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsCompany = allValuesCompany;
			$scope.optionsCompanyHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsCompanyHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesCompany).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyController.ts/search', {
					conditions: [
						{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesCompany.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Name
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesCompany.push(e);
						}
					});
					$scope.optionsCompany = allValuesCompany.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'Company',
						message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesCompany.add(event.originalEvent.target.value);
			}
		}
	};

	function isText(keycode) {
		if ((keycode >= 48 && keycode <= 90) || (keycode >= 96 && keycode <= 111) || (keycode >= 186 && keycode <= 222) || [8, 46, 173].includes(keycode)) return true;
		return false;
	}

});