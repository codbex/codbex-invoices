angular.module('page', ['blimpKit', 'platformView']).controller('PageController', ($scope, ViewParameters) => {
	$scope.entity = {};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		$scope.action = 'select';

		$scope.entity = params.entity;
	}
});