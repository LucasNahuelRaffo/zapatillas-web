import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const LAST_UPDATED = '28 de mayo de 2026'
const WHATSAPP_URL = 'https://wa.me/5491112345678'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-skylight text-2xl sm:text-3xl uppercase tracking-tight mb-4 text-black">
        {title}
      </h2>
      <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed">{children}</div>
    </section>
  )
}

function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc pl-5 space-y-2">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  )
}

interface LegalContent {
  title: string
  metaDescription: string
  body: React.ReactNode
}

const CONTENT: Record<string, LegalContent> = {
  'terminos-y-condiciones': {
    title: 'Términos y Condiciones',
    metaDescription:
      'Términos y condiciones de uso y compra en Tuviejasneakers. Conocé las reglas del sitio, precios, pagos, envíos y responsabilidades.',
    body: (
      <>
        <Section title="1. Aceptación">
          <p>
            Al navegar y realizar compras en Tuviejasneakers aceptás estos Términos y Condiciones en su
            totalidad. Si no estás de acuerdo con alguno de los puntos, te pedimos que no utilices el
            sitio. Podemos actualizar estos términos en cualquier momento; la versión vigente es la
            publicada en esta página.
          </p>
        </Section>
        <Section title="2. Productos y precios">
          <p>
            Comercializamos calzado premium importado. Hacemos nuestro mejor esfuerzo para que las
            fotografías, descripciones y precios sean exactos, pero pueden existir variaciones mínimas
            de color o detalle propias de cada par.
          </p>
          <p>
            Todos los precios se expresan en pesos argentinos (ARS) e incluyen impuestos cuando
            corresponde. Los precios pueden modificarse sin previo aviso, pero nunca afectan a pedidos
            ya confirmados.
          </p>
        </Section>
        <Section title="3. Pedidos y pagos">
          <p>
            La compra se coordina y confirma a través de nuestros canales de atención. Aceptamos todas
            las billeteras virtuales y los medios de pago informados al momento de la compra. El pedido
            se considera confirmado una vez acreditado el pago.
          </p>
          <p>
            Nos reservamos el derecho de cancelar pedidos ante sospechas de fraude, errores evidentes
            de precio o falta de stock, reintegrando en ese caso cualquier importe abonado.
          </p>
        </Section>
        <Section title="4. Envíos">
          <p>
            Realizamos envíos a todo el país mediante mensajería privada y correo. Los plazos de
            entrega son estimados y pueden variar según la localidad y la empresa de logística. El
            despacho se realiza dentro de las 24 hs hábiles posteriores a la confirmación del pago.
          </p>
        </Section>
        <Section title="5. Cambios y devoluciones">
          <p>
            Las condiciones de cambios y devoluciones se detallan en nuestra página de{' '}
            <Link to="/cambios-y-devoluciones" className="text-black underline underline-offset-2 hover:text-gray-600">
              Cambios y Devoluciones
            </Link>
            .
          </p>
        </Section>
        <Section title="6. Propiedad intelectual">
          <p>
            Todo el contenido del sitio (textos, imágenes, logos y diseño) pertenece a Tuviejasneakers o se
            utiliza con autorización. Queda prohibida su reproducción total o parcial sin nuestro
            consentimiento.
          </p>
        </Section>
        <Section title="7. Responsabilidad y jurisdicción">
          <p>
            No nos responsabilizamos por daños derivados del mal uso de los productos o de
            interrupciones ajenas a nuestra voluntad en el funcionamiento del sitio. Estos términos se
            rigen por las leyes de la República Argentina.
          </p>
        </Section>
        <Section title="8. Contacto">
          <p>
            Ante cualquier consulta podés escribirnos por{' '}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-black underline underline-offset-2 hover:text-gray-600">
              WhatsApp
            </a>
            .
          </p>
        </Section>
      </>
    ),
  },
  'politica-de-privacidad': {
    title: 'Política de Privacidad',
    metaDescription:
      'Política de privacidad de Tuviejasneakers. Cómo recopilamos, usamos y protegemos tus datos personales conforme a la Ley 25.326.',
    body: (
      <>
        <Section title="1. Datos que recopilamos">
          <p>
            Recopilamos los datos que nos brindás al realizar una compra o consulta: nombre, datos de
            contacto (teléfono, email), dirección de envío y la información necesaria para procesar el
            pedido. No almacenamos datos de tarjetas ni credenciales de pago.
          </p>
        </Section>
        <Section title="2. Uso de la información">
          <p>Utilizamos tus datos exclusivamente para:</p>
          <Bullets
            items={[
              'Procesar, coordinar y enviar tus pedidos.',
              'Brindarte atención y responder tus consultas.',
              'Informarte novedades o promociones, solo si lo autorizás.',
            ]}
          />
        </Section>
        <Section title="3. Compartir datos con terceros">
          <p>
            Solo compartimos los datos estrictamente necesarios con las empresas de logística para
            concretar la entrega. No vendemos ni cedemos tu información a terceros con fines
            comerciales.
          </p>
        </Section>
        <Section title="4. Cookies">
          <p>
            El sitio puede utilizar cookies y tecnologías similares para mejorar tu experiencia de
            navegación y entender el uso del sitio. Podés deshabilitarlas desde la configuración de tu
            navegador.
          </p>
        </Section>
        <Section title="5. Tus derechos">
          <p>
            Conforme a la Ley 25.326 de Protección de los Datos Personales, podés solicitar el acceso,
            la rectificación, la actualización o la supresión de tus datos en cualquier momento
            escribiéndonos por{' '}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-black underline underline-offset-2 hover:text-gray-600">
              WhatsApp
            </a>
            . La AAIP, órgano de control de la Ley 25.326, tiene la atribución de atender denuncias por
            incumplimiento de las normas de protección de datos personales.
          </p>
        </Section>
        <Section title="6. Seguridad">
          <p>
            Adoptamos medidas razonables para proteger tu información, pero ningún sistema es
            infalible. Te recomendamos no compartir datos sensibles por canales no oficiales.
          </p>
        </Section>
      </>
    ),
  },
  'cambios-y-devoluciones': {
    title: 'Cambios y Devoluciones',
    metaDescription:
      'Política de cambios y devoluciones de Tuviejasneakers: 5 días hábiles, productos sin uso y en su caja original.',
    body: (
      <>
        <Section title="Plazo y condiciones">
          <p>
            Tenés <strong className="text-black">5 días hábiles</strong> desde la recepción del pedido
            para solicitar un cambio de talle o una devolución. Para que el cambio o la devolución sea
            válido, las zapatillas deben encontrarse:
          </p>
          <Bullets
            items={[
              <><strong className="text-black">Sin uso</strong>, sin marcas ni signos de desgaste.</>,
              'En su caja original y con todos sus accesorios y etiquetas.',
              'En las mismas condiciones en que fueron recibidas.',
            ]}
          />
          <p>
            No se aceptan cambios ni devoluciones de productos usados, dañados por mal uso o sin su
            embalaje original.
          </p>
        </Section>
        <Section title="Cómo solicitarlo">
          <p>
            Escribinos por{' '}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-black underline underline-offset-2 hover:text-gray-600">
              WhatsApp
            </a>{' '}
            dentro del plazo indicando tu número de pedido y el motivo. Te guiamos en cada paso para
            coordinar el retiro o envío del producto.
          </p>
        </Section>
        <Section title="Costos de envío">
          <p>
            En los cambios por talle, el costo de logística del nuevo envío puede estar a cargo del
            comprador, salvo que el cambio se deba a un error nuestro o a una falla de fabricación, en
            cuyo caso lo cubrimos nosotros.
          </p>
        </Section>
      </>
    ),
  },
}

export default function LegalPage({ slug }: { slug: string }) {
  const content = CONTENT[slug]

  if (!content) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="text-gray-500 font-skylight text-2xl">Página no encontrada.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f9f9f9]">
      <Helmet>
        <title>{content.title} | Tuviejasneakers</title>
        <meta name="description" content={content.metaDescription} />
      </Helmet>

      <div className="max-w-[820px] mx-auto px-6 lg:px-12 pt-32 pb-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.15em] uppercase text-gray-400 hover:text-black transition-colors mb-10"
        >
          <ArrowLeft size={14} /> Volver al inicio
        </Link>

        <h1 className="font-skylight text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-black leading-none mb-4">
          {content.title}
        </h1>
        <p className="text-[12px] text-gray-400 font-medium mb-16">
          Última actualización: {LAST_UPDATED}
        </p>

        {content.body}
      </div>
    </main>
  )
}
