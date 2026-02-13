angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/codbex-invoices/api/PurchaseInvoice/PurchaseInvoicePaymentService.ts';
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
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsPurchaseInvoice = params.optionsPurchaseInvoice;
			$scope.optionsSupplierPayment = params.optionsSupplierPayment;
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

		$scope.servicePurchaseInvoice = '/services/ts/codbex-invoices/gen/codbex-invoices/api/PurchaseInvoice/PurchaseInvoiceService.ts';
		$scope.serviceSupplierPayment = '/services/ts/codbex-payments/gen/codbex-payments/api/SupplierPayment/SupplierPaymentService.ts';

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