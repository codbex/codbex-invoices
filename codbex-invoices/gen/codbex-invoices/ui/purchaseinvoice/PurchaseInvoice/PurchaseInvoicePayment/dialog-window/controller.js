angular.module('page', ['blimpKit', 'platformView', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/codbex-invoices/api/purchaseinvoice/PurchaseInvoicePaymentService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, EntityService) => {
		const Dialogs = new DialogHub();
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
				Dialogs.postMessage({ topic: 'codbex-invoices.purchaseinvoice.PurchaseInvoicePayment.entityCreated', data: response.data });
				Dialogs.showAlert({
					title: 'PurchaseInvoicePayment',
					message: 'PurchaseInvoicePayment successfully created',
					type: AlertTypes.Success
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'PurchaseInvoicePayment',
					message: `Unable to create PurchaseInvoicePayment: '${message}'`,
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
				Dialogs.postMessage({ topic: 'codbex-invoices.purchaseinvoice.PurchaseInvoicePayment.entityUpdated', data: response.data });
				Dialogs.showAlert({
					title: 'PurchaseInvoicePayment',
					message: 'PurchaseInvoicePayment successfully updated',
					type: AlertTypes.Success
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'PurchaseInvoicePayment',
					message: `Unable to update PurchaseInvoicePayment: '${message}'`,
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.servicePurchaseInvoice = '/services/ts/codbex-invoices/gen/codbex-invoices/api/purchaseinvoice/PurchaseInvoiceService.ts';
		$scope.serviceSupplierPayment = '/services/ts/codbex-payments/gen/codbex-payments/api/SupplierPayment/SupplierPaymentService.ts';

		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: 'Description',
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