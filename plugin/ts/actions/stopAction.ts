import StreamDeckClient from '../sd-client'
import TogglClient from '../toggl-client'

class StopAction {
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
    this.togglClient.getCurrentEntry().then((res) => { // get id of currently running entry
      console.log(payload)
      if (res.data !== null) {
        this.togglClient.stopEntry({
          timeEntryId: res.data.id // then submit request to stop
        }).catch((err) => {
          console.error(err)
          this.sdClient.showAlert()
        })
      } else {
        this.sdClient.showAlert() // if no time tracking session is running, show alert
      }
    }).catch((err) => {
      console.error(err)
      this.sdClient.showAlert()
    })
  }
}

export default StopAction
