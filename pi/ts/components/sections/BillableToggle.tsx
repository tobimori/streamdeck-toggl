import React, { useContext } from 'react'
import { SettingsContext } from '../../settingsCtx'

const BillableToggle: React.FC = () => {
  const { state, update } = useContext(SettingsContext)

  const handleChange = (billable: boolean): void => {
    update({ ...state, billable: billable })
  }

  return (
    <>
      <div className='sdpi-item invalidHidden'>
        <div className='sdpi-item-label'>Billable</div>
        <div className='sdpi-item-value'>
          <span className='sdpi-item-child'>
            <input id='billableOff' type='radio' name='rdio' onChange={() => handleChange(false)} checked={state.billable === false || state.billable === undefined} />
            <label htmlFor='billableOff' className='sdpi-item-label'><span />No</label>
          </span>
          <span className='sdpi-item-child'>
            <input id='billableOn' type='radio' value='off' name='rdio' onChange={() => handleChange(true)} checked={state.billable} />
            <label htmlFor='billableOn' className='sdpi-item-label'><span />Yes (Paid Plans only)</label>
          </span>
        </div>
      </div>
    </>
  )
}

export default BillableToggle
