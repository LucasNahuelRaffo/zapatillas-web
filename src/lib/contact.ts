// Punto único para el número y los mensajes de WhatsApp del sitio.
// Cambiar acá cambia todos los botones, links y mensajes predeterminados.

export const WHATSAPP_NUMBER = '5491151256838' // formato wa.me (sin +, sin espacios, sin dashes)
export const WHATSAPP_DISPLAY = '+54 9 11 5125-6838' // para mostrar al usuario
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`

export function buildWhatsAppLink(message: string): string {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
}

// Mensaje predeterminado para consultar por una zapatilla puntual desde la ficha
export function buildProductMessage(opts: {
  name: string
  price: number
  size?: string
  color?: string
}): string {
  const price = `$${opts.price.toLocaleString('es-AR')}`
  const details = [opts.size && `Talle ${opts.size} US`, opts.color]
    .filter(Boolean)
    .join(', ')
  return `Hola! Cómo estás? Vi las ${opts.name} en la web (${price})${details ? ` — ${details}` : ''}. ¿Me confirmás si te quedan en stock? 🙌`
}

// Mensaje predeterminado para el checkout del carrito
export function buildCartMessage(
  items: Array<{
    name: string
    size: string
    color: string
    qty: number
    subtotal: number
  }>,
  total: number,
): string {
  let msg = 'Hola! Cómo estás? Estuve viendo en la web y quería consultar por estas zapatillas:\n\n'
  items.forEach(i => {
    msg += `• ${i.name} — Talle ${i.size} US, ${i.color}, x${i.qty} — $${i.subtotal.toLocaleString('es-AR')}\n`
  })
  msg += `\n*Total: $${total.toLocaleString('es-AR')}*\n\n¿Me confirmás si te quedaron en stock? 🙌`
  return msg
}
