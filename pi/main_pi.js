/* eslint-disable no-unused-vars, no-undef */
let websocket = null
let uuid = null

function connectElgatoStreamDeckSocket (inPort, inPropertyInspectorUUID, inRegisterEvent, inInfo, inActionInfo) {
  uuid = inPropertyInspectorUUID

  websocket = new WebSocket('ws://localhost:' + inPort)

  websocket.onopen = function () {
    // WebSocket is connected, register the Property Inspector
    let json = {
      event: inRegisterEvent,
      uuid: inPropertyInspectorUUID
    }
    websocket.send(JSON.stringify(json))

    // Request settings
    json = {
      event: 'getSettings',
      context: uuid
    }
    websocket.send(JSON.stringify(json))
  }

  websocket.onmessage = function (evt) {
    // Received message from Stream Deck
    const jsonObj = JSON.parse(evt.data)
    if (jsonObj.event === 'didReceiveSettings') {
      const payload = jsonObj.payload.settings

      if (payload.apiToken) document.getElementById('apitoken').value = payload.apiToken
      if (payload.activity) document.getElementById('activity').value = payload.activity
      if (payload.workspaceId) document.getElementById('wid').value = payload.workspaceId
      if (payload.projectId) document.getElementById('pid').value = payload.projectId

      const el = document.querySelector('.sdpi-wrapper')
      el && el.classList.remove('hidden')
    }
  }
}

function sendSettings () {
  if (websocket && (websocket.readyState === 1)) {
    const payload = {
      apiToken: document.getElementById('apitoken').value,
      activity: document.getElementById('activity').value,
      workspaceId: document.getElementById('wid').value,
      projectId: document.getElementById('pid').value
    }
    const json = {
      event: 'setSettings',
      context: uuid,
      payload: payload
    }
    websocket.send(JSON.stringify(json))
    console.log(json)
  }
}

function openPage (site) {
  if (websocket && (websocket.readyState === 1)) {
    const json = {
      event: 'openUrl',
      payload: {
        url: 'https://' + site
      }
    }
    websocket.send(JSON.stringify(json))
  }
}
