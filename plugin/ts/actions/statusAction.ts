import StreamDeckClient from '../sd-client'
import TogglClient from '../toggl-client'

class StatusAction {
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
    console.log(payload)
  }
}

export default StatusAction
