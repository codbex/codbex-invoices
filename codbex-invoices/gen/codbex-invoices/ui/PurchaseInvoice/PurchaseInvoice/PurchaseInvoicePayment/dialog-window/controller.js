angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/codbex-invoices/api/PurchaseInvoice/PurchaseInvoicePaymentController.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'PurchaseInvoicePayment successfully created';
		let propertySuccessfullyUpdated = 'PurchaseInvoicePayment successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'PurchaseInvoicePayment Details',
			create: 'Create PurchaseInvoicePayment',
			update: 'Update PurchaseInvoicePayment'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.formHeadSelect', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT)' });
			$scope.formHeaders.create = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.formHeadCreate', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT)' });
			$scope.formHeaders.update = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.formHeadUpdate', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-invoices:codbex-invoices-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-invoices:codbex-invoices-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT)' });
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
			const optionsPurchaseInvoiceMap = new Map();
			params.optionsPurchaseInvoice?.forEach(e => optionsPurchaseInvoiceMap.set(e.value, e));
			$scope.optionsPurchaseInvoice = Array.from(optionsPurchaseInvoiceMap.values());
			const optionsSupplierPaymentMap = new Map();
			params.optionsSupplierPayment?.forEach(e => optionsSupplierPaymentMap.set(e.value, e));
			$scope.optionsSupplierPayment = Array.from(optionsSupplierPaymentMap.values());
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-invoices.PurchaseInvoice.PurchaseInvoicePayment.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT'),
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToCreate', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT)', message: message }),
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
				Dialogs.postMessage({ topic: 'codbex-invoices.PurchaseInvoice.PurchaseInvoicePayment.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT'),
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToUpdate', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.servicePurchaseInvoice = '/services/ts/codbex-invoices/gen/codbex-invoices/api/PurchaseInvoice/PurchaseInvoiceController.ts';

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

		$scope.serviceSupplierPayment = '/services/ts/codbex-payments/gen/codbex-payments/api/SupplierPayment/SupplierPaymentController.ts';

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

		$scope.$watch('entity.PurchaseInvoice', function (newValue, oldValue) {
			if (newValue !== undefined && newValue !== null) {
				$http.get($scope.servicePurchaseInvoice + '/' + newValue).then((response) => {
					let valueFrom = response.data.Supplier;
					$http.post('/services/ts/codbex-payments/gen/codbex-payments/api/SupplierPayment/SupplierPaymentController.ts/search', {
						conditions: [
							{ propertyName: 'Supplier', operator: 'EQ', value: valueFrom }
						]
					}).then((response) => {
						$scope.optionsSupplierPayment = response.data.map(e => ({
							value: e.Id,
							text: e.Name
						}));
						if ($scope.action !== 'select' && newValue !== oldValue) {
							if ($scope.optionsSupplierPayment.length == 1) {
								$scope.entity.SupplierPayment = $scope.optionsSupplierPayment[0].value;
							} else {
								$scope.entity.SupplierPayment = undefined;
							}
						}
					}, (error) => {
						console.error(error);
					});
				}, (error) => {
					console.error(error);
				});
			}
		});

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
			Dialogs.closeWindow({ id: 'PurchaseInvoicePayment-details' });
		};
	});