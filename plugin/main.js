/* eslint-disable no-unused-vars, no-undef */
const togglBaseUrl = 'https://www.toggl.com/api/v8'

let websocket = null
let pluginUUID = null
const currentlyPolling = {}
let pollingInitialized = false

function connectElgatoStreamDeckSocket (inPort, inPluginUUID, inRegisterEvent, inInfo) {
  pluginUUID = inPluginUUID

  // Open the web socket
  websocket = new WebSocket('ws://localhost:' + inPort)

  websocket.onopen = function () {
    // WebSocket is connected, register the plugin
    websocket.send(JSON.stringify(json = {
      event: inRegisterEvent,
      uuid: inPluginUUID
    }))
  }

  websocket.onmessage = function (evt) {
    // Received message from Stream Deck
    const jsonObj = JSON.parse(evt.data)
    const { event, context, payload } = jsonObj
    console.log(jsonObj)

    switch (event) {
      case 'keyDown':
        stopPolling(context, payload.settings.apiToken)
        !payload.settings.apiToken && showAlert(context)
        !payload.settings.workspaceId && showAlert(context)
        !payload.isInMultiAction && payload.settings.apiToken && startPolling(context, payload.settings.apiToken)
        toggle(context, payload.settings)
        break
      case 'willAppear':
        !initialized && initPolling()
        !payload.settings.apiToken && showAlert(context)
        !payload.isInMultiAction && payload.settings.apiToken && startPolling(context, payload.settings.apiToken)
        break
      case 'willDisappear':
        !payload.isInMultiAction && stopPolling(context, payload.settings.apiToken)
        break
    }
  }
}

// Polling
async function stopPolling (context, apiToken) {
  removeFromArray(currentlyPolling[apiToken], context)
  setTitle(context)
}

function startPolling (context, apiToken) {
  if (!currentlyPolling[apiToken]) currentlyPolling[apiToken] = []
  currentlyPolling[apiToken].push(context)
}

async function initPolling () {
  pollingInitialized = true
  while (pollingInitialized) { // eslint-disable-line no-unmodified-loop-condition
    for (apiToken in currentlyPolling) {
      await getCurrentEntry(apiToken).then(entryData => {
        for (cNum in currentlyPolling[apiToken]) {
          const context = currentlyPolling[apiToken][cNum]
          if (entryData) {
            setState(context, 0)
            setTitle(context, `${Math.floor((new Date() - new Date(entryData.start)) / 60000)} mins`)
          } else {
            setState(context, 1)
            setTitle(context)
          }
        }
      })
    }
    await wait()
  }
}

function wait (ms = 3000) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

// Toggle

async function toggle (context, settings) {
  const { apiToken, activity, projectId, workspaceId } = settings

  getCurrentEntry(apiToken).then(entryData => {
    if (!entryData) {
      startEntry(apiToken, activity, workspaceId, projectId).then(requestData => {
        setTitle(context, '0 mins')
      })
    } else {
      stopEntry(apiToken, entryData.id).then(requestData => {
        setTitle(context)
      })
    }
  })
}

// Toggl API Helpers

async function startEntry (apiToken = isRequired(), activity = 'Time Entry created by Toggl for Stream Deck', workspaceId = 0, projectId = 0) {
  const response = await fetch(
    `${togglBaseUrl}/time_entries/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${apiToken}:api_token`)}`
      },
      body: JSON.stringify({
        time_entry: {
          description: activity,
          wid: workspaceId,
          pid: projectId,
          created_with: 'Stream Deck'
        }
      })
    })
  const data = await response.json()
  return data.data
}

async function stopEntry (apiToken = isRequired(), entryId = isRequired()) {
  const response = await fetch(
    `${togglBaseUrl}/time_entries/${entryId}/stop`, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${btoa(`${apiToken}:api_token`)}`
      }
    })
  const data = await response.json()
  return data.data
}

async function getCurrentEntry (apiToken = isRequired()) {
  const response = await fetch(
    `${togglBaseUrl}/time_entries/current`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${btoa(`${apiToken}:api_token`)}`
      }
    })
  const data = await response.json()
  return data.data
}

// Set Button State (for Polling)
function setState (context = isRequired(), state = isRequired()) {
  websocket && (websocket.readyState === 1) &&
  websocket.send(JSON.stringify({
    event: 'setState',
    context: context,
    payload: {
      state: state
    }
  }))
}

// Set Button Title (for Polling)
function setTitle (context = isRequired(), title = '') {
  websocket && (websocket.readyState === 1) &&
  websocket.send(JSON.stringify({
    event: 'setTitle',
    context: context,
    payload: {
      title: title,
      target: 'both'
    }
  }))
}

function showAlert (context = isRequired()) {
  websocket && (websocket.readyState === 1) &&
  websocket.send(JSON.stringify({
    event: 'showAlert',
    context: context
  }))
}

// throw error when required argument is not supplied
const isRequired = () => {
  throw new Error('Missing required params')
}

// Remove from Array helper
function removeFromArray (arr) {
  var what; var a = arguments; var L = a.length; var ax
  while (L > 1 && arr.length) {
    what = a[--L]
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1)
    }
  }
  return arr
}
