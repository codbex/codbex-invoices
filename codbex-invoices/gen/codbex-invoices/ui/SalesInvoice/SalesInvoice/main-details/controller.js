angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/SalesInvoiceController.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'SalesInvoice successfully created';
		let propertySuccessfullyUpdated = 'SalesInvoice successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'SalesInvoice Details',
			create: 'Create SalesInvoice',
			update: 'Update SalesInvoice'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.formHeadSelect', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICE)' });
			$scope.formHeaders.create = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.formHeadCreate', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICE)' });
			$scope.formHeaders.update = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.formHeadUpdate', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICE)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-invoices:codbex-invoices-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICE)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-invoices:codbex-invoices-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICE)' });
		});

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-invoices-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'SalesInvoice' && e.view === 'SalesInvoice' && e.type === 'entity');
		});

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					id: $scope.entity.Id
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-invoices.SalesInvoice.SalesInvoice.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsType = [];
				$scope.optionsCustomer = [];
				$scope.optionsCurrency = [];
				$scope.optionsPaymentMethod = [];
				$scope.optionsSentMethod = [];
				$scope.optionsStatus = [];
				$scope.optionsOperator = [];
				$scope.optionsCompany = [];
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.SalesInvoice.SalesInvoice.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.Date) {
					data.entity.Date = new Date(data.entity.Date);
				}
				if (data.entity.Due) {
					data.entity.Due = new Date(data.entity.Due);
				}
				$scope.entity = data.entity;
				$scope.optionsType = data.optionsType;
				$scope.optionsCustomer = data.optionsCustomer;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsPaymentMethod = data.optionsPaymentMethod;
				$scope.optionsSentMethod = data.optionsSentMethod;
				$scope.optionsStatus = data.optionsStatus;
				$scope.optionsOperator = data.optionsOperator;
				$scope.optionsCompany = data.optionsCompany;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.SalesInvoice.SalesInvoice.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsType = data.optionsType;
				$scope.optionsCustomer = data.optionsCustomer;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsPaymentMethod = data.optionsPaymentMethod;
				$scope.optionsSentMethod = data.optionsSentMethod;
				$scope.optionsStatus = data.optionsStatus;
				$scope.optionsOperator = data.optionsOperator;
				$scope.optionsCompany = data.optionsCompany;
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.SalesInvoice.SalesInvoice.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.Date) {
					data.entity.Date = new Date(data.entity.Date);
				}
				if (data.entity.Due) {
					data.entity.Due = new Date(data.entity.Due);
				}
				$scope.entity = data.entity;
				$scope.optionsType = data.optionsType;
				$scope.optionsCustomer = data.optionsCustomer;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsPaymentMethod = data.optionsPaymentMethod;
				$scope.optionsSentMethod = data.optionsSentMethod;
				$scope.optionsStatus = data.optionsStatus;
				$scope.optionsOperator = data.optionsOperator;
				$scope.optionsCompany = data.optionsCompany;
				$scope.action = 'update';
			});
		}});

		$scope.serviceType = '/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/SalesInvoiceTypeController.ts';
		$scope.serviceCustomer = '/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerController.ts';
		$scope.serviceCurrency = '/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyController.ts';
		$scope.servicePaymentMethod = '/services/ts/codbex-methods/gen/codbex-methods/api/Settings/PaymentMethodController.ts';
		$scope.serviceSentMethod = '/services/ts/codbex-methods/gen/codbex-methods/api/Settings/SentMethodController.ts';
		$scope.serviceStatus = '/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/SalesInvoiceStatusController.ts';
		$scope.serviceOperator = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeController.ts';
		$scope.serviceCompany = '/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyController.ts';

		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.SalesInvoice.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.SalesInvoice.clearDetails' , data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.SALESINVOICE'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.SALESINVOICE'),
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToCreate', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICE)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.SalesInvoice.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.SalesInvoice.clearDetails', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.SALESINVOICE'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.SALESINVOICE'),
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToCreate', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICE)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-invoices.SalesInvoice.SalesInvoice.clearDetails');
		};
		
		//-----------------Dialogs-------------------//
		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};
		
		$scope.createType = () => {
			Dialogs.showWindow({
				id: 'SalesInvoiceType-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createCustomer = () => {
			Dialogs.showWindow({
				id: 'Customer-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createCurrency = () => {
			Dialogs.showWindow({
				id: 'Currency-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createPaymentMethod = () => {
			Dialogs.showWindow({
				id: 'PaymentMethod-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createSentMethod = () => {
			Dialogs.showWindow({
				id: 'SentMethod-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createStatus = () => {
			Dialogs.showWindow({
				id: 'SalesInvoiceStatus-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createOperator = () => {
			Dialogs.showWindow({
				id: 'Employee-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createCompany = () => {
			Dialogs.showWindow({
				id: 'Company-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshType = () => {
			$scope.optionsType = [];
			$http.get('/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/SalesInvoiceTypeController.ts').then((response) => {
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
		};
		$scope.refreshCustomer = () => {
			$scope.optionsCustomer = [];
			$http.get('/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerController.ts').then((response) => {
				$scope.optionsCustomer = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Customer',
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshCurrency = () => {
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
		};
		$scope.refreshPaymentMethod = () => {
			$scope.optionsPaymentMethod = [];
			$http.get('/services/ts/codbex-methods/gen/codbex-methods/api/Settings/PaymentMethodController.ts').then((response) => {
				$scope.optionsPaymentMethod = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'PaymentMethod',
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshSentMethod = () => {
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
		};
		$scope.refreshStatus = () => {
			$scope.optionsStatus = [];
			$http.get('/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/SalesInvoiceStatusController.ts').then((response) => {
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
		};
		$scope.refreshOperator = () => {
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
		};
		$scope.refreshCompany = () => {
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
		};

		//----------------Dropdowns-----------------//	
	});