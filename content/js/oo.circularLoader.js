var app = angular.module('myApp', []);

function callLoader(value){
var total = value;
alert("in call loader == > " + value);
	app.controller('myCtrl', function($scope) {
	    $scope.total = total;
	});	
}
