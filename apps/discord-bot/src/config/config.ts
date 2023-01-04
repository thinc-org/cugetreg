export interface Configuration {
  discord: {
    token: string
    clientID: string
  }
  googleAnalytic: {
    GA4_PROPERTY_ID: string
  }
}

export const configuration: Configuration = {
  discord: {
    token: process.env.DISCORD_TOKEN,
    clientID: process.env.DISCORD_CLIENT_ID,
  },
  googleAnalytic: {
    GA4_PROPERTY_ID: process.env.GA4_PROPERTY_ID,
  },
}
