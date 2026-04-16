import { Link } from 'react-router-dom';

export default function Footer() {
  const sections = [
    {
      title: 'Help',
      links: ['Contacto', 'Cambios y Devoluciones']
    },
    {
      title: 'Shop',
      links: ['Hombre', 'Mujer', 'Nuevos Ingresos', 'Promociones']
    },
    {
      title: 'Legal',
      links: ['Términos y Condiciones', 'Política de Privacidad', 'Defensa del Consumidor']
    }
  ]

  return (
    <footer className="bg-black text-white pt-24 pb-8 border-t border-black/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-16 lg:gap-12 mb-24">
          
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-5 pr-10">
            <h2 className="text-3xl font-black tracking-tighter uppercase mb-6 flex items-center gap-3">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Za-pass
            </h2>
            <p className="text-[13px] text-gray-500 leading-relaxed font-medium mb-10 max-w-sm">
              Confección de nivel premium AAA. Redefiniendo el estándar con calidad que se siente como el original, directo desde las mismas fábricas productoras.
            </p>
            
            <div className="flex gap-4">
              {/* Instagram */}
              <a href="#" className="w-11 h-11 border border-white/20 rounded-full flex items-center justify-center hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500 hover:border-transparent transition-all duration-300 transform hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.069 4.849-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" className="w-11 h-11 border border-white/20 rounded-full flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] transition-all duration-300 transform hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
                </svg>
              </a>
              {/* Whatsapp */}
              <a href="#" className="w-11 h-11 border border-white/20 rounded-full flex items-center justify-center hover:bg-[#25D366] hover:border-[#25D366] transition-all duration-300 transform hover:scale-110">
                <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12.031 2.039a10 10 0 0 0-8.54 15.207l-1.49 5.438 5.565-1.46a10.023 10.023 0 0 0 4.465 1.055h.004a10.003 10.003 0 0 0 10-10C22.035 6.755 17.55 2.039 12.031 2.039zM12.03 20.06a8.318 8.318 0 0 1-4.242-1.157l-.304-.18-3.153.827.842-3.076-.197-.315A8.305 8.305 0 0 1 12.03 3.722a8.305 8.305 0 0 1 8.313 8.316 8.306 8.306 0 0 1-8.313 8.022zm4.568-6.236c-.25-.125-1.482-.731-1.712-.815-.229-.083-.397-.124-.564.125-.166.25-.646.814-.792.981-.146.167-.291.189-.541.064-.251-.125-1.058-.39-2.016-1.24-.746-.662-1.251-1.48-1.397-1.73-.146-.249-.016-.385.11-.508.113-.111.25-.292.375-.438.125-.146.166-.25.25-.417.083-.166.041-.312-.021-.437-.062-.125-.563-1.357-.772-1.857-.203-.491-.409-.425-.563-.432-.146-.008-.312-.008-.479-.008-.166 0-.437.062-.666.312-.229.25-.874.855-.874 2.083 0 1.229.896 2.417 1.021 2.583.124.167 1.761 2.686 4.267 3.768.596.257 1.062.41 1.425.525.599.191 1.144.163 1.572.099.479-.072 1.481-.605 1.69-1.19.208-.585.208-1.085.146-1.19-.062-.103-.229-.166-.479-.291z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link Cols */}
          {sections.map((section, idx) => (
            <div key={idx} className="col-span-1 md:col-span-2">
              <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-8">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map(l => {
                  let path = '#';
                  if (section.title === 'Help') path = '/';
                  if (section.title === 'Shop') path = '/shop';

                  return (
                    <li key={l}>
                      <Link to={path} className="text-[13px] text-gray-400 font-medium hover:text-white transition-colors">
                        {l}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <p className="text-[11px] text-gray-500 font-medium tracking-wide">
            © {new Date().getFullYear()} Za-pass Inc. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-bold tracking-[0.2em] text-gray-600 uppercase">Pagos</span>
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1.5 border border-white/20 text-gray-400 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 hover:bg-[#1434CB] hover:text-white hover:border-[#1434CB] cursor-default">Visa</div>
              <div className="px-3 py-1.5 border border-white/20 text-gray-400 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 hover:bg-gradient-to-r hover:from-[#EB001B] hover:via-[#FF5F00] hover:to-[#F79E1B] hover:text-white hover:border-l-[#EB001B] hover:border-r-[#F79E1B] hover:border-y-[#FF5F00] cursor-default">Mastercard</div>
              <div className="px-3 py-1.5 border border-white/20 text-gray-400 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 hover:bg-[#009EE3] hover:text-white hover:border-[#009EE3] cursor-default">Mercado Pago</div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
