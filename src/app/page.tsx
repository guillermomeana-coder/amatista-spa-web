"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import HoverImageReveal from "@/components/HoverImageReveal";
import SmoothScrollSlider from "@/components/SmoothScrollSlider";
import {
  Flower2,
  Sparkles,
  Gem,
  Eye,
  Brush,
  Zap,
  Palette,
  Heart,
  Star,
  MapPin,
  Phone,
  Clock,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

/* ───── Inline SVG icons ───── */
function InstaIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/* ───── Constants ───── */
const WA = "https://api.whatsapp.com/send/?phone=529844632344&text=Hola%20Amatista%2C%20me%20gustar%C3%ADa%20agendar%20una%20cita";
const WA_PKG = (p: string) => `https://api.whatsapp.com/send/?phone=529844632344&text=Hola%20Amatista%2C%20quiero%20reservar%20el%20paquete%20${encodeURIComponent(p)}`;
const IG = "https://www.instagram.com/amatistabeautyandspa";
const COORDS = { lat: 20.6318, lng: -87.0686 };

function getDirectionsUrl() {
  if (typeof navigator === "undefined") return `https://www.google.com/maps/dir/?api=1&destination=${COORDS.lat},${COORDS.lng}`;
  const ua = navigator.userAgent || "";
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return isIOS
    ? `maps://maps.apple.com/?daddr=${COORDS.lat},${COORDS.lng}&dirflg=d`
    : `https://www.google.com/maps/dir/?api=1&destination=${COORDS.lat},${COORDS.lng}`;
}

const NAV = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Galería", href: "#galeria" },
  { label: "Contacto", href: "#contacto" },
];

const SERVICES = [
  { icon: Flower2, name: "Masajes Relajantes", en: "Relaxing Massages", desc: "Relajá cuerpo y mente con nuestros masajes terapéuticos y descontracturantes.", descEn: "Relax body and mind with our therapeutic deep tissue massages.", price: "$800 MXN", img: "/images/spa-massage.jpg" },
  { icon: Sparkles, name: "Tratamientos Faciales", en: "Facial Treatments", desc: "Rejuvenecé tu piel con tratamientos personalizados de hidratación profunda.", descEn: "Rejuvenate your skin with personalized deep hydration treatments.", price: "$700 MXN", img: "/images/spa-facial.jpg" },
  { icon: Gem, name: "Manicure & Pedicure", en: "Manicure & Pedicure", desc: "Uñas perfectas con técnicas de vanguardia: Gel, Acrílico, Russian Manicure.", descEn: "Perfect nails with cutting-edge techniques: Gel, Acrylic, Russian Manicure.", price: "$550 MXN", img: "/images/spa-nails.jpg" },
  { icon: Eye, name: "Extensiones de Pestañas", en: "Lash Extensions", desc: "Mirada cautivadora con extensiones profesionales pelo por pelo.", descEn: "Captivating look with professional individual lash extensions.", price: "$600 MXN", img: "/images/spa-lashes.jpg" },
  { icon: Brush, name: "Diseño de Cejas", en: "Brow Design", desc: "Laminado, threading y diseño personalizado para enmarcar tu mirada.", descEn: "Lamination, threading and custom brow design to frame your look.", price: "$350 MXN", img: "/images/spa-brows.jpg" },
  { icon: Zap, name: "Depilación", en: "Hair Removal", desc: "Depilación definitiva y con cera, con tecnología avanzada y cuidado especial.", descEn: "Permanent and wax hair removal with advanced technology.", price: "$400 MXN", img: "/images/spa-waxing.jpg" },
  { icon: Palette, name: "Maquillaje Profesional", en: "Professional Makeup", desc: "Looks para cada ocasión: social, nupcial, editorial y artístico.", descEn: "Looks for every occasion: social, bridal, editorial and artistic.", price: "$900 MXN", img: "/images/spa-makeup.jpg" },
  { icon: Heart, name: "Tratamientos Corporales", en: "Body Treatments", desc: "Envolturas, exfoliaciones y tratamientos reductivos para tu bienestar.", descEn: "Body wraps, exfoliations and slimming treatments for your wellness.", price: "$800 MXN", img: "/images/real-buddha-stones.png" },
];

const PACKAGES = [
  { name: "Ritual Amatista", desc: "Masaje relajante + Facial hidratante + Manicure spa", descEn: "Relaxing massage + Hydrating facial + Spa manicure", price: "$2,200 MXN", usd: "~$125 USD", badge: "Most Popular", featured: true },
  { name: "Glow Total", desc: "Facial premium + Diseño de cejas + Extensiones de pestañas", descEn: "Premium facial + Brow design + Lash extensions", price: "$1,800 MXN", usd: "~$100 USD", badge: null, featured: false },
  { name: "Día de Reina", desc: "Masaje + Facial + Manicure + Pedicure + Maquillaje", descEn: "Massage + Facial + Manicure + Pedicure + Makeup", price: "$3,900 MXN", usd: "~$220 USD", badge: "Complete Experience", featured: false },
];

const TESTIMONIALS = [
  { en: "The best spa in Playa del Carmen. The atmosphere is incredible and the girls are super professional. My facial was a truly transformative experience.", es: "El mejor spa de Playa del Carmen. El ambiente es increíble y las chicas son super profesionales. Mi facial fue una experiencia transformadora.", author: "María G." },
  { en: "My nails have never looked this good. The Russian manicure they do here is next level. I don't go anywhere else anymore.", es: "Mis uñas nunca se vieron tan bien. El Russian manicure que hacen acá es de otro nivel. Ya no voy a ningún otro lugar.", author: "Ana L." },
  { en: "I came for a massage and left feeling completely renewed. The space transmits a unique peace. 100% recommended.", es: "Vine por un masaje y salí renovada. El espacio transmite una paz única. 100% recomendado.", author: "Sofía R." },
];

const EXPERIENCES = [
  { text: "MASAJES RELAJANTES", image: "/images/spa-massage.jpg", link: WA },
  { text: "TRATAMIENTOS FACIALES", image: "/images/spa-facial.jpg", link: WA },
  { text: "MANICURE & PEDICURE", image: "/images/spa-nails.jpg", link: WA },
  { text: "EXTENSIONES DE PESTAÑAS", image: "/images/spa-lashes.jpg", link: WA },
  { text: "MAQUILLAJE PROFESIONAL", image: "/images/spa-makeup.jpg", link: WA },
];

const SLIDER_IMAGES = [
  { src: "/images/real-fachada.jpg", alt: "Fachada Amatista Beauty & Spa" },
  { src: "/images/real-massage-room.png", alt: "Sala de Masajes" },
  { src: "/images/real-nail-station.png", alt: "Área de Uñas" },
  { src: "/images/real-geoda-logo.png", alt: "Geoda de Amatista" },
  { src: "/images/real-nail-wide.png", alt: "Nail Station" },
  { src: "/images/real-massage-front.png", alt: "Massage Room" },
  { src: "/images/real-reception-geoda.jpg", alt: "Recepción" },
  { src: "/images/real-buddha-stones.png", alt: "Hot Stones & Buddha" },
  { src: "/images/real-reception-logo.jpg", alt: "Logo Amatista" },
];

/* ───── Scroll reveal ───── */
function useReveal(sel: string) {
  useEffect(() => {
    const els = document.querySelectorAll(sel);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          gsap.fromTo(e.target, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sel]);
}

/* ═══════════════════ PAGE ═══════════════════ */
export default function Home() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hero = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!hero.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".hero-logo", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.2 })
      .fromTo(".hero-t", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, "-=0.6")
      .fromTo(".hero-s", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
      .fromTo(".hero-c", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");
  }, []);

  useReveal(".rv");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          gsap.fromTo(e.target.querySelectorAll(".sc"), { opacity: 0, y: 24, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.4)" });
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.1 }
    );
    const g = document.querySelector(".sg");
    if (g) obs.observe(g);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* ══ NAV ══ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">
          <a href="#inicio" className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Amatista Beauty & Spa" width={48} height={48} className="h-10 w-auto sm:h-12" priority />
            <div className="hidden sm:flex flex-col">
              <span className="font-heading text-lg font-semibold tracking-[0.15em] text-primary-dark">AMATISTA</span>
              <span className="text-[9px] tracking-[0.12em] text-accent font-body -mt-0.5">BELLEZA QUE TRANSMUTA</span>
            </div>
          </a>
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV.map((l) => <a key={l.href} href={l.href} className="text-sm font-body font-medium text-foreground/70 hover:text-primary transition-colors cursor-pointer">{l.label}</a>)}
            <a href={WA} target="_blank" rel="noopener noreferrer" className="ml-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-dark transition-colors cursor-pointer">Reservar Cita</a>
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-foreground cursor-pointer" aria-label="Menu">{open ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
        {open && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border px-4 py-4 flex flex-col gap-3">
            {NAV.map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-base font-body font-medium text-foreground/80 hover:text-primary py-2 cursor-pointer">{l.label}</a>)}
            <a href={WA} target="_blank" rel="noopener noreferrer" className="mt-2 px-5 py-3 bg-primary text-white text-center font-semibold rounded-full cursor-pointer">Reservar Cita</a>
          </div>
        )}
      </nav>

      {/* ══ HERO ══ */}
      <section id="inicio" ref={hero} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image src="/images/real-nail-station.png" alt="Interior Amatista Beauty & Spa Playa del Carmen" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/65 to-background/90" />
        </div>
        {/* Decorative elements */}
        <div className="absolute top-32 left-[15%] w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
        <div className="absolute top-48 right-[20%] w-1 h-1 bg-primary-light rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-[30%] w-2 h-2 bg-accent-light rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <div className="hero-logo mb-8 flex justify-center opacity-0">
            <Image src="/images/logo.png" alt="Amatista - Belleza que Transmuta" width={220} height={220} className="w-40 h-auto sm:w-52 md:w-56 drop-shadow-lg" priority />
          </div>
          <h1 className="hero-t font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-tight opacity-0">
            Belleza que <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Transmuta</span>
          </h1>
          <p className="hero-s mt-6 text-base sm:text-lg md:text-xl text-foreground/90 font-body font-light max-w-xl mx-auto leading-relaxed opacity-0">Tu santuario de bienestar en el corazón de Playa del Carmen</p>
          <p className="hero-s mt-2 text-sm sm:text-base text-foreground/60 font-body font-light opacity-0">Your beauty &amp; wellness sanctuary in the heart of Playa del Carmen</p>
          <div className="hero-c mt-10 flex flex-col sm:flex-row gap-4 justify-center opacity-0">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/25 cursor-pointer">Reservar Cita / Book Now</a>
            <a href="#servicios" className="px-8 py-3.5 border-2 border-white/30 text-foreground font-semibold rounded-full hover:bg-white/20 backdrop-blur-sm transition-all cursor-pointer">Ver Servicios / Services</a>
          </div>
          <div className="mt-12 flex justify-center"><div className="w-px h-16 bg-gradient-to-b from-accent/50 to-transparent" /></div>
        </div>
      </section>

      {/* ══ SERVICIOS ══ */}
      <section id="servicios" className="py-20 sm:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 rv">
            <span className="text-accent font-body text-sm font-semibold tracking-[0.2em] uppercase">Nuestros Servicios / Our Services</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mt-3">Experiencias de Transformación</h2>
            <p className="mt-4 text-foreground/65 font-body max-w-lg mx-auto">Cada tratamiento es un ritual diseñado para reconectarte con tu esencia</p>
            <p className="mt-1 text-foreground/50 font-body text-sm">Every treatment is a ritual designed to reconnect you with your essence</p>
          </div>
          <div className="sg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((s) => (
              <div key={s.name} className="sc group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer opacity-0">
                {/* Service image */}
                <div className="relative h-40 overflow-hidden">
                  {s.img ? (
                    <Image src={s.img} alt={`${s.name} - ${s.en}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-light/30 to-accent-light/20 flex items-center justify-center">
                      <s.icon size={36} className="text-primary/40" strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon size={18} className="text-primary" strokeWidth={1.5} />
                    <h3 className="font-heading text-base font-semibold text-foreground">{s.name}</h3>
                  </div>
                  <p className="text-xs text-foreground/40 font-body mb-2">{s.en}</p>
                  <p className="text-sm text-foreground/50 font-body leading-relaxed">{s.desc}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-accent">Desde {s.price}</span>
                    <a href={WA} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center gap-1 cursor-pointer">Agendar <ChevronRight size={14} /></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NOSOTROS ══ */}
      <section id="nosotros" className="py-20 sm:py-28 px-4 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="rv">
            <span className="text-accent font-body text-sm font-semibold tracking-[0.2em] uppercase">Sobre Amatista / About Us</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mt-3">Un espacio donde la belleza se transforma en <span className="text-primary">bienestar</span></h2>
            <p className="mt-6 text-foreground/60 font-body leading-relaxed">Amatista nació de la pasión por la belleza consciente y el bienestar integral. Inspirados en la piedra amatista, símbolo de transformación y equilibrio, creamos un espacio donde cada tratamiento es un ritual de conexión contigo misma.</p>
            <p className="mt-4 text-foreground/60 font-body leading-relaxed">En nuestro spa, ubicado en el vibrante corazón de Playa del Carmen, fusionamos técnicas profesionales de vanguardia con la energía sanadora del Caribe mexicano.</p>
            <p className="mt-4 text-foreground/55 font-body text-sm italic leading-relaxed">Amatista was born from a passion for conscious beauty and holistic wellness. Inspired by the amethyst stone, symbol of transformation and balance, we created a space where every treatment is a ritual of self-connection, blending cutting-edge techniques with the healing energy of the Mexican Caribbean.</p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { es: "Profesionales certificadas", en: "Certified professionals" },
                { es: "Productos premium seleccionados", en: "Premium selected products" },
                { es: "Ambiente de paz y armonía", en: "Peaceful & harmonious atmosphere" },
                { es: "Atención 100% personalizada", en: "100% personalized attention" },
              ].map((item) => (
                <div key={item.es} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Sparkles size={12} className="text-primary" /></div>
                  <div><span className="text-sm font-body text-foreground/70">{item.es}</span><span className="block text-xs font-body text-foreground/40">{item.en}</span></div>
                </div>
              ))}
            </div>
          </div>
          {/* Real spa photo */}
          <div className="rv relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
              <Image src="/images/real-massage-room.png" alt="Sala de masajes Amatista Beauty & Spa Playa del Carmen" fill className="object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-accent/20 -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-xl bg-primary/10 -z-10" />
            {/* Logo overlay */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
              <Image src="/images/logo.png" alt="Amatista" width={80} height={80} className="w-16 h-auto" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ EXPERIENCIAS — HoverImageReveal ══ */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-background to-muted/30 hidden md:block">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 rv">
            <span className="text-accent font-body text-sm font-semibold tracking-[0.2em] uppercase">Experiencias / Experiences</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mt-3">Descubrí tu tratamiento</h2>
            <p className="mt-2 text-foreground/55 font-body text-sm">Hover to discover your treatment</p>
          </div>
          <HoverImageReveal
            items={EXPERIENCES}
            textColor="var(--foreground)"
            dimColor="var(--secondary)"
            accentColor="var(--primary)"
            fontSize="clamp(1.8rem, 4vw, 3.5rem)"
            imageWidth={300}
            imageHeight={400}
            rounded={20}
            offsetX={250}
            offsetY={-30}
            followStrength={4}
          />
        </div>
      </section>

      {/* ══ GALERÍA — SmoothScrollSlider ══ */}
      <section id="galeria" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 rv">
            <span className="text-accent font-body text-sm font-semibold tracking-[0.2em] uppercase">Galería / Gallery</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mt-3">Nuestro Espacio / Our Space</h2>
            <p className="mt-3 text-foreground/55 font-body text-sm">Scroll or drag to explore</p>
          </div>
        </div>
        <div className="h-[400px] sm:h-[520px]">
          <SmoothScrollSlider
            images={SLIDER_IMAGES}
            slideWidth={340}
            slideHeight={440}
            spacing={2}
            direction="right"
            smoothness={10}
            radius={20}
            dim={8}
            background="transparent"
            sensitivity={5}
            loop
          />
        </div>
      </section>

      {/* ══ TESTIMONIOS ══ */}
      <section className="py-20 sm:py-28 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 rv">
            <span className="text-accent font-body text-sm font-semibold tracking-[0.2em] uppercase">Testimonios / Reviews</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mt-3">Lo que dicen nuestras clientas</h2>
            <p className="mt-2 text-foreground/55 font-body text-sm">What our clients say</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="rv bg-card rounded-2xl p-6 sm:p-8 border border-border hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-accent fill-accent" />)}</div>
                <p className="text-foreground/70 font-body text-sm leading-relaxed italic">&ldquo;{t.en}&rdquo;</p>
                <p className="mt-2 text-foreground/40 font-body text-xs leading-relaxed italic">&ldquo;{t.es}&rdquo;</p>
                <p className="mt-4 font-heading font-semibold text-foreground text-sm">{t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PAQUETES ══ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 rv">
            <span className="text-accent font-body text-sm font-semibold tracking-[0.2em] uppercase">Paquetes / Special Packages</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mt-3">Experiencias Completas</h2>
            <p className="mt-4 text-foreground/65 font-body max-w-lg mx-auto">Combina nuestros mejores tratamientos y ahorra</p>
            <p className="mt-1 text-foreground/50 font-body text-sm">Combine our best treatments and save</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PACKAGES.map((p) => (
              <div key={p.name} className={`rv bg-card rounded-2xl p-6 sm:p-8 border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${p.featured ? "border-accent shadow-lg shadow-accent/10" : "border-border hover:border-primary/30"} relative`}>
                {p.badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">{p.badge}</span>}
                <h3 className="font-heading text-xl font-semibold text-foreground mt-2">{p.name}</h3>
                <p className="mt-3 text-sm text-foreground/50 font-body leading-relaxed">{p.desc}</p>
                <p className="mt-1 text-xs text-foreground/35 font-body">{p.descEn}</p>
                <p className="mt-6 font-heading text-3xl font-bold text-primary">{p.price}</p>
                <p className="text-xs text-foreground/40 font-body">{p.usd}</p>
                <a href={WA_PKG(p.name)} target="_blank" rel="noopener noreferrer" className={`mt-6 block text-center py-3 rounded-full font-semibold text-sm transition-all cursor-pointer ${p.featured ? "bg-primary text-white hover:bg-primary-dark" : "bg-primary/10 text-primary hover:bg-primary/20"}`}>Reservar / Book Now</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACTO + MAPS ══ */}
      <section id="contacto" className="py-20 sm:py-28 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 rv">
            <span className="text-accent font-body text-sm font-semibold tracking-[0.2em] uppercase">Contacto / Contact</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mt-3">Visitanos / Visit Us</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rv rounded-2xl overflow-hidden border border-border h-[300px] sm:h-[400px]">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3733.5!2d-87.0686!3d20.6318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDM3JzU0LjUiTiA4N8KwMDQnMDcuMCJX!5e0!3m2!1ses!2smx!4v1" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Amatista Beauty & Spa - Playa del Carmen" />
            </div>
            <div className="rv flex flex-col justify-center gap-6 sm:gap-8">
              {[
                { icon: MapPin, title: "Dirección / Address", content: <p className="text-sm text-foreground/60 font-body mt-1">Entre calles 26 y 28 Nte, Col. Gonzalo Guerrero<br />Playa del Carmen, Q.R. 77710, México</p> },
                { icon: Phone, title: "WhatsApp", content: <a href={WA} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-dark font-body mt-1 block cursor-pointer">+52 984 463 2344</a> },
                { icon: InstaIcon, title: "Instagram", content: <a href={IG} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-dark font-body mt-1 block cursor-pointer">@amatistabeautyandspa</a> },
                { icon: Clock, title: "Horario / Hours", content: <p className="text-sm text-foreground/60 font-body mt-1">Lunes a Sábado / Mon-Sat: 9:00 AM - 7:00 PM</p> },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><item.icon size={20} className="text-primary" /></div>
                  <div><h4 className="font-heading font-semibold text-foreground">{item.title}</h4>{item.content}</div>
                </div>
              ))}
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button onClick={() => window.open(getDirectionsUrl(), "_blank")} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all cursor-pointer font-semibold text-sm">
                  <MapPin size={18} /> Cómo Llegar / Get Directions
                </button>
                <a href={`https://www.google.com/maps/search/Amatista+Beauty+Spa+Playa+del+Carmen/@${COORDS.lat},${COORDS.lng},17z`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-border rounded-xl hover:shadow-md transition-all cursor-pointer text-sm font-semibold text-foreground/70">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#4285F4"/></svg>
                  Ver en Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="bg-foreground text-white/80 py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/images/logo.png" alt="Amatista" width={48} height={48} className="w-12 h-auto brightness-0 invert opacity-80" loading="lazy" />
                <div>
                  <span className="font-heading text-xl font-semibold tracking-[0.15em] text-white">AMATISTA</span>
                  <p className="text-[9px] tracking-[0.12em] text-accent-light -mt-0.5">BELLEZA QUE TRANSMUTA</p>
                </div>
              </div>
              <p className="text-sm text-white/50 font-body leading-relaxed">Tu santuario de belleza y bienestar en el corazón de Playa del Carmen.</p>
              <p className="mt-1 text-xs text-white/30 font-body">Your beauty &amp; wellness sanctuary in the heart of Playa del Carmen.</p>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white mb-4">Enlaces / Links</h4>
              <div className="flex flex-col gap-2">{NAV.map((l) => <a key={l.href} href={l.href} className="text-sm text-white/50 hover:text-accent transition-colors font-body cursor-pointer">{l.label}</a>)}</div>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white mb-4">Contacto / Contact</h4>
              <div className="flex flex-col gap-2 text-sm text-white/50 font-body">
                <p>Entre calles 26 y 28 Nte, Gonzalo Guerrero</p>
                <p>Playa del Carmen, Q.R. 77710</p>
                <a href={WA} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors cursor-pointer">+52 984 463 2344</a>
                <a href={IG} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors cursor-pointer flex items-center gap-2"><InstaIcon size={16} /> @amatistabeautyandspa</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/30 font-body">
            <p>&copy; 2026 Amatista Beauty &amp; Spa. Todos los derechos reservados.</p>
            <p>Belleza que Transmuta ✦ Playa del Carmen, México</p>
          </div>
        </div>
      </footer>

      {/* ══ WA FLOAT ══ */}
      <a href={WA} target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="Contact via WhatsApp">
        <svg viewBox="0 0 32 32" width="32" height="32" fill="white">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.91 15.91 0 0016.004 32C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0zm9.302 22.602c-.39 1.1-1.932 2.014-3.166 2.28-.846.18-1.95.322-5.67-1.218-4.762-1.97-7.826-6.798-8.064-7.114-.23-.316-1.912-2.55-1.912-4.862s1.21-3.448 1.64-3.922c.39-.432.918-.606 1.2-.606.15 0 .282.008.402.014.432.018.648.042.934.724.356.854 1.224 2.982 1.33 3.2.108.216.18.468.036.754-.136.29-.204.47-.408.724-.204.252-.428.564-.612.756-.204.216-.418.45-.18.882.238.432 1.06 1.746 2.274 2.828 1.562 1.392 2.876 1.824 3.286 2.028.324.162.71.132.958-.12.314-.324.702-.86 1.098-1.39.282-.378.638-.426.992-.282.358.136 2.268 1.068 2.656 1.264.39.196.648.294.744.456.094.162.094.936-.296 2.036z"/>
        </svg>
      </a>
    </>
  );
}
