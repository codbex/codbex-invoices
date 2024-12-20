angular.module('page', ["ideUI", "ideView"])
	.controller('PageController', ['$scope', 'ViewParameters', function ($scope, ViewParameters) {

		$scope.entity = {};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = "select";;

			if (params.entity['salesinvoiceDate']) {
				params.entity['salesinvoiceDate'] = new Date(params.entity['salesinvoiceDate']);
			}
			if (params.entity['salesinvoiceDue']) {
				params.entity['salesinvoiceDue'] = new Date(params.entity['salesinvoiceDue']);
			}
			$scope.entity = params.entity;
		}

	}]);