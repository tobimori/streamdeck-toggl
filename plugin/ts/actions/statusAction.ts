import StreamDeckClient from '../sd-client'
import TogglClient from '../toggl-client'

class StatusAction {
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
    console.log(payload)
  }
}

export default StatusAction
