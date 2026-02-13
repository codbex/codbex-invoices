angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/SalesInvoiceItemController.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'SalesInvoiceItem successfully created';
		let propertySuccessfullyUpdated = 'SalesInvoiceItem successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'SalesInvoiceItem Details',
			create: 'Create SalesInvoiceItem',
			update: 'Update SalesInvoiceItem'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.formHeadSelect', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM)' });
			$scope.formHeaders.create = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.formHeadCreate', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM)' });
			$scope.formHeaders.update = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.formHeadUpdate', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-invoices:codbex-invoices-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-invoices:codbex-invoices-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsSalesInvoice = params.optionsSalesInvoice;
			$scope.optionsUoM = params.optionsUoM;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.SalesInvoiceItem.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM'),
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToCreate', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM)', message: message }),
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
				Dialogs.postMessage({ topic: 'codbex-invoices.SalesInvoice.SalesInvoiceItem.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM'),
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToUpdate', { name: '$t(codbex-invoices:codbex-invoices-model.t.SALESINVOICEITEM)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceSalesInvoice = '/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/SalesInvoiceController.ts';
		$scope.serviceUoM = '/services/ts/codbex-uoms/gen/codbex-uoms/api/Settings/UoMController.ts';

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
			Dialogs.closeWindow({ id: 'SalesInvoiceItem-details' });
		};
	});