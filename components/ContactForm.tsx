'use client'
import { useState } from 'react'

export default function ContactForm() {
    const [sent, setSent] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', message: '' })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSent(true)
    }

    if (sent) return (
        <section style={{ background: '#fff', padding: '72px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Merci, votre message a bien ete envoye.</p>
        </section>
    )

    return (
        <section style={{ background: '#fff', padding: '72px 24px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, fontSize: '32px', textTransform: 'uppercase', marginBottom: '40px', textAlign: 'center' }}>Contacter la Conciergerie</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input
                        type="text"
                        placeholder="Nom"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid #ccc', fontSize: '13px', outline: 'none', background: 'transparent' }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid #ccc', fontSize: '13px', outline: 'none', background: 'transparent' }}
                    />
                    <textarea
                        placeholder="Message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        style={{ padding: '12px', border: '1px solid #eee', fontSize: '13px', outline: 'none', background: 'transparent', resize: 'none' }}
                    />
                    <button
                        type="submit"
                        style={{ padding: '12px 24px', background: '#000', color: '#fff', border: 'none', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer', alignSelf: 'flex-start' }}
                    >
                        Envoyer
                    </button>
                </form>
            </div>
        </section>
    )
}
