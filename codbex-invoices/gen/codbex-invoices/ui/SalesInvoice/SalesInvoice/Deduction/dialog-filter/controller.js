angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, $http, ViewParameters) => {
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
		const optionsAdvanceInvoiceMap = new Map();
		params.optionsAdvanceInvoice.forEach(e => optionsAdvanceInvoiceMap.set(e.value, e));
		$scope.optionsAdvanceInvoice = Array.from(optionsAdvanceInvoiceMap.values());
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
		if (entity.DeductionInvoice !== undefined) {
			const condition = { propertyName: 'DeductionInvoice', operator: 'EQ', value: entity.DeductionInvoice };
			filter.$filter.conditions.push(condition);
		}
		if (entity.AdvanceInvoice !== undefined) {
			const condition = { propertyName: 'AdvanceInvoice', operator: 'EQ', value: entity.AdvanceInvoice };
			filter.$filter.conditions.push(condition);
		}
		Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.Deduction.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
		lastSearchValuesAdvanceInvoice.clear();
		allValuesAdvanceInvoice.length = 0;
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'Deduction-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};

	const lastSearchValuesAdvanceInvoice = new Set();
	const allValuesAdvanceInvoice = [];
	let loadMoreOptionsAdvanceInvoiceCounter = 0;
	$scope.optionsAdvanceInvoiceLoading = false;
	$scope.optionsAdvanceInvoiceHasMore = true;

	$scope.loadMoreOptionsAdvanceInvoice = () => {
		const limit = 20;
		$scope.optionsAdvanceInvoiceLoading = true;
		$http.get(`/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/SalesInvoiceController.ts?$limit=${limit}&$offset=${++loadMoreOptionsAdvanceInvoiceCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesAdvanceInvoice.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Number
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesAdvanceInvoice.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsAdvanceInvoice.find(o => o.value === e.value)) {
					$scope.optionsAdvanceInvoice.push(e);
				}
			})
			$scope.optionsAdvanceInvoiceHasMore = resultValues.length > 0;
			$scope.optionsAdvanceInvoiceLoading = false;
		}, (error) => {
			$scope.optionsAdvanceInvoiceLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'AdvanceInvoice',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsAdvanceInvoiceChange = (event) => {
		if (allValuesAdvanceInvoice.length === 0) {
			allValuesAdvanceInvoice.push(...$scope.optionsAdvanceInvoice);
		}
		if (event.originalEvent.target.value === '') {
			allValuesAdvanceInvoice.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsAdvanceInvoice = allValuesAdvanceInvoice;
			$scope.optionsAdvanceInvoiceHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsAdvanceInvoiceHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesAdvanceInvoice).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/SalesInvoiceController.ts/search', {
					conditions: [
						{ propertyName: 'Number', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesAdvanceInvoice.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Number
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesAdvanceInvoice.push(e);
						}
					});
					$scope.optionsAdvanceInvoice = allValuesAdvanceInvoice.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'AdvanceInvoice',
						message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesAdvanceInvoice.add(event.originalEvent.target.value);
			}
		}
	};

	function isText(keycode) {
		if ((keycode >= 48 && keycode <= 90) || (keycode >= 96 && keycode <= 111) || (keycode >= 186 && keycode <= 222) || [8, 46, 173].includes(keycode)) return true;
		return false;
	}

});