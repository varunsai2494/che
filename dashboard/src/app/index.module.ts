/*
 * Copyright (c) 2015-2017 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
'use strict';

import {Register} from '../components/utils/register';
import {FactoryConfig} from './factories/factories-config';

import {ComponentsConfig} from '../components/components-config';

import {AdminsConfig} from './admin/admin-config';
import {AdministrationConfig} from './administration/administration-config';
import {DiagnosticsConfig} from './diagnostics/diagnostics-config';
import {CheColorsConfig} from './colors/che-color.constant';
import {CheOutputColorsConfig} from './colors/che-output-colors.constant';
import {CheCountriesConfig} from './constants/che-countries.constant';
import {CheJobsConfig} from './constants/che-jobs.constant';
import {DashboardConfig} from './dashboard/dashboard-config';
// switch to a config
import {IdeConfig} from './ide/ide-config';
import {NavbarConfig} from './navbar/navbar-config';
import {ProjectsConfig} from './projects/projects-config';
import {ProxySettingsConfig} from './proxy/proxy-settings.constant';
import {WorkspacesConfig} from './workspaces/workspaces-config';
import {StacksConfig} from './stacks/stacks-config';
import {DemoComponentsController} from './demo-components/demo-components.controller';
import {CheBranding} from '../components/branding/che-branding.factory';
import {ChePreferences} from '../components/api/che-preferences.factory';
import {LoginController} from './login/login.controller';


// init module
let initModule = angular.module('userDashboard', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ngRoute',
  'angular-websocket', 'ui.bootstrap', 'ui.codemirror', 'ngMaterial', 'ngMessages', 'angularMoment', 'angular.filter',
  'ngDropdowns', 'ngLodash', 'angularCharts', 'ngClipboard', 'uuid4', 'angularFileUpload']);

// add a global resolve flag on all routes (user needs to be resolved first)
initModule.config(['$routeProvider', ($routeProvider: che.route.IRouteProvider) => {
  $routeProvider.accessWhen = (path: string, route: che.route.IRoute) => {
    route.resolve || (route.resolve = {});
    (route.resolve as any).app = ['cheBranding', '$q', 'chePreferences', (cheBranding: CheBranding, $q: ng.IQService, chePreferences: ChePreferences) => {
      let deferred = $q.defer();
      if (chePreferences.getPreferences() || DEV) {
        deferred.resolve();
      } else {
        chePreferences.fetchPreferences().then(() => {
          deferred.resolve();
        }, (error: any) => {
          deferred.reject(error);
        });
      }

      return deferred.promise;
    }];

    return $routeProvider.when(path, route);
  };

  $routeProvider.accessOtherWise = (route: che.route.IRoute) => {
    route.resolve || (route.resolve = {});
    (route.resolve as any).app = ['$q', 'chePreferences', ($q: ng.IQService, chePreferences: ChePreferences) => {
      let deferred = $q.defer();
      if (chePreferences.getPreferences() || DEV) {
        deferred.resolve();
      } else {
        chePreferences.fetchPreferences().then(() => {
          deferred.resolve();
        }, (error: any) => {
          deferred.reject(error);
        });
      }

      return deferred.promise;
    }];
    return $routeProvider.otherwise(route);
  };


}]);

var DEV = false;

initModule.controller('LoginController', LoginController);
initModule.config(['$routeProvider', 'ngClipProvider', ($routeProvider: che.route.IRouteProvider, ngClipProvider: any) => {
  $routeProvider.accessWhen('/login', {
    title: 'Login',
    templateUrl: 'app/login/login.html',
    controller: 'LoginController',
    controllerAs: 'loginController'
  }).accessOtherWise({
    redirectTo: '/workspaces'
  });
  // add .swf path location using ngClipProvider
  let ngClipProviderPath = DEV ? 'bower_components/zeroclipboard/dist/ZeroClipboard.swf' : 'assets/zeroclipboard/ZeroClipboard.swf';
  ngClipProvider.setPath(ngClipProviderPath);
}]);

// configs
initModule.config(['$routeProvider', 'ngClipProvider', ($routeProvider, ngClipProvider) => {
  // config routes (add demo page)
  if (DEV) {
    $routeProvider.accessWhen('/demo-components', {
      title: 'Demo Components',
      templateUrl: 'app/demo-components/demo-components.html',
      controller: 'DemoComponentsController',
      controllerAs: 'demoComponentsController',
      reloadOnSearch: false
    });
  }

  $routeProvider.accessOtherWise({
    redirectTo: '/workspaces'
  });
  // add .swf path location using ngClipProvider
  let ngClipProviderPath = DEV ? 'bower_components/zeroclipboard/dist/ZeroClipboard.swf' : 'assets/zeroclipboard/ZeroClipboard.swf';
  ngClipProvider.setPath(ngClipProviderPath);
}]);


/**
 * Setup route redirect module
 */
initModule.run(['$rootScope', '$location', '$routeParams', 'routingRedirect', '$timeout', 'ideIFrameSvc', 'cheIdeFetcher', 'routeHistory', 'cheUIElementsInjectorService', 'workspaceDetailsService',
  ($rootScope, $location, $routeParams, routingRedirect, $timeout, ideIFrameSvc, cheIdeFetcher, routeHistory, cheUIElementsInjectorService, workspaceDetailsService) => {
    $rootScope.hideLoader = false;
    $rootScope.waitingLoaded = false;
    $rootScope.showIDE = false;

    workspaceDetailsService.addPage('Projects', '<workspace-details-projects></workspace-details-projects>', 'icon-ic_inbox_24px');
    workspaceDetailsService.addPage('SSH', '<workspace-details-ssh></workspace-details-ssh>', 'icon-ic_vpn_key_24px');

    // here only to create instances of these components
    cheIdeFetcher;
    routeHistory;

    $rootScope.$on('$viewContentLoaded', () => {
      cheUIElementsInjectorService.injectAll();
      $timeout(() => {
        if (!$rootScope.hideLoader) {
          if (!$rootScope.wantTokeepLoader) {
            $rootScope.hideLoader = true;
          } else {
            $rootScope.hideLoader = false;
          }
        }
        $rootScope.waitingLoaded = true;
      }, 1000);
    });

    $rootScope.$on('$routeChangeStart', (event, next)=> {
      if (DEV) {
        console.log('$routeChangeStart event with route', next);
      }
    });

    $rootScope.$on('$routeChangeSuccess', (event: ng.IAngularEvent, next: ng.route.IRoute) => {
      const route = (<any>next).$$route;
      if (angular.isFunction(route.title)) {
        $rootScope.currentPage = route.title($routeParams);
      } else {
        $rootScope.currentPage = route.title || 'Dashboard';
      }
      const originalPath: string = route.originalPath;
      if (originalPath && originalPath.indexOf('/ide/') === -1) {
        $rootScope.showIDE = false;
      }
      // when a route is about to change, notify the routing redirect node
      if (next.resolve) {
        if (DEV) {
          console.log('$routeChangeSuccess event with route', next);
        }// check routes
        routingRedirect.check(event, next);
      }
    });

    $rootScope.$on('$routeChangeError', () => {
      $location.path('/');
    });
  }]);


// add interceptors
initModule.factory('ETagInterceptor', ($window, $cookies, $q) => {

  var etagMap = {};

  return {
    request: (config) => {
      // add IfNoneMatch request on the che api if there is an existing eTag
      if ('GET' === config.method) {
        if (config.url.indexOf('/api') === 0) {
          let eTagURI = etagMap[config.url];
          if (eTagURI) {
            config.headers = config.headers || {};
            angular.extend(config.headers, {'If-None-Match': eTagURI});
          }
        }
      }
      return config || $q.when(config);
    },
    response: (response) => {

      // if response is ok, keep ETag
      if ('GET' === response.config.method) {
        if (response.status === 200) {
          var responseEtag = response.headers().etag;
          if (responseEtag) {
            if (response.config.url.indexOf('/api') === 0) {

              etagMap[response.config.url] = responseEtag;
            }
          }
        }

      }
      return response || $q.when(response);
    }
  };
});

initModule.config(($mdThemingProvider, jsonColors) => {

  var cheColors = angular.fromJson(jsonColors);
  var getColor = (key) => {
    var color = cheColors[key];
    if (!color) {
      // return a flashy red color if color is undefined
      console.log('error, the color' + key + 'is undefined');
      return '#ff0000';
    }
    if (color.indexOf('$') === 0) {
      color = getColor(color);
    }
    return color;

  };


  var cheMap = $mdThemingProvider.extendPalette('indigo', {
    '500': getColor('$dark-menu-color'),
    '300': 'D0D0D0'
  });
  $mdThemingProvider.definePalette('che', cheMap);

  var cheDangerMap = $mdThemingProvider.extendPalette('red', {});
  $mdThemingProvider.definePalette('cheDanger', cheDangerMap);

  var cheWarningMap = $mdThemingProvider.extendPalette('orange', {
    'contrastDefaultColor': 'light'
  });
  $mdThemingProvider.definePalette('cheWarning', cheWarningMap);

  var cheGreenMap = $mdThemingProvider.extendPalette('green', {
    'A100': '#46AF00',
    'contrastDefaultColor': 'light'
  });
  $mdThemingProvider.definePalette('cheGreen', cheGreenMap);

  var cheDefaultMap = $mdThemingProvider.extendPalette('blue', {
    'A400': getColor('$che-medium-blue-color')
  });
  $mdThemingProvider.definePalette('cheDefault', cheDefaultMap);

  var cheNoticeMap = $mdThemingProvider.extendPalette('blue', {
    'A400': getColor('$mouse-gray-color')
  });
  $mdThemingProvider.definePalette('cheNotice', cheNoticeMap);

  var cheAccentMap = $mdThemingProvider.extendPalette('blue', {
    '700': getColor('$che-medium-blue-color'),
    'A400': getColor('$che-medium-blue-color'),
    'A200': getColor('$che-medium-blue-color'),
    'contrastDefaultColor': 'light'
  });
  $mdThemingProvider.definePalette('cheAccent', cheAccentMap);


  var cheNavyPalette = $mdThemingProvider.extendPalette('purple', {
    '500': getColor('$che-navy-color'),
    'contrastDefaultColor': 'light'
  });
  $mdThemingProvider.definePalette('cheNavyPalette', cheNavyPalette);


  var toolbarPrimaryPalette = $mdThemingProvider.extendPalette('purple', {
    '500': getColor('$che-white-color'),
    'contrastDefaultColor': 'dark'
  });
  $mdThemingProvider.definePalette('toolbarPrimaryPalette', toolbarPrimaryPalette);

  var toolbarAccentPalette = $mdThemingProvider.extendPalette('purple', {
    'A200': 'EF6C00',
    '700': 'E65100',
    'contrastDefaultColor': 'light'
  });
  $mdThemingProvider.definePalette('toolbarAccentPalette', toolbarAccentPalette);

  var cheGreyPalette = $mdThemingProvider.extendPalette('grey', {
    'A100': 'efefef',
    'contrastDefaultColor': 'light'
  });
  $mdThemingProvider.definePalette('cheGrey', cheGreyPalette);

  $mdThemingProvider.theme('danger')
    .primaryPalette('che')
    .accentPalette('cheDanger')
    .backgroundPalette('grey');

  $mdThemingProvider.theme('warning')
    .primaryPalette('che')
    .accentPalette('cheWarning')
    .backgroundPalette('grey');

  $mdThemingProvider.theme('chesave')
    .primaryPalette('green')
    .accentPalette('cheGreen')
    .backgroundPalette('grey');

  $mdThemingProvider.theme('checancel')
    .primaryPalette('che')
    .accentPalette('cheGrey')
    .backgroundPalette('grey');

  $mdThemingProvider.theme('chedefault')
    .primaryPalette('che')
    .accentPalette('cheDefault')
    .backgroundPalette('grey');

  $mdThemingProvider.theme('chenotice')
    .primaryPalette('che')
    .accentPalette('cheNotice')
    .backgroundPalette('grey');

  $mdThemingProvider.theme('default')
    .primaryPalette('che')
    .accentPalette('cheAccent')
    .backgroundPalette('grey');

  $mdThemingProvider.theme('toolbar-theme')
    .primaryPalette('toolbarPrimaryPalette')
    .accentPalette('toolbarAccentPalette');

  $mdThemingProvider.theme('factory-theme')
    .primaryPalette('light-blue')
    .accentPalette('pink')
    .warnPalette('red')
    .backgroundPalette('purple');

  $mdThemingProvider.theme('onboarding-theme')
    .primaryPalette('cheNavyPalette')
    .accentPalette('pink')
    .warnPalette('red')
    .backgroundPalette('purple');

  $mdThemingProvider.theme('dashboard-theme')
    .primaryPalette('cheNavyPalette')
    .accentPalette('pink')
    .warnPalette('red')
    .backgroundPalette('purple');

  $mdThemingProvider.theme('maincontent-theme')
    .primaryPalette('che')
    .accentPalette('cheAccent');
});

initModule.constant('userDashboardConfig', {
  developmentMode: DEV
});

// This can not be moved to separate factory class, because it is not fits into
// model how Angular works with them. When we override request and responseError
// functions, they are called in another context, without creating new class instance,
// and "this" became undefined.
// See http://stackoverflow.com/questions/30978743/how-can-this-be-undefined-in-the-constructor-of-an-angular-config-class
initModule.factory('AddMachineTokenToUrlInterceptor', ($injector, $q) => {
  var tokens = {};

  function requestToken(workspaceId) {

    let promise = $injector.get('$http').get('/api/machine/token/' + workspaceId);

    return promise.then((resp) => {
      tokens[workspaceId] = resp.data.machineToken;
      return tokens[workspaceId];
    }, (error) => {
      if (error.status === 304) {
        return tokens[workspaceId];
      }
    });
  }

  function getWorkspaceId(url) {
    let workspaceId;
    // in case of injection 'cheWorkspace' we will get an error with 'circular dependency found' message,
    // so to avoid this we need to use injector.get() directly.
    $injector.get('cheWorkspace').getWorkspaceAgents().forEach((value, key) => {
      if (url.startsWith(value.workspaceAgentData.path)) {
        workspaceId = key;
      }
    });
    return workspaceId;
  }

  return {
    request: (config) => {
      let workspaceId = getWorkspaceId(config.url);
      if (!workspaceId) {
        return config || $q.when(config);
      }

      return $q.when(tokens[workspaceId] || requestToken(workspaceId))
        .then((token) => {
          config.headers['Authorization'] = token;
          return config;
        });
    },

    responseError: (rejection) => {
      let workspaceId = getWorkspaceId(rejection.config.url);
      if (rejection && workspaceId && (rejection.status === 401 || rejection.status === 503)) {
        delete tokens[workspaceId];
      }
      return $q.reject(rejection);
    }
  };
});

// prevents CSRF(see https://en.wikipedia.org/wiki/Cross-site_request_forgery)
// using additional token header, see
// https://tomcat.apache.org/tomcat-7.0-doc/config/filter.html#CSRF_Prevention_Filter_for_REST_APIs
initModule.factory('CsrfPreventionInterceptor', ($injector, $q) => {
  const CSRF_TOKEN_HEADER_NAME = 'X-CSRF-Token';
  let csrfToken = '';

  function isModifyingMethod(method: string): boolean {
    return method === 'POST' || method === 'PUT' || method === 'DELETE';
  };

  function isMachineRequest(url: string): boolean {
    let agents = $injector.get('cheWorkspace').getWorkspaceAgents();
    for (let agent of agents.values()) {
      if (url.startsWith(agent.workspaceAgentData.path)) {
        return true;
      }
    }
    return false;
  };

  function requestCSRFToken() {
    // request X-CSRF-Token through any GET requests, which requires user to be logged-in
    // and is not used by dashboard to avoid 304:
    let promise = $injector.get('$http').get('/api/user/settings');

    return promise.then((response: any) => {
      let respCsrfToken = response.headers(CSRF_TOKEN_HEADER_NAME);
      if (respCsrfToken) {
        csrfToken = respCsrfToken;
      }
      return respCsrfToken;
    }, (error: any) => {
      if (error.status === 304) {
        return csrfToken;
      }
    });
  }

  return {
    request: (config: any) => {
      // no need to add X-CSRF-Token to machine requests
      if (isMachineRequest(config.url)) {
        return config;
      }

      // the X-CSRF-Token=Fetch if the request method is 'GET' and token is not fetched yet
      if (config.method === 'GET' && !csrfToken) {
        config.headers[CSRF_TOKEN_HEADER_NAME] = 'Fetch';
        return config;
      }

      // the X-CSRF-Token=0ABCD(actual token) if request modifies server state and token is fetched
      if (isModifyingMethod(config.method)) {
        return $q.when((csrfToken) || requestCSRFToken()).then((token: string) => {
          config.headers[CSRF_TOKEN_HEADER_NAME] = token;
          return config;
        });
      }

      return config;
    },

    // gets fetched X-CSRF-Token and caches it
    response: (response: any) => {
      var respCsrfToken = response.headers(CSRF_TOKEN_HEADER_NAME);
      if (respCsrfToken && response.config.method === 'GET') {
        csrfToken = respCsrfToken;
      }
      return response;
    }
  };
});

// add interceptors
initModule.factory('AuthInterceptor', ($window, $cookies, $q, $location, $log) => {
  return {
    request: (config) => {
      //remove prefix url
      if (config.url.indexOf('https://codenvy.com/api') === 0) {
        config.url = config.url.substring('https://codenvy.com'.length);
      }

      let authHeader = config.headers['Authorization'];

      // do not add token on auth login
      if (config.url.indexOf('/api/auth/login') === -1 && config.url.indexOf('api/') !== -1 && $window.sessionStorage['codenvyToken'] && (!authHeader || authHeader.length === 0)) {
        config.headers['Authorization'] = $window.sessionStorage['codenvyToken'];
      }
      return config || $q.when(config);
    },
    response: (response) => {
      return response || $q.when(response);
    },
    responseError: (rejection) => {
      // handle only api call
      if (rejection.config) {
        if (rejection.config.url.indexOf('localhost') > 0 || rejection.config.url.startsWith('/api/user') > 0) {
          if (rejection.status === 401 || rejection.status === 403) {
            $log.info('Redirect to login page.');
            $location.path('/login');

          }
        }
      }
      return $q.reject(rejection);
    }
  };
});

initModule.config(['$routeProvider', '$locationProvider', '$httpProvider', ($routeProvider, $locationProvider, $httpProvider) => {
  // add the ETag interceptor for Che API
  $httpProvider.interceptors.push('ETagInterceptor');

  $httpProvider.interceptors.push('AddMachineTokenToUrlInterceptor');
  $httpProvider.interceptors.push('CsrfPreventionInterceptor');
  if (DEV) {
    console.log('adding auth interceptor');
    $httpProvider.interceptors.push('AuthInterceptor');
  }
}]);


var instanceRegister = new Register(initModule);

if (DEV) {
  // instanceRegister.controller('LoginController', LoginController);
  instanceRegister.controller('DemoComponentsController', DemoComponentsController);
}

new ProxySettingsConfig(instanceRegister);
new CheColorsConfig(instanceRegister);
new CheOutputColorsConfig(instanceRegister);
new CheCountriesConfig(instanceRegister);
new CheJobsConfig(instanceRegister);
new ComponentsConfig(instanceRegister);
new AdminsConfig(instanceRegister);
new AdministrationConfig(instanceRegister);
new IdeConfig(instanceRegister);
new DiagnosticsConfig(instanceRegister);

new NavbarConfig(instanceRegister);
new ProjectsConfig(instanceRegister);
new WorkspacesConfig(instanceRegister);
new DashboardConfig(instanceRegister);
new StacksConfig(instanceRegister);
new FactoryConfig(instanceRegister);
