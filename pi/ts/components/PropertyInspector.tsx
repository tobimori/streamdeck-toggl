import React from 'react'
import StreamDeckClient from '../../../plugin/ts/sd-client'

interface IProps {
  client?: StreamDeckClient
  info: {
    action: string
    context: string
    device: string
    payload: {
      coordinates: {
        column: 1
        row: 2
      }
      settings: Record<string, unknown>
    }
  }
  globalSettings: Record<string, unknown>
}

const PropertyInspector: React.FC<IProps> = ({ client }: IProps) => {
  if (client !== undefined) {
    return (
      <>
        <div className='sdpi-item invalidHidden' id='billableWrapper'>
          <div className='sdpi-item-label'>Billable</div>
          <div className='sdpi-item-value' id='billable'>
            <span className='sdpi-item-child'>
              <input id='billableOff' type='radio' name='rdio' checked />
              <label htmlFor='billableOff' className='sdpi-item-label'><span />No</label>
            </span>
            <span className='sdpi-item-child'>
              <input id='billableOn' type='radio' value='off' name='rdio' />
              <label htmlFor='billableOn' className='sdpi-item-label'><span />Yes (Paid Plans only)</label>
            </span>
          </div>
        </div>
        {/* info/meta block */}
        <div className='sdpi-item'>
          <details className='message info'>
            <summary className='sdpi-item-value'>
              <div className='sdpi-item-child'><a onClick={() => client.openUrl({ url: 'track.toggl.com/timer' })}>Open Toggl</a></div>
              <div className='sdpi-item-child' style={{ marginTop: -2 }}><a onClick={() => client.openUrl({ url: 'discord.gg/YWy3UAy' })}>Discord</a></div>
              <div className='sdpi-item-child' style={{ marginTop: -6 }}><a onClick={() => client.openUrl({ url: 'github.com/tobimori/streamdeck-toggl' })}>GitHub</a></div>
              <div className='sdpi-item-child' style={{ marginTop: -6 }}><a onClick={() => client.openUrl({ url: 'ko-fi.com/tobimori' })}>Ko-fi</a></div>
            </summary>
          </details>
        </div>
        <div className='sdpi-item'>
          <details className='message'>
            <summary style={{ marginTop: -10 }}>A project by <a onClick={() => client.openUrl({ url: 'moeritz.io' })}>tobimori</a></summary>
          </details>
        </div>
      </>
    )
  }
  return null
}

export default PropertyInspector
