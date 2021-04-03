class TogglClient {
  private readonly apiToken: string
  private readonly baseUrl: string

  public constructor ({
    apiToken,
    baseUrl
  }: {
    apiToken: string
    baseUrl: string
  }) {
    this.apiToken = apiToken
    this.baseUrl = baseUrl
  }

  private async sendTogglRequest ({ endpoint, method, data }: { endpoint: string, method: 'GET' | 'POST' | 'PUT', data?: Record<string, unknown> }): Promise<Response> {
    return await fetch(`${this.baseUrl}/${endpoint}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${this.apiToken}:api_token`)}`
      },
      body: JSON.stringify(data)
    })
  }

  public async getWorkspaces (): Promise<any> {
    const req = await this.sendTogglRequest({ endpoint: 'workspaces', method: 'GET' })
    return await req.json()
  }

  public async getProjects ({ workspaceId }: { workspaceId: number }): Promise<any> {
    const req = await this.sendTogglRequest({ endpoint: `workspaces/${workspaceId}/projects?active=true`, method: 'GET' })
    return await req.json()
  }

  public async startEntry ({ activity, workspaceId, projectId, billable }: { activity: string, workspaceId?: number, projectId?: number, billable?: boolean }): Promise<any> {
    const req = await this.sendTogglRequest({
      endpoint: 'time_entries/start',
      method: 'POST',
      data: {
        time_entry: {
          description: activity,
          wid: workspaceId,
          pid: projectId,
          billable,
          created_with: 'Toggl Track for Stream Deck'
        }
      }
    })
    return await req.json()
  }

  public async getCurrentEntry (): Promise<any> {
    const req = await this.sendTogglRequest({ endpoint: 'time_entries/current', method: 'GET' })
    return await req.json()
  }

  public async stopEntry ({ timeEntryId }: { timeEntryId: number }): Promise<any> {
    const req = await this.sendTogglRequest({
      endpoint: `time_entries/${timeEntryId}/stop`,
      method: 'PUT'
    })
    return await req.json()
  }
}
export default TogglClient
