angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/java/codbex-invoices/gen/codbex_invoices/api/salesinvoice/SalesInvoiceController';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete SalesInvoice? This action cannot be undone.',
			deleteTitle: 'Delete SalesInvoice?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.yes');
			translated.no = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.deleteTitle', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICE)' });
			translated.deleteConfirm = LocaleService.t('codbex-invoices:codbex-invoices-model.messages.deleteConfirm', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICE)' });
		});
		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataOffset = 0;
		$scope.dataLimit = 10;
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-invoices-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'SalesInvoice' && e.view === 'SalesInvoice' && (e.type === 'page' || e.type === undefined));
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				maxWidth: action.maxWidth,
				maxHeight: action.maxHeight,
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		function refreshData() {
			$scope.dataReset = true;
			$scope.dataPage--;
		}

		function resetPagination() {
			$scope.dataReset = true;
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-invoices.SalesInvoice.SalesInvoice.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.selectedEntity = null;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.SalesInvoice.SalesInvoice.entityCreated', handler: () => {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.SalesInvoice.SalesInvoice.entityUpdated', handler: () => {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.SalesInvoice.SalesInvoice.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {
					$filter: {}
				};
			}
			$scope.selectedEntity = null;
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				$scope.dataPages = Math.ceil($scope.dataCount / $scope.dataLimit);
				filter.$filter.offset = ($scope.dataPage - 1) * $scope.dataLimit;
				filter.$filter.limit = $scope.dataLimit;
				if ($scope.dataReset) {
					filter.$filter.offset = 0;
					filter.$filter.limit = $scope.dataPage * $scope.dataLimit;
				}

				EntityService.search(filter).then((response) => {
					if ($scope.data == null || $scope.dataReset) {
						$scope.data = [];
						$scope.dataReset = false;
					}
					if (optionsCustomerHasMore) {
						const optionsCustomerSearchValues = Array.from(new Set(response.data.map(e => e.Customer)));
						if (optionsCustomerSearchValues.length > 0) {
							$http.post('/services/java/codbex-partners/gen/codbex_partners/api/customers/CustomerController/search', {
								conditions: [
									{ propertyName: 'Id', operator: 'IN', value: optionsCustomerSearchValues }
								]
							}).then((response) => {
								$scope.optionsCustomer.push(...response.data.map(e => ({
									value: e.Id,
									text: e.Name
								})));
							}, (error) => {
								console.error(error);
								const message = error.data ? error.data.message : '';
								Dialogs.showAlert({
									title: 'Customer',
									message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
									type: AlertTypes.Error
								});
							});
						}
					}
					if (optionsTypeHasMore) {
						const optionsTypeSearchValues = Array.from(new Set(response.data.map(e => e.Type)));
						if (optionsTypeSearchValues.length > 0) {
							$http.post('/services/java/codbex-invoices/gen/codbex_invoices/api/settings/SalesInvoiceTypeController/search', {
								conditions: [
									{ propertyName: 'Id', operator: 'IN', value: optionsTypeSearchValues }
								]
							}).then((response) => {
								$scope.optionsType.push(...response.data.map(e => ({
									value: e.Id,
									text: e.Name
								})));
							}, (error) => {
								console.error(error);
								const message = error.data ? error.data.message : '';
								Dialogs.showAlert({
									title: 'Type',
									message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
									type: AlertTypes.Error
								});
							});
						}
					}
					if (optionsCurrencyHasMore) {
						const optionsCurrencySearchValues = Array.from(new Set(response.data.map(e => e.Currency)));
						if (optionsCurrencySearchValues.length > 0) {
							$http.post('/services/java/codbex-currencies/gen/codbex_currencies/api/settings/CurrencyController/search', {
								conditions: [
									{ propertyName: 'Id', operator: 'IN', value: optionsCurrencySearchValues }
								]
							}).then((response) => {
								$scope.optionsCurrency.push(...response.data.map(e => ({
									value: e.Id,
									text: e.Code
								})));
							}, (error) => {
								console.error(error);
								const message = error.data ? error.data.message : '';
								Dialogs.showAlert({
									title: 'Currency',
									message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
									type: AlertTypes.Error
								});
							});
						}
					}
					if (optionsPaymentMethodHasMore) {
						const optionsPaymentMethodSearchValues = Array.from(new Set(response.data.map(e => e.PaymentMethod)));
						if (optionsPaymentMethodSearchValues.length > 0) {
							$http.post('/services/java/codbex-methods/gen/codbex_methods/api/settings/PaymentMethodController/search', {
								conditions: [
									{ propertyName: 'Id', operator: 'IN', value: optionsPaymentMethodSearchValues }
								]
							}).then((response) => {
								$scope.optionsPaymentMethod.push(...response.data.map(e => ({
									value: e.Id,
									text: e.Name
								})));
							}, (error) => {
								console.error(error);
								const message = error.data ? error.data.message : '';
								Dialogs.showAlert({
									title: 'PaymentMethod',
									message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
									type: AlertTypes.Error
								});
							});
						}
					}
					if (optionsSentMethodHasMore) {
						const optionsSentMethodSearchValues = Array.from(new Set(response.data.map(e => e.SentMethod)));
						if (optionsSentMethodSearchValues.length > 0) {
							$http.post('/services/java/codbex-methods/gen/codbex_methods/api/settings/SentMethodController/search', {
								conditions: [
									{ propertyName: 'Id', operator: 'IN', value: optionsSentMethodSearchValues }
								]
							}).then((response) => {
								$scope.optionsSentMethod.push(...response.data.map(e => ({
									value: e.Id,
									text: e.Name
								})));
							}, (error) => {
								console.error(error);
								const message = error.data ? error.data.message : '';
								Dialogs.showAlert({
									title: 'SentMethod',
									message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
									type: AlertTypes.Error
								});
							});
						}
					}
					if (optionsStatusHasMore) {
						const optionsStatusSearchValues = Array.from(new Set(response.data.map(e => e.Status)));
						if (optionsStatusSearchValues.length > 0) {
							$http.post('/services/java/codbex-invoices/gen/codbex_invoices/api/settings/SalesInvoiceStatusController/search', {
								conditions: [
									{ propertyName: 'Id', operator: 'IN', value: optionsStatusSearchValues }
								]
							}).then((response) => {
								$scope.optionsStatus.push(...response.data.map(e => ({
									value: e.Id,
									text: e.Name
								})));
							}, (error) => {
								console.error(error);
								const message = error.data ? error.data.message : '';
								Dialogs.showAlert({
									title: 'Status',
									message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
									type: AlertTypes.Error
								});
							});
						}
					}
					if (optionsOperatorHasMore) {
						const optionsOperatorSearchValues = Array.from(new Set(response.data.map(e => e.Operator)));
						if (optionsOperatorSearchValues.length > 0) {
							$http.post('/services/java/codbex-employees/gen/codbex_employees/api/employees/EmployeeController/search', {
								conditions: [
									{ propertyName: 'Id', operator: 'IN', value: optionsOperatorSearchValues }
								]
							}).then((response) => {
								$scope.optionsOperator.push(...response.data.map(e => ({
									value: e.Id,
									text: e.FirstName
								})));
							}, (error) => {
								console.error(error);
								const message = error.data ? error.data.message : '';
								Dialogs.showAlert({
									title: 'Operator',
									message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
									type: AlertTypes.Error
								});
							});
						}
					}
					if (optionsCompanyHasMore) {
						const optionsCompanySearchValues = Array.from(new Set(response.data.map(e => e.Company)));
						if (optionsCompanySearchValues.length > 0) {
							$http.post('/services/java/codbex-companies/gen/codbex_companies/api/companies/CompanyController/search', {
								conditions: [
									{ propertyName: 'Id', operator: 'IN', value: optionsCompanySearchValues }
								]
							}).then((response) => {
								$scope.optionsCompany.push(...response.data.map(e => ({
									value: e.Id,
									text: e.Name
								})));
							}, (error) => {
								console.error(error);
								const message = error.data ? error.data.message : '';
								Dialogs.showAlert({
									title: 'Company',
									message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
									type: AlertTypes.Error
								});
							});
						}
					}
					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
						if (e.Due) {
							e.Due = new Date(e.Due);
						}
						if (e.CreatedAt) {
							e.CreatedAt = new Date(e.CreatedAt);
						}
						if (e.UpdatedAt) {
							e.UpdatedAt = new Date(e.UpdatedAt);
						}
					});

					$scope.data = $scope.data.concat(response.data);
					$scope.dataPage++;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.SALESINVOICE'),
						message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLF', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICE)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.SALESINVOICE'),
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToCount', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICE)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = (entity) => {
			$scope.selectedEntity = entity;
			Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.SalesInvoice.entitySelected', data: {
				entity: entity,
				selectedMainEntityId: entity.Id,
				optionsCustomer: $scope.optionsCustomer,
				optionsType: $scope.optionsType,
				optionsCurrency: $scope.optionsCurrency,
				optionsPaymentMethod: $scope.optionsPaymentMethod,
				optionsSentMethod: $scope.optionsSentMethod,
				optionsStatus: $scope.optionsStatus,
				optionsOperator: $scope.optionsOperator,
				optionsCompany: $scope.optionsCompany,
			}});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			$scope.action = 'create';

			Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.SalesInvoice.createEntity', data: {
				entity: {},
				optionsCustomer: $scope.optionsCustomer,
				optionsType: $scope.optionsType,
				optionsCurrency: $scope.optionsCurrency,
				optionsPaymentMethod: $scope.optionsPaymentMethod,
				optionsSentMethod: $scope.optionsSentMethod,
				optionsStatus: $scope.optionsStatus,
				optionsOperator: $scope.optionsOperator,
				optionsCompany: $scope.optionsCompany,
			}});
		};

		$scope.updateEntity = () => {
			$scope.action = 'update';
			Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.SalesInvoice.updateEntity', data: {
				entity: $scope.selectedEntity,
				optionsCustomer: $scope.optionsCustomer,
				optionsType: $scope.optionsType,
				optionsCurrency: $scope.optionsCurrency,
				optionsPaymentMethod: $scope.optionsPaymentMethod,
				optionsSentMethod: $scope.optionsSentMethod,
				optionsStatus: $scope.optionsStatus,
				optionsOperator: $scope.optionsOperator,
				optionsCompany: $scope.optionsCompany,
			}});
		};

		$scope.deleteEntity = () => {
			let id = $scope.selectedEntity.Id;
			Dialogs.showDialog({
				title: translated.deleteTitle,
				message: translated.deleteConfirm,
				buttons: [{
					id: 'delete-btn-yes',
					state: ButtonStates.Emphasized,
					label: translated.yes,
				}, {
					id: 'delete-btn-no',
					label: translated.no,
				}],
				closeButton: false
			}).then((buttonId) => {
				if (buttonId === 'delete-btn-yes') {
					EntityService.delete(id).then(() => {
						refreshData();
						$scope.loadPage($scope.dataPage, $scope.filter);
						Dialogs.triggerEvent('codbex-invoices.SalesInvoice.SalesInvoice.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.SALESINVOICE'),
							message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToDelete', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICE)', message: message }),
							type: AlertTypes.Error
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'SalesInvoice-filter',
				params: {
					entity: $scope.filterEntity,
					optionsCustomer: $scope.optionsCustomer,
					optionsType: $scope.optionsType,
					optionsCurrency: $scope.optionsCurrency,
					optionsPaymentMethod: $scope.optionsPaymentMethod,
					optionsSentMethod: $scope.optionsSentMethod,
					optionsStatus: $scope.optionsStatus,
					optionsOperator: $scope.optionsOperator,
					optionsCompany: $scope.optionsCompany,
				},
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsCustomer = [];
		$scope.optionsType = [];
		$scope.optionsCurrency = [];
		$scope.optionsPaymentMethod = [];
		$scope.optionsSentMethod = [];
		$scope.optionsStatus = [];
		$scope.optionsOperator = [];
		$scope.optionsCompany = [];

		let optionsCustomerHasMore = true;

		$http.get('/services/java/codbex-partners/gen/codbex_partners/api/customers/CustomerController/count').then((response) => {
			const optionsCustomerCount = response.data.count;
			$http.get('/services/java/codbex-partners/gen/codbex_partners/api/customers/CustomerController').then((response) => {
				$scope.optionsCustomer = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				optionsCustomerHasMore = optionsCustomerCount > $scope.optionsCustomer.length;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Customer',
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Customer',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		let optionsTypeHasMore = true;

		$http.get('/services/java/codbex-invoices/gen/codbex_invoices/api/settings/SalesInvoiceTypeController/count').then((response) => {
			const optionsTypeCount = response.data.count;
			$http.get('/services/java/codbex-invoices/gen/codbex_invoices/api/settings/SalesInvoiceTypeController').then((response) => {
				$scope.optionsType = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				optionsTypeHasMore = optionsTypeCount > $scope.optionsType.length;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Type',
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Type',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		let optionsCurrencyHasMore = true;

		$http.get('/services/java/codbex-currencies/gen/codbex_currencies/api/settings/CurrencyController/count').then((response) => {
			const optionsCurrencyCount = response.data.count;
			$http.get('/services/java/codbex-currencies/gen/codbex_currencies/api/settings/CurrencyController').then((response) => {
				$scope.optionsCurrency = response.data.map(e => ({
					value: e.Id,
					text: e.Code
				}));
				optionsCurrencyHasMore = optionsCurrencyCount > $scope.optionsCurrency.length;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Currency',
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Currency',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		let optionsPaymentMethodHasMore = true;

		$http.get('/services/java/codbex-methods/gen/codbex_methods/api/settings/PaymentMethodController/count').then((response) => {
			const optionsPaymentMethodCount = response.data.count;
			$http.get('/services/java/codbex-methods/gen/codbex_methods/api/settings/PaymentMethodController').then((response) => {
				$scope.optionsPaymentMethod = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				optionsPaymentMethodHasMore = optionsPaymentMethodCount > $scope.optionsPaymentMethod.length;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'PaymentMethod',
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'PaymentMethod',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		let optionsSentMethodHasMore = true;

		$http.get('/services/java/codbex-methods/gen/codbex_methods/api/settings/SentMethodController/count').then((response) => {
			const optionsSentMethodCount = response.data.count;
			$http.get('/services/java/codbex-methods/gen/codbex_methods/api/settings/SentMethodController').then((response) => {
				$scope.optionsSentMethod = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				optionsSentMethodHasMore = optionsSentMethodCount > $scope.optionsSentMethod.length;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'SentMethod',
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'SentMethod',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		let optionsStatusHasMore = true;

		$http.get('/services/java/codbex-invoices/gen/codbex_invoices/api/settings/SalesInvoiceStatusController/count').then((response) => {
			const optionsStatusCount = response.data.count;
			$http.get('/services/java/codbex-invoices/gen/codbex_invoices/api/settings/SalesInvoiceStatusController').then((response) => {
				$scope.optionsStatus = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				optionsStatusHasMore = optionsStatusCount > $scope.optionsStatus.length;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Status',
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Status',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		let optionsOperatorHasMore = true;

		$http.get('/services/java/codbex-employees/gen/codbex_employees/api/employees/EmployeeController/count').then((response) => {
			const optionsOperatorCount = response.data.count;
			$http.get('/services/java/codbex-employees/gen/codbex_employees/api/employees/EmployeeController').then((response) => {
				$scope.optionsOperator = response.data.map(e => ({
					value: e.Id,
					text: e.FirstName
				}));
				optionsOperatorHasMore = optionsOperatorCount > $scope.optionsOperator.length;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Operator',
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Operator',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		let optionsCompanyHasMore = true;

		$http.get('/services/java/codbex-companies/gen/codbex_companies/api/companies/CompanyController/count').then((response) => {
			const optionsCompanyCount = response.data.count;
			$http.get('/services/java/codbex-companies/gen/codbex_companies/api/companies/CompanyController').then((response) => {
				$scope.optionsCompany = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				optionsCompanyHasMore = optionsCompanyCount > $scope.optionsCompany.length;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Company',
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Company',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$scope.optionsCustomerValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsCustomer.length; i++) {
				if ($scope.optionsCustomer[i].value === optionKey) {
					return $scope.optionsCustomer[i].text;
				}
			}
			return null;
		};
		$scope.optionsTypeValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsType.length; i++) {
				if ($scope.optionsType[i].value === optionKey) {
					return $scope.optionsType[i].text;
				}
			}
			return null;
		};
		$scope.optionsCurrencyValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsCurrency.length; i++) {
				if ($scope.optionsCurrency[i].value === optionKey) {
					return $scope.optionsCurrency[i].text;
				}
			}
			return null;
		};
		$scope.optionsPaymentMethodValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsPaymentMethod.length; i++) {
				if ($scope.optionsPaymentMethod[i].value === optionKey) {
					return $scope.optionsPaymentMethod[i].text;
				}
			}
			return null;
		};
		$scope.optionsSentMethodValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsSentMethod.length; i++) {
				if ($scope.optionsSentMethod[i].value === optionKey) {
					return $scope.optionsSentMethod[i].text;
				}
			}
			return null;
		};
		$scope.optionsStatusValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsStatus.length; i++) {
				if ($scope.optionsStatus[i].value === optionKey) {
					return $scope.optionsStatus[i].text;
				}
			}
			return null;
		};
		$scope.optionsOperatorValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsOperator.length; i++) {
				if ($scope.optionsOperator[i].value === optionKey) {
					return $scope.optionsOperator[i].text;
				}
			}
			return null;
		};
		$scope.optionsCompanyValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsCompany.length; i++) {
				if ($scope.optionsCompany[i].value === optionKey) {
					return $scope.optionsCompany[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});
