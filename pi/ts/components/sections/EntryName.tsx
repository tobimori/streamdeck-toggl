import React, { useContext } from 'react'
import { SettingsContext } from '../../settingsCtx'

const EntryName: React.FC = () => {
  const { state, update } = useContext(SettingsContext)

  const handleChange = (entryName: string): void => {
    update({ ...state, entryName })
  }

  return (
    <div className='sdpi-item'>
      <div className='sdpi-item-label'>Entry Name</div>
      <input
        className='sdpi-item-value' value={state.entryName} placeholder='What are you doing?' onChange={(e) => {
          e.preventDefault()
          handleChange(e.target.value)
        }}
      />
    </div>
  )
}

export default EntryName
