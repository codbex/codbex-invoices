angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/codbex-invoices/api/PurchaseInvoice/PurchaseInvoicePaymentController.ts';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete PurchaseInvoicePayment? This action cannot be undone.',
			deleteTitle: 'Delete PurchaseInvoicePayment?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.yes');
			translated.no = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-invoices:codbex-invoices-model.defaults.deleteTitle', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT)' });
			translated.deleteConfirm = LocaleService.t('codbex-invoices:codbex-invoices-model.messages.deleteConfirm', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT)' });
		});
		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-invoices-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'PurchaseInvoice' && e.view === 'PurchaseInvoicePayment' && (e.type === 'page' || e.type === undefined));
			$scope.entityActions = response.data.filter(e => e.perspective === 'PurchaseInvoice' && e.view === 'PurchaseInvoicePayment' && e.type === 'entity');
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					selectedMainEntityKey: 'PurchaseInvoice',
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
					selectedMainEntityKey: 'PurchaseInvoice',
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
		Dialogs.addMessageListener({ topic: 'codbex-invoices.PurchaseInvoice.PurchaseInvoice.entitySelected', handler: (data) => {
			resetPagination();
			$scope.selectedMainEntityId = data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.PurchaseInvoice.PurchaseInvoice.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				resetPagination();
				$scope.selectedMainEntityId = null;
				$scope.data = null;
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.PurchaseInvoice.PurchaseInvoicePayment.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.PurchaseInvoice.PurchaseInvoicePayment.entityCreated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.PurchaseInvoice.PurchaseInvoicePayment.entityUpdated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.PurchaseInvoice.PurchaseInvoicePayment.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			let PurchaseInvoice = $scope.selectedMainEntityId;
			$scope.dataPage = pageNumber;
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {
					$filter: {
						conditions: []
					}
				};
			}
			filter.$filter.conditions.push({ propertyName: 'PurchaseInvoice', operator: 'EQ', value: PurchaseInvoice });
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				filter.$filter.offset = (pageNumber - 1) * $scope.dataLimit;
				filter.$filter.limit = $scope.dataLimit;
				EntityService.search(filter).then((response) => {
					$scope.data = response.data;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT'),
						message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLF', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT'),
					message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToCount', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT)', message: message }),
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
				id: 'PurchaseInvoicePayment-details',
				params: {
					action: 'select',
					entity: entity,
					optionsPurchaseInvoice: $scope.optionsPurchaseInvoice,
					optionsSupplierPayment: $scope.optionsSupplierPayment,
				},
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'PurchaseInvoicePayment-filter',
				params: {
					entity: $scope.filterEntity,
					optionsPurchaseInvoice: $scope.optionsPurchaseInvoice,
					optionsSupplierPayment: $scope.optionsSupplierPayment,
				},
			});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			Dialogs.showWindow({
				id: 'PurchaseInvoicePayment-details',
				params: {
					action: 'create',
					entity: {
						'PurchaseInvoice': $scope.selectedMainEntityId
					},
					selectedMainEntityKey: 'PurchaseInvoice',
					selectedMainEntityId: $scope.selectedMainEntityId,
					optionsPurchaseInvoice: $scope.optionsPurchaseInvoice,
					optionsSupplierPayment: $scope.optionsSupplierPayment,
				},
				closeButton: false
			});
		};

		$scope.updateEntity = (entity) => {
			Dialogs.showWindow({
				id: 'PurchaseInvoicePayment-details',
				params: {
					action: 'update',
					entity: entity,
					selectedMainEntityKey: 'PurchaseInvoice',
					selectedMainEntityId: $scope.selectedMainEntityId,
					optionsPurchaseInvoice: $scope.optionsPurchaseInvoice,
					optionsSupplierPayment: $scope.optionsSupplierPayment,
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
						Dialogs.triggerEvent('codbex-invoices.PurchaseInvoice.PurchaseInvoicePayment.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT'),
							message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToDelete', { name: '$t(codbex-invoices:codbex-invoices-model.t.PURCHASEINVOICEPAYMENT)', message: message }),
							type: AlertTypes.Error,
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsPurchaseInvoice = [];
		$scope.optionsSupplierPayment = [];


		$http.get('/services/ts/codbex-invoices/gen/codbex-invoices/api/PurchaseInvoice/PurchaseInvoiceController.ts').then((response) => {
			$scope.optionsPurchaseInvoice = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'PurchaseInvoice',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-payments/gen/codbex-payments/api/SupplierPayment/SupplierPaymentController.ts').then((response) => {
			$scope.optionsSupplierPayment = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'SupplierPayment',
				message: LocaleService.t('codbex-invoices:codbex-invoices-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$scope.optionsPurchaseInvoiceValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsPurchaseInvoice.length; i++) {
				if ($scope.optionsPurchaseInvoice[i].value === optionKey) {
					return $scope.optionsPurchaseInvoice[i].text;
				}
			}
			return null;
		};
		$scope.optionsSupplierPaymentValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsSupplierPayment.length; i++) {
				if ($scope.optionsSupplierPayment[i].value === optionKey) {
					return $scope.optionsSupplierPayment[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});
