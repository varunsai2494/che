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

/**
 * Test of the Che Team API
 */
describe('CheTeam', () => {

  /**
   * User Factory for the test
   */
  let factory;

  /**
   * Che User API
   */
  let userFactory;

  /**
   * che API builder.
   */
  let cheAPIBuilder;

  /**
   * Che backend
   */
  let cheHttpBackend;

  /**
   * che API builder.
   */
  let cheAPIBuilder;

  /**
   * Backend for handling http operations
   */
  let httpBackend;

  /**
   * Che backend
   */
  let cheHttpBackend;

  /**
   *  setup module
   */
  beforeEach(angular.mock.module('cheDashboard'));

  /**
   * Inject factory and http backend
   */
  beforeEach(inject((cheTeam, cheUser, _cheAPIBuilder_, _cheHttpBackend_, _cheAPIBuilder_, _cheHttpBackend_) => {
    factory = cheTeam;
    userFactory = cheUser;
    cheAPIBuilder = _cheAPIBuilder_;
    cheHttpBackend = _cheHttpBackend_;
    cheAPIBuilder = _cheAPIBuilder_;
    cheHttpBackend = _cheHttpBackend_;
    httpBackend = cheHttpBackend.getHttpBackend();
  }));

  /**
   * Check assertion after the test
   */
  afterEach(() => {
    httpBackend.verifyNoOutstandingRequest();
    httpBackend.verifyNoOutstandingExpectation();
  });

  /**
   * Check than we are able to fetch team data
   */
  describe('Fetch team method', () => {
    let testUser, testTeam;

    beforeEach(() => {
      /* user setup */

      // setup tests objects
      let userId = 'idTestUser';
      let email = 'eclipseChe@eclipse.org';

      testUser = cheAPIBuilder.getUserBuilder().withId(userId).withEmail(email).build();

      // providing request
      // add test user on Http backend
      cheHttpBackend.setDefaultUser(testUser);

      // setup backend for users
      cheHttpBackend.usersBackendSetup();

      /* team setup */

      // setup tests objects
      let teamId = 'idTestTeam';
      let teamName = 'testTeam';

      let testTeam = cheAPIBuilder.getTeamBuilder().withId(teamId).withName(teamName).build();

      // add test team on Http backend
      cheHttpBackend.addTeamById(testTeam);

      // setup backend for teams
      cheHttpBackend.teamsBackendSetup();
    });

    it('should reject promise if team\'s request failed', () => {
      /* fulfil all requests */
      httpBackend.flush();

      let errorMessage = 'teams request failed',
          callbacks = {
            testResolve: () => { },
            testReject: (error: any) => {
              expect(error.data.message).toEqual(errorMessage);
            }
          };

      // create spies
      spyOn(callbacks, 'testResolve');
      spyOn(callbacks, 'testReject');

      // change response to make request fail
      httpBackend.expectGET(/\/api\/organization(\?.*$)?/).respond(404, {message: errorMessage});

      factory.fetchTeams()
        .then(callbacks.testResolve)
        .catch(callbacks.testReject)
        .finally();

      httpBackend.flush();

      expect(callbacks.testResolve).not.toHaveBeenCalled();
      expect(callbacks.testReject).toHaveBeenCalled();
    });

    it('should resolve promise', () => {
      /* fulfil all requests */
      httpBackend.flush();

      let errorMessage = 'user request failed',
          callbacks = {
            testResolve: () => { },
            testReject: (error: any) => {
              expect(error.data.message).toEqual(errorMessage);
            }
          };

      // create spies
      spyOn(callbacks, 'testResolve');
      spyOn(callbacks, 'testReject');

      factory.fetchTeams()
        .then(callbacks.testResolve)
        .catch(callbacks.testReject)
        .finally();

      httpBackend.flush();

      expect(callbacks.testResolve).toHaveBeenCalled();
      expect(callbacks.testReject).not.toHaveBeenCalled();
    });

    it('should resolve promise if team\'s request status code equals 304', () => {
      /* fulfil all requests */
      httpBackend.flush();

      let errorMessage = 'teams request failed',
          callbacks = {
            testResolve: () => { },
            testReject: (error: any) => {
              expect(error.data.message).toEqual(errorMessage);
            }
          };

      // create spies
      spyOn(callbacks, 'testResolve');
      spyOn(callbacks, 'testReject');

      factory.fetchTeams()
        .then(callbacks.testResolve)
        .catch(callbacks.testReject)
        .finally();

      // change response
      httpBackend.expect('GET', /\/api\/organization(\?.*$)?/).respond(304, {});

      httpBackend.flush();

      expect(callbacks.testResolve).toHaveBeenCalled();
      expect(callbacks.testReject).not.toHaveBeenCalled();
    });

  });

});
