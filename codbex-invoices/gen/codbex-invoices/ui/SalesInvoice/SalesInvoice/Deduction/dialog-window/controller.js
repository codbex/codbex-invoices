angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/DeductionService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'Deduction successfully created';
		let propertySuccessfullyUpdated = 'Deduction successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'Deduction Details',
			create: 'Create Deduction',
			update: 'Update Deduction'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-invoices:defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-invoices:defaults.formHeadSelect', { name: '$t(codbex-invoices:t.DEDUCTION)' });
			$scope.formHeaders.create = LocaleService.t('codbex-invoices:defaults.formHeadCreate', { name: '$t(codbex-invoices:t.DEDUCTION)' });
			$scope.formHeaders.update = LocaleService.t('codbex-invoices:defaults.formHeadUpdate', { name: '$t(codbex-invoices:t.DEDUCTION)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-invoices:messages.propertySuccessfullyCreated', { name: '$t(codbex-invoices:t.DEDUCTION)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-invoices:messages.propertySuccessfullyUpdated', { name: '$t(codbex-invoices:t.DEDUCTION)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsAdvanceInvoice = params.optionsAdvanceInvoice;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.Deduction.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:t.DEDUCTION'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-invoices:t.DEDUCTION'),
					message: LocaleService.t('codbex-invoices:messages.error.unableToCreate', { name: '$t(codbex-invoices:t.DEDUCTION)', message: message }),
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
				Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.Deduction.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:t.DEDUCTION'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-invoices:t.DEDUCTION'),
					message: LocaleService.t('codbex-invoices:messages.error.unableToUpdate', { name: '$t(codbex-invoices:t.DEDUCTION)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceAdvanceInvoice = '/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/SalesInvoiceService.ts';

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
			Dialogs.closeWindow({ id: 'Deduction-details' });
		};
	});