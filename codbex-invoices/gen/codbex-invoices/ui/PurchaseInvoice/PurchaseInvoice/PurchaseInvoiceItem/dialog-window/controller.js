angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/codbex-invoices/api/PurchaseInvoice/PurchaseInvoiceItemService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'PurchaseInvoiceItem successfully created';
		let propertySuccessfullyUpdated = 'PurchaseInvoiceItem successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'PurchaseInvoiceItem Details',
			create: 'Create PurchaseInvoiceItem',
			update: 'Update PurchaseInvoiceItem'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-invoices:defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-invoices:defaults.formHeadSelect', { name: '$t(codbex-invoices:t.PURCHASEINVOICEITEM)' });
			$scope.formHeaders.create = LocaleService.t('codbex-invoices:defaults.formHeadCreate', { name: '$t(codbex-invoices:t.PURCHASEINVOICEITEM)' });
			$scope.formHeaders.update = LocaleService.t('codbex-invoices:defaults.formHeadUpdate', { name: '$t(codbex-invoices:t.PURCHASEINVOICEITEM)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-invoices:messages.propertySuccessfullyCreated', { name: '$t(codbex-invoices:t.PURCHASEINVOICEITEM)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-invoices:messages.propertySuccessfullyUpdated', { name: '$t(codbex-invoices:t.PURCHASEINVOICEITEM)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsPurchaseInvoice = params.optionsPurchaseInvoice;
			$scope.optionsUoM = params.optionsUoM;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-invoices.PurchaseInvoice.PurchaseInvoiceItem.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:t.PURCHASEINVOICEITEM'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-invoices:t.PURCHASEINVOICEITEM'),
					message: LocaleService.t('codbex-invoices:messages.error.unableToCreate', { name: '$t(codbex-invoices:t.PURCHASEINVOICEITEM)', message: message }),
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
				Dialogs.postMessage({ topic: 'codbex-invoices.PurchaseInvoice.PurchaseInvoiceItem.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:t.PURCHASEINVOICEITEM'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-invoices:t.PURCHASEINVOICEITEM'),
					message: LocaleService.t('codbex-invoices:messages.error.unableToUpdate', { name: '$t(codbex-invoices:t.PURCHASEINVOICEITEM)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.servicePurchaseInvoice = '/services/ts/codbex-invoices/gen/codbex-invoices/api/PurchaseInvoice/PurchaseInvoiceService.ts';
		$scope.serviceUoM = '/services/ts/codbex-uoms/gen/codbex-uoms/api/Settings/UoMService.ts';

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
			Dialogs.closeWindow({ id: 'PurchaseInvoiceItem-details' });
		};
	});