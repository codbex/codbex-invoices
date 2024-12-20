angular.module('page', ["ideUI", "ideView", "entityApi"])
    .config(["messageHubProvider", function (messageHubProvider) {
        messageHubProvider.eventIdPrefix = 'codbex-invoices.Reports.UNPAID_PURCHASEINVOICE';
    }])
    .config(["entityApiProvider", function (entityApiProvider) {
        entityApiProvider.baseUrl = "/services/ts/codbex-invoices/gen/unpaid-purchaseinvoice/api/UNPAID_PURCHASEINVOICE/UNPAID_PURCHASEINVOICEService.ts";
    }])
    .controller('PageController', ['$scope', 'messageHub', 'entityApi', 'ViewParameters', function ($scope, messageHub, entityApi, ViewParameters) {

		let params = ViewParameters.get();
		if (Object.keys(params).length) {         
            const filterEntity = params.filterEntity ?? {};

			const filter = {
			};

            $scope.filter = filter;
		}

        $scope.loadPage = function (filter) {
            if (!filter && $scope.filter) {
                filter = $scope.filter;
            }
            let request;
            if (filter) {
                request = entityApi.search(filter);
            } else {
                request = entityApi.list();
            }
            request.then(function (response) {
                if (response.status != 200) {
                    messageHub.showAlertError("UNPAID_PURCHASEINVOICE", `Unable to list/filter UNPAID_PURCHASEINVOICE: '${response.message}'`);
                    return;
                }

                response.data.forEach(e => {
                    if (e['purchaseinvoiceDate']) {
                        e['purchaseinvoiceDate'] = new Date(e['purchaseinvoiceDate']);
                    }
                    if (e['purchaseinvoiceDue']) {
                        e['purchaseinvoiceDue'] = new Date(e['purchaseinvoiceDue']);
                    }
                });

                $scope.data = response.data;
                setTimeout(() => {
                    window.print();

                }, 250);
            });
        };
        $scope.loadPage($scope.filter);

        window.onafterprint = () => {
            messageHub.closeDialogWindow("codbex-invoices-Reports-UNPAID_PURCHASEINVOICE-print");
        }

    }]);