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
	}

	, _eventPosition = function(ev) {

	}

	// Checks if the menu, when opened, will extend off the screen.
	// Need to reposition if this is the case
	, _positionMenu = function(el) {
		var yMax = $window.innerHeight + ($window.scrollY || $window.pageYOffset);
		var xMax = $window.innerWidth + ($window.scrollX || $window.pageXOffset);
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
	}

	, _service = {
        _handleClick: function(item) {
        	if(item.disabled)
        		return;
        	_service.attachto = _service.clickEvent = null;
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
        },
        eventPosition: function(e, touch) {
        	if(touch) {
        		e = e.touches[0];
        	}
        	var x = e.clientX !== undefined ? e.clientX : e.pageX
        	,   y = e.clientX !== undefined ? e.clientY : e.pageY;
        	x += $window.scrollX === undefined ? $window.pageXOffset : $window.scrollX;
        	y += $window.scrollY === undefined ? $window.pageYOffset : $window.scrollY;
        	return {
        		x: x, y: y
        	};
        }
    };
    return _service;
}]);

 app.directive('ngContextmenuContainer', ['ngContextmenuService', '$timeout',  function(ngContextmenu, $apply) {
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

            angular.element(document).bind('touchend', function(e) {
            	if(ngContextmenu._currentTouch) {
            		e.stopPropagation();
            		e.preventDefault();
            		ngContextmenu._currentTouch = null;
            	}
            });

            angular.element(document).bind('contextmenu click', function(e) {
                $apply(function() {
                    ngContextmenu.clickEvent = null;
                    ngContextmenu.attachto = null;
                });
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

            el.bind('touchstart', function(e) {
            	(function(el, ev) {
            		ngContextmenu._currentTouch = {element: el};
            		setTimeout(function() {
            			if(ngContextmenu._currentTouch && ngContextmenu._currentTouch.element == el) {
            				ngContextmenu._currentTouch = null;
            				$apply(function() {
	            				ngContextmenu.attachto = el;
			                    ngContextmenu.items = scope.menuItems;
			                    ngContextmenu._extraData = scope.extraData;
			                    ngContextmenu.clickEvent = {
			                    	x: ngContextmenu.eventPosition(e, true).x,
                    				y: ngContextmenu.eventPosition(e, true).y
			                    };
			                });
            			}
            		}, 800)
            	})(el, e);
            });

            el.bind('contextmenu', function (e) {
        	    e.stopPropagation();
                e.preventDefault();
                $apply(function () {

                    ngContextmenu.attachto = el;
                    ngContextmenu.items = scope.menuItems;
                    ngContextmenu._extraData = scope.extraData;
                    ngContextmenu.clickEvent = {
                    	x: ngContextmenu.eventPosition(e).x,
                    	y: ngContextmenu.eventPosition(e).y
                    };
                });
            });
         },
     }
 }]);