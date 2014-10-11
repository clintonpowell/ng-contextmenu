ng-contextmenu
==============
Depends on `angular` and `angular-sanitize`

Lightweight Angular.js context menu module, styled after Google Chrome context menu 

**Quick usage instructions**:

Include the `ng-contextmenu.css` and `ng-contextmenu.js` in your markup however you wish.

In your angular app, require the `ng-contextmenu` module:

```JavaScript
    var myApp = angular.module('myApp', ['ng-contextmenu']);
```

In your root template (at the end of your `body` tag for instance), add an element with the `ng-contextmenu-container` directive:

```html
<div ng-contextmenu-container></div>
```

In your controllers, inject the `ngContextmenuService` service. Define your click handler and list of menu items:
```JavaScript
        myApp.controller('myController', ['$scope', 'ngContextmenuService', function($scope, contextMenu) {
            contextMenu.clickHandler = function(menuItem, dataItem) {
                //menuItem is which item from the menuItemList was clicked
                //dataItem is the model of the element for which the context menu was opened
                
                menuItem.click(dataItem);
            };
            
            $scope.selectItem = function(item) {
                // do something with your dataItem
            };
            
            // define a list of menu items.
            // title is the text/html that is displayed
            $scope.menuItemList = [
                {
                    title: 'Option 1',
                    click: $scope.selectItem
                },
                {
                    title: 'Option 2',
                    click: $scope.selectItem
                }
            ];
            
            $scope.dataItemList = [
                {
                    name: 'Data 1',
                    amount: 10
                },
                {
                    name: 'Data 2',
                    amount: 20
                }
            ];
            
        }]);
```

Now you can add the data items with contextmenu markup to your html:
```html
        <ul ng-controller="myController">
            <li ng-repeat="item in dataItemList" ng-contextmenu="menuItemList" ng-contextmenu-data="item">
                {{item.name}} - ${{item.amount}}
            </li>
        </ul>
```

Note the `ng-contextmenu-data` attribute. This passes the dataItem into the contextmenu, so that it can pass to your click handlers.
