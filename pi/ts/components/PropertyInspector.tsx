import React, { useContext, useEffect } from 'react'

import StreamDeckClient from '../../../plugin/ts/sd-client'
import { SettingsContext } from '../settingsCtx'
import { ToggleInspector, MetaBlock } from '.'

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
  globalSettings: Record<string, unknown>
}

const PropertyInspector: React.FC<IProps> = ({ client, info }: IProps) => {
  const { state, update } = useContext(SettingsContext)

  useEffect(() => {
    update({
      ...state,
      sdClient: client,
      actionType: info.action,
      billable: info.payload.settings.billable
    })
  }, [client, info])

  useEffect(() => {
    console.log('state changed')
    if (state.sdClient !== undefined) {
      state.sdClient.setSettings({
        settings: {
          billable: state.billable === true || false
        }
      })
    }
  }, [state])

  const renderPI = (action: string): any => { // fix return type
    switch (action) {
      case 'io.moeritz.streamdeck.toggl.toggle':
        return <ToggleInspector />
    }
  }

  if (client !== undefined) {
    return (
      <>
        {renderPI(info.action)}
        <MetaBlock />
      </>
    )
  }

  return null
}

export default PropertyInspector
