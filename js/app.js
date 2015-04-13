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
        return $resource('http://bookmarks-angular.herokuapp.com/api/bookmarks/:id',
            {
                id:'@id'
            },
            {
                update : {method:'PUT'}
            }
        );
    })

	.directive('modal', function () {
	    return {
	      template: '<div class="modal fade">' + 
	          '<div class="modal-dialog">' + 
	            '<div class="modal-content">' + 
	              '<div class="modal-header">' + 
	                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
	                '<h4 class="modal-title">{{ title }}</h4>' + 
	              '</div>' + 
	              '<div class="modal-body" ng-transclude></div>' + 
	            '</div>' + 
	          '</div>' + 
	        '</div>',
	      restrict: 'E',
	      transclude: true,
	      replace:true,
	      scope:true,
	      link: function postLink(scope, element, attrs) {
	        scope.title = attrs.title;

	        scope.$watch(attrs.visible, function(value){
	          if(value == true)
	            $(element).modal('show');
	          else
	            $(element).modal('hide');
	        });

	        $(element).on('shown.bs.modal', function(){
	          scope.$apply(function(){
	            scope.$parent[attrs.visible] = true;
	          });
	        });

	        $(element).on('hidden.bs.modal', function(){
	          scope.$apply(function(){
	            scope.$parent[attrs.visible] = false;
	          });
	        });
	      }
	    };
	  })

    .directive('bootstrapSelect', function ($parse){

        return {
            link: function (scope, element, attrs) {
                var collection = attrs.bootstrapSelect,
                valueProperty = attrs.selectValue,
                labelProperty = attrs.selectLabel,
                model = attrs.selectModel,
                getter = $parse(model),
                setter = getter.assign;

                $(element).selectpicker();

                scope.$watch(collection, function (data){
                    if(data){
                        $(element).find('option').remove();
                        var html = [];
                        $.each(data, function(index, object) {
                            html.push('<option value="'+object[valueProperty]+'">');
                            html.push(object[labelProperty]);
                            html.push('</option>');
                        });
                        $(element).append(html.join(''));
                        $(element).selectpicker('refresh');
                    }
                });

                scope.$watch(model, function (data){
                    if(angular.isObject(data)){
                        $(element).selectpicker('val',data[valueProperty]);
                    }
                });

                $(element).change(function(){
                    var col = scope[collection],
                    val = $(element).val();

                    for(var i=0,len=col.length;i<len;i++){
                        if(val == col[i][valueProperty]){
                            setter(scope,col[i]);
                            break;
                        }
                    }
                });
            }

        }
    })

    .controller('MainController',function ($scope, Category, Bookmark){
		$scope.showModal = false;

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
            //if($scope.bookmarkForm.$valid){
            if(!bookmark.id){
                var record = new Bookmark();

                record.title = bookmark.title;
                record.url = bookmark.url;
                record.category_id = bookmark.category.id;

                record.$save(function(){
                    $scope.bookmarks.push(record);
                });
            }else{
                bookmark.$update();
            }
            $scope.showModal = !$scope.showModal;
            //}
        }

        $scope.remove = function(bookmark){
            bookmark.$remove(function(){
                for(var i=0,len=$scope.bookmarks.length;i<len;i++){
                    if($scope.bookmarks[i].id === bookmark.id){
                        $scope.bookmarks.splice(i,1);
                        break;
                    }
                }
            });
        }

        $scope.showWindow = function(bookmark){
            //$scope.bookmarkForm.$setPristine();
            //$scope.bookmarkForm.$setUntouched();

            bookmark = bookmark || {category:$scope.currentCategory,url:''};
            $scope.bookmark = bookmark;       
            $scope.showModal = !$scope.showModal;
        }
    });
})();