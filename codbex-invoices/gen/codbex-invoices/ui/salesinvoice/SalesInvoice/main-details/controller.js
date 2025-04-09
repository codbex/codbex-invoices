angular.module('page', ['blimpKit', 'platformView', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/SalesInvoiceService.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, EntityService) => {
		const Dialogs = new DialogHub();
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

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-invoices-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'salesinvoice' && e.view === 'SalesInvoice' && e.type === 'entity');
		});

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: action.label,
				path: action.path,
				params: {
					id: $scope.entity.Id
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-invoices.salesinvoice.SalesInvoice.clearDetails', handler: () => {
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
		Dialogs.addMessageListener({ topic: 'codbex-invoices.salesinvoice.SalesInvoice.entitySelected', handler: (data) => {
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
		Dialogs.addMessageListener({ topic: 'codbex-invoices.salesinvoice.SalesInvoice.createEntity', handler: (data) => {
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
		Dialogs.addMessageListener({ topic: 'codbex-invoices.salesinvoice.SalesInvoice.updateEntity', handler: (data) => {
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

		$scope.serviceType = '/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/SalesInvoiceTypeService.ts';
		$scope.serviceCustomer = '/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerService.ts';
		$scope.serviceCurrency = '/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyService.ts';
		$scope.servicePaymentMethod = '/services/ts/codbex-methods/gen/codbex-methods/api/Settings/PaymentMethodService.ts';
		$scope.serviceSentMethod = '/services/ts/codbex-methods/gen/codbex-methods/api/Settings/SentMethodService.ts';
		$scope.serviceStatus = '/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/SalesInvoiceStatusService.ts';
		$scope.serviceOperator = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts';
		$scope.serviceCompany = '/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts';

		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-invoices.salesinvoice.SalesInvoice.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-invoices.salesinvoice.SalesInvoice.clearDetails' , data: response.data });
				Dialogs.showAlert({
					title: 'SalesInvoice',
					message: 'SalesInvoice successfully created',
					type: AlertTypes.Success
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'SalesInvoice',
					message: `Unable to create SalesInvoice: '${message}'`,
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-invoices.salesinvoice.SalesInvoice.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-invoices.salesinvoice.SalesInvoice.clearDetails', data: response.data });
				Dialogs.showAlert({
					title: 'SalesInvoice',
					message: 'SalesInvoice successfully updated',
					type: AlertTypes.Success
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'SalesInvoice',
					message: `Unable to create SalesInvoice: '${message}'`,
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-invoices.salesinvoice.SalesInvoice.clearDetails');
		};
		
		//-----------------Dialogs-------------------//
		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: 'Description',
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
			$http.get('/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/SalesInvoiceTypeService.ts').then((response) => {
				$scope.optionsType = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Type',
					message: `Unable to load data: '${message}'`,
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshCustomer = () => {
			$scope.optionsCustomer = [];
			$http.get('/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerService.ts').then((response) => {
				$scope.optionsCustomer = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Customer',
					message: `Unable to load data: '${message}'`,
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshCurrency = () => {
			$scope.optionsCurrency = [];
			$http.get('/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyService.ts').then((response) => {
				$scope.optionsCurrency = response.data.map(e => ({
					value: e.Id,
					text: e.Code
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Currency',
					message: `Unable to load data: '${message}'`,
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshPaymentMethod = () => {
			$scope.optionsPaymentMethod = [];
			$http.get('/services/ts/codbex-methods/gen/codbex-methods/api/Settings/PaymentMethodService.ts').then((response) => {
				$scope.optionsPaymentMethod = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'PaymentMethod',
					message: `Unable to load data: '${message}'`,
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshSentMethod = () => {
			$scope.optionsSentMethod = [];
			$http.get('/services/ts/codbex-methods/gen/codbex-methods/api/Settings/SentMethodService.ts').then((response) => {
				$scope.optionsSentMethod = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'SentMethod',
					message: `Unable to load data: '${message}'`,
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshStatus = () => {
			$scope.optionsStatus = [];
			$http.get('/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/SalesInvoiceStatusService.ts').then((response) => {
				$scope.optionsStatus = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Status',
					message: `Unable to load data: '${message}'`,
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshOperator = () => {
			$scope.optionsOperator = [];
			$http.get('/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts').then((response) => {
				$scope.optionsOperator = response.data.map(e => ({
					value: e.Id,
					text: e.FirstName
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Operator',
					message: `Unable to load data: '${message}'`,
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshCompany = () => {
			$scope.optionsCompany = [];
			$http.get('/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts').then((response) => {
				$scope.optionsCompany = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Company',
					message: `Unable to load data: '${message}'`,
					type: AlertTypes.Error
				});
			});
		};

		//----------------Dropdowns-----------------//	
	});