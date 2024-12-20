angular.module('page', ["ideUI", "ideView", "entityApi"])
    .config(["messageHubProvider", function (messageHubProvider) {
        messageHubProvider.eventIdPrefix = 'codbex-invoices.Reports.UNPAID_SALESINVOICE';
    }])
    .config(["entityApiProvider", function (entityApiProvider) {
        entityApiProvider.baseUrl = "/services/ts/codbex-invoices/gen/unpaid-salesinvoice/api/UNPAID_SALESINVOICE/UNPAID_SALESINVOICEService.ts";
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
                    messageHub.showAlertError("UNPAID_SALESINVOICE", `Unable to list/filter UNPAID_SALESINVOICE: '${response.message}'`);
                    return;
                }

                response.data.forEach(e => {
                    if (e['salesinvoiceDate']) {
                        e['salesinvoiceDate'] = new Date(e['salesinvoiceDate']);
                    }
                    if (e['salesinvoiceDue']) {
                        e['salesinvoiceDue'] = new Date(e['salesinvoiceDue']);
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
            messageHub.closeDialogWindow("codbex-invoices-Reports-UNPAID_SALESINVOICE-print");
        }

    }]);
