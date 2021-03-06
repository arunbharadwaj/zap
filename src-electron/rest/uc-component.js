/**
 *
 *    Copyright (c) 2020 Silicon Labs
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

/**
 * This module provides the REST API to the generation.
 *
 * @module REST API: generation functions
 */

const env = require('../util/env.js')
const studio = require('../ide-integration/studio-integration.js')
const http = require('http-status-codes')
const restApi = require('../../src-shared/rest-api.js')

function httpGetComponentTree(db) {
  return (req, res) => {
    let name = studio.projectName(req.query.studioProject)
    if (name) {
      env.logInfo(`StudioUC(${name}): Get project info`)
      studio
        .getProjectInfo(req.query.studioProject)
        .then((r) => {
          env.logInfo(`StudioUC(${name}): RESP: ${r.status}`)
          res.send(r.data)
        })
        .catch((err) => {
          env.logInfo(`StudioUC(${name}): ERR: ${err}`)
          handleError(err, res)
        })
    } else {
      env.logInfo(
        `StudioUC(${name}): Get project info: missing "studioProject=" query string`
      )
      res.send([])
    }
  }
}

//  input:
//    enabling component by specified 'componentId' or leveraging cluster to component mapping by
//    specifying 'clusterId' and 'side'.
//
function httpGetComponentAdd(db) {
  return (req, res) => {
    let name = studio.projectName(req.query.studioProject)
    let componentId = ''

    if (req.query.componentId) {
      componentId = req.query.componentId
    } else {
      // check for cluster / component mapping
    }

    env.logInfo(`StudioUC(${name}): Enabling component "${componentId}"`)
    studio
      .addComponent(req.query.studioProject, componentId)
      .then((r) => {
        if (r.status == http.StatusCodes.OK) {
          env.logInfo(`StudioUC(${name}): Component "${componentId}" added.`)
        }
        return res.send(r.data)
      })
      .catch((err) => handleError(err, res))
  }
}

function httpGetComponentRemove(db) {
  return (req, res) => {
    let name = studio.projectName(req.query.studioProject)
    let componentId = ''

    if (req.query.componentId) {
      componentId = req.query.componentId
    } else {
      // check for cluster / component mapping
    }

    env.logInfo(`StudioUC(${name}): Disabling component "${componentId}"`)
    studio
      .removeComponent(req.query.studioProject, componentId)
      .then((r) => {
        if (r.status == http.StatusCodes.OK) {
          env.logInfo(`StudioUC(${name}): Component "${componentId}" removed.`)
        }
        return res.send(r.data)
      })
      .catch((err) => handleError(err, res))
  }
}

function handleError(err, res) {
  if (err.response) {
    res.send(err.response.data)
  } else {
    res.send(err.message)
  }
}

exports.get = [
  {
    uri: restApi.uc.componentTree,
    callback: httpGetComponentTree,
  },
  {
    uri: restApi.uc.componentAdd,
    callback: httpGetComponentAdd,
  },
  {
    uri: restApi.uc.componentRemove,
    callback: httpGetComponentRemove,
  },
]
