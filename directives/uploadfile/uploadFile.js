Dhis2Api.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
Dhis2Api.service('fileUpload', ['$http','commonvariable', function ($http,commonvariable) {
    this.uploadFileToUrl = function(file, uploadUrl,name,folder){
        var fd = new FormData();
        fd.append('file', file);
        fd.append('name',name);
        fd.append('folder',folder);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
            transformResponse: function (data, headers) {
            	data=angular.fromJson(data); 
            	return data;
            }
        })
        .success(function (data) {
        	commonvariable.Fileupload=data;
        })
        .error(function (data) {
            console.log(data);
        });
    }
}]);
