import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  // Read raw data because the old fields are no longer in the Payload schema.
  const globals = payload.db.globals.collection
  const about = await globals.findOne({ globalType: 'about' }, { session })
  if (!about || about.portrait?.image) return
  const portrait = about.portrait
  if (portrait?.source !== 'media' || !portrait.media) {
    throw new Error('About has no existing Media portrait. Select an image in About and save before rerunning this migration. URL-only portraits require a manually selected or uploaded Media record.')
  }
  await payload.findByID({ collection: 'media', id: String(portrait.media), depth: 0, req })
  const result = await globals.updateOne(
    { _id: about._id, 'portrait.media': portrait.media, 'portrait.image': null },
    { $set: { 'portrait.image': portrait.media } },
    { session },
  )
  if (!result.matchedCount) throw new Error('About changed during migration. Rerun to inspect the current portrait.')
  // Leave legacy fields in MongoDB for rollback; caption and other content are untouched.
}

export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  const globals = payload.db.globals.collection
  const about = await globals.findOne({ globalType: 'about' }, { session })
  if (!about?.portrait?.image) return
  const image = await payload.findByID({ collection: 'media', id: String(about.portrait.image), depth: 0, req })
  await globals.updateOne(
    { _id: about._id },
    {
      $set: {
        'portrait.source': 'media', 'portrait.media': about.portrait.image,
        'portrait.alt': image.alt, 'portrait.width': image.width, 'portrait.height': image.height,
      },
      $unset: { 'portrait.image': '' },
    },
    { session },
  )
}
