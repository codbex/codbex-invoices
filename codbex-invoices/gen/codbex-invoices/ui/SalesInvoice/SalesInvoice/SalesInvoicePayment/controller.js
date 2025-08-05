angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/SalesInvoicePaymentService.ts';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete SalesInvoicePayment? This action cannot be undone.',
			deleteTitle: 'Delete SalesInvoicePayment?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-invoices:defaults.yes');
			translated.no = LocaleService.t('codbex-invoices:defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-invoices:defaults.deleteTitle', { name: '$t(codbex-invoices:t.SALESINVOICEPAYMENT)' });
			translated.deleteConfirm = LocaleService.t('codbex-invoices:messages.deleteConfirm', { name: '$t(codbex-invoices:t.SALESINVOICEPAYMENT)' });
		});
		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-invoices-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'SalesInvoice' && e.view === 'SalesInvoicePayment' && (e.type === 'page' || e.type === undefined));
			$scope.entityActions = response.data.filter(e => e.perspective === 'SalesInvoice' && e.view === 'SalesInvoicePayment' && e.type === 'entity');
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					selectedMainEntityKey: 'SalesInvoice',
					selectedMainEntityId: $scope.selectedMainEntityId,
				},
				maxWidth: action.maxWidth,
				maxHeight: action.maxHeight,
				closeButton: true
			});
		};

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					id: $scope.entity.Id,
					selectedMainEntityKey: 'SalesInvoice',
					selectedMainEntityId: $scope.selectedMainEntityId,
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}
		resetPagination();

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-invoices.SalesInvoice.SalesInvoice.entitySelected', handler: (data) => {
			resetPagination();
			$scope.selectedMainEntityId = data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.SalesInvoice.SalesInvoice.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				resetPagination();
				$scope.selectedMainEntityId = null;
				$scope.data = null;
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.SalesInvoice.SalesInvoicePayment.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.SalesInvoice.SalesInvoicePayment.entityCreated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.SalesInvoice.SalesInvoicePayment.entityUpdated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.SalesInvoice.SalesInvoicePayment.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			let SalesInvoice = $scope.selectedMainEntityId;
			$scope.dataPage = pageNumber;
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {};
			}
			if (!filter.$filter) {
				filter.$filter = {};
			}
			if (!filter.$filter.equals) {
				filter.$filter.equals = {};
			}
			filter.$filter.equals.SalesInvoice = SalesInvoice;
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				filter.$offset = (pageNumber - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				EntityService.search(filter).then((response) => {
					$scope.data = response.data;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-invoices:t.SALESINVOICEPAYMENT'),
						message: LocaleService.t('codbex-invoices:messages.error.unableToLF', { name: '$t(codbex-invoices:t.SALESINVOICEPAYMENT)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-invoices:t.SALESINVOICEPAYMENT'),
					message: LocaleService.t('codbex-invoices:messages.error.unableToCount', { name: '$t(codbex-invoices:t.SALESINVOICEPAYMENT)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.selectEntity = (entity) => {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = (entity) => {
			$scope.selectedEntity = entity;
			Dialogs.showWindow({
				id: 'SalesInvoicePayment-details',
				params: {
					action: 'select',
					entity: entity,
					optionsSalesInvoice: $scope.optionsSalesInvoice,
					optionsCustomerPayment: $scope.optionsCustomerPayment,
				},
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'SalesInvoicePayment-filter',
				params: {
					entity: $scope.filterEntity,
					optionsSalesInvoice: $scope.optionsSalesInvoice,
					optionsCustomerPayment: $scope.optionsCustomerPayment,
				},
			});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			Dialogs.showWindow({
				id: 'SalesInvoicePayment-details',
				params: {
					action: 'create',
					entity: {
						'SalesInvoice': $scope.selectedMainEntityId
					},
					selectedMainEntityKey: 'SalesInvoice',
					selectedMainEntityId: $scope.selectedMainEntityId,
					optionsSalesInvoice: $scope.optionsSalesInvoice,
					optionsCustomerPayment: $scope.optionsCustomerPayment,
				},
				closeButton: false
			});
		};

		$scope.updateEntity = (entity) => {
			Dialogs.showWindow({
				id: 'SalesInvoicePayment-details',
				params: {
					action: 'update',
					entity: entity,
					selectedMainEntityKey: 'SalesInvoice',
					selectedMainEntityId: $scope.selectedMainEntityId,
					optionsSalesInvoice: $scope.optionsSalesInvoice,
					optionsCustomerPayment: $scope.optionsCustomerPayment,
			},
				closeButton: false
			});
		};

		$scope.deleteEntity = (entity) => {
			let id = entity.Id;
			Dialogs.showDialog({
				title: translated.deleteTitle,
				message: translated.deleteConfirm,
				buttons: [{
					id: 'delete-btn-yes',
					state: ButtonStates.Emphasized,
					label: translated.yes,
				}, {
					id: 'delete-btn-no',
					label: translated.no,
				}],
				closeButton: false
			}).then((buttonId) => {
				if (buttonId === 'delete-btn-yes') {
					EntityService.delete(id).then(() => {
						$scope.loadPage($scope.dataPage, $scope.filter);
						Dialogs.triggerEvent('codbex-invoices.SalesInvoice.SalesInvoicePayment.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-invoices:t.SALESINVOICEPAYMENT'),
							message: LocaleService.t('codbex-invoices:messages.error.unableToDelete', { name: '$t(codbex-invoices:t.SALESINVOICEPAYMENT)', message: message }),
							type: AlertTypes.Error,
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsSalesInvoice = [];
		$scope.optionsCustomerPayment = [];


		$http.get('/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/SalesInvoiceService.ts').then((response) => {
			$scope.optionsSalesInvoice = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'SalesInvoice',
				message: LocaleService.t('codbex-invoices:messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-payments/gen/codbex-payments/api/CustomerPayment/CustomerPaymentService.ts').then((response) => {
			$scope.optionsCustomerPayment = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'CustomerPayment',
				message: LocaleService.t('codbex-invoices:messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$scope.optionsSalesInvoiceValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsSalesInvoice.length; i++) {
				if ($scope.optionsSalesInvoice[i].value === optionKey) {
					return $scope.optionsSalesInvoice[i].text;
				}
			}
			return null;
		};
		$scope.optionsCustomerPaymentValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsCustomerPayment.length; i++) {
				if ($scope.optionsCustomerPayment[i].value === optionKey) {
					return $scope.optionsCustomerPayment[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});
