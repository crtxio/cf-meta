export interface Env {
  ZONES: KVNamespace
  RESOLVER: KVNamespace
  getDomain: (namehash: string) => Promise<DomainData | null>
  getMetadata: (namehash: string) => Promise<Record<string, any> | null>
  getMetadataLayer: (address: string, channel: string) => Promise<Metadata>
  getInvitationMetadata: (registrar: string, tid: string) => Promise<Metadata | null>
}

export type RouterParams = {
  namehash?: string
  origin?: string
  tid?: string
}

export interface RouterRequest extends Request {
  params: RouterParams
}

export type DomainData = {
  namehash: string
  parent: string
  label: string
  fqn: string
  owner?: string
}

export type Metadata = {
  name?: string
  image?: string
  image_data?: string
  description?: string
  external_url?: string
  animation_url?: string
  background_color?: string
  attributes?: MetadataAttribute[]
}

export type MetadataAttribute = {
  display_type?: 'date' | 'number' | 'boost_number' | 'boost_percentage'
  trait_type: string
  value: string | number
}
