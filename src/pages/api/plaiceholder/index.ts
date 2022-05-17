import { NextApiRequest, NextApiResponse } from 'next'
import { getPlaiceholder } from 'plaiceholder'

// eslint-disable-next-line import/no-default-export
export default async function plaiceholder(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req
  const url = body.url as string

  const { base64, img } = await getPlaiceholder(url)

  res.status(200).send({
    base64,
    img,
  })
}
