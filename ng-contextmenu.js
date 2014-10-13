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
        	if(navigator.vibrate) {
        		navigator.vibrate(20);
        	}
        	$apply(function() {
        		_positionMenu(el[0]);
        		el.addClass('open');
                (function(el) {
                    setTimeout(function() { 
                        el.removeClass('noselect');
                    }, 1200 - _service.options.tapHoldLength);
                })(_service.attachto);
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
        },
        options: {
            tapHoldLength: 400
        },
        // useragent script courtesy of http://detectmobilebrowsers.com
        isMobile: (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test($window.navigator.userAgent||$window.navigator.vendor||$window.opera)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(($window.navigator.userAgent||$window.navigator.vendor||$window.opera).substr(0,4)))
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

            //shim for html5 vibrate API
            navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

            scope.$watch('menuObject.clickEvent', function(ev) {
                if(ev) {
                    ngContextmenu.attachMenu(el);
                } else {
                    el.removeClass('open');
                }
            });

            angular.element(document).bind('contextmenu click', function(e) {
                $apply(function() {

                    // prevent closing of menu for mobile long-tap menu
                    if(ngContextmenu._currentTouch) {
                        ngContextmenu._currentTouch = null;
                        return;
                    }
                    if(ngContextmenu.attachto) {
                        ngContextmenu.attachto.removeClass('open');
                        ngContextmenu.isMobile && ngContextmenu.attachto.addClass('noselect');
                    }
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
            el.addClass('ng-contextmenu');
            if(ngContextmenu.isMobile) {
                el.addClass('noselect');
            }
            el.bind('touchstart', function(e) {
            	(function(el, ev) {
            		ngContextmenu._currentTouch = {element: el};
            		setTimeout(function() {
            			if(ngContextmenu._currentTouch && ngContextmenu._currentTouch.element == el) {
            				$apply(function() {
                                if(ngContextmenu.attachto) {
                                    ngContextmenu.attachto.removeClass('open');
                                    ngContextmenu.isMobile && ngContextmenu.attachto.addClass('noselect');
                                }
                                el.addClass('open');
	            				ngContextmenu.attachto = el;
			                    ngContextmenu.items = scope.menuItems;
			                    ngContextmenu._extraData = scope.extraData;
			                    ngContextmenu.clickEvent = {
			                    	x: ngContextmenu.eventPosition(e, true).x,
                    				y: ngContextmenu.eventPosition(e, true).y
			                    };
			                });
            			}
            		}, ngContextmenu.options.tapHoldLength)
            	})(el, e);
            });

            el.bind('contextmenu', function (e) {
        	    e.stopPropagation();
                e.preventDefault();
                $apply(function () {
                    if(ngContextmenu.attachto) {
                        ngContextmenu.attachto.removeClass('open');
                        ngContextmenu.isMobile && ngContextmenu.attachto.addClass('noselect');
                    }
                    el.addClass('open');
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