interface ProductInfoProps {
  brand: string;
  name: string;
  subtitle?: string;
  price: number;
  selectedColor?: string;
}

export default function ProductInfo({ brand, name, subtitle, price, selectedColor }: ProductInfoProps) {
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price).replace('ARS', '$');


  return (
    <div className="mb-8">
      {/* Badges */}
      <div className="flex gap-2 mb-6">
        <span className="px-3 py-1 bg-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500 rounded-sm">
          CALIDAD PREMIUM
        </span>
        <span className="px-3 py-1 bg-green-50 text-[10px] font-bold uppercase tracking-widest text-green-600 rounded-sm">
          IN STOCK
        </span>
      </div>

      <h1 className="font-common text-3xl md:text-4xl font-black leading-[1.1] mb-2 uppercase tracking-tight">
        {name} {selectedColor && <span className="opacity-40 ml-2 text-xl italic lowercase">({selectedColor})</span>}
      </h1>
      <p className="text-gray-400 text-sm font-medium mb-8">
        {subtitle}
      </p>

      <div className="space-y-1">
        <p className="text-3xl font-black tracking-tight">{formattedPrice}</p>
      </div>
    </div>
  );
}
