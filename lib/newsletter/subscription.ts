import type { Resend } from 'resend'

async function includesSegment(resend: Resend, contactId: string, segmentId: string) {
    let after: string | undefined

    for (;;) {
        const { data, error } = await resend.contacts.segments.list({ contactId, limit: 100, after })
        if (error || !data) throw new Error('Unable to verify newsletter membership')
        if (data.data.some(segment => segment.id === segmentId)) return true
        if (!data.has_more) return false

        const cursor = data.data.at(-1)?.id
        if (!cursor || cursor === after) throw new Error('Invalid contact segments page')
        after = cursor
    }
}

export async function subscribeToNewsletter(
    resend: Resend,
    { email, firstName, segmentId }: { email: string; firstName: string; segmentId: string },
) {
    const existing = await resend.contacts.get({ email })

    if (existing.data) {
        const { id, first_name, unsubscribed } = existing.data
        if (unsubscribed) return { status: 'opted-out' } as const
        if (await includesSegment(resend, id, segmentId)) return { status: 'already-subscribed' } as const

        const added = await resend.contacts.segments.add({ contactId: id, segmentId })
        if (added.error || !added.data?.id) throw new Error('Unable to add contact to newsletter')
        return { status: 'subscribed', contactId: id, firstName: firstName || first_name || undefined } as const
    }

    if (existing.error?.statusCode !== 404 && existing.error?.name !== 'not_found') {
        throw new Error('Unable to look up newsletter contact')
    }

    const created = await resend.contacts.create({
        email,
        firstName: firstName || undefined,
        unsubscribed: false,
        segments: [{ id: segmentId }],
    })
    if (created.error || !created.data?.id) {
        // A concurrent request may have registered this address after the initial lookup.
        if (created.error?.statusCode === 409) {
            const current = await resend.contacts.get({ email })
            if (current.data && !current.data.unsubscribed
                && await includesSegment(resend, current.data.id, segmentId)) {
                return { status: 'already-subscribed' } as const
            }
        }
        throw new Error('Unable to create newsletter contact')
    }

    return { status: 'subscribed', contactId: created.data.id, firstName: firstName || undefined } as const
}
