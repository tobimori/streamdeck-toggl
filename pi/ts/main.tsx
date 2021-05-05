import React from 'react'
import ReactDOM from 'react-dom'

import { PropertyInspector } from './components'
import { IAccounts, SettingsProvider } from './settingsCtx'

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
  let globalSettings: {
    accounts: IAccounts
  } = {
    accounts: {}
  }

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

  // custom events for adding account from setup
  document.addEventListener('saveAccount', (e) => {
    const { detail } = e as CustomEvent

    globalSettings = {
      ...globalSettings,
      accounts: {
        ...globalSettings.accounts,
        [detail.id]: detail
      }
    }

    websocket.send(
      JSON.stringify({
        event: 'setGlobalSettings',
        context: inUUID,
        payload: globalSettings
      })
    )

    websocket.send(
      JSON.stringify({
        event: 'getGlobalSettings',
        context: inUUID,
        payload: globalSettings
      })
    )
  })

  document.addEventListener('removeAccount', (e) => {
    const { detail } = e as CustomEvent

    const { [detail.id]: _, ...filteredAccounts } = globalSettings.accounts
    globalSettings.accounts = filteredAccounts

    websocket.send(
      JSON.stringify({
        event: 'setGlobalSettings',
        context: inUUID,
        payload: globalSettings
      })
    )

    websocket.send(
      JSON.stringify({
        event: 'getGlobalSettings',
        context: inUUID,
        payload: globalSettings
      })
    )
  })

  websocket.onmessage = function ({ data }) {
    const { event, payload } = JSON.parse(data)

    console.log(event, payload)

    if (event === 'didReceiveGlobalSettings') {
      globalSettings = payload.settings
    }

    ReactDOM.render(
      <SettingsProvider>
        <PropertyInspector client={client} info={JSON.parse(inActionInfo)} globalSettings={globalSettings} />
      </SettingsProvider>,
      document.getElementById('sdpi')
    )
  }
}

module.exports = connectElgatoStreamDeckSocket
