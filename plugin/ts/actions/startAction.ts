import StreamDeckClient from '../sd-client'
import TogglClient from '../toggl-client'

class StartAction {
  private readonly sdClient: StreamDeckClient
  public togglId: string
  public togglClient: TogglClient

  public constructor ({
    sdClient,
    togglId,
    togglClient
  }: {
    sdClient: StreamDeckClient
    togglId: string
    togglClient: TogglClient
  }) {
    this.sdClient = sdClient
    this.togglId = togglId
    this.togglClient = togglClient
  }

  public onKeyDown (payload: Record<string, any>): void {
    this.togglClient.startEntry({
      activity: payload.settings.entryName,
      workspaceId: payload.settings.workspaceId,
      projectId: payload.settings.projectId,
      billable: payload.settings.billable
    }).catch((err) => {
      console.error(err)
      this.sdClient.showAlert()
    })
  }
}

export default StartAction
