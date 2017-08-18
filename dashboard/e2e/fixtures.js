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

let Fixtures = function() {

  this.getUsers = function(number) {
    const users = [];
    for (let i = 0; i < number; i++) {
      const id = `userId${i}`,
            name = `userName${i}`;
      users.push({id, name})
    }
    return users;
  };

  this.getStacks = function(numberAll, numberQuickStart, numberSingleMachine) {
    const stackSamples = require('./workspaces/create-workspace/stacks');

    if (numberQuickStart > numberAll) {
      console.warn('Number of Quick Start stacks should be less of equal to number of all stacks');
      numberQuickStart = numberAll;
    }
    if (numberSingleMachine > numberAll) {
      console.warn('Number of Single Machine stacks should be less of equal to number of all stacks');
      numberSingleMachine = numberAll;
    }

    const stacks = [];
    for (let i = 0; i < numberAll; i++) {
      const id = `stackId${i}`,
            name = `stackName${i}`,
            scope = i < numberQuickStart ? 'general' : 'advanced',
            stack = i < numberSingleMachine
              ? JSON.parse(JSON.stringify(stackSamples.singleMachine))
              : JSON.parse(JSON.stringify(stackSamples.multiMachine));
      stack.id = id;
      stack.name = name;
      stack.scope = scope;
      stacks.push(stack);
    }

    return stacks;
  };

  this.getWorkspaces = function(number) {
    const users = this.getUsers(1);

    const namespace = users[0].name,
          status = 'STOPPED',
          nowTimestamp = Math.floor(Date.now() / 1000),
          attributes = {
            created: nowTimestamp,
            stackId: 'stackId',
            updated: nowTimestamp
          },
          defaultEnvironment = 'default',
          environments = {
            [defaultEnvironment]: {
              machines: {
                'dev-machine': {
                  attributes: {
                    memoryLimitBytes: '2147483648'
                  },
                  servers: {},
                  agents: ['org.eclipse.che.terminal', 'org.eclipse.che.ws-agent', 'org.eclipse.che.ssh', 'org.eclipse.che.exec'],
                  recipe: {
                    location: 'eclipse/ubuntu_jdk8',
                    type: 'dockerimage'
                  }
                }
              }
            }
          };

    const workspaces = [];
    for (let i = 0; i < number; i++) {
      const id = `workspaceId${i}`,
            name = `workspaceName${}`;
      workspaces.push({id, name, namespace, status, defaultEnvironment, environments, attributes});
    }

    return workspaces;
  };

};

module.exports = new Fixtures();
