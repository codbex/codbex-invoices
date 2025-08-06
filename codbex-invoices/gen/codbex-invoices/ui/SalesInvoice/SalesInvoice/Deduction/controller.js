angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/DeductionService.ts';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete Deduction? This action cannot be undone.',
			deleteTitle: 'Delete Deduction?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-invoices:defaults.yes');
			translated.no = LocaleService.t('codbex-invoices:defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-invoices:defaults.deleteTitle', { name: '$t(codbex-invoices:t.DEDUCTION)' });
			translated.deleteConfirm = LocaleService.t('codbex-invoices:messages.deleteConfirm', { name: '$t(codbex-invoices:t.DEDUCTION)' });
		});
		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-invoices-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'SalesInvoice' && e.view === 'Deduction' && (e.type === 'page' || e.type === undefined));
			$scope.entityActions = response.data.filter(e => e.perspective === 'SalesInvoice' && e.view === 'Deduction' && e.type === 'entity');
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					selectedMainEntityKey: 'DeductionInvoice',
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
					selectedMainEntityKey: 'DeductionInvoice',
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
		Dialogs.addMessageListener({ topic: 'codbex-invoices.SalesInvoice.Deduction.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.SalesInvoice.Deduction.entityCreated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.SalesInvoice.Deduction.entityUpdated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-invoices.SalesInvoice.Deduction.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			let DeductionInvoice = $scope.selectedMainEntityId;
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
			filter.$filter.equals.DeductionInvoice = DeductionInvoice;
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
						title: LocaleService.t('codbex-invoices:t.DEDUCTION'),
						message: LocaleService.t('codbex-invoices:messages.error.unableToLF', { name: '$t(codbex-invoices:t.DEDUCTION)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-invoices:t.DEDUCTION'),
					message: LocaleService.t('codbex-invoices:messages.error.unableToCount', { name: '$t(codbex-invoices:t.DEDUCTION)', message: message }),
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
				id: 'Deduction-details',
				params: {
					action: 'select',
					entity: entity,
					optionsAdvanceInvoice: $scope.optionsAdvanceInvoice,
				},
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'Deduction-filter',
				params: {
					entity: $scope.filterEntity,
					optionsAdvanceInvoice: $scope.optionsAdvanceInvoice,
				},
			});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			Dialogs.showWindow({
				id: 'Deduction-details',
				params: {
					action: 'create',
					entity: {
						'DeductionInvoice': $scope.selectedMainEntityId
					},
					selectedMainEntityKey: 'DeductionInvoice',
					selectedMainEntityId: $scope.selectedMainEntityId,
					optionsAdvanceInvoice: $scope.optionsAdvanceInvoice,
				},
				closeButton: false
			});
		};

		$scope.updateEntity = (entity) => {
			Dialogs.showWindow({
				id: 'Deduction-details',
				params: {
					action: 'update',
					entity: entity,
					selectedMainEntityKey: 'DeductionInvoice',
					selectedMainEntityId: $scope.selectedMainEntityId,
					optionsAdvanceInvoice: $scope.optionsAdvanceInvoice,
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
						Dialogs.triggerEvent('codbex-invoices.SalesInvoice.Deduction.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-invoices:t.DEDUCTION'),
							message: LocaleService.t('codbex-invoices:messages.error.unableToDelete', { name: '$t(codbex-invoices:t.DEDUCTION)', message: message }),
							type: AlertTypes.Error,
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsAdvanceInvoice = [];


		$http.get('/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/SalesInvoiceService.ts').then((response) => {
			$scope.optionsAdvanceInvoice = response.data.map(e => ({
				value: e.Id,
				text: e.Number
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'AdvanceInvoice',
				message: LocaleService.t('codbex-invoices:messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$scope.optionsAdvanceInvoiceValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsAdvanceInvoice.length; i++) {
				if ($scope.optionsAdvanceInvoice[i].value === optionKey) {
					return $scope.optionsAdvanceInvoice[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});
