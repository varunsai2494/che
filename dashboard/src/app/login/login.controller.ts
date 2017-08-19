/*
 * Copyright (c) [2015] - [2017] Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
'use strict';

import {CheUser} from '../../components/api/che-user.factory';

export class LoginController {
  $http: ng.IHttpService;
  $cookies: ng.cookies.ICookiesService;
  $window: ng.IWindowService;
  $timeout: ng.ITimeoutService;
  $location: ng.ILocationService;
  $log: ng.ILogService;
  cheUser: CheUser;

  private username: string;
  private password: string;
  private error: any;
  private loginInProgress: boolean;

  /**
   * Default constructor
   * @ngInject for Dependency injection
   */
  constructor($http: ng.IHttpService,
              $cookies: ng.cookies.ICookiesService,
              $window: ng.IWindowService,
              $timeout: ng.ITimeoutService,
              $location: ng.ILocationService,
              $log: ng.ILogService,
              cheUser: CheUser) {
    this.$http = $http;
    this.$cookies = $cookies;
    this.$window = $window;
    this.$timeout = $timeout;
    this.cheUser = cheUser;
    this.$location = $location;
    this.$log = $log;

    this.username = '';
    this.password = '';

    this.error = null;
    this.loginInProgress = false;

    // hide the navbar
    angular.element('#codenvynavbar').hide();
    angular.element('#codenvyfooter').hide();
  }

  submit() {
    // reset error message
    this.error = null;
    this.loginInProgress = true;

    let loginData = {'username': this.username, 'password': this.password};

    this.$http({
      url: '/api/auth/login',
      method: 'POST',
      data: loginData
    }).then((response: any) => {

      this.$cookies.token = response.data.value;
      this.$window.sessionStorage.codenvyToken = response.data.value;
      this.$cookies.refreshStatus = 'DISABLED';

      // update user
      let promise = this.cheUser.fetchUser();
      promise.then(() => this.refresh() , () => this.refresh());
    },  (response: any) => {
      this.loginInProgress = false;
      this.$log.log('error on login', response);
      this.error = response.statusText;
    });
  }

  refresh() {
    // refresh the home page
    this.$window.location = '/';
    this.$timeout(() =>  this.$window.location.reload(), 500);
  }

}

