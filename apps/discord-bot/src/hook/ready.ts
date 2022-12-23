import { Client } from 'discord.js'

export default (client: Client): void => {
  client.on('ready', async () => {
    if (client.user && client.application) {
      console.log(`${client.user.username} Online!`)
    }
  })
}
