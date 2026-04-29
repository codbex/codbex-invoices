angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/codbex-invoices/api/PurchaseInvoice/PurchaseInvoiceController.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'PurchaseInvoice successfully created';
		let propertySuccessfullyUpdated = 'PurchaseInvoice successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'PurchaseInvoice Details',
			create: 'Create PurchaseInvoice',
			update: 'Update PurchaseInvoice'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.formHeadSelect', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICE)' });
			$scope.formHeaders.create = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.formHeadCreate', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICE)' });
			$scope.formHeaders.update = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.formHeadUpdate', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICE)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-invoices:codbex-invoices-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICE)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-invoices:codbex-invoices-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICE)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			if (params.entity.Date) {
				params.entity.Date = new Date(params.entity.Date);
			}
			if (params.entity.Due) {
				params.entity.Due = new Date(params.entity.Due);
			}
			if (params.entity.CreatedAt) {
				params.entity.CreatedAt = new Date(params.entity.CreatedAt);
			}
			if (params.entity.UpdatedAt) {
				params.entity.UpdatedAt = new Date(params.entity.UpdatedAt);
			}
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			const optionsTypeMap = new Map();
			params.optionsType?.forEach(e => optionsTypeMap.set(e.value, e));
			$scope.optionsType = Array.from(optionsTypeMap.values());
			const optionsSupplierMap = new Map();
			params.optionsSupplier?.forEach(e => optionsSupplierMap.set(e.value, e));
			$scope.optionsSupplier = Array.from(optionsSupplierMap.values());
			const optionsCurrencyMap = new Map();
			params.optionsCurrency?.forEach(e => optionsCurrencyMap.set(e.value, e));
			$scope.optionsCurrency = Array.from(optionsCurrencyMap.values());
			const optionsSentMethodMap = new Map();
			params.optionsSentMethod?.forEach(e => optionsSentMethodMap.set(e.value, e));
			$scope.optionsSentMethod = Array.from(optionsSentMethodMap.values());
			const optionsStatusMap = new Map();
			params.optionsStatus?.forEach(e => optionsStatusMap.set(e.value, e));
			$scope.optionsStatus = Array.from(optionsStatusMap.values());
			const optionsOperatorMap = new Map();
			params.optionsOperator?.forEach(e => optionsOperatorMap.set(e.value, e));
			$scope.optionsOperator = Array.from(optionsOperatorMap.values());
			const optionsCompanyMap = new Map();
			params.optionsCompany?.forEach(e => optionsCompanyMap.set(e.value, e));
			$scope.optionsCompany = Array.from(optionsCompanyMap.values());
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-invoices.PurchaseInvoice.PurchaseInvoice.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICE'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToCreate', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICE)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-invoices.PurchaseInvoice.PurchaseInvoice.entityUpdated', data: response.data });
				$scope.cancel();
				Notifications.show({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICE'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToUpdate', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICE)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceType = '/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/PurchaseInvoiceTypeController.ts';
		
		$scope.optionsType = [];
		
		$http.get('/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/PurchaseInvoiceTypeController.ts').then((response) => {
			$scope.optionsType = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Type',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		const lastSearchValuesType = new Set();
		const allValuesType = [];
		let loadMoreOptionsTypeCounter = 0;
		$scope.optionsTypeLoading = false;
		$scope.optionsTypeHasMore = true;

		$scope.loadMoreOptionsType = () => {
			const limit = 20;
			$scope.optionsTypeLoading = true;
			$http.get(`/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/PurchaseInvoiceTypeController.ts?$limit=${limit}&$offset=${++loadMoreOptionsTypeCounter * limit}`)
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
					$http.post('/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/PurchaseInvoiceTypeController.ts/search', {
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
		$scope.serviceSupplier = '/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierController.ts';
		
		$scope.optionsSupplier = [];
		
		$http.get('/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierController.ts').then((response) => {
			$scope.optionsSupplier = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Supplier',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		const lastSearchValuesSupplier = new Set();
		const allValuesSupplier = [];
		let loadMoreOptionsSupplierCounter = 0;
		$scope.optionsSupplierLoading = false;
		$scope.optionsSupplierHasMore = true;

		$scope.loadMoreOptionsSupplier = () => {
			const limit = 20;
			$scope.optionsSupplierLoading = true;
			$http.get(`/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierController.ts?$limit=${limit}&$offset=${++loadMoreOptionsSupplierCounter * limit}`)
			.then((response) => {
				const optionValues = allValuesSupplier.map(e => e.value);
				const resultValues = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				const newValues = [];
				resultValues.forEach(e => {
					if (!optionValues.includes(e.value)) {
						allValuesSupplier.push(e);
						newValues.push(e);
					}
				});
				newValues.forEach(e => {
					if (!$scope.optionsSupplier.find(o => o.value === e.value)) {
						$scope.optionsSupplier.push(e);
					}
				})
				$scope.optionsSupplierHasMore = resultValues.length > 0;
				$scope.optionsSupplierLoading = false;
			}, (error) => {
				$scope.optionsSupplierLoading = false;
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Supplier',
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		$scope.onOptionsSupplierChange = (event) => {
			if (allValuesSupplier.length === 0) {
				allValuesSupplier.push(...$scope.optionsSupplier);
			}
			if (event.originalEvent.target.value === '') {
				allValuesSupplier.sort((a, b) => a.text.localeCompare(b.text));
				$scope.optionsSupplier = allValuesSupplier;
				$scope.optionsSupplierHasMore = true;
			} else if (isText(event.which)) {
				$scope.optionsSupplierHasMore = false;
				let cacheHit = false;
				Array.from(lastSearchValuesSupplier).forEach(e => {
					if (event.originalEvent.target.value.startsWith(e)) {
						cacheHit = true;
					}
				})
				if (!cacheHit) {
					$http.post('/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierController.ts/search', {
						conditions: [
							{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
						]
					}).then((response) => {
						const optionValues = allValuesSupplier.map(e => e.value);
						const searchResult = response.data.map(e => ({
							value: e.Id,
							text: e.Name
						}));
						searchResult.forEach(e => {
							if (!optionValues.includes(e.value)) {
								allValuesSupplier.push(e);
							}
						});
						$scope.optionsSupplier = allValuesSupplier.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
					}, (error) => {
						console.error(error);
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: 'Supplier',
							message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
							type: AlertTypes.Error
						});
					});
					lastSearchValuesSupplier.add(event.originalEvent.target.value);
				}
			}
		};
		$scope.serviceCurrency = '/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyController.ts';
		
		$scope.optionsCurrency = [];
		
		$http.get('/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyController.ts').then((response) => {
			$scope.optionsCurrency = response.data.map(e => ({
				value: e.Id,
				text: e.Code
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Currency',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

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
		$scope.serviceSentMethod = '/services/ts/codbex-methods/gen/codbex-methods/api/Settings/SentMethodController.ts';
		
		$scope.optionsSentMethod = [];
		
		$http.get('/services/ts/codbex-methods/gen/codbex-methods/api/Settings/SentMethodController.ts').then((response) => {
			$scope.optionsSentMethod = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'SentMethod',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

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
		$scope.serviceStatus = '/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/PurchaseInvoiceStatusController.ts';
		
		$scope.optionsStatus = [];
		
		$http.get('/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/PurchaseInvoiceStatusController.ts').then((response) => {
			$scope.optionsStatus = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Status',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		const lastSearchValuesStatus = new Set();
		const allValuesStatus = [];
		let loadMoreOptionsStatusCounter = 0;
		$scope.optionsStatusLoading = false;
		$scope.optionsStatusHasMore = true;

		$scope.loadMoreOptionsStatus = () => {
			const limit = 20;
			$scope.optionsStatusLoading = true;
			$http.get(`/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/PurchaseInvoiceStatusController.ts?$limit=${limit}&$offset=${++loadMoreOptionsStatusCounter * limit}`)
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
					$http.post('/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/PurchaseInvoiceStatusController.ts/search', {
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
		$scope.serviceOperator = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeController.ts';
		
		$scope.optionsOperator = [];
		
		$http.get('/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeController.ts').then((response) => {
			$scope.optionsOperator = response.data.map(e => ({
				value: e.Id,
				text: e.FirstName
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Operator',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

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
		$scope.serviceCompany = '/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyController.ts';
		
		$scope.optionsCompany = [];
		
		$http.get('/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyController.ts').then((response) => {
			$scope.optionsCompany = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Company',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

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
			Dialogs.closeWindow({ id: 'PurchaseInvoice-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});