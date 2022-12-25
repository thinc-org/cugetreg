export interface Configuration {
  discord: {
    token: string
    clientID: string
  }
}

export const configuration: Configuration = {
  discord: {
    token: process.env.DISCORD_TOKEN,
    clientID: process.env.DISCORD_CLIENT_ID,
  },
}
