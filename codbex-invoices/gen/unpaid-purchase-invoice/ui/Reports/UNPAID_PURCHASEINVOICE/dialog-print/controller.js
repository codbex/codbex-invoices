angular.module('page', ['blimpKit', 'platformView', 'EntityService'])
    .config(['EntityServiceProvider', (EntityServiceProvider) => {
        EntityServiceProvider.baseUrl = '/services/ts/codbex-invoices/gen/unpaid-purchase-invoice/api/Reports/UNPAID_PURCHASEINVOICEService.ts';
    }])
    .controller('PageController', ($scope, EntityService, ViewParameters) => {
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
                    if (e['Due']) {
                        e['Due'] = new Date(e['Due']);
                    }
                });

                $scope.data = response.data;
                setTimeout(() => {
                    window.print();
                }, 250);
            }, (error) => {
                const message = error.data ? error.data.message : '';
                Dialogs.showAlert({
                    title: 'UNPAID_PURCHASEINVOICE',
                    message: `Unable to list/filter UNPAID_PURCHASEINVOICE: '${message}'`,
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