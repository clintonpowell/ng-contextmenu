ng-contextmenu
==============

Lightweight Angular context menu module, styled after Google Chrome context menu 

**Quick usage instructions**:

    <html ng-app="myApp">
      <head>
        <title></title>
        <script src="angular.js"></script>
        <script src="angular-sanitize.js"></script>
        <script>
          var myApp = angular.module('myApp', ['ng-contextmenu']);
            myApp.controller('mainController', ['ngContextmenuService', function($scope, contextMenu) {
              contextMenu.clickHandler = function(item) {
                // handle selected menuItem
              };
              
              $scope.menuItems = [
                {
                  title: 'Back',
                  disabled: true
                },
                {
                  title: 'Forward',
                  href: 'https://github.com',
                  otherProp: 'value'
                }
              ];
            });
          </script>
      </head>
      <body ng-controller="mainController">
        <ul>
          <li ng-repeat="for x in [1,2,3,4,5]" ng-contextmenu="menuItems">Item {{x}}</li>
        </ul>
        <div ng-contextmenu-container="" />
      </body>
    </html>
