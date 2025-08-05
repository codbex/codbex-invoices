angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
	$scope.entity = {};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		$scope.action = 'select';

		if (params.entity['Date']) {
			params.entity['Date'] = new Date(params.entity['Date']);
		}
		$scope.entity = params.entity;
	}
});