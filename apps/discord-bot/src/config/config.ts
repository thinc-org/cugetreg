export interface Configuration {
  discord: {
    token: string
  }
}

export const configuration = (): Configuration => {
  return {
    discord: {
      token: process.env.DISCORD_TOKEN,
    },
  }
}
