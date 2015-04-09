(function(){
    "use strict";

    angular.module('Bookmarks',[
        'ngResource'
    ])

    .service('Category',function ($http){
        this.getAll = function(success, failure){
            $http.get('http://bookmarks-angular.herokuapp.com/api/categories')
            .success(success)
            .error(failure);  
        }
    })

    .factory('Bookmark',function ($resource){
        return $resource('http://bookmarks-angular.herokuapp.com/api/bookmarks');
    })

    .controller('MainController',function ($scope, Category, Bookmark){
        $scope.name = 'Gorka';

        Category.getAll(
            function (data){
                $scope.categories = data.categories;
                $scope.currentCategory = data.categories[0];
                $scope.bookmarks = Bookmark.query();
            }
        );

        $scope.setCurrentCategory = function(category){
            $scope.currentCategory = category;
        }

        $scope.isCurrentCategory = function(category){
            return $scope.currentCategory.id === category.id;
        }

        $scope.save = function(bookmark){
            if($scope.bookmarkForm.$valid){
                if(!bookmark.id){
                    var record = angular.copy(bookmark);

                    record.id = $scope.bookmarks.length;
                    $scope.bookmarks.push(record);
                }
                $('#bookmarkModal').modal('hide');
            }
        }

        $scope.save = function(bookmark){
            if($scope.bookmarkForm.$valid){
                if(!bookmark.id){
                    var record = new Bookmark();

                    record.title = bookmark.title;
                    record.url = bookmark.url;
                    record.category_id = bookmark.category.id;

                    record.$save(function(){
                        $scope.bookmarks.push(record);
                    });
                }
                $('#bookmarkModal').modal('hide');
            }
        }

        $scope.remove = function(id){
            for(var i=0,len=$scope.bookmarks.length;i<len;i++){
                if($scope.bookmarks[i].id === id){
                    $scope.bookmarks.splice(i,1);
                    break;
                }
            }
        }

        $scope.showWindow = function(bookmark){
            $scope.bookmarkForm.$setPristine();
            $scope.bookmarkForm.$setUntouched();

            bookmark = bookmark || {category:$scope.currentCategory,url:''};
            $scope.bookmark = bookmark;       
            $('#bookmarkModal').modal('show');
        }
    });
})();