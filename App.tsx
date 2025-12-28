
import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Type, Download, Copy, LogIn, LogOut, User, Loader2, Trash2, 
  Check, Clipboard, Star, RotateCcw, Image as ImageIcon, Search, Minus, Plus, Settings2, 
  Share2, Hexagon, Wind, ArrowRight, Languages, ChevronDown, ThumbsUp, 
  ThumbsDown, Flag, Settings, X, MessageCircle, Send, Bot, Minimize2, Sparkles,
  Images, Grid
} from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// --- Types for TypeScript ---
interface Language {
  code: string;
  name: string;
}

interface TranslationMap {
  [key: string]: { [key: string]: string };
}

interface ThemeColorMap {
  [key: string]: string;
}

interface Theme {
  name: string;
  isPro?: boolean;
  colors: ThemeColorMap;
}

interface ThemesMap {
  [key: string]: Theme;
}

interface Review {
  id: number;
  username: string;
  rating: number;
  comment: string;
  timestamp: string;
  likes: string[];
  dislikes: string[];
  reports: string[];
}

interface HistoryItem {
  id: number;
  text: string;
  image: string;
  timestamp: string;
}

interface UserAccount {
  email?: string;
  password?: string;
  createdAt?: string;
  history: HistoryItem[];
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// --- Translation System (i18n) ---
const languages: Language[] = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
  { code: 'ru', name: 'Русский' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'sv', name: 'Svenska' },
  { code: 'pl', name: 'Polski' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'th', name: 'ไทย' },
  { code: 'fi', name: 'Suomi' },
  { code: 'el', name: 'Ελληνικά' },
];

const translations: TranslationMap = {
  es: {
    header_ratings: "Calificaciones",
    header_remaining: "Restantes",
    header_login: "Iniciar Sesión",
    header_register: "Crear Cuenta",
    header_logout: "Salir",
    header_pro: "Pro",
    header_home: "Inicio",
    header_settings: "Configuración",
    login_title: "Iniciar Sesión",
    login_user: "Usuario",
    login_user_placeholder: "Ingresa tu usuario",
    login_pass: "Contraseña",
    login_pass_placeholder: "Ingresa tu contraseña",
    login_cancel: "Cancelar",
    login_submit: "Ingresar",
    login_error: "Usuario o contraseña incorrectos",
    register_title: "Crear Cuenta",
    register_subtitle: "Acceso ilimitado gratis",
    register_user: "Usuario",
    register_email: "Email",
    register_pass: "Contraseña",
    register_confirm: "Confirmar",
    register_submit: "Crear",
    register_error_fields: "Por favor completa todos los campos",
    register_error_match: "Las contraseñas no coinciden",
    register_error_length: "La contraseña debe tener al menos 6 caracteres",
    register_error_exists: "Este usuario ya existe",
    register_success: "¡Cuenta creada exitosamente!",
    rating_title: "¡Calíficanos!",
    rating_subtitle: "¿Qué te parece Cenra?",
    rating_placeholder: "Opcional: déjanos un comentario...",
    rating_skip: "Omitir",
    rating_submit: "Enviar",
    rating_error: "Por favor selecciona una calificación",
    rating_thanks: "¡Gracias por tu calificación!",
    settings_title: "Configuración",
    settings_language: "Idioma",
    settings_theme: "Temas",
    settings_theme_pro: "Pro",
    settings_close: "Cerrar",
    landing_title: "Bienvenido a Cenra",
    landing_subtitle: "Tu estudio creativo para recortar imágenes con texto y formas.",
    landing_desc: "Sube una imagen y recórtala al instante usando tu propio texto o formas geométricas. Añade bordes, sombras y ajusta tu imagen con controles fáciles de usar. ¡Crea diseños únicos en segundos!",
    landing_upload: "Subir Archivo",
    landing_paste: "Pegar Imagen",
    landing_or: "o",
    landing_start_now: "Empezar Ahora",
    editor_mode: "Modo",
    editor_mode_text: "Texto",
    editor_mode_shape: "Forma",
    editor_step1: "1. Imagen",
    editor_step1_upload: "Subir Archivo",
    editor_step1_paste: "Pegar Imagen",
    editor_step1_replace: "Reemplazar Imagen",
    editor_step1_paste_replace: "Pegar y Reemplazar",
    editor_step2: "Ajustes",
    editor_text_placeholder: "Escribe tu texto aquí...",
    editor_font: "Fuente",
    editor_size: "Tamaño",
    editor_shape: "Forma",
    editor_outline: "Borde",
    editor_shadow: "Sombra",
    editor_color: "Color",
    editor_width: "Ancho",
    editor_blur: "Blur",
    editor_offset_x: "Offset X",
    editor_offset_y: "Offset Y",
    editor_generate: "Generar Recorte",
    editor_processing: "Procesando...",
    editor_limit_remaining: "Recortes restantes",
    editor_limit_login: "para recortes ilimitados.",
    editor_limit_register: "Crea una cuenta gratis",
    editor_preview: "Vista Previa / Resultado",
    editor_preview_placeholder: "Sube o pega una imagen para empezar",
    editor_controls_zoom: "Zoom",
    editor_controls_rotation: "Rotación",
    editor_controls_reset: "Reiniciar posición",
    editor_controls_help: "Arrastra la imagen para moverla. Doble click para ocultar controles.",
    editor_download: "Descargar",
    editor_copy: "Copiar",
    editor_copied: "Copiado",
    editor_history: "Historial Reciente",
    editor_pattern_toggle: "Relleno de Patrón",
    editor_pattern_upload: "Subir Imágenes (1-10)",
    editor_pattern_scale: "Escala del Patrón",
    editor_pattern_images: "Imágenes seleccionadas",
    editor_caption: "Etiqueta del Resultado",
    editor_caption_placeholder: "Ej: El corazón está muy al borde",
    ratings_title: "Calificaciones",
    ratings_empty: "Aún no hay calificaciones.",
    ratings_form_title: "Deja tu calificación",
    ratings_form_desc: "Tu opinión nos ayuda a mejorar.",
    ratings_form_login: "Inicia sesión para dejar una calificación.",
    ratings_form_thanks: "Ya has dejado tu calificación. ¡Gracias!",
    ratings_useful: "Útil",
    ratings_not_useful: "No útil",
    ratings_report: "Reportar",
    ratings_reported: "Reportado",
    ratings_delete: "Borrar",
    shape_circle: "Círculo",
    shape_square: "Cuadrado",
    shape_triangle: "Triángulo",
    shape_star: "Estrella (5 Puntas)",
    shape_heart: "Corazón",
    shape_hexagon: "Hexágono",
    shape_diamond: "Diamante",
    shape_pentagon: "Pentágono",
    shape_octagon: "Octágono",
    shape_heptagon: "Heptágono",
    shape_trapezoid: "Trapecio",
    shape_parallelogram: "Paralelogramo",
    shape_oval: "Óvalo",
    shape_semicircle: "Semicírculo",
    shape_quarter_circle: "Cuarto de Círculo",
    shape_moon: "Luna Creciente",
    shape_ring: "Anillo",
    shape_plus: "Signo Más",
    shape_cross: "Cruz (X)",
    shape_arrow_right: "Flecha Derecha",
    shape_teardrop: "Lágrima",
    shape_burst_8: "Estallido (8 Puntas)",
    shape_burst_12: "Estallido (12 Puntas)",
    shape_cube_3d: "Cubo 3D",
    shape_banner: "Banner",
    shape_speech_bubble: "Burbuja de Diálogo",
    shape_cylinder: "Cilindro",
    shape_cloud: "Nube",
    shape_lightning_bolt: "Rayo",
    shape_checkmark: "Marca de Verificación",
    shape_arrow_up: "Flecha Arriba",
    shape_arrow_left: "Flecha Izquierda",
    shape_swiss_cross: "Cruz Suiza",
    alert_img_upload: "Por favor sube una imagen o usa el relleno de patrón",
    alert_text_required: "Por favor escribe el texto",
    alert_limit_reached: "Has alcanzado el límite de 12 recortes diarios",
    alert_img_load_error: "Error al cargar la imagen",
    alert_generate_error: "Error al generar",
    alert_paste_error: "No se pudo pegar la imagen. Intenta subirla manualmente.",
    alert_copy_error: "No se pudo copiar",
    alert_copy_unsupported: "Copiado al portapapeles no es compatible. Intenta descargar.",
    alert_report_thanks: "Gracias por tu reporte. Lo revisaremos.",
    chat_placeholder: "Pregunta sobre Cenra...",
    chat_title: "Asistente Cenra",
    ai_btn: "Generar con IA",
    ai_placeholder: "Describe la imagen que quieres...",
    ai_submit: "Generar Imagen",
    ai_generating: "Creando magia...",
  },
  en: {
    header_ratings: "Ratings",
    header_remaining: "Remaining",
    header_login: "Login",
    header_register: "Sign Up",
    header_logout: "Logout",
    header_pro: "Pro",
    header_home: "Home",
    header_settings: "Settings",
    login_title: "Login",
    login_user: "Username",
    login_user_placeholder: "Enter your username",
    login_pass: "Password",
    login_pass_placeholder: "Enter your password",
    login_cancel: "Cancel",
    login_submit: "Login",
    login_error: "Incorrect username or password",
    register_title: "Create Account",
    register_subtitle: "Free unlimited access",
    register_user: "Username",
    register_email: "Email",
    register_pass: "Password",
    register_confirm: "Confirm",
    register_submit: "Create",
    register_error_fields: "Please fill in all fields",
    register_error_match: "Passwords do not match",
    register_error_length: "Password must be at least 6 characters",
    register_error_exists: "This user already exists",
    register_success: "Account created successfully!",
    rating_title: "Rate Us!",
    rating_subtitle: "What do you think of Cenra?",
    rating_placeholder: "Optional: leave us a comment...",
    rating_skip: "Skip",
    rating_submit: "Submit",
    rating_error: "Please select a rating",
    rating_thanks: "Thank you for your rating!",
    settings_title: "Settings",
    settings_language: "Language",
    settings_theme: "Themes",
    settings_theme_pro: "Pro",
    settings_close: "Close",
    landing_title: "Welcome to Cenra",
    landing_subtitle: "Your creative studio for cropping images with text and shapes.",
    landing_desc: "Upload an image and instantly crop it using your own text or geometric shapes. Add borders, shadows, and adjust your image with easy-to-use controls. Create unique designs in seconds!",
    landing_upload: "Upload File",
    landing_paste: "Paste Image",
    landing_or: "or",
    landing_start_now: "Start Now",
    editor_mode: "Mode",
    editor_mode_text: "Text",
    editor_mode_shape: "Shape",
    editor_step1_upload: "Upload File",
    editor_step1_paste: "Paste Image",
    editor_step1_replace: "Replace Image",
    editor_step1_paste_replace: "Paste & Replace",
    editor_step2: "Settings",
    editor_text_placeholder: "Type your text here...",
    editor_font: "Font",
    editor_size: "Size",
    editor_shape: "Shape",
    editor_outline: "Outline",
    editor_shadow: "Shadow",
    editor_color: "Color",
    editor_width: "Width",
    editor_blur: "Blur",
    editor_offset_x: "Offset X",
    editor_offset_y: "Offset Y",
    editor_generate: "Generate Crop",
    editor_processing: "Processing...",
    editor_limit_remaining: "Remaining crops",
    editor_limit_login: "for unlimited crops.",
    editor_limit_register: "Create a free account",
    editor_preview: "Preview / Result",
    editor_preview_placeholder: "Upload or paste an image to start",
    editor_controls_zoom: "Zoom",
    editor_controls_rotation: "Rotation",
    editor_controls_reset: "Reset position",
    editor_controls_help: "Drag image to move. Double-click to hide controls.",
    editor_download: "Download",
    editor_copy: "Copy",
    editor_copied: "Copied",
    editor_history: "Recent History",
    editor_pattern_toggle: "Pattern Fill",
    editor_pattern_upload: "Upload Images (1-10)",
    editor_pattern_scale: "Pattern Scale",
    editor_pattern_images: "Selected Images",
    editor_caption: "Result Label",
    editor_caption_placeholder: "Ex: The heart is too close to the edge",
    ratings_title: "Ratings",
    ratings_empty: "No ratings yet.",
    ratings_form_title: "Leave your rating",
    ratings_form_desc: "Your feedback helps us improve.",
    ratings_form_login: "Login to leave a rating.",
    ratings_form_thanks: "You have already left your rating. Thank you!",
    ratings_useful: "Useful",
    ratings_not_useful: "Not Useful",
    ratings_report: "Report",
    ratings_reported: "Reported",
    ratings_delete: "Delete",
    shape_circle: "Circle",
    shape_square: "Square",
    shape_triangle: "Triangle",
    shape_star: "Star (5-Point)",
    shape_heart: "Heart",
    shape_hexagon: "Hexagon",
    shape_diamond: "Diamond",
    shape_pentagon: "Pentagon",
    shape_octagon: "Octagon",
    shape_heptagon: "Heptagon",
    shape_trapezoid: "Trapezoid",
    shape_parallelogram: "Parallelogram",
    shape_oval: "Oval",
    shape_semicircle: "Semicircle",
    shape_quarter_circle: "Quarter Circle",
    shape_moon: "Crescent Moon",
    shape_ring: "Ring",
    shape_plus: "Plus Sign",
    shape_cross: "Cross (X)",
    shape_arrow_right: "Right Arrow",
    shape_teardrop: "Teardrop",
    shape_burst_8: "8-Point Burst",
    shape_burst_12: "12-Point Burst",
    shape_cube_3d: "3D Cube",
    shape_banner: "Banner",
    shape_speech_bubble: "Speech Bubble",
    shape_cylinder: "Cylinder",
    shape_cloud: "Cloud",
    shape_lightning_bolt: "Lightning Bolt",
    shape_checkmark: "Checkmark",
    shape_arrow_up: "Up Arrow",
    shape_arrow_left: "Left Arrow",
    shape_swiss_cross: "Swiss Cross",
    alert_img_upload: "Please upload an image or use pattern fill",
    alert_text_required: "Please enter text",
    alert_limit_reached: "You have reached the daily limit of 12 crops",
    alert_img_load_error: "Error loading image",
    alert_generate_error: "Error generating",
    alert_paste_error: "Could not paste image. Try uploading manually.",
    alert_copy_error: "Could not copy",
    alert_copy_unsupported: "Copy to clipboard is not supported. Please try downloading.",
    alert_report_thanks: "Thank you for your report. We will review it.",
    chat_placeholder: "Ask about Cenra...",
    chat_title: "Cenra Assistant",
    ai_btn: "Generate with AI",
    ai_placeholder: "Describe the image you want...",
    ai_submit: "Generate Image",
    ai_generating: "Creating magic...",
  },
};

// --- Theme System ---
const themeColors: ThemesMap = {
  theme1: {
    name: "Cenra (Original)",
    colors: {
      "--theme-bg-from": "#7da05a",
      "--theme-bg-via": "#00a074",
      "--theme-bg-to": "#8387b0",
      "--theme-primary": "#1bbeb0",
      "--theme-secondary": "#b671de",
      "--theme-accent": "#00fff6",
      "--theme-accent-2": "#ffd000",
      "--theme-accent-3": "#a7d458",
      "--theme-text-light": "#ffffff",
      "--theme-text-dark": "#000000",
      "--theme-bg-dark-opacity": "rgba(0, 0, 0, 0.2)",
      "--theme-bg-light-opacity": "rgba(255, 255, 255, 0.1)",
      "--theme-border-opacity": "rgba(255, 255, 255, 0.1)",
      "--theme-text-gray": "#d1d5db",
      "--theme-text-gray-light": "#9ca3af",
    },
  },
  theme2: {
    name: "Ocean Deep",
    colors: {
      "--theme-bg-from": "#000428",
      "--theme-bg-via": "#004e92",
      "--theme-bg-to": "#000428",
      "--theme-primary": "#0077b6",
      "--theme-secondary": "#023e8a",
      "--theme-accent": "#ade8f4",
      "--theme-accent-2": "#00b4d8",
      "--theme-accent-3": "#48cae4",
      "--theme-text-light": "#ffffff",
      "--theme-text-dark": "#000000",
      "--theme-bg-dark-opacity": "rgba(0, 0, 0, 0.3)",
      "--theme-bg-light-opacity": "rgba(255, 255, 255, 0.1)",
      "--theme-border-opacity": "rgba(173, 232, 244, 0.2)",
      "--theme-text-gray": "#d1d5db",
      "--theme-text-gray-light": "#9ca3af",
    },
  },
  theme3: {
    name: "Sunset",
    colors: {
      "--theme-bg-from": "#ff7e5f",
      "--theme-bg-via": "#feb47b",
      "--theme-bg-to": "#ff7e5f",
      "--theme-primary": "#e63946",
      "--theme-secondary": "#f4a261",
      "--theme-accent": "#f1faee",
      "--theme-accent-2": "#ffc300",
      "--theme-accent-3": "#e63946",
      "--theme-text-light": "#ffffff",
      "--theme-text-dark": "#000000",
      "--theme-bg-dark-opacity": "rgba(0, 0, 0, 0.2)",
      "--theme-bg-light-opacity": "rgba(255, 255, 255, 0.2)",
      "--theme-border-opacity": "rgba(255, 255, 255, 0.2)",
      "--theme-text-gray": "#f1faee",
      "--theme-text-gray-light": "#a8dadc",
    },
  },
  theme4: {
    name: "Forest",
    isPro: true,
    colors: {
      "--theme-bg-from": "#134e4a",
      "--theme-bg-via": "#22c55e",
      "--theme-bg-to": "#15803d",
      "--theme-primary": "#16a34a",
      "--theme-secondary": "#f97316",
      "--theme-accent": "#bef264",
      "--theme-accent-2": "#facc15",
      "--theme-accent-3": "#84cc16",
      "--theme-text-light": "#ffffff",
      "--theme-text-dark": "#000000",
      "--theme-bg-dark-opacity": "rgba(0, 0, 0, 0.3)",
      "--theme-bg-light-opacity": "rgba(255, 255, 255, 0.1)",
      "--theme-border-opacity": "rgba(190, 242, 100, 0.2)",
      "--theme-text-gray": "#d1d5db",
      "--theme-text-gray-light": "#9ca3af",
    },
  },
  theme6: {
    name: "Pastel",
    isPro: true,
    colors: {
      "--theme-bg-from": "#fbc2eb",
      "--theme-bg-via": "#a6c1ee",
      "--theme-bg-to": "#fbc2eb",
      "--theme-primary": "#fecaca",
      "--theme-secondary": "#bbf7d0",
      "--theme-accent": "#a78bfa",
      "--theme-accent-2": "#fdba74",
      "--theme-accent-3": "#fca5a5",
      "--theme-text-light": "#581c87",
      "--theme-text-dark": "#312e81",
      "--theme-bg-dark-opacity": "rgba(0, 0, 0, 0.05)",
      "--theme-bg-light-opacity": "rgba(255, 255, 255, 0.5)",
      "--theme-border-opacity": "rgba(255, 255, 255, 0.5)",
      "--theme-text-gray": "#6b7280",
      "--theme-text-gray-light": "#9ca3af",
    },
  },
  theme7: {
    name: "Neon",
    colors: {
      "--theme-bg-from": "#000000",
      "--theme-bg-via": "#1f005c",
      "--theme-bg-to": "#000000",
      "--theme-primary": "#f000b8",
      "--theme-secondary": "#33ff00",
      "--theme-accent": "#00f0ff",
      "--theme-accent-2": "#ff007c",
      "--theme-accent-3": "#33ff00",
      "--theme-text-light": "#ffffff",
      "--theme-text-dark": "#000000",
      "--theme-bg-dark-opacity": "rgba(31, 0, 92, 0.5)",
      "--theme-bg-light-opacity": "rgba(255, 255, 255, 0.1)",
      "--theme-border-opacity": "rgba(0, 240, 255, 0.3)",
      "--theme-text-gray": "#d1d5db",
      "--theme-text-gray-light": "#9ca3af",
    },
  },
  theme8: {
    name: "Retro",
    isPro: true,
    colors: {
      "--theme-bg-from": "#363020",
      "--theme-bg-via": "#7b683d",
      "--theme-bg-to": "#363020",
      "--theme-primary": "#e09f3e",
      "--theme-secondary": "#9e2a2b",
      "--theme-accent": "#fff3b0",
      "--theme-accent-2": "#e09f3e",
      "--theme-accent-3": "#540b0e",
      "--theme-text-light": "#fff3b0",
      "--theme-text-dark": "#363020",
      "--theme-bg-dark-opacity": "rgba(0, 0, 0, 0.3)",
      "--theme-bg-light-opacity": "rgba(255, 243, 176, 0.1)",
      "--theme-border-opacity": "rgba(255, 243, 176, 0.2)",
      "--theme-text-gray": "#fff3b0",
      "--theme-text-gray-light": "#e09f3e",
    },
  },
  theme9: {
    name: "Desert",
    colors: {
      "--theme-bg-from": "#fdfcdc",
      "--theme-bg-via": "#fed9b7",
      "--theme-bg-to": "#fdfcdc",
      "--theme-primary": "#f07167",
      "--theme-secondary": "#0081a7",
      "--theme-accent": "#00afb9",
      "--theme-accent-2": "#f07167",
      "--theme-accent-3": "#fed9b7",
      "--theme-text-light": "#003049",
      "--theme-text-dark": "#003049",
      "--theme-bg-dark-opacity": "rgba(0, 48, 73, 0.05)",
      "--theme-bg-light-opacity": "rgba(255, 255, 255, 0.5)",
      "--theme-border-opacity": "rgba(0, 129, 167, 0.2)",
      "--theme-text-gray": "#003049",
      "--theme-text-gray-light": "#0081a7",
    },
  },
  theme10: {
    name: "Arctic",
    isPro: true,
    colors: {
      "--theme-bg-from": "#dbeafe",
      "--theme-bg-via": "#bfdbfe",
      "--theme-bg-to": "#dbeafe",
      "--theme-primary": "#2563eb",
      "--theme-secondary": "#475569",
      "--theme-accent": "#93c5fd",
      "--theme-accent-2": "#1d4ed8",
      "--theme-accent-3": "#60a5fa",
      "--theme-text-light": "#1e3a8a",
      "--theme-text-dark": "#ffffff",
      "--theme-bg-dark-opacity": "rgba(100, 116, 139, 0.1)",
      "--theme-bg-light-opacity": "rgba(255, 255, 255, 0.5)",
      "--theme-border-opacity": "rgba(147, 197, 253, 0.4)",
      "--theme-text-gray": "#334155",
      "--theme-text-gray-light": "#64748b",
    },
  },
};

export default function TextCropStudio() {
  // --- State ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [accounts, setAccounts] = useState<{[key: string]: UserAccount}>({});
  
  const [showHomePage, setShowHomePage] = useState(true);
  const [showLanding, setShowLanding] = useState(true); 
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showRatingsPage, setShowRatingsPage] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalGenerations, setTotalGenerations] = useState(0);
  
  const [mode, setMode] = useState('text');
  const [selectedShape, setSelectedShape] = useState('circle');
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(120);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [addOutline, setAddOutline] = useState(false);
  const [outlineColor, setOutlineColor] = useState('#000000');
  const [outlineWidth, setOutlineWidth] = useState(8);
  const [addShadow, setAddShadow] = useState(false);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowBlur, setShadowBlur] = useState(15);
  const [shadowOffsetX, setShadowOffsetX] = useState(5);
  const [shadowOffsetY, setShadowOffsetY] = useState(5);

  const [resultCaption, setResultCaption] = useState('');
  
  // --- Pattern State ---
  const [usePattern, setUsePattern] = useState(false);
  const [patternImages, setPatternImages] = useState<string[]>([]);
  const [patternScale, setPatternScale] = useState(1);
  const patternInputRef = useRef<HTMLInputElement>(null);

  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [imageScale, setImageScale] = useState(1);
  const [imageX, setImageX] = useState(0);
  const [imageY, setImageY] = useState(0);
  const [imageRotation, setImageRotation] = useState(0);
  const [showImageControls, setShowImageControls] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [dailyGenerations, setDailyGenerations] = useState(0);
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString());
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [language, setLanguage] = useState('es');
  const [currentTheme, setCurrentTheme] = useState('theme1');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // --- AI Image Gen State ---
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // --- Chat State ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // t() function for translations
  const t = (key: string) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  const fonts = [
    'Arial', 'Arial Black', 'Impact', 'Verdana', 'Tahoma', 
    'Trebuchet MS', 'Georgia', 'Times New Roman', 'Courier New',
    'Comic Sans MS', 'Brush Script MT', 'Lucida Console',
    'Roboto', 'Open Sans', 'Montserrat', 'Lato', 'Poppins', 
    'Playfair Display', 'Oswald', 'Raleway', 'Pacifico', 
    'Dancing Script', 'Lobster', 'Righteous', 'Fredoka One', 
    'Indie Flower', 'Caveat', 'Satisfy', 'Shadows Into Light', 
    'Bangers', 'Permanent Marker', 'Great Vibes', 'Kaushan Script', 
    'Sacramento', 'Courgette', 'Abril Fatface', 'Bebas Neue', 
    'Comfortaa', 'Orbitron', 'Cinzel', 'Quicksand', 'Amatic SC',
    'Garamond', 'Palatino', 'Helvetica', 'Monaco', 'Copperplate',
    'Papyrus', 'Futura', 'Gill Sans', 'Source Sans Pro', 'PT Sans',
    'Merriweather', 'Noto Sans', 'Muli', 'Nunito', 'Patua One', 'Alfa Slab One'
  ];

  const shapes = () => [
    { id: 'circle', name: t('shape_circle') },
    { id: 'square', name: t('shape_square') },
    { id: 'triangle', name: t('shape_triangle') },
    { id: 'star', name: t('shape_star') },
    { id: 'heart', name: t('shape_heart') },
    { id: 'hexagon', name: t('shape_hexagon') },
    { id: 'diamond', name: t('shape_diamond') },
    { id: 'pentagon', name: t('shape_pentagon') },
    { id: 'octagon', name: t('shape_octagon') },
    { id: 'heptagon', name: t('shape_heptagon') },
    { id: 'trapezoid', name: t('shape_trapezoid') },
    { id: 'parallelogram', name: t('shape_parallelogram') },
    { id: 'oval', name: t('shape_oval') },
    { id: 'semicircle', name: t('shape_semicircle') },
    { id: 'quarter_circle', name: t('shape_quarter_circle') },
    { id: 'moon', name: t('shape_moon') },
    { id: 'ring', name: t('shape_ring') },
    { id: 'plus', name: t('shape_plus') },
    { id: 'cross', name: t('shape_cross') },
    { id: 'arrow_right', name: t('shape_arrow_right') },
    { id: 'teardrop', name: t('shape_teardrop') },
    { id: 'burst_8', name: t('shape_burst_8') },
    { id: 'burst_12', name: t('shape_burst_12') },
    { id: 'cube_3d', name: t('shape_cube_3d') },
    { id: 'banner', name: t('shape_banner') },
    { id: 'speech_bubble', name: t('shape_speech_bubble') },
    { id: 'cylinder', name: t('shape_cylinder') },
    { id: 'cloud', name: t('shape_cloud') },
    { id: 'lightning_bolt', name: t('shape_lightning_bolt') },
    { id: 'checkmark', name: t('shape_checkmark') },
    { id: 'arrow_up', name: t('shape_arrow_up') },
    { id: 'arrow_left', name: t('shape_arrow_left') },
    { id: 'swiss_cross', name: t('shape_swiss_cross') },
  ];

  // --- Theme Enforcement Logic ---
  useEffect(() => {
    const theme = themeColors[currentTheme] || themeColors.theme1;
    if (theme.isPro && !isLoggedIn) {
      setCurrentTheme('theme1');
      return;
    }

    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    sessionStorage.setItem('cenraTheme', currentTheme);
  }, [currentTheme, isLoggedIn]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isChatOpen]);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('userAuth');
    const savedGenerations = sessionStorage.getItem('dailyGenerations');
    const savedResetDate = sessionStorage.getItem('lastResetDate');
    const savedAccounts = sessionStorage.getItem('cenraAccounts');
    const savedReviews = sessionStorage.getItem('cenraReviews');
    const savedTotalGenerations = sessionStorage.getItem('totalGenerations');
    const savedLang = sessionStorage.getItem('cenraLang');
    const savedTheme = sessionStorage.getItem('cenraTheme');

    let initialIsLoggedIn = false;
    if (savedAuth) {
      const auth = JSON.parse(savedAuth);
      initialIsLoggedIn = auth.isLoggedIn;
      setIsLoggedIn(auth.isLoggedIn);
      setUsername(auth.username);
      if (auth.username && savedAccounts) {
        const accs = JSON.parse(savedAccounts);
        if (accs[auth.username]?.history) setHistory(accs[auth.username].history);
      }
    }

    if (savedLang && translations[savedLang]) setLanguage(savedLang);
    
    if (savedTheme && themeColors[savedTheme]) {
      if (themeColors[savedTheme].isPro && !initialIsLoggedIn) {
        setCurrentTheme('theme1');
      } else {
        setCurrentTheme(savedTheme);
      }
    }

    if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
    if (savedReviews) setReviews(JSON.parse(savedReviews));
    if (savedTotalGenerations) setTotalGenerations(parseInt(savedTotalGenerations));

    if (savedResetDate) {
      const currentDate = new Date().toDateString();
      if (currentDate !== savedResetDate) {
        setDailyGenerations(0);
        setLastResetDate(currentDate);
        sessionStorage.setItem('dailyGenerations', '0');
        sessionStorage.setItem('lastResetDate', currentDate);
      } else if (savedGenerations) {
        setDailyGenerations(parseInt(savedGenerations));
      }
    }
  }, []);

  const handleLogin = () => {
    if (loginUsername && loginPassword) {
      const accs: {[key: string]: UserAccount} = JSON.parse(sessionStorage.getItem('cenraAccounts') || '{}');
      if (accs[loginUsername]?.password === loginPassword) {
        setIsLoggedIn(true);
        setUsername(loginUsername);
        setHistory(accs[loginUsername].history || []);
        sessionStorage.setItem('userAuth', JSON.stringify({ isLoggedIn: true, username: loginUsername }));
        setShowLogin(false);
        setLoginUsername('');
        setLoginPassword('');
      } else {
        alert(t('login_error'));
      }
    }
  };

  const handleRegister = () => {
    if (!registerUsername || !registerEmail || !registerPassword || !registerConfirmPassword) {
      alert(t('register_error_fields'));
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      alert(t('register_error_match'));
      return;
    }
    if (registerPassword.length < 6) {
      alert(t('register_error_length'));
      return;
    }
    const accs: {[key: string]: UserAccount} = JSON.parse(sessionStorage.getItem('cenraAccounts') || '{}');
    if (accs[registerUsername]) {
      alert(t('register_error_exists'));
      return;
    }
    const newAccounts = {
      ...accs,
      [registerUsername]: {
        email: registerEmail,
        password: registerPassword,
        createdAt: new Date().toISOString(),
        history: []
      }
    };
    setAccounts(newAccounts);
    sessionStorage.setItem('cenraAccounts', JSON.stringify(newAccounts));
    setIsLoggedIn(true);
    setUsername(registerUsername);
    setHistory([]);
    sessionStorage.setItem('userAuth', JSON.stringify({ isLoggedIn: true, username: registerUsername }));
    setShowRegister(false);
    setRegisterUsername('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');
    alert(t('register_success'));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setHistory([]);
    sessionStorage.removeItem('userAuth');
  };

  const changeLanguage = (langCode: string) => {
    setLanguage(langCode);
    sessionStorage.setItem('cenraLang', langCode);
  };

  const drawPolygon = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, sides: number, rotation = 0) => {
    if (sides < 3) return;
    const angleOffset = rotation - Math.PI / 2;
    ctx.moveTo(x + radius * Math.cos(angleOffset), y + radius * Math.sin(angleOffset));
    for (let i = 1; i <= sides; i++) {
      const angle = (i / sides) * 2 * Math.PI + angleOffset;
      ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
    }
  };

  const drawBurst = (ctx: CanvasRenderingContext2D, x: number, y: number, spikes: number, outerRadius: number, innerRadius: number) => {
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI / spikes) * i - Math.PI / 2;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
  };

  const canGenerate = () => isLoggedIn || dailyGenerations < 12;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        resetImageTransform();
        setOutputImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePatternUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 10);
    if (files.length > 0) {
      const newImages: string[] = [];
      let loaded = 0;
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          newImages.push(ev.target?.result as string);
          loaded++;
          if (loaded === files.length) {
            setPatternImages(prev => [...prev, ...newImages].slice(0, 10));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // --- Fix handlePaste: Using any to bypass potential shadowing of Blob and unknown types ---
  const handlePaste = async () => {
    try {
      const clipboardItems: any = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            // Type assertion as any to bypass potential shadowing issues with the Blob interface
            const blob = (await item.getType(type)) as any;
            const reader = new FileReader();
            reader.onload = (event) => {
              setUploadedImage(event.target?.result as string);
              resetImageTransform();
              setOutputImage(null);
            };
            reader.readAsDataURL(blob);
            return; 
          }
        }
      }
    } catch (err) {
      alert(t('alert_paste_error'));
    }
  };

  const resetImageTransform = () => {
    setImageScale(1);
    setImageX(0);
    setImageY(0);
    setImageRotation(0);
    setShowImageControls(false);
  }

  const handleImageDoubleClick = () => {
    if (uploadedImage) setShowImageControls(!showImageControls);
  };

  const handleImageMouseDown = (e: React.MouseEvent) => {
    if (showImageControls && uploadedImage) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - imageX, y: e.clientY - imageY });
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setImageX(e.clientX - dragStart.x);
        setImageY(e.clientY - dragStart.y);
      }
    };
    const handleGlobalMouseUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart]);

  const drawShape = (ctx: CanvasRenderingContext2D, shape: string, x: number, y: number, size: number) => {
    const radius = size / 2;
    ctx.beginPath();
    switch(shape) {
      case 'circle': ctx.arc(x, y, radius, 0, Math.PI * 2); break;
      case 'square': ctx.rect(x - radius, y - radius, size, size); break;
      case 'triangle': drawPolygon(ctx, x, y, radius, 3); ctx.closePath(); break;
      case 'star': drawBurst(ctx, x, y, 5, radius, radius / 2.5); ctx.closePath(); break;
      case 'heart':
        ctx.moveTo(x, y + radius / 2);
        ctx.bezierCurveTo(x, y, x - radius, y - radius / 2, x - radius, y + radius / 3);
        ctx.bezierCurveTo(x - radius, y + radius, x, y + radius * 1.3, x, y + radius * 1.3);
        ctx.bezierCurveTo(x, y + radius * 1.3, x + radius, y + radius, x + radius, y + radius / 3);
        ctx.bezierCurveTo(x + radius, y - radius / 2, x, y, x, y + radius / 2);
        ctx.closePath();
        break;
      case 'hexagon': drawPolygon(ctx, x, y, radius, 6); ctx.closePath(); break;
      case 'diamond': drawPolygon(ctx, x, y, radius, 4, Math.PI / 4); ctx.closePath(); break;
      case 'pentagon': drawPolygon(ctx, x, y, radius, 5); ctx.closePath(); break;
      case 'octagon': drawPolygon(ctx, x, y, radius, 8, Math.PI / 8); ctx.closePath(); break;
      case 'heptagon': drawPolygon(ctx, x, y, radius, 7); ctx.closePath(); break;
      case 'trapezoid':
        ctx.moveTo(x - radius, y + radius); ctx.lineTo(x + radius, y + radius);
        ctx.lineTo(x + radius * 0.6, y - radius); ctx.lineTo(x - radius * 0.6, y - radius);
        ctx.closePath();
        break;
      case 'parallelogram':
        ctx.moveTo(x - radius, y + radius); ctx.lineTo(x + radius * 0.5, y + radius);
        ctx.lineTo(x + radius, y - radius); ctx.lineTo(x - radius * 0.5, y - radius);
        ctx.closePath();
        break;
      case 'oval': ctx.ellipse(x, y, radius, radius * 0.7, 0, 0, Math.PI * 2); break;
      case 'semicircle': ctx.arc(x, y + radius / 2, radius, Math.PI, 0); ctx.closePath(); break;
      case 'quarter_circle': ctx.moveTo(x - radius, y - radius); ctx.arc(x - radius, y - radius, size, 0, Math.PI / 2); ctx.closePath(); break;
      case 'moon': ctx.arc(x, y, radius, 0.5 * Math.PI, 1.5 * Math.PI); ctx.bezierCurveTo(x + radius * 0.5, y, x + radius * 0.5, y + radius, x, y + radius); break;
      case 'ring': ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.moveTo(x + radius * 0.7, y); ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2, true); break;
      case 'plus': ctx.rect(x - radius * 0.15, y - radius, radius * 0.3, size); ctx.rect(x - radius, y - radius * 0.15, size, radius * 0.3); break;
      case 'cross': drawPolygon(ctx, x, y, radius, 4, Math.PI / 4); ctx.moveTo(x - radius * 0.6, y - radius * 0.6); ctx.lineTo(x + radius * 0.6, y + radius * 0.6); ctx.moveTo(x - radius * 0.6, y + radius * 0.6); ctx.lineTo(x + radius * 0.6, y - radius * 0.6); break;
      case 'arrow_right':
        ctx.moveTo(x - radius, y - radius * 0.5); ctx.lineTo(x, y - radius * 0.5); ctx.lineTo(x, y - radius);
        ctx.lineTo(x + radius, y); ctx.lineTo(x, y + radius); ctx.lineTo(x, y + radius * 0.5);
        ctx.lineTo(x - radius, y + radius * 0.5); ctx.closePath();
        break;
      case 'teardrop':
        ctx.moveTo(x, y - radius); ctx.bezierCurveTo(x + radius, y - radius, x + radius, y + radius, x, y + radius);
        ctx.bezierCurveTo(x - radius, y + radius, x - radius, y - radius, x, y - radius); ctx.closePath();
        break;
      case 'burst_8': drawBurst(ctx, x, y, 8, radius, radius * 0.5); ctx.closePath(); break;
      case 'burst_12': drawBurst(ctx, x, y, 12, radius, radius * 0.6); ctx.closePath(); break;
      case 'cube_3d':
        const off = radius * 0.4; ctx.rect(x - radius, y - radius, size, size);
        ctx.moveTo(x - radius, y - radius); ctx.lineTo(x - radius + off, y - radius - off);
        ctx.lineTo(x + radius + off, y - radius - off); ctx.lineTo(x + radius, y - radius);
        ctx.moveTo(x + radius + off, y - radius - off); ctx.lineTo(x + radius + off, y + radius - off);
        ctx.lineTo(x + radius, y + radius); break;
      case 'banner':
        const bH = radius * 0.7; ctx.moveTo(x - radius, y); ctx.lineTo(x - radius * 0.8, y - bH / 2);
        ctx.lineTo(x + radius * 0.8, y - bH / 2); ctx.lineTo(x + radius, y);
        ctx.lineTo(x + radius * 0.8, y + bH / 2); ctx.lineTo(x - radius * 0.8, y + bH / 2); ctx.closePath(); break;
      case 'speech_bubble':
        ctx.ellipse(x, y - radius * 0.1, radius, radius * 0.8, 0, 0, Math.PI * 2);
        ctx.moveTo(x - radius * 0.3, y + radius * 0.6); ctx.lineTo(x, y + radius); ctx.lineTo(x, y + radius * 0.6); ctx.closePath(); break;
      case 'cylinder':
        ctx.ellipse(x, y - radius * 0.6, radius, radius * 0.3, 0, 0, Math.PI * 2);
        ctx.moveTo(x - radius, y - radius * 0.6); ctx.lineTo(x - radius, y + radius * 0.6);
        ctx.ellipse(x, y + radius * 0.6, radius, radius * 0.3, 0, 0, Math.PI * 2);
        ctx.moveTo(x + radius, y + radius * 0.6); ctx.lineTo(x + radius, y - radius * 0.6); break;
      case 'cloud':
        ctx.arc(x - radius * 0.5, y + radius * 0.1, radius * 0.5, Math.PI * 0.8, Math.PI * 1.9);
        ctx.arc(x + radius * 0.5, y - radius * 0.2, radius * 0.7, Math.PI * 0.9, Math.PI * 2.1);
        ctx.arc(x, y - radius * 0.5, radius * 0.4, Math.PI * 1.2, Math.PI * 2.5); ctx.closePath(); break;
      case 'lightning_bolt':
        ctx.moveTo(x + radius * 0.2, y - radius); ctx.lineTo(x - radius * 0.5, y + radius * 0.1);
        ctx.lineTo(x, y + radius * 0.1); ctx.lineTo(x - radius * 0.2, y + radius);
        ctx.lineTo(x + radius * 0.5, y - radius * 0.1); ctx.lineTo(x, y - radius * 0.1); ctx.closePath(); break;
      case 'checkmark':
        ctx.moveTo(x - radius, y); ctx.lineTo(x - radius * 0.2, y + radius * 0.8);
        ctx.lineTo(x + radius, y - radius * 0.8); ctx.lineTo(x + radius * 0.7, y - radius);
        ctx.lineTo(x - radius * 0.2, y + radius * 0.2); ctx.lineTo(x - radius * 0.7, y - radius * 0.3); ctx.closePath(); break;
      case 'arrow_up':
        ctx.moveTo(x, y - radius); ctx.lineTo(x + radius, y); ctx.lineTo(x + radius * 0.5, y);
        ctx.lineTo(x + radius * 0.5, y + radius); ctx.lineTo(x - radius * 0.5, y + radius);
        ctx.lineTo(x - radius * 0.5, y); ctx.lineTo(x - radius, y); ctx.closePath(); break;
      case 'arrow_left':
        ctx.moveTo(x - radius, y); ctx.lineTo(x, y - radius); ctx.lineTo(x, y - radius * 0.5);
        ctx.lineTo(x + radius, y - radius * 0.5); ctx.lineTo(x + radius, y + radius * 0.5);
        ctx.lineTo(x, y + radius * 0.5); ctx.lineTo(x, y + radius); ctx.closePath(); break;
      case 'swiss_cross':
        ctx.rect(x - radius, y - radius * 0.3, size, radius * 0.6);
        ctx.rect(x - radius * 0.3, y - radius, radius * 0.6, size); break;
      default: ctx.arc(x, y, radius, 0, Math.PI * 2);
    }
  };

  const generateImage = async () => {
    if (!uploadedImage && !(usePattern && patternImages.length > 0)) {
      alert(t('alert_img_upload'));
      return;
    }
    if (mode === 'text' && !text.trim()) {
      alert(t('alert_text_required'));
      return;
    }
    if (!canGenerate()) {
      alert(t('alert_limit_reached'));
      return;
    }

    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new window.Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = usePattern && patternImages.length > 0 ? patternImages[0] : uploadedImage!;
      });

      canvas.width = usePattern ? 1000 : img.width;
      canvas.height = usePattern ? 1000 : img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const x = canvas.width / 2;
      const y = canvas.height / 2;
      
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      const effectCanvas = document.createElement('canvas');
      effectCanvas.width = canvas.width;
      effectCanvas.height = canvas.height;
      const effectCtx = effectCanvas.getContext('2d');
      if (!effectCtx) return;

      if (addShadow) {
        effectCtx.shadowColor = shadowColor;
        effectCtx.shadowBlur = shadowBlur;
        effectCtx.shadowOffsetX = shadowOffsetX;
        effectCtx.shadowOffsetY = shadowOffsetY;
      }

      if (mode === 'text') {
        const fontStyle = `bold ${fontSize}px ${fontFamily}`;
        tempCtx.font = fontStyle;
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        
        effectCtx.font = fontStyle;
        effectCtx.textAlign = 'center';
        effectCtx.textBaseline = 'middle';

        const lines = text.split('\n');
        const lineHeight = fontSize * 1.2;
        const totalHeight = lines.length * lineHeight;
        const startY = y - (totalHeight / 2) + (lineHeight / 2);
        
        if (addOutline) {
          effectCtx.strokeStyle = outlineColor;
          effectCtx.lineWidth = outlineWidth;
          effectCtx.lineJoin = 'round';
          lines.forEach((line, index) => {
            const lineY = startY + (index * lineHeight);
            effectCtx.strokeText(line, x, lineY);
          });
        }
        
        tempCtx.fillStyle = 'white';
        lines.forEach((line, index) => {
          const lineY = startY + (index * lineHeight);
          tempCtx.fillText(line, x, lineY);
        });
      } else {
        const size = Math.min(canvas.width, canvas.height) * 0.8;
        if (addOutline) {
          effectCtx.strokeStyle = outlineColor;
          effectCtx.lineWidth = outlineWidth;
          effectCtx.lineJoin = 'round';
          drawShape(effectCtx, selectedShape, x, y, size);
          effectCtx.stroke();
        }
        tempCtx.fillStyle = 'white';
        drawShape(tempCtx, selectedShape, x, y, size);
        if (selectedShape === 'ring') tempCtx.fill('evenodd');
        else tempCtx.fill();
      }

      if (usePattern && patternImages.length > 0) {
        const pCanvas = document.createElement('canvas');
        const pCtx = pCanvas.getContext('2d');
        const baseSize = 150 * patternScale;
        const cols = Math.ceil(Math.sqrt(patternImages.length));
        const rows = Math.ceil(patternImages.length / cols);
        pCanvas.width = baseSize * cols;
        pCanvas.height = baseSize * rows;

        const loadedImgs = await Promise.all(patternImages.map(src => {
          return new Promise<HTMLImageElement>((res) => {
            const pI = new window.Image();
            pI.onload = () => res(pI);
            pI.src = src;
          });
        }));

        loadedImgs.forEach((pI, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          pCtx!.drawImage(pI, c * baseSize, r * baseSize, baseSize, baseSize);
        });

        const pattern = ctx.createPattern(pCanvas, 'repeat');
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      } else {
        ctx.save();
        ctx.translate(x + imageX, y + imageY);
        ctx.rotate((imageRotation * Math.PI) / 180);
        ctx.scale(imageScale, imageScale);
        ctx.translate(-x, -y);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
      }

      const maskData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
      const effectData = effectCtx.getImageData(0, 0, canvas.width, canvas.height);
      const finalData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < maskData.data.length; i += 4) {
        const mAlpha = maskData.data[i + 3];
        const eAlpha = effectData.data[i + 3];
        if (mAlpha > 0) {
        } else if (eAlpha > 0) {
          finalData.data[i] = effectData.data[i];
          finalData.data[i + 1] = effectData.data[i + 1];
          finalData.data[i + 2] = effectData.data[i + 2];
          finalData.data[i + 3] = effectData.data[i + 3];
        } else {
          finalData.data[i + 3] = 0;
        }
      }
      ctx.putImageData(finalData, 0, 0);
      
      const outUrl = canvas.toDataURL('image/png');
      setOutputImage(outUrl);

      if (isLoggedIn && username) {
        const newItem: HistoryItem = {
          id: Date.now(),
          text: mode === 'text' ? text : selectedShape,
          image: outUrl,
          timestamp: new Date().toLocaleString()
        };
        const updatedH = [newItem, ...history].slice(0, 20);
        setHistory(updatedH);
        const accs = JSON.parse(sessionStorage.getItem('cenraAccounts') || '{}');
        if (accs[username]) {
          accs[username].history = updatedH;
          sessionStorage.setItem('cenraAccounts', JSON.stringify(accs));
        }
      }

      if (!isLoggedIn) {
        const nC = dailyGenerations + 1;
        setDailyGenerations(nC);
        sessionStorage.setItem('dailyGenerations', nC.toString());
      }
      const nT = totalGenerations + 1;
      setTotalGenerations(nT);
      sessionStorage.setItem('totalGenerations', nT.toString());
      if (nT === 3 && !userHasReviewed) setTimeout(() => setShowRatingModal(true), 1000);
      setIsProcessing(false);

    } catch (err: any) {
      alert(t('alert_generate_error') + ': ' + err.message);
      setIsProcessing(false);
    }
  };

  const handleAiImageGeneration = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: aiPrompt }] }
      });
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setUploadedImage(`data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`);
            resetImageTransform();
            setOutputImage(null);
            setShowAiPrompt(false);
            return;
          }
        }
      }
      alert(t('alert_generate_error'));
    } catch (error: any) {
      alert(t('alert_generate_error') + ': ' + error.message);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!outputImage) return;
    const link = document.createElement('a');
    link.href = outputImage;
    link.download = `cenra-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Fix copyToClipboard: Using any for the blob to handle potential shadowing or incorrect native interface alignment ---
  const copyToClipboard = async () => {
    if (!outputImage) return;
    try {
      const response = await fetch(outputImage);
      const blob = (await response.blob()) as any;
      if (navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else alert(t('alert_copy_unsupported'));
    } catch (err: any) {
      alert(t('alert_copy_error') + ': ' + err.message);
    }
  };

  const clearAll = () => {
    setUploadedImage(null);
    setText('');
    setOutputImage(null);
    setPatternImages([]);
    setResultCaption('');
    resetImageTransform();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReviewSubmit = () => {
    if (rating === 0) { alert(t('rating_error')); return; }
    const newR: Review = {
      id: Date.now(),
      username: isLoggedIn ? username : 'Usuario anónimo',
      rating,
      comment: reviewText,
      timestamp: new Date().toLocaleString(),
      likes: [], dislikes: [], reports: [] 
    };
    const updated = [newR, ...reviews];
    setReviews(updated);
    sessionStorage.setItem('cenraReviews', JSON.stringify(updated));
    setShowRatingModal(false);
    setRating(0);
    setReviewText('');
    alert(t('rating_thanks'));
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userM: ChatMessage = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userM]);
    setChatInput('');
    setIsChatLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: chatInput,
        config: {
          systemInstruction: "Eres el asistente de Cenra Studio. Cenra es un estudio creativo para recortar imágenes por texto o formas geométricas. Características principales: recorte por texto personalizable (fuentes, tamaños), recorte por formas (más de 30 tipos), relleno con patrones (hasta 10 imágenes), efectos de borde y sombra, y generación de imágenes con IA. Ayuda a los usuarios con dudas sobre la herramienta o consejos de diseño."
        }
      });
      setChatMessages(prev => [...prev, { role: 'model', text: response.text || "No hay respuesta disponible en este momento." }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Lo siento, ocurrió un error al conectar con el servidor." }]);
    } finally { setIsChatLoading(false); }
  };

  const remainingGenerations = isLoggedIn ? '∞' : 12 - dailyGenerations;
  const userHasReviewed = isLoggedIn && reviews.some(r => r.username === username);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--theme-bg-from)] via-[var(--theme-bg-via)] to-[var(--theme-bg-to)] text-[var(--theme-text-light)] font-sans relative">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* --- Header --- */}
      <header className="bg-[var(--theme-bg-dark-opacity)] backdrop-blur-md border-b border-[var(--theme-border-opacity)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setShowHomePage(true); setShowRatingsPage(false); clearAll(); setShowLanding(true); }}>
            <svg width="200" height="50" viewBox="0 0 200 50" fill="none">
              <defs>
                <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--theme-accent-3)" />
                  <stop offset="50%" stopColor="var(--theme-accent)" />
                  <stop offset="100%" stopColor="var(--theme-secondary)" />
                </linearGradient>
              </defs>
              <path d="M 15 8 L 28 2 L 41 8 L 41 22 L 28 28 L 15 22 Z" fill="url(#hexGradient)" />
              <path d="M 20 10 Q 18 12 18 15 Q 18 18 20 20 L 28 15 L 36 20 Q 38 18 38 15 Q 38 12 36 10 L 28 15 Z" fill="white" />
              <text x="50" y="32" fontFamily="Arial" fontSize="28" fontWeight="700" fill="var(--theme-text-light)">Cenra</text>
            </svg>
          </div>
          
          <div className="flex items-center gap-4">
            {!showHomePage && (
              <button onClick={() => { setShowHomePage(true); setShowRatingsPage(false); }} className="px-4 py-2 bg-[var(--theme-bg-light-opacity)] hover:bg-opacity-20 text-[var(--theme-text-light)] rounded-full transition text-sm">
                ← {t('header_home')}
              </button>
            )}
            {!showRatingsPage && showHomePage && (
              <button onClick={() => { setShowRatingsPage(true); setShowHomePage(false); }} className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 rounded-full transition text-sm flex items-center gap-2 border border-yellow-500/30">
                <Star className="w-4 h-4" /> {t('header_ratings')}
              </button>
            )}
            {!isLoggedIn && showHomePage && !showLanding && (
              <div className="text-sm text-[var(--theme-text-gray)] bg-[var(--theme-bg-light-opacity)] px-3 py-1 rounded-full border border-white/5">
                {t('header_remaining')}: <span className="font-bold text-[var(--theme-accent)]">{remainingGenerations}</span>
              </div>
            )}
            <button onClick={() => setShowSettingsModal(true)} title={t('header_settings')} className="p-2 bg-[var(--theme-bg-light-opacity)] hover:bg-opacity-20 text-[var(--theme-text-light)] rounded-full transition">
              <Settings className="w-5 h-5" />
            </button>
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[var(--theme-bg-light-opacity)] px-4 py-2 rounded-full border border-white/5">
                  <User className="w-4 h-4 text-[var(--theme-accent)]" />
                  <span className="text-[var(--theme-text-light)] font-medium">{username}</span>
                  <span className="text-xs text-[var(--theme-accent)] ml-2">{t('header_pro')} ∞</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-full transition">
                  <LogOut className="w-4 h-4" /> {t('header_logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => setShowRegister(true)} className="flex items-center gap-2 px-6 py-2 bg-[var(--theme-secondary)] hover:brightness-110 text-[var(--theme-text-light)] rounded-full transition font-medium shadow-lg shadow-[var(--theme-secondary)]/20">
                  <User className="w-4 h-4" /> {t('header_register')}
                </button>
                <button onClick={() => setShowLogin(true)} className="flex items-center gap-2 px-6 py-2 bg-[var(--theme-primary)] hover:brightness-110 text-[var(--theme-text-light)] rounded-full transition font-medium shadow-lg shadow-[var(--theme-primary)]/20">
                  <LogIn className="w-4 h-4" /> {t('header_login')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- Modals --- */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-[var(--theme-primary)]/30">
            <h2 className="text-2xl font-bold text-white mb-6">{t('login_title')}</h2>
            <div className="space-y-4">
              <input type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-[var(--theme-primary)]" placeholder={t('login_user_placeholder')} />
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-[var(--theme-primary)]" placeholder={t('login_pass_placeholder')} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />
              <div className="flex gap-3">
                <button onClick={() => setShowLogin(false)} className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">{t('login_cancel')}</button>
                <button onClick={handleLogin} className="flex-1 px-4 py-3 bg-[var(--theme-primary)] text-white rounded-lg hover:brightness-110 transition shadow-lg shadow-[var(--theme-primary)]/20">{t('login_submit')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showRegister && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-[var(--theme-secondary)]/30">
            <h2 className="text-2xl font-bold text-white mb-2">{t('register_title')}</h2>
            <p className="text-gray-400 text-sm mb-6">{t('register_subtitle')}</p>
            <div className="space-y-4">
              <input type="text" placeholder={t('register_user')} value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-[var(--theme-secondary)]" />
              <input type="email" placeholder={t('register_email')} value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-[var(--theme-secondary)]" />
              <input type="password" placeholder={t('register_pass')} value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-[var(--theme-secondary)]" />
              <input type="password" placeholder={t('register_confirm')} value={registerConfirmPassword} onChange={(e) => setRegisterConfirmPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-[var(--theme-secondary)]" onKeyPress={(e) => e.key === 'Enter' && handleRegister()} />
              <div className="flex gap-3">
                <button onClick={() => setShowRegister(false)} className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">{t('login_cancel')}</button>
                <button onClick={handleRegister} className="flex-1 px-4 py-3 bg-[var(--theme-secondary)] text-white rounded-lg hover:brightness-110 transition shadow-lg shadow-[var(--theme-secondary)]/20">{t('register_submit')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {showRatingsPage ? (
          <div className="bg-[var(--theme-bg-dark-opacity)] rounded-2xl p-8 border border-[var(--theme-border-opacity)] backdrop-blur-sm">
            <h1 className="text-3xl font-bold mb-6 text-yellow-300">{t('ratings_title')}</h1>
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map(r => (
                  <div key={r.id} className="bg-gray-800/80 p-4 rounded-lg border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">{r.username}</span>
                      <div className="flex gap-1">{[1,2,3,4,5].map(s => <Star key={s} size={16} fill={r.rating >= s ? 'yellow' : 'none'} stroke={r.rating >= s ? 'yellow' : 'gray'} />)}</div>
                    </div>
                    <p className="text-gray-300 italic">"{r.comment}"</p>
                    <div className="mt-2 text-[10px] text-gray-500">{r.timestamp}</div>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-400">{t('ratings_empty')}</p>}
          </div>
        ) : showLanding ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
            <h1 className="text-6xl font-bold text-[var(--theme-text-light)] mb-4 animate-in fade-in slide-in-from-top-10 duration-700 tracking-tight">{t('landing_title')}</h1>
            <p className="text-2xl text-[var(--theme-accent)] mb-6 animate-in fade-in slide-in-from-top-8 duration-700 delay-100 font-medium">{t('landing_subtitle')}</p>
            <p className="text-lg text-[var(--theme-text-light)] max-w-2xl mb-10 animate-in fade-in slide-in-from-top-6 duration-700 delay-200 opacity-80 leading-relaxed">{t('landing_desc')}</p>
            <button onClick={() => setShowLanding(false)} className="px-10 py-5 rounded-xl bg-[var(--theme-accent)] text-[var(--theme-text-dark)] font-black text-xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-2xl shadow-[var(--theme-accent)]/30">
              <Wind size={28} /> {t('landing_start_now')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            <div className="space-y-6">
              <div className="bg-[var(--theme-bg-dark-opacity)] rounded-2xl p-5 border border-[var(--theme-border-opacity)] shadow-xl backdrop-blur-sm">
                <h3 className="font-semibold mb-4 text-[var(--theme-accent)] flex items-center gap-2"><Hexagon size={18}/> {t('editor_mode')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setMode('text')} className={`py-3 rounded-xl flex items-center justify-center gap-2 transition font-bold ${mode === 'text' ? 'bg-[var(--theme-primary)] text-white shadow-lg' : 'bg-white/5 hover:bg-white/10'}`}><Type size={20} /> {t('editor_mode_text')}</button>
                  <button onClick={() => setMode('shape')} className={`py-3 rounded-xl flex items-center justify-center gap-2 transition font-bold ${mode === 'shape' ? 'bg-[var(--theme-primary)] text-white shadow-lg' : 'bg-white/5 hover:bg-white/10'}`}><Hexagon size={20} /> {t('editor_mode_shape')}</button>
                </div>
              </div>

              <div className="bg-[var(--theme-bg-dark-opacity)] rounded-2xl p-5 border border-[var(--theme-border-opacity)] space-y-4 shadow-xl backdrop-blur-sm">
                <h3 className="font-semibold text-[var(--theme-accent)] flex items-center gap-2"><Settings2 size={18}/> {t('editor_step2')}</h3>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--theme-text-gray)] font-medium">{t('editor_caption')}</label>
                    <input 
                      type="text" 
                      value={resultCaption} 
                      onChange={(e) => setResultCaption(e.target.value)} 
                      className="w-full bg-black/40 border border-white/10 p-3 rounded-lg focus:ring-2 focus:ring-[var(--theme-primary)] outline-none transition text-sm" 
                      placeholder={t('editor_caption_placeholder')} 
                    />
                  </div>
                </div>

                {mode === 'text' ? (
                  <div className="space-y-4 border-t border-white/5 pt-4">
                    <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full bg-black/40 border border-white/10 p-3 rounded-lg focus:ring-2 focus:ring-[var(--theme-primary)] outline-none transition" rows={3} placeholder={t('editor_text_placeholder')} />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-[var(--theme-text-gray)]">{t('editor_font')}</label>
                        <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full bg-black/40 border border-white/10 p-2 rounded-lg text-sm outline-none">
                          {fonts.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-[var(--theme-text-gray)]">{t('editor_size')}</label>
                        <input type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full bg-black/40 border border-white/10 p-2 rounded-lg text-sm outline-none" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 border-t border-white/5 pt-4">
                    <label className="text-xs text-[var(--theme-text-gray)] font-medium">{t('editor_shape')}</label>
                    <select value={selectedShape} onChange={(e) => setSelectedShape(e.target.value)} className="w-full bg-black/40 border border-white/10 p-2 rounded-lg outline-none">
                      {shapes().map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[var(--theme-text-gray)] flex items-center gap-2 text-sm font-medium"><Grid size={16} /> {t('editor_pattern_toggle')}</label>
                    <button onClick={() => setUsePattern(!usePattern)} className={`w-12 h-6 rounded-full relative transition ${usePattern ? 'bg-[var(--theme-accent-3)]' : 'bg-gray-600'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${usePattern ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  {usePattern && (
                    <div className="space-y-3 p-3 bg-black/30 rounded-xl animate-in slide-in-from-top-2">
                      <input type="file" multiple accept="image/*" className="hidden" ref={patternInputRef} onChange={handlePatternUpload} />
                      <button onClick={() => patternInputRef.current?.click()} className="w-full py-2 bg-[var(--theme-accent)] text-[var(--theme-text-dark)] rounded-lg text-xs font-black flex items-center justify-center gap-2 hover:brightness-110 transition shadow-lg shadow-[var(--theme-accent)]/20">
                        <Images size={16} /> {t('editor_pattern_upload')}
                      </button>
                      {patternImages.length > 0 && (
                        <div className="grid grid-cols-5 gap-1">
                          {patternImages.map((src, idx) => (
                            <div key={idx} className="relative group aspect-square rounded-md overflow-hidden">
                              <img src={src} className="w-full h-full object-cover" />
                              <button onClick={() => setPatternImages(prev => prev.filter((_, i) => i !== idx))} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Trash2 size={12} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 flex justify-between uppercase tracking-wider">{t('editor_pattern_scale')} <span>{patternScale.toFixed(1)}x</span></label>
                        <input type="range" min="0.1" max="5" step="0.1" value={patternScale} onChange={(e) => setPatternScale(parseFloat(e.target.value))} className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--theme-accent)]" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t('editor_outline')}</span>
                    <button onClick={() => setAddOutline(!addOutline)} className={`w-12 h-6 rounded-full relative transition ${addOutline ? 'bg-green-500' : 'bg-gray-600'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${addOutline ? 'left-7' : 'left-1'}`} /></button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t('editor_shadow')}</span>
                    <button onClick={() => setAddShadow(!addShadow)} className={`w-12 h-6 rounded-full relative transition ${addShadow ? 'bg-green-500' : 'bg-gray-600'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${addShadow ? 'left-7' : 'left-1'}`} /></button>
                  </div>
                </div>
              </div>

              <button 
                onClick={generateImage} 
                disabled={isProcessing} 
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#ffd000] to-[#b671de] text-black font-black text-xl flex items-center justify-center gap-3 hover:shadow-2xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shadow-xl border-b-4 border-black/20"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : <Wind size={24} />} {isProcessing ? t('editor_processing') : t('editor_generate')}
              </button>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[var(--theme-bg-dark-opacity)] rounded-3xl p-6 border border-[var(--theme-border-opacity)] min-h-[550px] flex flex-col shadow-2xl backdrop-blur-md">
                <h3 className="font-semibold mb-6 text-[var(--theme-accent)] flex items-center gap-2"><ImageIcon size={18}/> {t('editor_preview')}</h3>
                
                <div className="flex-1 bg-black/40 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center border border-white/5 group shadow-inner">
                  <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden">
                    {!uploadedImage && !outputImage && !usePattern && (
                      <div className="text-center text-gray-600 animate-pulse">
                        <ImageIcon size={80} className="mx-auto mb-4 opacity-10" />
                        <p className="text-lg opacity-40">{t('editor_preview_placeholder')}</p>
                      </div>
                    )}
                    {uploadedImage && !outputImage && (
                      <img 
                        src={uploadedImage} 
                        onDoubleClick={handleImageDoubleClick} 
                        onMouseDown={handleImageMouseDown} 
                        className="max-w-full max-h-full select-none" 
                        style={{ 
                          transform: `translate(${imageX}px, ${imageY}px) scale(${imageScale}) rotate(${imageRotation}deg)`, 
                          cursor: isDragging ? 'grabbing' : 'grab',
                          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                        }} 
                      />
                    )}
                    {outputImage && <img src={outputImage} className="max-w-[90%] max-h-[90%] animate-in zoom-in-95 duration-500 shadow-2xl rounded-lg" />}
                    
                    {showImageControls && !outputImage && uploadedImage && (
                      <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 space-y-4 shadow-2xl z-20">
                        <div className="flex items-center gap-4">
                          <Minus size={14} className="opacity-50" />
                          <input type="range" min="0.1" max="5" step="0.1" value={imageScale} onChange={(e) => setImageScale(parseFloat(e.target.value))} className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--theme-accent)]" />
                          <Plus size={14} className="opacity-50" />
                        </div>
                        <div className="flex items-center gap-4">
                          <RotateCcw size={14} className="opacity-50 transform -scale-x-100" />
                          <input type="range" min="0" max="360" value={imageRotation} onChange={(e) => setImageRotation(parseInt(e.target.value))} className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--theme-primary)]" />
                          <RotateCcw size={14} className="opacity-50" />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium">
                          <span>{t('editor_controls_help')}</span>
                          <button onClick={resetImageTransform} className="text-[var(--theme-accent)] hover:underline uppercase tracking-widest">{t('editor_controls_reset')}</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="p-1 border-2 border-cyan-400/40 rounded-xl flex flex-wrap gap-2">
                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-4 bg-cyan-400 text-black rounded-lg font-black flex items-center justify-center gap-2 hover:brightness-110 transition shadow-lg"><Upload size={20} /> {t('editor_step1_upload')}</button>
                    <button onClick={handlePaste} className="flex-1 py-4 bg-[#546e7a] text-white rounded-lg font-black flex items-center justify-center gap-2 hover:brightness-110 transition shadow-lg"><Clipboard size={20} /> {t('editor_step1_paste')}</button>
                    <button onClick={() => setShowAiPrompt(!showAiPrompt)} className="flex-1 py-4 bg-[#6200ea] text-white rounded-lg font-black flex items-center justify-center gap-2 hover:brightness-110 transition shadow-lg"><Sparkles size={20} /> {t('ai_btn')}</button>
                  </div>

                  {resultCaption && outputImage && (
                    <div className="text-center py-4 text-cyan-400 font-bold text-xl drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-in fade-in slide-in-from-bottom-2">
                      {resultCaption}
                    </div>
                  )}

                  {showAiPrompt && (
                    <div className="p-5 bg-indigo-900/40 border border-indigo-500/30 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 shadow-inner">
                      <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 text-sm" rows={2} placeholder={t('ai_placeholder')} />
                      <button onClick={handleAiImageGeneration} disabled={isAiGenerating} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-xl">
                        {isAiGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />} {t('ai_submit')}
                      </button>
                    </div>
                  )}

                  {outputImage && (
                    <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4">
                      <button onClick={downloadImage} className="py-4 bg-[#00796b] text-white hover:brightness-110 rounded-xl font-black flex items-center justify-center gap-3 transition shadow-xl"><Download size={22} /> {t('editor_download')}</button>
                      <button onClick={copyToClipboard} className="py-4 bg-[#0288d1] text-white hover:brightness-110 rounded-xl font-black flex items-center justify-center gap-3 transition shadow-xl">{copied ? <Check size={22}/> : <Copy size={22}/>} {copied ? t('editor_copied') : t('editor_copy')}</button>
                    </div>
                  )}
                </div>
              </div>

              {history.length > 0 && (
                <div className="bg-[var(--theme-bg-dark-opacity)] rounded-3xl p-6 border border-[var(--theme-border-opacity)] shadow-xl backdrop-blur-sm">
                  <h3 className="font-semibold mb-4 text-[var(--theme-accent)] flex items-center gap-2"><Grid size={18}/> {t('editor_history')}</h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                    {history.map(item => (
                      <div key={item.id} className="min-w-[140px] max-w-[140px] group relative">
                        <div className="aspect-square bg-black/40 rounded-2xl overflow-hidden border border-white/10 cursor-pointer shadow-lg hover:shadow-cyan-500/20 transition-all" onClick={() => setOutputImage(item.image)}>
                          <img src={item.image} className="w-full h-full object-contain group-hover:scale-110 transition duration-500" />
                        </div>
                        <div className="mt-2 text-[10px] text-gray-500 font-bold uppercase tracking-tighter truncate text-center">{item.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- Chatbot UI --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {isChatOpen && (
          <div className="bg-gray-900 w-85 sm:w-96 h-[550px] border border-[var(--theme-primary)]/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 backdrop-blur-md">
            <div className="bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] p-5 flex justify-between items-center text-white shadow-xl">
              <span className="font-black flex items-center gap-3"><Bot size={22} /> {t('chat_title')}</span>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-2 rounded-xl transition"><Minimize2 size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin bg-[#0b0b14]/95">
              {chatMessages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-10">
                  <Bot size={64} className="mb-6" />
                  <p className="text-sm font-medium leading-relaxed">¿En qué puedo ayudarte hoy con tu diseño en Cenra Studio?</p>
                </div>
              )}
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-md leading-relaxed ${m.role === 'user' ? 'bg-[var(--theme-primary)] text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none border border-white/5'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center border border-white/5">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 bg-gray-900 border-t border-white/5 flex gap-3">
              <input 
                type="text" 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
                className="flex-1 bg-gray-800/50 border border-white/10 px-5 py-3 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[var(--theme-primary)] transition placeholder:opacity-50" 
                placeholder={t('chat_placeholder')} 
              />
              <button onClick={handleSendMessage} className="bg-[var(--theme-primary)] text-white p-3 rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[var(--theme-primary)]/20">
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)} 
          className={`w-16 h-16 rounded-3xl shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 ${isChatOpen ? 'bg-gray-800 rotate-90 rounded-full' : 'bg-[var(--theme-primary)] rounded-2xl'}`}
        >
          {isChatOpen ? <X size={28} /> : <MessageCircle size={32} className="text-white" />}
        </button>
      </div>

      <footer className="max-w-7xl mx-auto px-4 py-12 text-center text-xs text-gray-500 opacity-50 space-y-2 font-medium">
        <p>&copy; {new Date().getFullYear()} Cenra Studio. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
