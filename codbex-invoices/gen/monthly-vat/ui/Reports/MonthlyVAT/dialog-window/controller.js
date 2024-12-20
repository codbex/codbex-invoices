angular.module('page', ["ideUI", "ideView"])
	.controller('PageController', ['$scope', 'ViewParameters', function ($scope, ViewParameters) {

		$scope.entity = {};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = "select";;

			if (params.entity['DueDate']) {
				params.entity['DueDate'] = new Date(params.entity['DueDate']);
			}
			$scope.entity = params.entity;
		}

	}]);