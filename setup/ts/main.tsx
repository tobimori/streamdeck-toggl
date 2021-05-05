import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const SetupForm: React.FC = () => {
  const [details, setDetails] = useState({
    email: '',
    password: ''
  })
  const [status, setStatus] = useState('')

  const handleSave = async (): Promise<void> => {
    setStatus('loading')

    if (details.email !== '' && details.password !== '') {
      const apiTokenReq = await fetch('https://api.track.toggl.com/api/v8/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${details.email}:${details.password}`)}`
        }
      })

      try {
        const { data } = await apiTokenReq.json()

        if (data?.api_token !== '') {
          window.opener.document.dispatchEvent(
            new CustomEvent('saveAccount', {
              detail: {
                id: data.id,
                name: `${data.fullname as string} - ${data.email as string}`,
                apiToken: data.api_token
              }
            })
          )
          console.log('Account saved!')
          window.close()
        }
      } catch (e) {
        setStatus('An unexpected error occured!')
        console.error(e)
      }

      if (apiTokenReq.status !== 200) {
        switch (apiTokenReq.status) {
          case 401:
          case 403:
            setStatus('Please double-check your credentials. Authorization failed.')
            break
          default:
            setStatus(`Authorization failed. Error code ${apiTokenReq.status}`)
        }
      }
    }
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <img style={{ width: '100%', marginBottom: '20px' }} src='../../resources/GitHubBanner.png' />
      <h1>Add Toggl Track account</h1>
      {status !== 'loading' && status !== '' && (
        <div className='sdpi-item'>
          <details className='message caution'>
            <summary>{status}</summary>
          </details>
        </div>
      )}
      <div className='sdpi-item'>
        <label className='sdpi-item-label'>Email</label>
        <input
          className='sdpi-item-value'
          type='text'
          placeholder='Email address'
          value={details.email}
          onChange={(e) => setDetails({ ...details, email: e.target.value })}
          required
        />
      </div>
      <div className='sdpi-item'>
        <label className='sdpi-item-label'>Password</label>
        <input
          className='sdpi-item-value'
          type='password'
          placeholder='Password'
          value={details.password}
          onChange={(e) => setDetails({ ...details, password: e.target.value })}
          required
        />
      </div>
      <button style={{ marginTop: 10 }} onClick={handleSave} disabled={status === 'loading'}>
        {status === 'loading' ? 'Checking credentials...' : 'Add account'}
      </button>
    </div>
  )
}

ReactDOM.render(<SetupForm />, document.getElementById('sdsetup'))
