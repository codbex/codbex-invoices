angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
    .config(['EntityServiceProvider', (EntityServiceProvider) => {
        EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/cashflow/api/Reports/CASHFLOWService.ts';
    }])
    .controller('PageController', ($scope, EntityService, LocaleService, ViewParameters) => {
        const Dialogs = new DialogHub();
		let params = ViewParameters.get();
		if (Object.keys(params).length) {         
            const filterEntity = params.filterEntity ?? {};

			$scope.filter = {};
		}

        $scope.loadPage = (filter) => {
            if (!filter && $scope.filter) {
                filter = $scope.filter;
            }
            let request;
            if (filter) {
                request = EntityService.search(filter);
            } else {
                request = EntityService.list();
            }
            request.then((response) => {
                response.data.forEach(e => {
                    if (e['Date']) {
                        e['Date'] = new Date(e['Date']);
                    }
                });

                $scope.data = response.data;
                setTimeout(() => {
                    window.print();
                }, 250);
            }, (error) => {
                const message = error.data ? error.data.message : '';
                Dialogs.showAlert({
                    title: LocaleService.t('codbex-invoices:cashflow-report.t.Cashflow'),
                    message: LocaleService.t('codbex-invoices:cashflow-report.messages.error.unableToLF', { name: '$t(codbex-invoices:cashflow-report.t.Cashflow)', message: message }),
                    type: AlertTypes.Error
                });
                console.error('EntityService:', error);
            });
        };
        $scope.loadPage($scope.filter);

        window.onafterprint = () => {
            Dialogs.closeWindow({ path: viewData.path });
        }
    });