interface ProductInfoProps {
  brand: string;
  name: string;
  subtitle?: string;
  price: number;
}

export default function ProductInfo({ brand, name, subtitle, price }: ProductInfoProps) {
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price).replace('ARS', '$');

  const installmentPrice = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
  }).format(Math.round(price / 3));

  return (
    <div className="mb-8">
      {/* Badges */}
      <div className="flex gap-2 mb-6">
        <span className="px-3 py-1 bg-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500 rounded-sm">
          PREMIUM REPLICA
        </span>
        <span className="px-3 py-1 bg-green-50 text-[10px] font-bold uppercase tracking-widest text-green-600 rounded-sm">
          IN STOCK
        </span>
      </div>

      <h1 className="font-skylight text-4xl md:text-5xl leading-[1.1] mb-2">
        {name}
      </h1>
      <p className="text-gray-400 text-sm font-medium mb-8">
        {subtitle}
      </p>

      <div className="space-y-1">
        <p className="text-3xl font-black tracking-tight">{formattedPrice}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded">
            💳
          </span>
          <p className="text-gray-600 font-medium">
            3 cuotas sin interés de <span className="font-bold text-black">${installmentPrice}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
