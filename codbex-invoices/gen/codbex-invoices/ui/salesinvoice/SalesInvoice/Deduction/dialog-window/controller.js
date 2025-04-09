angular.module('page', ['blimpKit', 'platformView', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/DeductionService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, EntityService) => {
		const Dialogs = new DialogHub();
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
				Dialogs.postMessage({ topic: 'codbex-invoices.salesinvoice.Deduction.entityCreated', data: response.data });
				Dialogs.showAlert({
					title: 'Deduction',
					message: 'Deduction successfully created',
					type: AlertTypes.Success
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Deduction',
					message: `Unable to create Deduction: '${message}'`,
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
				Dialogs.postMessage({ topic: 'codbex-invoices.salesinvoice.Deduction.entityUpdated', data: response.data });
				Dialogs.showAlert({
					title: 'Deduction',
					message: 'Deduction successfully updated',
					type: AlertTypes.Success
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Deduction',
					message: `Unable to update Deduction: '${message}'`,
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceAdvanceInvoice = '/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/SalesInvoiceService.ts';

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
			Dialogs.closeWindow({ id: 'Deduction-details' });
		};
	});