﻿(function () {
    'use strict';

    var serviceId = 'accountClientSvc';

    // TODO: replace app with your module name
    angular.module('app')
        .factory(serviceId, ['$http','$q', accountClientSvc]);

    function accountClientSvc($http,$q) {
        // Routes
        //TODO: the base url is NOT working. it needs to get a base url only id there is one and not add the current page name as the base. This is happpening because fo the change away from #
        var baseUrl = "/",
        addExternalLoginUrl = baseUrl + "api/Account/AddExternalLogin",
        changePasswordUrl = baseUrl + "api/Account/changePassword",
        loginUrl = baseUrl + "token",
        logoutUrl = baseUrl + "api/Account/Logout",
        registerUrl = baseUrl + "api/Account/Register",
        registerExternalUrl = baseUrl + "api/Account/RegisterExternal",
        removeLoginUrl = baseUrl + "api/Account/RemoveLogin",
        setPasswordUrl = baseUrl + "api/Account/setPassword",
        authorizeUrl = baseUrl + "api/Account/Authorize",
        siteUrl = baseUrl,
        userInfoUrl = baseUrl + "api/Account/UserInfo";

        var service = {
            register: register,
            login: login,
            logout: logout,
            setPassword: setPassword,
            changePassword: changePassword,
            authorize: authorize,
            getExternalLogins: getExternalLogins,
            getUserInfo: getUserInfo,
            registerExternal: registerExternal
        };

        return service;

        
        //user{userName, password, confirmPassword, email}
        function register(user) {
            var deferred = $q.defer();

            user.grant_type = "password";

            $http({
                method: 'POST',
                url: registerUrl,
                data: user
            }).then(
				function (result) {
				    //success

				    deferred.resolve(result);
				},
				function (result) {
				    //error

				    deferred.reject(result);
				}
			);

            return deferred.promise;
        }

        //user{userName, password, confirmPassword, email}
        function registerExternal(user) {
            var deferred = $q.defer();

            user.grant_type = "password";

            $http({
                method: 'POST',
                url: registerExternalUrl,
                data: user
            }).then(
				function (result) {
				    //success
				    deferred.resolve(result);
				},
				function (result) {
				    //error
				    deferred.reject(result);
				}
			);

            return deferred.promise;
        }

        //user{id,password, rememberMe}
        function login(user) {
            var deferred = $q.defer();

            var args = {
                username: user.id,
                password: user.password,
                grant_type: "password"
            };

            var xsrf = $.param(args);

            $http({
                method: 'POST',
                url: loginUrl,
                data: xsrf,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status) {                
                deferred.resolve(data);
            }).error(function (data, status) {                
                deferred.reject(data);
            });

            return deferred.promise;
        }        

        function logout() {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: logoutUrl
            }).success(function (data, status) {
                //TODO: check out data returned and return only good user data from here
                deferred.resolve(data);
            }).error(function (data, status) {
                //TODO: check out data returned and return only useful safe errors
                deferred.reject(data);
            });

            return deferred.promise;
        }

        //roles ["rolename"] roles required.        
        function authorize(roles) {
            var deferred = $q.defer();
            
            $http({
                method: 'GET',
                url: authorizeUrl,
                params: { roles: roles },
                
            }).success(function (data, status) {                
                deferred.resolve(true);
            }).error(function (data, status) {                
                deferred.reject(false);
            });

            return deferred.promise;

        }

        function setPassword() { }

        function changePassword() { }

        function getExternalLogins(returnUrl, generateState) {
            var deferred = $q.defer();

            var externalLoginUrl = baseUrl + "api/Account/ExternalLogins?returnUrl=" + (encodeURIComponent(siteUrl + returnUrl)) +
                "&generateState=" + (generateState ? "true" : "false");

            $http({
                method: 'GET',
                url: externalLoginUrl
            }).success(function (data, status) {
                //TODO: check out data returned and return only good user data from here
                deferred.resolve(data);
            }).error(function (data, status) {
                //TODO: check out data returned and return only useful safe errors
                deferred.reject(data);
            });

            return deferred.promise;
        }

        //accessToken (at this point the user is not signed in so need to manually set the auth header
        function getUserInfo(accessToken) {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: userInfoUrl,
                headers: { Authorization: 'Bearer ' + accessToken }            
            }).success(function (data, status) {
                deferred.resolve(data);
            }).error(function (data, status) {
                deferred.reject(data);
            });

            return deferred.promise;

        }
    }
})();