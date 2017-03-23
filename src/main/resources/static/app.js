var app = angular.module('archive', []);

app.directive('fileModel', [ '$parse', function($parse) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function() {
				scope.$apply(function() {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
} ]);

app.service('ArchiveService', [ '$http', '$rootScope', function($http, $rootScope) {
	this.search = function(registrationnumber, date) {
		$http.get("http://localhost:8080/archive/documents", {
			params : {
				registrationnumber : registrationnumber,
				date : date
			}
		}).success(function(response) {
			$rootScope.metadataList = response;
		}).error(function() {
		});
	}
}]);

app.service('fileUpload', ['$http','ArchiveService', function($http, ArchiveService) {
	this.uploadFileToUrl = function(uploadUrl, file, registrationnumber, date) {
		var fd = new FormData();
		fd.append('file', file);
		fd.append('registrationnumber', registrationnumber);
		fd.append('date', date);
		$http.post(uploadUrl, fd, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).success(function() {
			ArchiveService.search(null, null);
		}).error(function() {
		});
	}
} ]);

app.controller('UploadCtrl', [ '$scope', 'fileUpload',
		function($scope, fileUpload) {
			$scope.uploadFile = function() {
				var file = $scope.filex;
				console.log('scope filex is ' + $scope.filex)
				var registrationnumber = $scope.registrationnumber;
				var date = $scope.date;
				console.log('file is ' + JSON.stringify(file));
				var uploadUrl = "/archive/upload";
				fileUpload.uploadFileToUrl(uploadUrl, file, registrationnumber, date);
			};
		} ]);

app.controller('ArchiveCtrl', function($scope, $http) {
	$scope.search = function(registrationnumber, date) {
		$http.get("http://localhost:8080/archive/documents", {
			params : {
				registrationnumber : registrationnumber,
				date : date
			}
		}).success(function(response) {
			$scope.metadataList = response;
		});
	};
});

app.run(function($rootScope, $http) {
	$http.get("http://localhost:8080/archive/documents").success(
			function(response) {
				$rootScope.metadataList = response;
			});
});

function sortByLabel(claims) {
	claims.sort(function(a, b) {
		var labelA = a.label.toLowerCase(), labelB = b.label.toLowerCase();
		if (labelA < labelB) // sort string ascending
			return -1;
		if (labelA > labelB)
			return 1;
		return 0; // default return value (no sorting)
	});
}
