/* eslint-disable no-unused-vars, no-undef */
const togglBaseUrl = 'https://api.track.toggl.com/api/v9'

let websocket = null
let uuid = null

function connectElgatoStreamDeckSocket (inPort, inPropertyInspectorUUID, inRegisterEvent, inInfo, inActionInfo) {
  uuid = inPropertyInspectorUUID

  // Open the web socket (use 127.0.0.1 vs localhost because windows is "slow" resolving 'localhost')
  websocket = new WebSocket('ws://127.0.0.1:' + inPort)

  websocket.onopen = function () {
    // WebSocket is connected, register the Property Inspector
    websocket.send(JSON.stringify({
      event: inRegisterEvent,
      uuid: inPropertyInspectorUUID
    }))

    // Request settings
    websocket.send(JSON.stringify({
      event: 'getSettings',
      context: uuid
    }))
  }

  websocket.onmessage = function (evt) {
    // Received message from Stream Deck
    const jsonObj = JSON.parse(evt.data)

    if (jsonObj.event === 'didReceiveSettings') {
      const payload = jsonObj.payload.settings

      if (payload.apiToken) document.getElementById('apitoken').value = payload.apiToken
      if (payload.label) document.getElementById('label').value = payload.label
      if (payload.activity) document.getElementById('activity').value = payload.activity
      document.getElementById('billable').value = payload.billableToggle ? 1 : 0

      const apiToken = document.getElementById('apitoken').value

      document.querySelector('.hiddenAll').classList.remove('hiddenAll')
      apiToken && updateWorkspaces(apiToken).then(e => {
        if (payload.workspaceId) document.getElementById('wid').value = payload.workspaceId

        updateProjects(apiToken, payload.workspaceId).then(e => {
          if (payload.projectId) document.getElementById('pid').value = payload.projectId

          document.getElementById('activityWrapper').classList.remove('hidden')
        })
      })
    }
  }
}

function sendSettings () {
  websocket && (websocket.readyState === 1) &&
  websocket.send(JSON.stringify({
    event: 'setSettings',
    context: uuid,
    payload: {
      apiToken: document.getElementById('apitoken').value,
      label: document.getElementById('label').value,
      activity: document.getElementById('activity').value,
      workspaceId: document.getElementById('wid').value,
      projectId: document.getElementById('pid').value,
      billableToggle: document.getElementById('billable').value == 1 ?  true : false
    }
  }))
}

function setAPIToken () {
  document.getElementById('wid').innerHTML = ''
  document.getElementById('pid').innerHTML = ''
  updateWorkspaces(document.getElementById('apitoken').value)
  document.getElementById('workspaceError').classList.remove('hiddenError')
  sendSettings()
}

function setWorkspace () {
  updateProjects(document.getElementById('apitoken').value, document.getElementById('wid').value)
  sendSettings()
}

async function updateProjects (apiToken, workspaceId) {
  try {
    await getProjects(apiToken, workspaceId).then(projectsData => {
      document.getElementById('pid').innerHTML = '<option value="0"></option>'
      document.getElementById('workspaceError').classList.add('hiddenError')
      document.getElementById('projectWrapper').classList.remove('hidden')
      document.getElementById('billableWrapper').classList.remove('hidden')
      const selectEl = document.getElementById('pid')

      for (projectNum in projectsData) {
        const optionEl = document.createElement('option')
        optionEl.innerText = projectsData[projectNum].name
        optionEl.value = projectsData[projectNum].id.toString()
        selectEl.append(optionEl)
      }
    })
  } catch (e) {
    document.getElementById('projectWrapper').classList.add('hidden')
    document.getElementById('billableWrapper').classList.add('hidden')
    document.getElementById('workspaceError').classList.remove('hiddenError')
  }
}

async function updateWorkspaces (apiToken) {
  try {
    await getWorkspaces(apiToken).then(workspaceData => {
      document.getElementById('wid').innerHTML = '<option value="0"></option>'
      document.getElementById('error').classList.add('hiddenError')
      document.getElementById('labelWrapper').classList.remove('hidden')
      document.getElementById('activityWrapper').classList.remove('hidden')
      document.getElementById('workspaceWrapper').classList.remove('hidden')
      const selectEl = document.getElementById('wid')

      for (ws in workspaceData) {
        const optionEl = document.createElement('option')
        optionEl.innerText = workspaceData[ws].name
        optionEl.value = workspaceData[ws].id.toString()
        selectEl.append(optionEl)
      }
    })
  } catch (e) {
    document.getElementById('error').classList.remove('hiddenError')
    document.getElementById('workspaceWrapper').classList.add('hidden')
    document.getElementById('labelWrapper').classList.add('hidden')
    document.getElementById('activityWrapper').classList.add('hidden')
    document.getElementById('projectWrapper').classList.add('hidden')
    document.getElementById('workspaceError').classList.add('hiddenError')
    console.log(e)
  }
}

async function getProjects (apiToken, workspaceId) {
  const response = await fetch(
    `${togglBaseUrl}/workspaces/${workspaceId}/projects`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${btoa(`${apiToken}:api_token`)}`
      }
    })
  const data = await response.json()
  return data
}

async function getWorkspaces (apiToken) {
  const response = await fetch(
    `${togglBaseUrl}/me/workspaces`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${btoa(`${apiToken}:api_token`)}`
      }
    })
  const data = await response.json()
  return data
}

function openPage (site) {
  websocket && (websocket.readyState === 1) &&
  websocket.send(JSON.stringify({
    event: 'openUrl',
    payload: {
      url: 'https://' + site
    }
  }))
}
