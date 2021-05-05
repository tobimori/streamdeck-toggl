import React, { useContext, useEffect, useState } from 'react'
import { SettingsContext } from '../../settingsCtx'

const WorkspaceSelect: React.FC = () => {
  const { state, update } = useContext(SettingsContext)
  const [projects, setProjects] = useState <Array<Record<string, any>>>([])

  const handleChange = (id: string | undefined): void => {
    update({ ...state, projectId: id })
  }

  useEffect(() => {
    if (state.workspaceId !== 'undefined' && state.workspaceId !== '') {
      state.togglClient.getProjects({
        workspaceId: state.workspaceId
      }).then((res: Array<Record<string, any>>) => {
        setProjects(res)
      })
    }
  }, [state.workspaceId])

  if (state.workspaceId !== undefined && state.workspaceId !== '' && projects.length !== 0) {
    return (
      <div className='sdpi-item'>
        <label className='sdpi-item-label'>Project</label>
        <select
          value={state.projectId}
          onChange={(e) => {
            e.preventDefault()
            handleChange(e.target.value)
          }}
          className='sdpi-item-value select'
        >
          <option value={undefined}>No project selected</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return null
}

export default WorkspaceSelect
