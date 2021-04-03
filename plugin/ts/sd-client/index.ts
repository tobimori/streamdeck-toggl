class StreamDeckClient {
  private readonly websocket: WebSocket
  private readonly context: any

  public constructor ({
    websocket,
    context
  }: {
    websocket: WebSocket
    context: any
  }) {
    this.websocket = websocket
    this.context = context
  }

  public setSettings ({ settings }: {settings: Record<string, unknown>}): void {
    this.websocket.send(
      JSON.stringify({
        event: 'setSettings',
        context: this.context,
        payload: settings
      })
    )
  }

  public getSettings (): void {
    this.websocket.send(
      JSON.stringify({
        event: 'getSettings',
        context: this.context
      })
    )
  }

  public setGlobalSettings ({ settings }: {settings: Record<string, unknown>}): void {
    this.websocket.send(
      JSON.stringify({
        event: 'setGlobalSettings',
        context: this.context,
        payload: settings
      })
    )
  }

  public getGlobalSettings (): void {
    this.websocket.send(
      JSON.stringify({
        event: 'getGlobalSettings',
        context: this.context
      })
    )
  }

  public openUrl ({ url }: { url: string }): void {
    this.websocket.send(
      JSON.stringify({
        event: 'openUrl',
        payload: {
          url: `https://${url}`
        }
      })
    )
  }

  public logMessage ({ message }: {message: string}): void {
    this.websocket.send(
      JSON.stringify({
        event: 'logMessage',
        context: this.context,
        payload: {
          message
        }
      })
    )
  }

  public setTitle ({ title, state }: { title: string, state?: 0 | 1 }): void {
    this.websocket.send(
      JSON.stringify({
        event: 'setTitle',
        context: this.context,
        payload: {
          title,
          target: 0,
          state
        }
      })
    )
  }

  // setImage

  public setState ({ state }: { state: number }): void {
    this.websocket.send(
      JSON.stringify({
        event: 'setState',
        context: this.context,
        payload: {
          state,
          target: 0
        }
      })
    )
  }

  public showAlert (): void {
    this.websocket.send(
      JSON.stringify({
        event: 'showAlert',
        context: this.context
      })
    )
  }

  public showOk (): void {
    this.websocket.send(
      JSON.stringify({
        event: 'showOk',
        context: this.context
      })
    )
  }

  // switchToProfile
  // sendToPropertyInspector
  // sendToPlugin
}

export default StreamDeckClient
