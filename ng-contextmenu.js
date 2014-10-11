/*
 * LICENSE: MIT
 * AUTHOR: Clint Powell
 * https://github.com/clintpowell/ngContextmenu
 */

 var app = angular.module('ng-contextmenu', ['ngSanitize']);

app.service('ngContextmenuService', function() {
	var _service = {
        items: [],
        attachto: null,
        _handleClick: function(item) {
        	if(item.disabled)
        		return;
        	return _service.clickHandler(item);
        },
        clickHandler: function() { },
        clickEvent: null,
        attachMenu: function(el) {
        	el[0].style.left = (_service.clickEvent.x+10)+'px';
        	el[0].style.top = (_service.clickEvent.y+10)+'px';
        	el.addClass('open');
        }
    };
    return _service;
});

 app.directive('ngContextmenuContainer', ['ngContextmenuService', function(ngContextmenu) {
     return {
         replace: true,
         template:     '<div class="ng-contextmenu-container">'+
                         '<div ng-repeat="item in menuObject.items" ng-contextmenu-item="item" ng-click="menuObject._handleClick(item)"></div>'+
                     '</div>',
         link: function(scope, el, attrs) {
             scope.menuObject = ngContextmenu;

             scope.$watch('menuObject.clickEvent', function(ev) {
                 if(ev) {
                 	ngContextmenu.attachMenu(el);
                 } else {
                 	el.removeClass('open');
                 }
             });
         }
    }
 }]);

 app.directive('ngContextmenuItem', ['ngContextmenuService', function(ngContextmenu) {
     return {
     	replace: true,
         scope: {
             item: '=ngContextmenuItem'
         },
         template: '<div ng-class="{disabled: item.disabled}" ng-click="!item.disabled && menuObject.clickHandler(item)"><div ng-if="item.divider" class="ng-contextmenu-divider"></div><div ng-if="!item.divider" ng-bind-html="item.title"></div></div>',
         link: function(scope, el, attrs) {
             scope.menuObject = ngContextmenu;
             el.bind('contextmenu click', function (event) {
                scope.$apply(function () {
                    event.stopPropagation();
                    event.preventDefault();
                });
            });
         }
     }
 }]);

 app.directive('ngContextmenu', ['ngContextmenuService', '$window', function(ngContextmenu, $window) {
     return {
         scope: {
             menuItems: '=ngContextmenu'
         },
         link: function(scope, el, attrs) {
             angular.element(document).bind('contextmenu click', function(e) {
                 scope.$apply(function() {
                     ngContextmenu.clickEvent = null;
                     ngContextmenu.attachto = null;
                 });
             });
            el.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.stopPropagation();
                    event.preventDefault();
                    ngContextmenu.attachto = el;
                    ngContextmenu.items = scope.menuItems;
                    ngContextmenu.clickEvent = {x: event.clientX+$window.scrollX, y: event.clientY +$window.scrollY };

                });
            });
         },
     }
 }]);