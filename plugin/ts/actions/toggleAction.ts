import StreamDeckClient from '../sd-client'
import TogglClient from '../toggl-client'

class ToggleAction {
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
    this.togglClient.getCurrentEntry().then((res) => {
      console.log(payload)
      if (res.data !== null) {
        this.togglClient.stopEntry({
          timeEntryId: res.data.id
        }).then(() => {
          this.sdClient.setState({ state: 1 }) // if stop request is successful, set state to OFF
        }).catch((err) => {
          console.error(err)
          this.sdClient.showAlert()
        })
      } else {
        this.togglClient.startEntry({
          activity: payload.settings.entryName,
          workspaceId: payload.settings.workspaceId,
          projectId: payload.settings.projectId,
          billable: payload.settings.billable
        }).then(() => {
          this.sdClient.setState({ state: 0 }) // if start request is successful, set state to ON
        }).catch((err) => {
          console.error(err)
          this.sdClient.showAlert()
        })
      }
    }).catch((err) => {
      console.error(err)
      this.sdClient.showAlert()
    })
  }
}

export default ToggleAction
