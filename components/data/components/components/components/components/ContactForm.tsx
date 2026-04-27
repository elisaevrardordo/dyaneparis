'use client'
import { useState } from 'react'

const cocktails = ['Dyane No.1 - Pornstar Martini','Dyane No.2 - Moscow Mule','Teo for Dyane Paris','Autre demande']
const ic = "w-full border-b border-black/20 bg-transparent py-3 text-sm focus:outline-none focus:border-black/60 transition-colors uppercase"
const st = {letterSpacing:'0.15em',fontSize:'11px'}

import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { name, email, country, zip, city, cocktail, message } = await req.json()
    try {
        await resend.emails.send({
              from: 'Conciergerie Dyane Paris <contact@dyaneparis.com>',
                    to: ['contact@dyaneparis.com'],
                          replyTo: email,
                                subject: `Nouvelle demande - ${cocktail || 'Contact general'}`,
                                      html: `<h2>Nouvelle demande</h2><p><b>Nom:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Pays:</b> ${country}</p><p><b>Ville:</b> ${city} ${zip}</p><p><b>Cocktail:</b> ${cocktail}</p><hr/><p><b>Message:</b></p><p>${message}</p>`,
                                          })
                                              return NextResponse.json({ ok: true })
                                                } catch (error) {
                                                    return NextResponse.json({ error: 'Email failed' }, { status: 500 })
                                                      }
                                                      }export default function ContactForm() {
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle')
    const [form, setForm] = useState({name:'',email:'',country:'',zip:'',city:'',cocktail:'',message:''})
      const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => setForm({...form,[e.target.name]:e.target.value})
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault(); setStatus('sending')
                try {
                      const r = await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
                            setStatus(r.ok ? 'sent' : 'error')
                                } catch { setStatus('error') }
                                  }
                                    return (
                                        <form onSubmit={handleSubmit} className="space-y-8">
                                              <div className="grid grid-cols-2 gap-6">
                                                      <input name="name" placeholder="PRENOM NOM *" required onChange={handleChange} className={ic} style={st} />
                                                              <input name="email" type="email" placeholder="E-MAIL *" required onChange={handleChange} className={ic} style={st} />
                                                                    </div>
                                                                          <select name="country" required onChange={handleChange} className={ic} style={st}>
                                                                                  <option value="">PAYS / REGION *</option>
                                                                                          <option>France</option><option>Belgique</option><option>Suisse</option><option>Luxembourg</option><option>Autre</option>
                                                                                                </select>
                                                                                                      <div className="grid grid-cols-2 gap-6">
                                                                                                              <input name="zip" placeholder="CODE POSTAL *" required onChange={handleChange} className={ic} style={st} />
                                                                                                                      <input name="city" placeholder="VILLE *" required onChange={handleChange} className={ic} style={st} />
                                                                                                                            </div>
                                                                                                                                  <select name="cocktail" onChange={handleChange} className={ic} style={st}>
                                                                                                                                          <option value="">INFORMATIONS SUR NOS COCKTAILS</option>
                                                                                                                                                  {cocktails.map(c => <option key={c}>{c}</option>)}
                                                                                                                                                        </select>
                                                                                                                                                              <textarea name="message" placeholder="VOTRE MESSAGE *" required rows={5} onChange={handleChange} className={`${ic} resize-none`} style={st} />
                                                                                                                                                                    <button type="submit" disabled={status==='sending'} className="btn-luxury w-full">
                                                                                                                                                                            {status==='sending'?'Envoi...':status==='sent'?'Message envoye':'Envoyer'}
                                                                                                                                                                                  </button>
                                                                                                                                                                                        {status==='error' && <p className="kicker text-xs text-red-600 text-center">Une erreur est survenue. Veuillez reessayer.</p>}
                                                                                                                                                                                            </form>
                                                                                                                                                                                              )
                                                                                                                                                                                              }