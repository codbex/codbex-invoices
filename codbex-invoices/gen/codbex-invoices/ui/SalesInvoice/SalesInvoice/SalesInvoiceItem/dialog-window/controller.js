angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/SalesInvoiceItemController.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'SalesInvoiceItem successfully created';
		let propertySuccessfullyUpdated = 'SalesInvoiceItem successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'SalesInvoiceItem Details',
			create: 'Create SalesInvoiceItem',
			update: 'Update SalesInvoiceItem'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.formHeadSelect', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM)' });
			$scope.formHeaders.create = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.formHeadCreate', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM)' });
			$scope.formHeaders.update = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.formHeadUpdate', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-invoices:codbex-invoices-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-invoices:codbex-invoices-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;

			if (params.entity.CreatedAt) {
				params.entity.CreatedAt = new Date(params.entity.CreatedAt);
			}
			if (params.entity.UpdatedAt) {
				params.entity.UpdatedAt = new Date(params.entity.UpdatedAt);
			}
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			const optionsSalesInvoiceMap = new Map();
			params.optionsSalesInvoice?.forEach(e => optionsSalesInvoiceMap.set(e.value, e));
			$scope.optionsSalesInvoice = Array.from(optionsSalesInvoiceMap.values());
			const optionsUoMMap = new Map();
			params.optionsUoM?.forEach(e => optionsUoMMap.set(e.value, e));
			$scope.optionsUoM = Array.from(optionsUoMMap.values());
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.SalesInvoiceItem.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM'),
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToCreate', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM)', message: message }),
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
				Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.SalesInvoiceItem.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM'),
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToUpdate', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceSalesInvoice = '/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/SalesInvoiceController.ts';

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
					text: e.Number
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
							{ propertyName: 'Number', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
						]
					}).then((response) => {
						const optionValues = allValuesSalesInvoice.map(e => e.value);
						const searchResult = response.data.map(e => ({
							value: e.Id,
							text: e.Number
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

		$scope.serviceUoM = '/services/ts/codbex-uoms/gen/codbex-uoms/api/Settings/UoMController.ts';

		const lastSearchValuesUoM = new Set();
		const allValuesUoM = [];
		let loadMoreOptionsUoMCounter = 0;
		$scope.optionsUoMLoading = false;
		$scope.optionsUoMHasMore = true;

		$scope.loadMoreOptionsUoM = () => {
			const limit = 20;
			$scope.optionsUoMLoading = true;
			$http.get(`/services/ts/codbex-uoms/gen/codbex-uoms/api/Settings/UoMController.ts?$limit=${limit}&$offset=${++loadMoreOptionsUoMCounter * limit}`)
			.then((response) => {
				const optionValues = allValuesUoM.map(e => e.value);
				const resultValues = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				const newValues = [];
				resultValues.forEach(e => {
					if (!optionValues.includes(e.value)) {
						allValuesUoM.push(e);
						newValues.push(e);
					}
				});
				newValues.forEach(e => {
					if (!$scope.optionsUoM.find(o => o.value === e.value)) {
						$scope.optionsUoM.push(e);
					}
				})
				$scope.optionsUoMHasMore = resultValues.length > 0;
				$scope.optionsUoMLoading = false;
			}, (error) => {
				$scope.optionsUoMLoading = false;
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'UoM',
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		$scope.onOptionsUoMChange = (event) => {
			if (allValuesUoM.length === 0) {
				allValuesUoM.push(...$scope.optionsUoM);
			}
			if (event.originalEvent.target.value === '') {
				allValuesUoM.sort((a, b) => a.text.localeCompare(b.text));
				$scope.optionsUoM = allValuesUoM;
				$scope.optionsUoMHasMore = true;
			} else if (isText(event.which)) {
				$scope.optionsUoMHasMore = false;
				let cacheHit = false;
				Array.from(lastSearchValuesUoM).forEach(e => {
					if (event.originalEvent.target.value.startsWith(e)) {
						cacheHit = true;
					}
				})
				if (!cacheHit) {
					$http.post('/services/ts/codbex-uoms/gen/codbex-uoms/api/Settings/UoMController.ts/search', {
						conditions: [
							{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
						]
					}).then((response) => {
						const optionValues = allValuesUoM.map(e => e.value);
						const searchResult = response.data.map(e => ({
							value: e.Id,
							text: e.Name
						}));
						searchResult.forEach(e => {
							if (!optionValues.includes(e.value)) {
								allValuesUoM.push(e);
							}
						});
						$scope.optionsUoM = allValuesUoM.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
					}, (error) => {
						console.error(error);
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: 'UoM',
							message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
							type: AlertTypes.Error
						});
					});
					lastSearchValuesUoM.add(event.originalEvent.target.value);
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
			Dialogs.closeWindow({ id: 'SalesInvoiceItem-details' });
		};
	});