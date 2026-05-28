import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, LogOut, Package, Check, X, Link as LinkIcon, ShoppingBag, LayoutGrid, Calendar, ChevronLeft, ChevronRight, Film, Play, Star, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Product } from '../../data/products'
import {
  getLocalProducts,
  addLocalProduct,
  updateLocalProduct,
  deleteLocalProduct,
  saveProductToSupabase,
  deleteProductFromSupabase,
  uploadProductImage,
  getProducts,
  toAbsoluteUrl,
} from '../../lib/productStore'
import { supabase } from '../../lib/supabase'
import { getVideos, addVideo, updateVideo, deleteVideo, uploadVideoFile, resetVideosToDefault, VideoReel } from '../../lib/videoStore'

// Sincroniza un producto con stock_zapatillas: borra filas viejas y re-inserta
async function syncStockZapatillas(product: Partial<Product>, oldName?: string) {
  const modeloToDelete = oldName ?? product.name
  if (!modeloToDelete) return

  // 1. Eliminar filas existentes del modelo
  await supabase.from('stock_zapatillas').delete().eq('modelo', modeloToDelete)

  if (!product.name || !product.colors?.length || !product.sizes?.length) return

  // 2. Insertar una fila por cada combinación color × talle
  const rows = product.colors.flatMap(color => {
    const colorImg = color.images?.[0] || product.images?.[0] || '';
    const absoluteImg = toAbsoluteUrl(colorImg);

    return product.sizes!
      .filter(s => s.stock)
      .map(s => ({
        modelo: product.name!,
        color: color.name,
        talle: s.size,
        precio: product.price ?? 120000,
        stock: s.quantity ?? 5,
        imagen_url: absoluteImg || null,
      }));
  })

  if (rows.length > 0) {
    await supabase.from('stock_zapatillas').insert(rows)
  }
}

async function removeStockZapatillas(productName: string) {
  await supabase.from('stock_zapatillas').delete().eq('modelo', productName)
}

// Cuenta admin única en Supabase Auth. El email no es secreto; la contraseña sí.
// Creá este usuario en Supabase > Auth > Users.
const ADMIN_EMAIL = 'admin@tuviejasneakers.com'

const BRANDS = ['Adidas', 'Nike', 'Jordan', 'Travis Scott', 'Puma', 'Topper', 'John Foos',
  'Vicus', 'Jaguar', 'Kioshi', 'Vans', 'Converse', 'Fila', 'DC Shoes', 'New Balance',
  'Asics', 'Salomon', 'Olympikus', 'Under Armour', 'Skechers', 'Reebok', 'On']

const COLORS_LIST = [
  { name: 'Negro', hex: '#000000' }, { name: 'Blanco', hex: '#FFFFFF' },
  { name: 'Rojo', hex: '#FF0000' }, { name: 'Azul', hex: '#0000FF' },
  { name: 'Verde', hex: '#008000' }, { name: 'Gris', hex: '#808080' },
  { name: 'Marrón', hex: '#8B4513' }, { name: 'Beige', hex: '#F5F5DC' },
]

const ALL_SIZES = ['38', '39', '40', '41', '42', '43', '44', '45']

function emptyProduct(): Omit<Product, 'id'> {
  return {
    brand: '', name: '', price: 0, subtitle: '', description: '',
    images: [], sizes: [], colors: [], category: '',
  }
}

export interface Reserva {
  id: number;
  reserva_id?: string;
  telefono?: string;
  nombre?: string;
  modelo: string;
  talle: string;
  fecha_entrega?: string;
  hora_entrega?: string;
  punto_encuentro?: string;
  metodo_pago?: string;
  total?: number;
  estado?: string;
  fecha_reserva?: string;
  created_at?: string;
}

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loggingIn, setLoggingIn] = useState(false)
  const [password, setPassword] = useState('')
  // Recuperación de contraseña (flujo email)
  const [recoveryMode, setRecoveryMode] = useState(false)
  const [recoverySending, setRecoverySending] = useState(false)
  const [recoverySent, setRecoverySent] = useState(false)
  const [recoveryError, setRecoveryError] = useState<string | null>(null)
  const [recoveryNewPwd, setRecoveryNewPwd] = useState('')
  const [recoveryConfirmPwd, setRecoveryConfirmPwd] = useState('')
  const [recoveryResetting, setRecoveryResetting] = useState(false)
  // Modal de configuración / cambio de contraseña
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [settingsError, setSettingsError] = useState<string | null>(null)
  const [settingsSuccess, setSettingsSuccess] = useState(false)
  const [changingPwd, setChangingPwd] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>(emptyProduct())
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newColorImageUrls, setNewColorImageUrls] = useState<Record<string, string>>({})
  const [imageMode, setImageMode] = useState<'general' | 'color'>('general')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [stockColors, setStockColors] = useState<string[]>([])
  const customColorInputRef = useRef<HTMLInputElement>(null)
  const pendingCustomHex = useRef<string | null>(null)

  // Estados del Calendario / Solicitudes
  const [activeTab, setActiveTab] = useState<'productos' | 'solicitudes' | 'videos'>('productos')
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [hasLoadedReservas, setHasLoadedReservas] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [loadingReservas, setLoadingReservas] = useState(false)
  const [errorReservas, setErrorReservas] = useState<string | null>(null)

  // Estados de Videos CRUD
  const [videosList, setVideosList] = useState<VideoReel[]>([])
  const [isEditingVideo, setIsEditingVideo] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<Partial<VideoReel>>({
    title: '', url: '', position: 'home', product_link: '', is_active: true
  })

  // Estado para la ventana de confirmación bonita
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: () => void | Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Eliminar',
    cancelLabel: 'Cancelar',
    onConfirm: () => {}
  });

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void | Promise<void>,
    confirmLabel = 'Eliminar',
    cancelLabel = 'Cancelar'
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmLabel,
      cancelLabel,
      onConfirm: async () => {
        await onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  useEffect(() => {
    if (isLoggedIn) {
      getProducts().then(setProducts).catch(() => setProducts(getLocalProducts()))
    }
  }, [isLoggedIn])

  // Bloquear scroll del body y html al abrir algún panel lateral o modal para evitar que Lenis/Scroll afecte el fondo
  useEffect(() => {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    if (isEditing || isEditingVideo || selectedDate || confirmModal.isOpen) {
      htmlEl.style.overflow = 'hidden';
      bodyEl.style.overflow = 'hidden';
    } else {
      htmlEl.style.overflow = '';
      bodyEl.style.overflow = '';
    }
    return () => {
      htmlEl.style.overflow = '';
      bodyEl.style.overflow = '';
    }
  }, [isEditing, isEditingVideo, selectedDate, confirmModal.isOpen])

  // Cargar videos solo al entrar a la tab de videos (videoStore cachea en memoria)
  useEffect(() => {
    if (isLoggedIn && activeTab === 'videos') {
      const fetchVideos = async () => {
        const vList = await getVideos()
        setVideosList(vList)
      }
      fetchVideos()
    }
  }, [isLoggedIn, activeTab])

  const openNewVideo = () => {
    setCurrentVideo({
      title: '', url: '', position: 'home', product_link: '', is_active: true
    })
    setIsEditingVideo(true)
  }

  const openEditVideo = (v: VideoReel) => {
    setCurrentVideo({ ...v })
    setIsEditingVideo(true)
  }

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentVideo.title || !currentVideo.url || !currentVideo.position) return

    if (currentVideo.id) {
      await updateVideo(currentVideo as VideoReel)
    } else {
      await addVideo(currentVideo as Omit<VideoReel, 'id' | 'created_at'>)
    }
    
    const vList = await getVideos()
    setVideosList(vList)
    setIsEditingVideo(false)
  }

  const handleDeleteVideo = async (id: string) => {
    showConfirm(
      '¿Eliminar Video Reel?',
      '¿Estás seguro de que deseas eliminar este video? Esta acción no se puede deshacer y el video dejará de mostrarse en la web.',
      async () => {
        await deleteVideo(id)
        const vList = await getVideos()
        setVideosList(vList)
      }
    )
  }

  const toggleVideoActive = async (v: VideoReel) => {
    const updated = { ...v, is_active: !v.is_active }
    await updateVideo(updated)
    const vList = await getVideos()
    setVideosList(vList)
  }

  // Cargar reservas
  useEffect(() => {
    if (isLoggedIn && activeTab === 'solicitudes' && !hasLoadedReservas) {
      const fetchReservas = async () => {
        setLoadingReservas(true)
        setErrorReservas(null)
        const { data, error } = await supabase.from('reservas_zapatillas').select('*').order('fecha_reserva', { ascending: false })
        if (error) {
          console.error("Error al cargar reservas:", error)
          setErrorReservas(error.message)
        }
        if (data) {
          setReservas(data as Reserva[])
          setHasLoadedReservas(true)
        }
        setLoadingReservas(false)
      }
      fetchReservas()
    }
  }, [isLoggedIn, activeTab, hasLoadedReservas])

  // Memoized product lookup function/map to replace linear searches on render
  const productLookup = useMemo(() => {
    const cache: Record<string, { id: number | null; image: string | null }> = {}
    return {
      get: (modelo: string) => {
        if (!modelo) return { id: null, image: null }
        const lowerModelo = modelo.toLowerCase()
        if (cache[lowerModelo]) return cache[lowerModelo]

        const prod = products.find(p => {
          const lowerName = p.name.toLowerCase()
          return lowerModelo.includes(lowerName) || lowerName.includes(lowerModelo)
        })

        const res = {
          id: prod?.id || null,
          image: prod?.images?.[0] || null
        }
        cache[lowerModelo] = res
        return res
      }
    }
  }, [products])

  const getProductImage = (modelo: string) => {
    return productLookup.get(modelo).image
  }

  const getProductId = (modelo: string) => {
    return productLookup.get(modelo).id
  }

  // Lógica del Calendario
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const emptyDays = Array(firstDay).fill(null)
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const isSameDay = (date1: string | Date, date2: Date) => {
    if (typeof date1 === 'string') {
      const datePart = date1.split('T')[0]
      const [year, month, day] = datePart.split('-').map(Number)
      return year === date2.getFullYear() &&
             month === date2.getMonth() + 1 &&
             day === date2.getDate()
    } else {
      return date1.getDate() === date2.getDate() &&
             date1.getMonth() === date2.getMonth() &&
             date1.getFullYear() === date2.getFullYear()
    }
  }

  // Pre-calculate/group reservations for the current month/year to run in O(R) instead of O(31 * R)
  const reservationsByDay = useMemo(() => {
    const map: Record<number, Reserva[]> = {}
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() // 0-indexed

    reservas.forEach(r => {
      const targetDate = r.fecha_entrega || r.fecha_reserva || r.created_at
      if (!targetDate) return
      
      let year: number, month: number, day: number
      if (typeof targetDate === 'string') {
        const datePart = targetDate.split('T')[0]
        const parts = datePart.split('-').map(Number)
        if (parts.length === 3) {
          [year, month, day] = parts
        } else {
          return
        }
      } else {
        const dObj = new Date(targetDate)
        year = dObj.getFullYear()
        month = dObj.getMonth() + 1
        day = dObj.getDate()
      }

      if (year === currentYear && month === currentMonth + 1) {
        if (!map[day]) map[day] = []
        map[day].push(r)
      }
    })
    return map
  }, [reservas, currentDate])

  const getReservasForDate = (date: Date) => {
    const day = date.getDate()
    if (date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
      return reservationsByDay[day] || []
    }
    return reservas.filter(r => {
      const targetDate = r.fecha_entrega || r.fecha_reserva || r.created_at
      if (!targetDate) return false
      return isSameDay(targetDate, date)
    })
  }

  const getReservasForDay = (day: number) => {
    return reservationsByDay[day] || []
  }

  // Detectar sesión activa al montar y suscribirse a cambios de auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session)
      // Cuando el usuario llega desde el link del email de recuperación,
      // Supabase dispara este evento — entramos en modo "setear nueva contraseña".
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const handleSendRecovery = async () => {
    setRecoveryError(null)
    setRecoverySending(true)
    const { error } = await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL, {
      redirectTo: `${window.location.origin}/admin`,
    })
    setRecoverySending(false)
    if (error) {
      setRecoveryError('No se pudo enviar el email: ' + error.message)
    } else {
      setRecoverySent(true)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setRecoveryError(null)

    if (recoveryNewPwd.length < 8) {
      setRecoveryError('La nueva contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (recoveryNewPwd !== recoveryConfirmPwd) {
      setRecoveryError('Las contraseñas no coinciden.')
      return
    }

    setRecoveryResetting(true)
    const { error } = await supabase.auth.updateUser({ password: recoveryNewPwd })
    setRecoveryResetting(false)
    if (error) {
      setRecoveryError('No se pudo actualizar: ' + error.message)
      return
    }
    setRecoveryMode(false)
    setRecoveryNewPwd('')
    setRecoveryConfirmPwd('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoggingIn(true)
    setLoginError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    })
    setLoggingIn(false)
    if (error) {
      setLoginError('Contraseña incorrecta')
    } else {
      setPassword('')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSettingsError(null)
    setSettingsSuccess(false)

    if (newPwd.length < 8) {
      setSettingsError('La nueva contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (newPwd !== confirmPwd) {
      setSettingsError('Las contraseñas nuevas no coinciden.')
      return
    }

    setChangingPwd(true)

    // 1) Verificar contraseña actual reintentando sign-in con la sesión existente
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: currentPwd,
    })
    if (verifyError) {
      setSettingsError('La contraseña actual es incorrecta.')
      setChangingPwd(false)
      return
    }

    // 2) Actualizar contraseña
    const { error: updateError } = await supabase.auth.updateUser({ password: newPwd })
    setChangingPwd(false)
    if (updateError) {
      setSettingsError('No se pudo cambiar la contraseña: ' + updateError.message)
      return
    }

    setSettingsSuccess(true)
    setCurrentPwd('')
    setNewPwd('')
    setConfirmPwd('')
  }

  const openNew = () => {
    setCurrentProduct(emptyProduct())
    setNewImageUrl('')
    setNewColorImageUrls({})
    setImageMode('general')
    setStockColors([])
    setIsEditing(true)
  }

  const openEdit = (p: Product) => {
    setCurrentProduct({ ...p })
    setNewImageUrl('')
    setNewColorImageUrls({})
    setImageMode(p.colors?.some(c => c.images?.length > 0) ? 'color' : 'general')
    setStockColors([])
    fetchStockColors(p.name)
    setIsEditing(true)
  }

  const handleDelete = async (id: number) => {
    const product = products.find(p => p.id === id)
    const productName = product ? `${product.brand} ${product.name}` : 'este producto'
    showConfirm(
      '¿Eliminar Producto?',
      `¿Estás seguro de que deseas eliminar "${productName}"? Esta acción borrará el calzado y su stock de forma permanente.`,
      async () => {
        deleteLocalProduct(id)
        setProducts(getLocalProducts())
        if (product) await removeStockZapatillas(product.name)
        await deleteProductFromSupabase(id)
      }
    )
  }

  const toggleFeatured = async (product: Product) => {
    const updated = { ...product, is_featured: !product.is_featured }
    updateLocalProduct(updated)
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))
    await saveProductToSupabase(updated)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((currentProduct.images?.length ?? 0) === 0) {
      alert('Agregá al menos una imagen (URL).')
      return
    }
    // Guardar el nombre original antes de editar (por si cambió)
    const originalName = currentProduct.id
      ? products.find(p => p.id === currentProduct.id)?.name
      : undefined

    // Limpiar DataURLs del array de imágenes — reemplazar con URLs reales de los colores
    const colorHttpImages = (currentProduct.colors || [])
      .flatMap(c => (c.images || []).filter(img => img.startsWith('http')))
    const cleanImages = [
      ...(currentProduct.images || []).filter(img => img.startsWith('http')),
      ...colorHttpImages,
    ].filter((v, i, arr) => arr.indexOf(v) === i)
    const productToSave = {
      ...currentProduct,
      images: cleanImages.length > 0 ? cleanImages : (currentProduct.images || []),
    }

    let savedProduct: Product
    if (productToSave.id) {
      updateLocalProduct(productToSave as Product)
      savedProduct = productToSave as Product
    } else {
      savedProduct = addLocalProduct(productToSave as Omit<Product, 'id'>)
    }
    setProducts(getLocalProducts())
    setIsEditing(false)

    await saveProductToSupabase(savedProduct)
    await syncStockZapatillas(productToSave, originalName)
    getProducts().then(setProducts).catch(() => {})
  }

  const addImageUrl = () => {
    const url = newImageUrl.trim()
    if (!url) return
    setCurrentProduct(prev => ({ ...prev, images: [...(prev.images || []), url] }))
    setNewImageUrl('')
  }

  const removeImage = (idx: number) => {
    setCurrentProduct(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== idx),
    }))
  }

  const addColorImageUrl = (colorName: string) => {
    const url = (newColorImageUrls[colorName] || '').trim()
    if (!url) return
    setCurrentProduct(prev => ({
      ...prev,
      colors: (prev.colors || []).map(c => 
        c.name === colorName ? { ...c, images: [...(c.images || []), url] } : c
      ),
      images: prev.images?.includes(url) ? prev.images : [...(prev.images || []), url]
    }))
    setNewColorImageUrls(prev => ({ ...prev, [colorName]: '' }))
  }

  const handleColorFileChange = async (colorName: string, file: File) => {
    setUploadingImage(true)
    const url = await uploadProductImage(file)
    setCurrentProduct(prev => ({
      ...prev,
      colors: (prev.colors || []).map(c =>
        c.name === colorName ? { ...c, images: [...(c.images || []), url] } : c
      ),
      images: prev.images?.includes(url) ? prev.images : [...(prev.images || []), url]
    }))
    setUploadingImage(false)
  }

  const removeColorImage = (colorName: string, idx: number) => {
    setCurrentProduct(prev => ({
      ...prev,
      colors: (prev.colors || []).map(c => 
        c.name === colorName ? { ...c, images: (c.images || []).filter((_, i) => i !== idx) } : c
      )
    }))
  }

  const toggleSize = (size: string) => {
    const sizes = currentProduct.sizes || []
    const has = sizes.some(s => s.size === size)
    setCurrentProduct(prev => ({
      ...prev,
      sizes: has ? sizes.filter(s => s.size !== size) : [...sizes, { size, stock: true, quantity: 5 }],
    }))
  }

  const handleQuantityChange = (size: string, qty: number) => {
    setCurrentProduct(prev => ({
      ...prev,
      sizes: (prev.sizes || []).map(s => s.size === size ? { ...s, quantity: qty } : s)
    }))
  }

  const toggleColor = (colorName: string, hex: string) => {
    const colors = currentProduct.colors || []
    const has = colors.some(c => c.hex === hex)
    setCurrentProduct(prev => ({
      ...prev,
      colors: has ? colors.filter(c => c.hex !== hex) : [...colors, { name: colorName, hex, images: [] }],
    }))
  }

  const updateColorName = (hex: string, newName: string) => {
    setCurrentProduct(prev => ({
      ...prev,
      colors: (prev.colors || []).map(c => c.hex === hex ? { ...c, name: newName } : c)
    }))
  }

  const fetchStockColors = async (modeloName: string) => {
    if (!modeloName) { setStockColors([]); return }
    try {
      const { data } = await supabase
        .from('stock_zapatillas')
        .select('color')
        .eq('modelo', modeloName)
      if (data) {
        setStockColors([...new Set(data.map((r: any) => r.color as string))])
      }
    } catch (_) {}
  }

  // ─── RECOVERY SCREEN (setear nueva contraseña tras link de email) ─
  if (recoveryMode) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md w-full bg-white p-10 rounded-sm shadow-xl border border-black/5">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center">
              <Settings size={32} />
            </div>
          </div>
          <h2 className="font-skylight text-4xl text-center mb-4">Nueva contraseña</h2>
          <p className="text-center text-gray-500 text-[11px] uppercase tracking-widest mb-8">Recuperación de acceso</p>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">Nueva contraseña</label>
              <input
                type="password"
                autoComplete="new-password"
                value={recoveryNewPwd}
                onChange={e => { setRecoveryNewPwd(e.target.value); setRecoveryError(null) }}
                disabled={recoveryResetting}
                className="w-full bg-gray-50 h-12 px-4 text-[13px] font-medium rounded-sm border border-gray-200 focus:border-black focus:outline-none disabled:opacity-60"
              />
              <p className="mt-1.5 text-[11px] text-gray-400">Mínimo 8 caracteres.</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">Confirmar</label>
              <input
                type="password"
                autoComplete="new-password"
                value={recoveryConfirmPwd}
                onChange={e => { setRecoveryConfirmPwd(e.target.value); setRecoveryError(null) }}
                disabled={recoveryResetting}
                className="w-full bg-gray-50 h-12 px-4 text-[13px] font-medium rounded-sm border border-gray-200 focus:border-black focus:outline-none disabled:opacity-60"
              />
            </div>
            {recoveryError && (
              <p className="text-[12px] font-semibold text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-sm">{recoveryError}</p>
            )}
            <button
              type="submit"
              disabled={recoveryResetting || !recoveryNewPwd || !recoveryConfirmPwd}
              className="w-full bg-black text-white h-14 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {recoveryResetting ? 'Guardando...' : 'Establecer contraseña'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ─── LOGIN SCREEN ────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md w-full bg-white p-10 rounded-sm shadow-xl border border-black/5">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center">
              <Package size={32} />
            </div>
          </div>
          <h2 className="font-skylight text-4xl text-center mb-4">Panel de Control</h2>
          <p className="text-center text-gray-500 text-[11px] uppercase tracking-widest mb-8">Acceso Restringido</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                placeholder="Contraseña"
                autoComplete="current-password"
                value={password}
                onChange={e => { setPassword(e.target.value); setLoginError(null) }}
                disabled={loggingIn}
                className={`w-full bg-gray-50 h-14 px-6 text-[13px] font-medium tracking-wide focus:outline-none transition-colors rounded-sm border disabled:opacity-60 ${
                  loginError
                    ? 'border-red-500 bg-red-50 focus:border-red-500'
                    : 'border-gray-200 focus:border-black'
                }`}
              />
              {loginError && (
                <p className="mt-2 text-[12px] font-semibold text-red-500">{loginError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loggingIn || !password}
              className="w-full bg-black text-white h-14 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loggingIn ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          {/* Recuperar contraseña */}
          <div className="mt-6 text-center">
            {recoverySent ? (
              <p className="text-[12px] text-green-700 bg-green-50 border border-green-100 px-3 py-2 rounded-sm">
                Te enviamos un email de recuperación. Revisá la casilla.
              </p>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSendRecovery}
                  disabled={recoverySending}
                  className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 hover:text-black transition-colors disabled:opacity-50"
                >
                  {recoverySending ? 'Enviando...' : '¿Olvidaste tu contraseña?'}
                </button>
                {recoveryError && (
                  <p className="mt-2 text-[11px] text-red-500">{recoveryError}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ─── DASHBOARD ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Header */}
      <header className="bg-white border-b border-black/5 py-6 px-6 lg:px-12 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full md:w-auto gap-8">
            <h1 className="font-skylight text-2xl text-black">Admin <span className="text-gray-400">/</span> Tuviejasneakers</h1>
            
            <div className="flex items-center bg-gray-100 p-1 rounded-sm">
              <button 
                onClick={() => setActiveTab('productos')} 
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-sm flex items-center gap-2 ${activeTab === 'productos' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-black'}`}
              >
                <LayoutGrid size={14}/> Productos
              </button>
              <button 
                onClick={() => setActiveTab('solicitudes')} 
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-sm flex items-center gap-2 ${activeTab === 'solicitudes' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-black'}`}
              >
                <Calendar size={14}/> Solicitudes
              </button>
              <button 
                onClick={() => setActiveTab('videos')} 
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-sm flex items-center gap-2 ${activeTab === 'videos' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-black'}`}
              >
                <Film size={14}/> Videos
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
            <Link to="/shop" className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all hidden sm:flex">
              <ShoppingBag size={18} /> Ver Tienda
            </Link>
            {activeTab === 'productos' && (
              <>
                <button
                  onClick={() => getProducts().then(setProducts).catch(() => {})}
                  className="px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 border border-gray-200 hover:border-black transition-colors rounded-sm text-gray-500 hover:text-black"
                  title="Actualizar catálogo desde Supabase"
                >
                  Actualizar
                </button>
                <button
                  onClick={openNew}
                  className="bg-black text-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-gray-800 transition-colors rounded-sm shadow-lg shadow-black/5"
                >
                  <Plus size={16} /> Nuevo
                </button>
              </>
            )}
            {activeTab === 'solicitudes' && (
              <button
                onClick={() => setHasLoadedReservas(false)}
                className="px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 border border-gray-200 hover:border-black transition-colors rounded-sm text-gray-500 hover:text-black"
                title="Actualizar solicitudes desde Supabase"
              >
                Actualizar
              </button>
            )}
            {activeTab === 'videos' && (
              <button
                onClick={openNewVideo}
                className="bg-black text-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-gray-800 transition-colors rounded-sm shadow-lg shadow-black/5"
              >
                <Plus size={16} /> Nuevo Video
              </button>
            )}
            <button
              onClick={() => {
                setSettingsOpen(true)
                setSettingsError(null)
                setSettingsSuccess(false)
                setCurrentPwd('')
                setNewPwd('')
                setConfirmPwd('')
              }}
              className="p-3 text-gray-400 hover:text-black transition-colors"
              title="Configuración"
            >
              <Settings size={20} />
            </button>
            <button onClick={handleLogout} className="p-3 text-gray-400 hover:text-red-500 transition-colors" title="Cerrar Sesión">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        {activeTab === 'productos' && (
          products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Package size={48} className="text-gray-200 mb-4" />
            <p className="text-gray-400 text-sm font-medium">No hay productos aún.</p>
            <button onClick={openNew} className="mt-4 text-[11px] font-bold uppercase tracking-widest underline underline-offset-4 hover:opacity-60 transition-opacity">
              Agregar el primero
            </button>
          </div>
        ) : (
          <div className="bg-white border border-black/5 rounded-sm overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Producto</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Categoría</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Precio</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Novedades</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                          {p.images?.[0]
                            ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={16} /></div>
                          }
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-black uppercase leading-tight">{p.name}</p>
                          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-bold uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full text-gray-500">{p.category}</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[14px] font-black text-black">${p.price.toLocaleString('es-AR')}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button
                        onClick={() => toggleFeatured(p)}
                        className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors ${p.is_featured ? 'bg-black text-white' : 'text-gray-300 hover:text-black hover:bg-gray-100'}`}
                        title={p.is_featured ? 'Quitar de Novedades' : 'Mostrar en Novedades'}
                      >
                        <Star size={18} fill={p.is_featured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Editar">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )
        )}

        {activeTab === 'solicitudes' && (
          <div className="bg-white border border-black/5 rounded-sm overflow-hidden shadow-sm p-8">
            {errorReservas && (
              <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-sm text-[12px] text-red-600 font-medium">
                Error al conectar con Supabase: {errorReservas}
              </div>
            )}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-2 border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors"><ChevronLeft size={20}/></button>
                <button onClick={nextMonth} className="p-2 border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors"><ChevronRight size={20}/></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-sm overflow-hidden">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                <div key={day} className="bg-gray-50 py-3 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  {day}
                </div>
              ))}
              
              {emptyDays.map((_, i) => (
                <div key={`empty-${i}`} className="bg-white min-h-[120px]" />
              ))}
              
              {daysArray.map(day => {
                const dayReservas = getReservasForDay(day)
                const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                const isToday = isSameDay(dateObj, new Date())
                const isSelected = selectedDate && isSameDay(dateObj, selectedDate)

                return (
                  <div 
                    key={day} 
                    onClick={() => setSelectedDate(dateObj)}
                    className={`bg-white min-h-[120px] p-2 border-t border-transparent hover:border-black/10 transition-colors cursor-pointer relative group ${isSelected ? 'ring-2 ring-black ring-inset z-10' : ''}`}
                  >
                    <span className={`text-[12px] font-bold w-8 h-8 flex items-center justify-center rounded-full ${isToday ? 'bg-black text-white' : 'text-gray-500 group-hover:text-black'}`}>
                      {day}
                    </span>
                    
                    <div className="mt-2 flex flex-wrap gap-1 justify-center sm:justify-start">
                      {dayReservas.slice(0, 5).map((r, i) => {
                        const imgUrl = getProductImage(r.modelo);
                        return (
                          <div key={i} className="relative w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center shadow-sm overflow-hidden" title={`${r.modelo} - ${r.talle}`}>
                            {imgUrl ? (
                              <img src={imgUrl} alt={r.modelo} className="w-full h-full object-cover" />
                            ) : (
                              <ShoppingBag size={12} className="text-gray-400" />
                            )}
                            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${r.estado === 'confirmado' ? 'bg-green-500' : r.estado === 'cancelado' ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                          </div>
                        )
                      })}
                      {dayReservas.length > 5 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500 shadow-sm border border-gray-200">
                          +{dayReservas.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="space-y-6">
            {/* Panel de Mantenimiento de Velocidad / Reels */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-black/5 p-6 rounded-sm shadow-sm">
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-black mb-1">Mantenimiento de Reels & Videos</h2>
                <p className="text-[10px] text-gray-400 font-medium max-w-2xl leading-relaxed uppercase">
                  Si subiste un video muy pesado por error que ralentiza la carga o si querés volver al estado inicial con videos ultra-rápidos en la nube Google Storage CDN, podés restablecerlos de forma instantánea.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  showConfirm(
                    '¿Restablecer Videos?',
                    '¿Estás seguro de que deseas restablecer TODOS los videos a los predeterminados de fábrica? Esto eliminará tus videos actuales y cargará los videos ultra-rápidos de Google CDN para máxima velocidad de la web.',
                    async () => {
                      try {
                        const reseted = await resetVideosToDefault();
                        setVideosList(reseted);
                        alert('¡Videos restablecidos con éxito! La velocidad de carga de la web ahora es óptima.');
                      } catch (err: any) {
                        alert('Error al restablecer videos: ' + (err.message || err));
                      }
                    },
                    'Restablecer'
                  );
                }}
                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-5 py-3 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                Restablecer Predeterminados
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videosList.map(v => (
                <div key={v.id} className="bg-white border border-black/5 rounded-sm overflow-hidden shadow-sm p-5 flex flex-col gap-4 relative group">
                  {/* Visual Video Thumbnail */}
                  <div className="aspect-[9/16] w-full bg-black rounded-sm overflow-hidden relative border border-gray-100 shadow-inner group-hover:shadow-md transition-shadow">
                    <video 
                      src={v.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      loop
                      preload="none"
                      onMouseEnter={e => e.currentTarget.play().catch(() => {})}
                      onMouseLeave={e => e.currentTarget.pause()}
                    />
                    <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                    
                    {/* Tag de Posición */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white border border-white/10 font-bold text-[8px] uppercase tracking-[0.25em] px-2 py-0.5 rounded-sm">
                      {v.position === 'home' ? 'Inicio' : 'Tienda'}
                    </div>

                    {/* Icono de Reproducción en hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                        <Play size={16} fill="currentColor" className="ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Detalles */}
                  <div className="flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <h3 className="text-[13px] font-bold text-black uppercase tracking-wide leading-tight line-clamp-1">{v.title}</h3>
                      <p className="text-[10px] text-gray-400 font-medium truncate mt-1">URL: {v.url}</p>
                      
                      {v.product_link && (
                        <div className="mt-2 flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2 py-1 rounded-sm text-[10px] font-bold text-gray-500 uppercase tracking-widest w-fit">
                          <ShoppingBag size={10} />
                          Prod ID: {v.product_link}
                        </div>
                      )}
                    </div>

                    {/* Estado + Acciones */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-1">
                      {/* Switch de Activo */}
                      <button 
                        type="button"
                        onClick={() => toggleVideoActive(v)}
                        className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          v.is_active 
                            ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                            : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                        }`}
                      >
                        {v.is_active ? 'Activo' : 'Pausado'}
                      </button>

                      {/* Acciones CRUD */}
                      <div className="flex items-center gap-1">
                        <button 
                          type="button"
                          onClick={() => openEditVideo(v)} 
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Editar Video"
                        >
                          <Pencil size={15} />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteVideo(v.id)} 
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Eliminar Video"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Tarjeta para Agregar nuevo */}
              <div 
                onClick={openNewVideo}
                className="border-2 border-dashed border-gray-200 hover:border-black/35 rounded-sm p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[300px] hover:bg-gray-50/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-full border border-gray-200 bg-white text-gray-400 flex items-center justify-center mb-4 group-hover:border-black group-hover:text-black transition-all">
                  <Plus size={20} />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-black transition-colors">Añadir Reel</p>
                <p className="text-[9px] text-gray-400 mt-1 max-w-[160px] leading-relaxed">Mostrá tus zapatillas en acción en formato vertical 9:16.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit / Create Slide-over */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex justify-start">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              className="w-full max-w-xl bg-white h-screen relative z-10 shadow-2xl flex flex-col p-8 overflow-y-auto"
              data-lenis-prevent
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black uppercase tracking-tighter">
                  {currentProduct.id ? 'Editar Producto' : 'Cargar Nuevo'}
                </h2>
                <button onClick={() => setIsEditing(false)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                {/* Marca + Modelo */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Marca</label>
                    <select
                      required
                      value={currentProduct.brand}
                      onChange={e => setCurrentProduct({ ...currentProduct, brand: e.target.value, category: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 h-14 px-5 text-[13px] font-bold focus:outline-none focus:border-black appearance-none transition-colors rounded-sm"
                    >
                      <option value="">Seleccionar</option>
                      {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Modelo</label>
                    <input
                      type="text" required
                      value={currentProduct.name}
                      onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                      onBlur={e => fetchStockColors(e.target.value.trim())}
                      className="w-full bg-gray-50 border border-gray-200 h-14 px-5 text-[13px] font-bold focus:outline-none focus:border-black transition-colors rounded-sm"
                      placeholder="Ej: Air Max 90"
                    />
                  </div>
                </div>

                {/* Precio */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Precio ($ARS)</label>
                  <input
                    type="text" required
                    value={currentProduct.price ? currentProduct.price.toLocaleString('es-AR') : ''}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '')
                      setCurrentProduct({ ...currentProduct, price: val === '' ? 0 : parseInt(val, 10) })
                    }}
                    className="w-full bg-gray-50 border border-gray-200 h-14 px-5 text-[13px] font-bold focus:outline-none focus:border-black transition-colors rounded-sm"
                    placeholder="150.000"
                  />
                </div>

                {/* Talles */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Talles y Stock</label>
                  <div className="grid grid-cols-4 gap-3">
                    {ALL_SIZES.map(size => {
                      const sizeObj = currentProduct.sizes?.find(s => s.size === size)
                      const selected = !!sizeObj
                      return (
                        <div key={size} className={`flex flex-col border rounded-sm transition-all ${selected ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                          <button
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`h-10 text-[12px] font-bold transition-all ${selected ? 'bg-black text-white' : 'bg-transparent text-gray-400 hover:text-black'}`}
                          >
                            Talle {size}
                          </button>
                          {selected && (
                            <div className="p-2 flex flex-col gap-1">
                              <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Cantidad</span>
                              <input 
                                type="number"
                                min="0"
                                value={sizeObj.quantity ?? 5}
                                onChange={(e) => handleQuantityChange(size, parseInt(e.target.value) || 0)}
                                className="w-full bg-white border border-gray-200 h-8 px-2 text-[12px] font-bold focus:outline-none focus:border-black rounded-sm"
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Colores */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Colores</label>
                  <div className="flex flex-wrap gap-3">
                    {COLORS_LIST.map(c => {
                      const selected = currentProduct.colors?.some(col => col.hex === c.hex)
                      return (
                        <button
                          key={c.name} type="button"
                          onClick={() => toggleColor(c.name, c.hex)}
                          className={`relative flex flex-col items-center gap-1 p-2 rounded-sm border transition-all ${selected ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-black'}`}
                        >
                          <div className="w-6 h-6 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: c.hex }} />
                          <span className={`text-[9px] font-bold uppercase ${selected ? 'text-black' : 'text-gray-400'}`}>{c.name}</span>
                          {selected && (
                            <div className="absolute -top-1 -right-1 bg-black text-white rounded-full p-0.5">
                              <Check size={8} />
                            </div>
                          )}
                        </button>
                      )
                    })}

                    {/* Picker de color personalizado */}
                    <div className="relative flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => customColorInputRef.current?.click()}
                        className="relative flex flex-col items-center gap-1 p-2 rounded-sm border border-dashed border-gray-300 hover:border-black transition-all"
                        title="Elegir color personalizado"
                      >
                        <div
                          className="w-6 h-6 rounded-full border border-black/10 shadow-sm flex items-center justify-center text-gray-400 hover:text-black"
                          style={{ background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' }}
                        />
                        <span className="text-[9px] font-bold uppercase text-gray-400">+Color</span>
                      </button>
                      <input
                        ref={customColorInputRef}
                        type="color"
                        className="absolute opacity-0 w-0 h-0 pointer-events-none"
                        onChange={e => {
                          const hex = e.target.value
                          setCurrentProduct(prev => {
                            let colors = prev.colors || []
                            if (pendingCustomHex.current) {
                              colors = colors.filter(c => c.hex !== pendingCustomHex.current)
                            }
                            pendingCustomHex.current = hex
                            return { ...prev, colors: [...colors, { name: 'Personalizado', hex, images: [] }] }
                          })
                        }}
                      />
                    </div>
                  </div>

                  {/* Nombres descriptivos para colores seleccionados */}
                  {(currentProduct.colors?.length ?? 0) > 0 && (
                    <div className="mt-4 space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Nombre descriptivo (opcional)</span>
                      {currentProduct.colors!.map(c => (
                        <div key={c.hex} className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: c.hex }} />
                            <input
                              type="text"
                              value={c.name}
                              onChange={e => updateColorName(c.hex, e.target.value)}
                              className="flex-1 bg-gray-50 border border-gray-200 h-9 px-3 text-[12px] font-medium focus:outline-none focus:border-black transition-colors rounded-sm"
                              placeholder="Ej: Blanco Azul, Negro Total..."
                            />
                          </div>
                          {stockColors.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pl-6">
                              {stockColors.map(sc => (
                                <button
                                  key={sc}
                                  type="button"
                                  onClick={() => updateColorName(c.hex, sc)}
                                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 border border-gray-200 rounded-sm hover:border-black hover:bg-black hover:text-white transition-all text-gray-500"
                                >
                                  {sc}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Descripción */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Descripción</label>
                  <textarea
                    value={currentProduct.description}
                    onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 p-5 text-[13px] font-medium focus:outline-none focus:border-black transition-colors rounded-sm resize-none"
                    placeholder="Detalles del producto..."
                  />
                </div>

                {/* Modalidad de Imágenes */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block border-t border-gray-100 pt-6">Modalidad de Imágenes</label>
                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setImageMode('general')}
                      className={`flex-1 py-3 border text-[11px] font-bold uppercase tracking-widest rounded-sm transition-colors ${imageMode === 'general' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}
                    >
                      Generales
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setImageMode('color')}
                      className={`flex-1 py-3 border text-[11px] font-bold uppercase tracking-widest rounded-sm transition-colors ${imageMode === 'color' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}
                    >
                      Por Color
                    </button>
                  </div>
                </div>

                {/* Imágenes Generales */}
                {imageMode === 'general' && (
                  <div className="mt-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Imágenes Generales</label>

                    {/* Previews */}
                    {(currentProduct.images?.length ?? 0) > 0 && (
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        {currentProduct.images!.map((url, i) => (
                          <div key={i} className="aspect-square bg-gray-100 rounded-sm overflow-hidden relative group">
                            <img src={url} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.src = '')} />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inputs para imagen */}
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={newImageUrl}
                          onChange={e => setNewImageUrl(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImageUrl() } }}
                          className="w-full bg-gray-50 border border-gray-200 h-12 pl-10 pr-4 text-[13px] focus:outline-none focus:border-black transition-colors rounded-sm"
                          placeholder="https://..."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); addImageUrl(); }}
                        className="bg-black text-white px-4 h-12 text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-1 shrink-0"
                      >
                        <Plus size={14} /> URL
                      </button>
                      
                      <label className="bg-black text-white px-4 h-12 text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0">
                        <Plus size={14} /> ARCHIVO
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            e.target.value = '';
                            setUploadingImage(true);
                            const url = await uploadProductImage(file);
                            setCurrentProduct(prev => ({ ...prev, images: [...(prev.images || []), url] }));
                            setUploadingImage(false);
                          }} 
                        />
                      </label>
                    </div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-2">Pegá una URL o seleccioná un archivo desde tu computadora</p>
                  </div>
                )}

                {/* Imágenes por Color */}
                {imageMode === 'color' && (currentProduct.colors?.length ?? 0) === 0 && (
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-6 border border-dashed border-gray-200 p-4 text-center rounded-sm">
                    Seleccioná al menos un color arriba para poder asignarle imágenes específicas.
                  </p>
                )}
                {imageMode === 'color' && (currentProduct.colors?.length ?? 0) > 0 && (
                  <div className="mt-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 block">Imágenes por Color</label>
                    <div className="space-y-6">
                      {currentProduct.colors!.map(color => (
                        <div key={color.name} className="bg-gray-50 p-4 border border-gray-200 rounded-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                            <span className="text-[11px] font-bold uppercase text-black">{color.name}</span>
                          </div>
                          
                          {/* Previews del color */}
                          {(color.images?.length ?? 0) > 0 && (
                            <div className="grid grid-cols-4 gap-2 mb-3">
                              {color.images!.map((url, i) => (
                                <div key={i} className="aspect-square bg-white border border-gray-200 rounded-sm overflow-hidden relative group">
                                  <img src={url} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.src = '')} />
                                  <button
                                    type="button"
                                    onClick={() => removeColorImage(color.name, i)}
                                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Inputs del color */}
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                value={newColorImageUrls[color.name] || ''}
                                onChange={e => setNewColorImageUrls(prev => ({ ...prev, [color.name]: e.target.value }))}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addColorImageUrl(color.name) } }}
                                className="w-full bg-white border border-gray-200 h-10 pl-8 pr-3 text-[12px] focus:outline-none focus:border-black transition-colors rounded-sm"
                                placeholder="https://..."
                              />
                            </div>
                            <button
                              type="button"
                              onClick={(e) => { e.preventDefault(); addColorImageUrl(color.name); }}
                              className="bg-black text-white px-3 h-10 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-colors shrink-0"
                            >
                              URL
                            </button>
                            <label className="bg-black text-white px-3 h-10 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-colors flex items-center justify-center cursor-pointer shrink-0">
                              PC
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleColorFileChange(color.name, file);
                                  e.target.value = '';
                                }} 
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit */}
                <div className="pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={uploadingImage}
                    className="w-full bg-black text-white h-16 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-3 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check size={18} />
                    {uploadingImage ? 'Subiendo imagen...' : currentProduct.id ? 'Guardar Cambios' : 'Publicar Producto'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Selected Date Slide-over */}
      <AnimatePresence>
        {selectedDate && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedDate(null)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="w-full max-w-md bg-white h-screen relative z-10 shadow-2xl flex flex-col p-8 overflow-y-auto"
              data-lenis-prevent
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Solicitudes</h2>
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-1">
                    {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                  </p>
                </div>
                <button onClick={() => setSelectedDate(null)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {getReservasForDate(selectedDate).length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-[11px] font-bold uppercase tracking-widest border border-dashed border-gray-200 rounded-sm">
                    No hay solicitudes este día
                  </div>
                ) : (
                  getReservasForDate(selectedDate).map(r => {
                    const prodId = getProductId(r.modelo);
                    const CardContent = (
                      <div className={`border border-gray-100 p-5 rounded-sm transition-all shadow-sm bg-white ${prodId ? 'hover:border-black/30 hover:shadow-md cursor-pointer' : 'hover:border-black/20'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm ${r.estado === 'confirmado' ? 'bg-green-100 text-green-700' : r.estado === 'cancelado' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                            {r.estado || 'pendiente'}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded-sm">
                            {r.hora_entrega || (r.fecha_reserva ? new Date(r.fecha_reserva).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--')}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3 relative">
                          <div className="w-12 h-12 rounded-sm bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {getProductImage(r.modelo) ? (
                              <img src={getProductImage(r.modelo)!} alt={r.modelo} className="w-full h-full object-cover" />
                            ) : (
                              <ShoppingBag size={16} className="text-gray-300" />
                            )}
                          </div>
                          <p className={`font-bold text-[13px] leading-tight text-black uppercase ${prodId ? 'group-hover:underline decoration-2 underline-offset-2' : ''}`}>{r.modelo}</p>
                        </div>
                        
                        <div className="flex flex-col gap-1 pt-2 border-t border-gray-50">
                          {r.nombre && (
                            <p className="text-[11px] text-gray-500 font-medium tracking-wide">
                              <span className="font-bold text-gray-800">Nombre:</span> {r.nombre}
                            </p>
                          )}
                          <p className="text-[11px] text-gray-500 font-medium tracking-wide">
                            <span className="font-bold text-gray-800">Talle:</span> {r.talle}
                          </p>
                          {r.punto_encuentro && (
                            <p className="text-[11px] text-gray-500 font-medium tracking-wide">
                              <span className="font-bold text-gray-800">Entrega:</span> {r.punto_encuentro}
                            </p>
                          )}
                          {r.telefono && (
                            <p className="text-[11px] text-gray-500 font-medium tracking-wide">
                              <span className="font-bold text-gray-800">WhatsApp:</span> {r.telefono}
                            </p>
                          )}
                          <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-2">
                            ID: {r.reserva_id?.substring(0, 8) || r.id}
                          </p>
                        </div>
                      </div>
                    );

                    return prodId ? (
                      <Link key={r.id} to={`/product/${prodId}`} target="_blank" className="block group">
                        {CardContent}
                      </Link>
                    ) : (
                      <div key={r.id} className="block group">
                        {CardContent}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit / Create Video Slide-over */}
      <AnimatePresence>
        {isEditingVideo && (
          <div className="fixed inset-0 z-50 flex justify-start">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditingVideo(false)} />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              className="w-full max-w-xl bg-white h-screen relative z-10 shadow-2xl flex flex-col p-8 overflow-y-auto"
              data-lenis-prevent
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black uppercase tracking-tighter">
                  {currentVideo.id ? 'Editar Video' : 'Nuevo Video Reel'}
                </h2>
                <button onClick={() => setIsEditingVideo(false)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveVideo} className="space-y-8">
                {/* Título */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Título del Video</label>
                  <input
                    type="text" required
                    value={currentVideo.title || ''}
                    onChange={e => setCurrentVideo({ ...currentVideo, title: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 h-14 px-5 text-[13px] font-bold focus:outline-none focus:border-black transition-colors rounded-sm"
                    placeholder="Ej: Nike Jordan 4 Sail - Calce Real"
                  />
                </div>

                {/* Posición de la Web */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Sección de la Web</label>
                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setCurrentVideo({ ...currentVideo, position: 'home' })}
                      className={`flex-1 py-3 border text-[11px] font-bold uppercase tracking-widest rounded-sm transition-colors ${currentVideo.position === 'home' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}
                    >
                      Inicio (Home)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setCurrentVideo({ ...currentVideo, position: 'shop' })}
                      className={`flex-1 py-3 border text-[11px] font-bold uppercase tracking-widest rounded-sm transition-colors ${currentVideo.position === 'shop' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}
                    >
                      Tienda (Shop Grid)
                    </button>
                  </div>
                </div>

                {/* Enlace de Producto */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Vincular a un Producto (Opcional)</label>
                  <select
                    value={currentVideo.product_link || ''}
                    onChange={e => setCurrentVideo({ ...currentVideo, product_link: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 h-14 px-5 text-[13px] font-bold focus:outline-none focus:border-black appearance-none transition-colors rounded-sm"
                  >
                    <option value="">Ninguno / General</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.brand} {p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Video URL o Archivo */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">URL Directa del Video (.mp4)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text" required
                        value={currentVideo.url || ''}
                        onChange={e => setCurrentVideo({ ...currentVideo, url: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 h-12 pl-10 pr-4 text-[13px] focus:outline-none focus:border-black transition-colors rounded-sm"
                        placeholder="https://assets.mixkit.co/...mp4"
                      />
                    </div>
                    
                    <label className={`px-4 h-12 text-[11px] font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0 ${uploadingVideo ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}>
                      {uploadingVideo ? (
                        <>
                          <span className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></span>
                          SUBIENDO...
                        </>
                      ) : (
                        <>
                          <Plus size={14} /> ARCHIVO
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="video/mp4,video/quicktime,video/webm" 
                        className="hidden" 
                        disabled={uploadingVideo}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          try {
                            setUploadingVideo(true);
                            const publicUrl = await uploadVideoFile(file);
                            setCurrentVideo(prev => ({ ...prev, url: publicUrl }));
                          } catch (err: any) {
                            alert("Error al cargar el video: " + (err.message || err));
                          } finally {
                            setUploadingVideo(false);
                            e.target.value = ''; // Reset input
                          }
                        }} 
                      />
                    </label>
                  </div>
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-2 leading-relaxed">
                    Recomendado: Pegá una URL de video .mp4. O seleccioná un video vertical corto desde tu dispositivo (se guardará directamente).
                  </p>
                </div>

                {/* Vista previa del Video cargado */}
                {currentVideo.url && (
                  <div className="mt-4 border border-gray-100 p-4 rounded-sm bg-gray-50">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Vista Previa</label>
                    <div className="aspect-[9/16] w-36 mx-auto bg-black rounded-sm overflow-hidden shadow-inner border border-gray-200">
                      <video 
                        src={currentVideo.url} 
                        className="w-full h-full object-cover" 
                        controls 
                        playsInline
                        muted
                      />
                    </div>
                  </div>
                )}

                {/* Switch Activo en Form */}
                <div className="flex items-center gap-3 border-t border-gray-100 pt-6">
                  <input
                    type="checkbox"
                    id="video_is_active"
                    checked={currentVideo.is_active ?? true}
                    onChange={e => setCurrentVideo({ ...currentVideo, is_active: e.target.checked })}
                    className="w-5 h-5 accent-black rounded cursor-pointer"
                  />
                  <label htmlFor="video_is_active" className="text-[11px] font-bold uppercase tracking-widest text-black cursor-pointer">Video Activo (Visible en la Web)</label>
                </div>

                {/* Submit */}
                <div className="pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    className="w-full bg-black text-white h-16 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-3 rounded-sm"
                  >
                    <Check size={18} /> {currentVideo.id ? 'Guardar Cambios' : 'Publicar Video Reel'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Configuración (cambiar contraseña) */}
      <AnimatePresence>
        {settingsOpen && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSettingsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white rounded-sm border border-black/5 shadow-2xl p-8 max-w-md w-full relative z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                    <Settings size={18} />
                  </div>
                  <div>
                    <h3 className="font-common text-base font-black uppercase tracking-[0.1em] text-black leading-tight">Configuración</h3>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">Cambiar contraseña</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="p-2 text-gray-400 hover:text-black transition-colors"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">Contraseña actual</label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={currentPwd}
                    onChange={e => { setCurrentPwd(e.target.value); setSettingsError(null); setSettingsSuccess(false) }}
                    disabled={changingPwd}
                    className="w-full bg-gray-50 h-12 px-4 text-[13px] font-medium rounded-sm border border-gray-200 focus:border-black focus:outline-none disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">Nueva contraseña</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={newPwd}
                    onChange={e => { setNewPwd(e.target.value); setSettingsError(null); setSettingsSuccess(false) }}
                    disabled={changingPwd}
                    className="w-full bg-gray-50 h-12 px-4 text-[13px] font-medium rounded-sm border border-gray-200 focus:border-black focus:outline-none disabled:opacity-60"
                  />
                  <p className="mt-1.5 text-[11px] text-gray-400">Mínimo 8 caracteres.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={confirmPwd}
                    onChange={e => { setConfirmPwd(e.target.value); setSettingsError(null); setSettingsSuccess(false) }}
                    disabled={changingPwd}
                    className="w-full bg-gray-50 h-12 px-4 text-[13px] font-medium rounded-sm border border-gray-200 focus:border-black focus:outline-none disabled:opacity-60"
                  />
                </div>

                {settingsError && (
                  <p className="text-[12px] font-semibold text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-sm">{settingsError}</p>
                )}
                {settingsSuccess && (
                  <p className="text-[12px] font-semibold text-green-600 bg-green-50 border border-green-100 px-3 py-2 rounded-sm">Contraseña actualizada correctamente.</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(false)}
                    className="flex-1 h-12 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 hover:text-black border border-gray-200 hover:border-black transition-colors rounded-sm"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    disabled={changingPwd || !currentPwd || !newPwd || !confirmPwd}
                    className="flex-1 h-12 text-[11px] font-bold uppercase tracking-[0.2em] bg-black text-white hover:bg-gray-900 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {changingPwd ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ventana de Confirmación Premium */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Fondo Oscuro con Desenfoque */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Tarjeta del Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white rounded-sm border border-black/5 shadow-2xl p-8 max-w-sm w-full relative z-10 text-center flex flex-col items-center"
            >
              {/* Icono de Alerta */}
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-5 border border-red-100">
                <Trash2 size={24} strokeWidth={2} />
              </div>

              {/* Título */}
              <h3 className="font-common text-base font-black uppercase tracking-[0.1em] text-black leading-tight">
                {confirmModal.title}
              </h3>

              {/* Mensaje */}
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed mt-3 uppercase tracking-wider">
                {confirmModal.message}
              </p>

              {/* Acciones */}
              <div className="flex gap-3 w-full mt-8">
                <button
                  type="button"
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 py-3 border border-gray-200 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-sm hover:border-black hover:text-black transition-colors cursor-pointer"
                >
                  {confirmModal.cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await confirmModal.onConfirm();
                  }}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-colors cursor-pointer shadow-sm hover:shadow-md"
                >
                  {confirmModal.confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
