/* eslint-disable no-unused-vars, no-undef */
let websocket = null
let pluginUUID = null

function connectElgatoStreamDeckSocket (inPort, inPluginUUID, inRegisterEvent, inInfo) {
  pluginUUID = inPluginUUID

  // Open the web socket
  websocket = new WebSocket('ws://localhost:' + inPort)

  websocket.onopen = function () {
    // WebSocket is connected, register the plugin
    const json = {
      event: inRegisterEvent,
      uuid: inPluginUUID
    }

    websocket.send(JSON.stringify(json))
  }

  websocket.onmessage = function (evt) {
    // Received message from Stream Deck
    const jsonObj = JSON.parse(evt.data)
    console.log(jsonObj)
  }
};
