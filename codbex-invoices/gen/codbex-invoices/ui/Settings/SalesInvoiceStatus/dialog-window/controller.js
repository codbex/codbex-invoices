angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/SalesInvoiceStatusService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'SalesInvoiceStatus successfully created';
		let propertySuccessfullyUpdated = 'SalesInvoiceStatus successfully updated';

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'SalesInvoiceStatus Details',
			create: 'Create SalesInvoiceStatus',
			update: 'Update SalesInvoiceStatus'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-invoices:defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-invoices:defaults.formHeadSelect', { name: '$t(codbex-invoices:t.SALESINVOICESTATUS)' });
			$scope.formHeaders.create = LocaleService.t('codbex-invoices:defaults.formHeadCreate', { name: '$t(codbex-invoices:t.SALESINVOICESTATUS)' });
			$scope.formHeaders.update = LocaleService.t('codbex-invoices:defaults.formHeadUpdate', { name: '$t(codbex-invoices:t.SALESINVOICESTATUS)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-invoices:messages.propertySuccessfullyCreated', { name: '$t(codbex-invoices:t.SALESINVOICESTATUS)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-invoices:messages.propertySuccessfullyUpdated', { name: '$t(codbex-invoices:t.SALESINVOICESTATUS)' });
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
				Dialogs.postMessage({ topic: 'codbex-invoices.Settings.SalesInvoiceStatus.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:t.SALESINVOICESTATUS'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-invoices:messages.error.unableToCreate', { name: '$t(codbex-invoices:t.SALESINVOICESTATUS)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-invoices.Settings.SalesInvoiceStatus.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:t.SALESINVOICESTATUS'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-invoices:messages.error.unableToUpdate', { name: '$t(codbex-invoices:t.SALESINVOICESTATUS)', message: message });
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
			Dialogs.closeWindow({ id: 'SalesInvoiceStatus-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});