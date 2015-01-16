﻿(function () {
    'use strict';

    angular
        .module('app.shell')
        .directive('skNavLinks', skNavLinks);

    skNavLinks.$inject = ['$window', '$rootScope', '$location'];

    function skNavLinks($window, $rootScope, $location) {
        // Usage:
        //     <skNavLinks></skNavLinks>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                links: '='
            },
            replace: true,
            templateUrl: 'app/shell/skNavLinks.html'
        };
        return directive;

        function link(scope, element, attrs) {
            //set the initial active link
            setActive(scope.links, $location.path().substring(1));

            //listen for changes
            $rootScope.$on('$routeChangeSuccess', function (event, next, current) {           
                if (scope.links && next.$$route) {
                    setActive(scope.links, next.$$route.originalPath.substring(1));
                }
            });
        }

        function setActive(links, activePath) {
            links.forEach(function (link) {
                link.isActive = link.url === activePath;
            });
        }
    }
})();