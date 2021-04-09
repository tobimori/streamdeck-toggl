import StreamDeckClient from '../sd-client'
import TogglClient from '../toggl-client'

class StartAction {
  private readonly sdClient: StreamDeckClient
  private readonly togglClient: TogglClient

  public constructor ({
    sdClient,
    togglClient
  }: {
    sdClient: StreamDeckClient
    togglClient: TogglClient
  }) {
    this.sdClient = sdClient
    this.togglClient = togglClient
  }

  public onKeyDown (payload: Record<string, any>): void {
    this.togglClient.startEntry({
      activity: 'test'
    }).catch((err) => {
      console.error(err)
      this.sdClient.showAlert()
    })
  }
}

export default StartAction
