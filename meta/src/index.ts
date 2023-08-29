import { Router } from 'itty-router'
import { createCors } from 'itty-cors'

import { withPress } from './press'
import { withJSON } from './utils'

import type { RouterRequest } from './types'

const { preflight } = createCors({ origins: ['*'] })
const router = Router()

router.all('*', preflight)
router.all('*', withPress)
router.all('/:namehash', async ({ params }: RouterRequest, { getMetadata }) => {
  const { namehash } = params
  return withJSON(await getMetadata(namehash))
})

router.get('/:origin/:tid', async ({ params }: RouterRequest, { getInvitationMetadata }) => {
  const { origin, tid } = params
  return withJSON(await getInvitationMetadata(origin, tid))
})

router.get('/:origin/:tid/image.svg', async ({ params }: RouterRequest, { getInvitationMetadata }) => {
  const { origin, tid } = params
  const { image_data } = await getInvitationMetadata(origin, tid)
  return new Response(image_data, { headers: { 'Content-Type': 'image/svg+xml' } })
})

export default { fetch: router.handle }
