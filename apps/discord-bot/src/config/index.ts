export interface Configuration {
  discord: {
    token: string
    clientID: string
  }
  googleAnalytics: {
    GA4_PROPERTY_ID: string
  }
  database: {
    connectionURL: string
  }
}

export const configuration: Configuration = {
  discord: {
    token: process.env.DISCORD_TOKEN,
    clientID: process.env.DISCORD_CLIENT_ID,
  },
  googleAnalytics: {
    GA4_PROPERTY_ID: process.env.GA4_PROPERTY_ID,
  },
  database: {
    connectionURL: process.env.DATABASE_CONNECTION_URL,
  },
}
