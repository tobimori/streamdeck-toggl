import StreamDeckClient from './sd-client'
import TogglClient from './toggl-client'

import ToggleAction from './actions/toggleAction'
import StatusAction from './actions/statusAction'
import StartAction from './actions/startAction'
import StopAction from './actions/stopAction'

const togglAccounts: Record<string, TogglClient> = {}
let actionInstances: Record<string, ToggleAction | StatusAction | StopAction | StartAction> = {}

function connectElgatoStreamDeckSocket (
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
        // add account to array if unknown
        if (togglAccounts[apiToken] === undefined) {
          togglAccounts[apiToken] = new TogglClient({
            apiToken,
            baseUrl: 'https://api.track.toggl.com/api/v8'
          })
        }

        // initialize new class for action, add to object with context as key
        switch (action) {
          case 'io.moeritz.streamdeck.toggl.toggle':
            actionInstances[context] = new ToggleAction({
              sdClient: new StreamDeckClient({ websocket: websocket, context: context }),
              togglClient: togglAccounts[apiToken]
            })
            break
          case 'io.moeritz.streamdeck.toggl.status':
            actionInstances[context] = new StatusAction({
              sdClient: new StreamDeckClient({ websocket: websocket, context: context }),
              togglClient: togglAccounts[apiToken]
            })
            break
          case 'io.moeritz.streamdeck.toggl.start':
            actionInstances[context] = new StartAction({
              sdClient: new StreamDeckClient({ websocket: websocket, context: context }),
              togglClient: togglAccounts[apiToken]
            })
            break
          case 'io.moeritz.streamdeck.toggl.stop':
            actionInstances[context] = new StopAction({
              sdClient: new StreamDeckClient({ websocket: websocket, context: context }),
              togglClient: togglAccounts[apiToken]
            })
            break
        }

        break
      case 'willDisappear':
        // remove action from object if disappears
        if (actionInstances[context] !== undefined) {
          const { context: _, ...newInstances } = actionInstances
          actionInstances = newInstances
        }
        break
      case 'keyDown':
        actionInstances[context].onKeyDown(payload)
        break
    }
  }
}

module.exports = connectElgatoStreamDeckSocket
