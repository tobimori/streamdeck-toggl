/* eslint-disable no-unused-vars, no-undef */
const togglBaseUrl = 'https://api.track.toggl.com/api/v8'

let websocket = null
let currentButtons = new Map()
let polling = false

function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {

  // Open the web socket (use 127.0.0.1 vs localhost because windows is "slow" resolving 'localhost')
  websocket = new WebSocket('ws://127.0.0.1:' + inPort)

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
    switch (event) {
      case 'keyDown':
        !payload.settings.apiToken && showAlert(context)
        !payload.settings.workspaceId && showAlert(context)
        toggle(context, payload.settings)
        break
      case 'willAppear':
        !payload.settings.apiToken && showAlert(context)
        !payload.isInMultiAction && payload.settings.apiToken && addButton(context, payload.settings)
        break
      case 'willDisappear':
        !payload.isInMultiAction && removeButton(context)
        break
      case 'didReceiveSettings': // anything could have changed, pull it, add it, and refresh.
        !payload.isInMultiAction && removeButton(context) && payload.settings.apiToken && addButton(context, payload.settings)
        !payload.isInMultiAction && refreshButtons()
        break
    }
  }
}


function removeButton(context) {
  return currentButtons.delete(context)
}

function addButton(context, settings) {
  currentButtons.set(context, settings)
  initPolling()
}

// Polling
async function initPolling() {
  if (polling) return

  polling = true

  while (currentButtons.size > 0) { // eslint-disable-line no-unmodified-loop-condition
    refreshButtons()
     
    //nothing special about 5s, just a random choice
    await new Promise(r => setTimeout(r, 5000));
  }

  polling = false
}

function refreshButtons() {
  
  //Get the list of unique apiTokens
  var tokens = new Set([...currentButtons.values()].map(s=>s.apiToken))
  
  tokens.forEach(apiToken => {
    
    //Get the current entry for this token
    getCurrentEntry(apiToken).then(entryData => {
    
      //Loop over all the buttons and update as appropriate
      currentButtons.forEach((settings, context) => {
        if (apiToken != settings.apiToken) //not one of "our" buttons
          return //We're in a forEach, this is effectively a 'continue'
        
        if (entryData //Does button match the active timer? 
            && entryData.wid == settings.workspaceId 
            && entryData.pid == settings.projectId 
            && entryData.description == settings.activity) {
          setState(context, 0)
          setTitle(context, `${formatElapsed(entryData.duration)}\n\n\n${settings.label}`)
        } else { //if not, make sure it's 'off'
          setState(context, 1)
          setTitle(context, settings.label)
        }
      })
    })
  })
}

function formatElapsed(elapsedFromToggl)
{
  const elapsed = Math.floor(Date.now()/1000) + elapsedFromToggl
  return formatSeconds(elapsed)
}

function formatSeconds(seconds)
{
  if (seconds < 3600)
    return leadingZero(Math.floor(seconds/60)) + ':' + leadingZero(seconds % 60)

  return leadingZero(Math.floor(seconds/3600)) + ':' + formatSeconds(seconds % 3600)
}

function leadingZero(val)
{
  if (val < 10)
    return '0' + val
  return val
}

async function toggle(context, settings) {
  const { apiToken, activity, projectId, workspaceId, billableToggle } = settings

  getCurrentEntry(apiToken).then(entryData => {
    if (!entryData) {
      //Not running? Start a new one
      startEntry(apiToken, activity, workspaceId, projectId, billableToggle).then(v=>refreshButtons())
    } else if (entryData.wid == workspaceId && entryData.pid == projectId && entryData.description == activity) {
      //The one running is "this one" -- toggle to stop
      stopEntry(apiToken, entryData.id).then(v=>refreshButtons())
    } else {
      //Just start the new one, old one will stop, it's toggl.
      startEntry(apiToken, activity, workspaceId, projectId, billableToggle).then(v=>refreshButtons())
    }
  })
}

// Toggl API Helpers

function startEntry(apiToken = isRequired(), activity = 'Time Entry created by Toggl for Stream Deck', workspaceId = 0, projectId = 0, billableToggle = false) {
  return fetch(
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
	billable: billableToggle,
        created_with: 'Stream Deck'
      }
    })
  })
}

function stopEntry(apiToken = isRequired(), entryId = isRequired()) {
  return fetch(
    `${togglBaseUrl}/time_entries/${entryId}/stop`, {
    method: 'PUT',
    headers: {
      Authorization: `Basic ${btoa(`${apiToken}:api_token`)}`
    }
  })
}

async function getCurrentEntry(apiToken = isRequired()) {
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
function setState(context = isRequired(), state = isRequired()) {
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
function setTitle(context = isRequired(), title = '') {
  websocket && (websocket.readyState === 1) && websocket.send(JSON.stringify({
    event: 'setTitle',
    context: context,
    payload: {
      title: title
    }
  }))
}

function showAlert(context = isRequired()) {
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

