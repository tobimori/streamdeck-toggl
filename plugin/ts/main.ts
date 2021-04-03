import StreamDeckClient from './sd-client'
import TogglClient from './toggl-client'
import { onKeyDown } from './toggleAction'

const togglAccounts: Record<string, TogglClient> = {}

function connectElgatoStreamDeckSocket(
  inPort: string,
  inPluginUUID: string,
  inRegisterEvent: any,
  inInfo: any
): void {
  // open web socket (ws)
  const websocket = new WebSocket('ws://127.0.0.1:' + inPort)

  websocket.onopen = function () {
    // ws is connected, send response
    websocket.send(JSON.stringify({
      event: inRegisterEvent,
      uuid: inPluginUUID
    }))
  }

  websocket.onmessage = function (evt) {
    const { event, action, context, payload } = JSON.parse(evt.data)
    console.log(event, action, context, payload)

    const apiToken = ''

    switch (event) {
      case 'willAppear':
        if (togglAccounts[apiToken] === undefined) {
          togglAccounts[apiToken] = new TogglClient({
            apiToken,
            baseUrl: 'https://api.track.toggl.com/api/v8'
          })
        }
        break
      case 'keyDown':
        onKeyDown({
          client: new StreamDeckClient({
            websocket,
            context
          })
        })
        break
    }
  }
}

module.exports = connectElgatoStreamDeckSocket
