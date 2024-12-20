angular.module('page', ["ideUI", "ideView"])
	.controller('PageController', ['$scope', 'ViewParameters', function ($scope, ViewParameters) {

		$scope.entity = {};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = "select";;

			if (params.entity['purchaseinvoiceDate']) {
				params.entity['purchaseinvoiceDate'] = new Date(params.entity['purchaseinvoiceDate']);
			}
			if (params.entity['purchaseinvoiceDue']) {
				params.entity['purchaseinvoiceDue'] = new Date(params.entity['purchaseinvoiceDue']);
			}
			$scope.entity = params.entity;
		}

	}]);