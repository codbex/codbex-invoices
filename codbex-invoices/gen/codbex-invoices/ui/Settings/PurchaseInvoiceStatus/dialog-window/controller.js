angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/PurchaseInvoiceStatusService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'PurchaseInvoiceStatus successfully created';
		let propertySuccessfullyUpdated = 'PurchaseInvoiceStatus successfully updated';

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'PurchaseInvoiceStatus Details',
			create: 'Create PurchaseInvoiceStatus',
			update: 'Update PurchaseInvoiceStatus'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-invoices:defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-invoices:defaults.formHeadSelect', { name: '$t(codbex-invoices:t.PURCHASEINVOICESTATUS)' });
			$scope.formHeaders.create = LocaleService.t('codbex-invoices:defaults.formHeadCreate', { name: '$t(codbex-invoices:t.PURCHASEINVOICESTATUS)' });
			$scope.formHeaders.update = LocaleService.t('codbex-invoices:defaults.formHeadUpdate', { name: '$t(codbex-invoices:t.PURCHASEINVOICESTATUS)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-invoices:messages.propertySuccessfullyCreated', { name: '$t(codbex-invoices:t.PURCHASEINVOICESTATUS)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-invoices:messages.propertySuccessfullyUpdated', { name: '$t(codbex-invoices:t.PURCHASEINVOICESTATUS)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-invoices.Settings.PurchaseInvoiceStatus.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:t.PURCHASEINVOICESTATUS'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-invoices:messages.error.unableToCreate', { name: '$t(codbex-invoices:t.PURCHASEINVOICESTATUS)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-invoices.Settings.PurchaseInvoiceStatus.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:t.PURCHASEINVOICESTATUS'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-invoices:messages.error.unableToUpdate', { name: '$t(codbex-invoices:t.PURCHASEINVOICESTATUS)', message: message });
				});
				console.error('EntityService:', error);
			});
		};


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
			Dialogs.closeWindow({ id: 'PurchaseInvoiceStatus-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});