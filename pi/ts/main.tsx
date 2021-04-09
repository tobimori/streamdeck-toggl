import React from 'react'
import ReactDOM from 'react-dom'

import { PropertyInspector } from './components'
import { SettingsProvider } from './settingsCtx'

import StreamDeckClient from '../../plugin/ts/sd-client'

function connectElgatoStreamDeckSocket (
  inPort: string,
  inUUID: string,
  inRegisterEvent: any,
  inInfo: any,
  inActionInfo: any
): void {
  const websocket = new WebSocket(`ws://127.0.0.1:${inPort}`)
  console.log(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo)
  let client: StreamDeckClient

  websocket.onopen = function () {
    websocket.send(
      JSON.stringify({
        event: inRegisterEvent,
        uuid: inUUID
      })
    )

    client = new StreamDeckClient({ websocket: websocket, context: inUUID })

    client.getGlobalSettings()
  }

  websocket.onmessage = function ({ data }) {
    const { event, payload } = JSON.parse(data)

    console.log(event, payload)

    if (event === 'didReceiveGlobalSettings') {
      const globalSettings = payload.settings

      ReactDOM.render(
        <SettingsProvider>
          <PropertyInspector client={client} info={JSON.parse(inActionInfo)} globalSettings={globalSettings} />
        </SettingsProvider>,
        document.getElementById('sdpi')
      )
    }
  }
}

module.exports = connectElgatoStreamDeckSocket
