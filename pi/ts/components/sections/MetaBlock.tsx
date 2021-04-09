import React, { useContext } from 'react'
import { SettingsContext } from '../../settingsCtx'

const MetaBlock: React.FC = () => {
  const { state } = useContext(SettingsContext)

  return (
    <>
      <div className='sdpi-item'>
        <details className='message info'>
          <summary className='sdpi-item-value'>
            <div className='sdpi-item-child'><a onClick={() => state.sdClient.openUrl({ url: 'track.toggl.com/timer' })}>Open Toggl</a></div>
            <div className='sdpi-item-child' style={{ marginTop: -2 }}><a onClick={() => state.sdClient.openUrl({ url: 'discord.gg/YWy3UAy' })}>Discord</a></div>
            <div className='sdpi-item-child' style={{ marginTop: -6 }}><a onClick={() => state.sdClient.openUrl({ url: 'github.com/tobimori/streamdeck-toggl' })}>GitHub</a></div>
            <div className='sdpi-item-child' style={{ marginTop: -6 }}><a onClick={() => state.sdClient.openUrl({ url: 'ko-fi.com/tobimori' })}>Ko-fi</a></div>
          </summary>
        </details>
      </div>
      <div className='sdpi-item'>
        <details className='message'>
          <summary style={{ marginTop: -10 }}>A project by <a onClick={() => state.sdClient.openUrl({ url: 'moeritz.io' })}>tobimori</a></summary>
        </details>
      </div>
    </>
  )
}

export default MetaBlock
