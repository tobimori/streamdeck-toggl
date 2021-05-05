import React, { useContext } from 'react'
import { SettingsContext } from '../../settingsCtx'

const AccountSelect: React.FC = () => {
  const { state, update } = useContext(SettingsContext)

  const handleChange = (id: string | undefined): void => {
    if (id === 'addNewAcc') {
      window.open('../setup/index.html')
    } else {
      update({ ...state, selectedAccount: id })
    }
  }

  if (state.accounts !== {}) {
    return (
      <>
        <div className='sdpi-item'>
          <label className='sdpi-item-label'>Account</label>
          <select
            value={state.selectedAccount}
            onChange={(e) => {
              e.preventDefault()
              handleChange(e.target.value)
            }}
            className='sdpi-item-value select'
          >
            <option value={undefined}>No selected account</option>
            {Object.keys(state.accounts).map((id) => {
              const acc = state.accounts[id]

              return (
                <option key={id} value={id}>
                  {acc.name}
                </option>
              )
            })}
            <option disabled>―――――――――――</option>
            <option value='addNewAcc'>Add account</option>
          </select>
        </div>
        <div className='sdpi-item'>
          <button
            style={{ marginLeft: 103 }}
            disabled={state.selectedAccount === 'addNewAcc' || state.selectedAccount === undefined}
            onClick={(e) => {
              e.preventDefault()
              document.dispatchEvent(
                new CustomEvent('removeAccount', { detail: { id: state.selectedAccount } })
              )
              handleChange(undefined)
            }}
            className='sdpi-item-value'
          >
            Remove account
          </button>
        </div>
      </>
    )
  }

  return null
}

export default AccountSelect
