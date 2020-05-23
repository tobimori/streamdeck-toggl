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

    json = {
      event: 'getSettings',
      context: uuid
    }
    websocket.send(JSON.stringify(json))

    json = {
      event: 'getGlobalSettings',
      context: uuid
    }
    websocket.send(JSON.stringify(json))
  }

  websocket.onmessage = function (evt) {
    // Received message from Stream Deck
    const jsonObj = JSON.parse(evt.data)
    if (jsonObj.event === 'didReceiveGlobalSettings') {
      const el = document.querySelector('.sdpi-wrapper')
      el && el.classList.remove('hidden')
    }
  }
}

function updateSettings () {
  if (websocket && (websocket.readyState === 1)) {
    const payload = {}
    const json = {
      event: 'setSettings',
      context: uuid,
      payload: payload
    }
    websocket.send(JSON.stringify(json))
    console.log(json)
  }
}

function updateGlobals () {
  if (websocket && (websocket.readyState === 1)) {
    const payload = {}
    payload.makerkey = document.getElementById('makerkey').value
    const json = {
      event: 'setGlobalSettings',
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
