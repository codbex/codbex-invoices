angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/DeductionController.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'Deduction successfully created';
		let propertySuccessfullyUpdated = 'Deduction successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'Deduction Details',
			create: 'Create Deduction',
			update: 'Update Deduction'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.formHeadSelect', { name: '$t(codbex-invoices:codbex-invoices-model.t.DEDUCTION)' });
			$scope.formHeaders.create = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.formHeadCreate', { name: '$t(codbex-invoices:codbex-invoices-model.t.DEDUCTION)' });
			$scope.formHeaders.update = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.formHeadUpdate', { name: '$t(codbex-invoices:codbex-invoices-model.t.DEDUCTION)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-invoices:codbex-invoices-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-invoices:codbex-invoices-model.t.DEDUCTION)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-invoices:codbex-invoices-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-invoices:codbex-invoices-model.t.DEDUCTION)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			const optionsAdvanceInvoiceMap = new Map();
			params.optionsAdvanceInvoice?.forEach(e => optionsAdvanceInvoiceMap.set(e.value, e));
			$scope.optionsAdvanceInvoice = Array.from(optionsAdvanceInvoiceMap.values());
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.Deduction.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.DEDUCTION'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.DEDUCTION'),
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToCreate', { name: '$t(codbex-invoices:codbex-invoices-model.t.DEDUCTION)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.Deduction.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.DEDUCTION'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.DEDUCTION'),
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToUpdate', { name: '$t(codbex-invoices:codbex-invoices-model.t.DEDUCTION)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceAdvanceInvoice = '/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/SalesInvoiceController.ts';

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

		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};

		$scope.cancel = () => {
			$scope.entity = {};
			$scope.action = 'select';
			Dialogs.closeWindow({ id: 'Deduction-details' });
		};
	});