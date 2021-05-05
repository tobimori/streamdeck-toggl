import React from 'react'
import { BillableToggle, EntryName, ProjectSelect, WorkspaceSelect } from '..'

const StartInspector: React.FC = () => {
  return (
    <>
      <EntryName />
      <WorkspaceSelect />
      <ProjectSelect />
      <BillableToggle />
    </>
  )
}

export default StartInspector
