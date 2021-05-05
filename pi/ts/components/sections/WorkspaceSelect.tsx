import React, { useContext, useEffect, useState } from 'react'
import { workspaceDetails } from '../../../../plugin/ts/toggl-client/types'
import { SettingsContext } from '../../settingsCtx'

const WorkspaceSelect: React.FC = () => {
  const { state, update } = useContext(SettingsContext)
  const [workspaces, setWorkspaces] = useState <workspaceDetails[]>([])

  const handleChange = (id: string | undefined): void => {
    update({ ...state, workspaceId: id })
  }

  useEffect(() => {
    state.togglClient.getWorkspaces().then((res: workspaceDetails[]) => {
      setWorkspaces(res)
    })
  }, [state.togglClient])

  if (workspaces.length !== 0) {
    return (
      <div className='sdpi-item'>
        <label className='sdpi-item-label'>Workspace</label>
        <select
          value={state.workspaceId}
          onChange={(e) => {
            e.preventDefault()
            handleChange(e.target.value)
          }}
          className='sdpi-item-value select'
        >
          <option value={undefined}>No workspace selected</option>
          {workspaces.map((workspace) => (
            <option key={workspace.id} value={workspace.id}>
              {workspace.name}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return null
}

export default WorkspaceSelect
