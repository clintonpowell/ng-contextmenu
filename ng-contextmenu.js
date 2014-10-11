/*
 * LICENSE: MIT
 * AUTHOR: Clint Powell
 * https://github.com/clintpowell/ngContextmenu
 */

 var app = angular.module('ng-contextmenu', ['ngSanitize']);

app.service('ngContextmenuService', ['$window', '$timeout', function($window, $apply) {
	var _elementDimensions = function(el) {
		if(!$window.getComputedStyle) {
			return {
				width: el.offsetWidth,
				height: el.offsetHeight
			};
		} else {
			return {
				width: parseInt($window.getComputedStyle(el, "").getPropertyValue("width").split('px')[0]),
				height: parseInt($window.getComputedStyle(el, "").getPropertyValue("height").split('px')[0])
			};
		}
	};

	// Checks if the menu, when opened, will extend off the screen.
	// Need to reposition if this is the case
	var _positionMenu = function(el) {
		var yMax = $window.innerHeight + $window.scrollY;
		var xMax = $window.innerWidth + $window.scrollX;
		var elementDimensions = _elementDimensions(el);
		var bottomY = _service.clickEvent.y+10 + elementDimensions.height + 2;
		var rightX = _service.clickEvent.x+10 + elementDimensions.width + 2;
		if(bottomY >= yMax) {
			el.style.top = (_service.clickEvent.y - elementDimensions.height - 10)+'px';
		} else {
			el.style.top = (_service.clickEvent.y+10)+'px';
		}
		if(rightX >= xMax) {
			el.style.left = (_service.clickEvent.x - elementDimensions.width - 10)+'px';
		} else {
			el.style.left = (_service.clickEvent.x+10)+'px';
		}
	};

	var _service = {
        _handleClick: function(item) {
        	if(item.disabled)
        		return;
        	return _service.clickHandler(item, _service._extraData);
        },
        _extraData: { },
        items: [],
        attachto: null,
        clickHandler: function() { },
        clickEvent: null,
        attachMenu: function(el) {
        	// Wrap this in a timeout, since we need the menu items to have
        	// been populated to calculate width / height
        	$apply(function() {
        		_positionMenu(el[0]);
        		el.addClass('open');
        	});
        }
    };
    return _service;
}]);

 app.directive('ngContextmenuContainer', ['ngContextmenuService', function(ngContextmenu) {
     return {
         replace: true,
     	template:   '<div class="ng-contextmenu-container">'+
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

 app.directive('ngContextmenuItem', ['ngContextmenuService', '$timeout',  function(ngContextmenu, $apply) {
     return {
     	replace: true,
         scope: {
             item: '=ngContextmenuItem',
             extra: '=ngContextmenuData'
         },
         template: '<div ng-class="{disabled: item.disabled}"><div ng-if="item.divider" class="ng-contextmenu-divider"></div><div ng-if="!item.divider" ng-bind-html="item.title"></div></div>',
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

 app.directive('ngContextmenu', ['ngContextmenuService', '$window', '$timeout',  function(ngContextmenu, $window, $apply) {
     return {
         scope: {
             menuItems: '=ngContextmenu',
             extraData: '=ngContextmenuData'
         },
         link: function(scope, el, attrs) {
         	var _currentTouch = null;

            angular.element(document).bind('touchend', function(e) {
            	if(_currentTouch) {
            		e.stopPropagation();
            		e.preventDefault();
            		delete _currentTouch;
            	}
            });

            angular.element(document).bind('contextmenu click', function(e) {
                $apply(function() {
                    ngContextmenu.clickEvent = null;
                    ngContextmenu.attachto = null;
                });
            });

            el.bind('touchstart', function(e) {
            	(function(el, ev) {
            		_currentTouch = {element: el};
            		setTimeout(function() {
            			if(_currentTouch && _currentTouch.element == el) {
            				delete _currentTouch;
            				$apply(function() {
	            				ngContextmenu.attachto = el;
			                    ngContextmenu.items = scope.menuItems;
			                    ngContextmenu._extraData = scope.extraData;
			                    ngContextmenu.clickEvent = {x: ev.clientX+$window.scrollX, y: ev.clientY +$window.scrollY };
			                });
            			}
            		}, 800)
            	})(el, e);
            });

            el.bind('contextmenu', function (e) {
                $apply(function () {
                    e.stopPropagation();
                    e.preventDefault();
                    ngContextmenu.attachto = el;
                    ngContextmenu.items = scope.menuItems;
                    ngContextmenu._extraData = scope.extraData;
                    ngContextmenu.clickEvent = {x: e.clientX+$window.scrollX, y: e.clientY +$window.scrollY };
                });
            });
         },
     }
 }]);