(function(){
    "use strict";

    angular.module('Bookmarks',[
    
    ])

    .controller('MainController',function ($scope){
        $scope.name = 'Gorka';
        $scope.categories = ['HTML5','JavaScript','CSS','Games'];
    });
})();