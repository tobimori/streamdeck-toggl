import StreamDeckClient from './sd-client'
import TogglClient from './toggl-client'

const apiToken = ''

export const onKeyDown = ({ client }: { client: StreamDeckClient }): void => {
  const togglClient = new TogglClient({
    apiToken,
    baseUrl: 'https://api.track.toggl.com/api/v8'
  })

  togglClient.getCurrentEntry().then((res) => {
    if (res.data !== null) {
      togglClient.stopEntry({ timeEntryId: res.data.id }).catch((err) => {
        console.error(err)
        client.showAlert()
      })
    } else {
      togglClient.startEntry({
        activity: 'test'
      }).catch((err) => {
        console.error(err)
        client.showAlert()
      })
    }
  }).catch((err) => {
    console.error(err)
    client.showAlert()
  })
}
