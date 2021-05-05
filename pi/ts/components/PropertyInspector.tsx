import React, { useContext, useEffect } from 'react'

import StreamDeckClient from '../../../plugin/ts/sd-client'
import { IAccounts, SettingsContext } from '../settingsCtx'
import { ToggleInspector, MetaBlock, AccountSelect, StartInspector, StatusInspector, StopInspector } from '.'
import TogglClient from '../../../plugin/ts/toggl-client'

interface IProps {
  client?: StreamDeckClient
  info: {
    action: string
    context: string
    device: string
    payload: {
      coordinates: {
        column: number
        row: number
      }
      settings: Record<string, unknown>
    }
  }
  globalSettings: {
    accounts: IAccounts
  }
}

const PropertyInspector: React.FC<IProps> = ({ client, info, globalSettings: { accounts } }: IProps) => {
  const { state, update } = useContext(SettingsContext)

  useEffect(() => {
    console.log(state)
    update({
      ...state,
      sdClient: client,
      togglClient: info.payload.settings.selectedAccount !== undefined &&
        info.payload.settings.selectedAccount !== '' &&
        accounts[info.payload.settings.selectedAccount as string] !== undefined
        ? new TogglClient({
          apiToken: accounts[info.payload.settings.selectedAccount as string].apiToken,
          baseUrl: 'https://api.track.toggl.com/api/v8'
        }) : undefined,
      actionType: info.action,
      accounts,
      ...info.payload.settings
    })
    console.log('props changed', state)
  }, [client, info, accounts])

  useEffect(() => {
    console.log(state)
    console.log('state changed')
    if (state.sdClient !== undefined) {
      state.sdClient.setSettings({
        settings: {
          billable: state.billable === true || false,
          selectedAccount: state.selectedAccount === undefined ? '' : state.selectedAccount,
          entryName: state.entryName === undefined ? '' : state.entryName,
          workspaceId: state.workspaceId === undefined ? '' : state.workspaceId,
          projectId: state.projectId === undefined ? '' : state.projectId
        }
      })
    }
  }, [state])

  const renderPI = (action: string): any => {
    switch (action) {
      case 'io.moeritz.streamdeck.toggl.toggle':
        return <ToggleInspector />
      case 'io.moeritz.streamdeck.toggl.status':
        return <StatusInspector />
      case 'io.moeritz.streamdeck.toggl.start':
        return <StartInspector />
      case 'io.moeritz.streamdeck.toggl.stop':
        return <StopInspector />
    }
  }

  if (state.sdClient !== undefined) {
    return (
      <>
        <AccountSelect />
        <hr />
        {state.selectedAccount !== undefined && state.selectedAccount !== '' && renderPI(info.action)}
        <MetaBlock />
      </>
    )
  }

  return null
}

export default PropertyInspector
