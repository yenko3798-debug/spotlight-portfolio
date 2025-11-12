"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, CalendarDays, ClipboardList, Target, GraduationCap } from "lucide-react";

/* ─────────────────────────────────  PAGE  ───────────────────────────────── */
export default function SpanishProjectPage() {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white overflow-hidden">
      <Glow />
      <AnimatePresence>{!isReady && <LoadingOverlay />}</AnimatePresence>

      <Header />
      <Hero />

      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <StickyProgress>
          <HorizontalCards />
        </StickyProgress>
      </section>

      <Footer />
    </main>
  );
}

/* ─────────────────────────────  DECORATIVE GLOW  ─────────────────────────── */
function Glow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -top-24 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-fuchsia-500/25 blur-[140px]" />
      <div className="absolute top-1/2 right-0 h-[28rem] w-[28rem] translate-x-1/3 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-[120px]" />
    </div>
  );
}

/* ──────────────────────────────────  HEADER  ─────────────────────────────── */
function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/30">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <motion.span
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-500 shadow-lg shadow-fuchsia-500/20"
          >
            <Sparkles className="h-5 w-5" />
          </motion.span>
          <span className="font-semibold tracking-wide">Mi Rutina Diaria</span>
        </div>

        <a
          href="#slides"
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
        >
          View Slides
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </a>
      </div>
    </header>
  );
}

/* ───────────────────────────────────  HERO  ──────────────────────────────── */
function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-10 pt-24 md:px-8 md:pb-16 md:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center"
      >
        <h1 className="bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-6xl">
          Amr Okasha: <span className="whitespace-nowrap">Mi Rutina Diaria</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-sm text-white/70 md:text-base">
          My daily routine presentation
        </p>

        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 16, stiffness: 140, delay: 0.15 }}
          className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm"
        >
          Scroll to view presentation
          <span className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">➜</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────  STICKY PROGRESS  ─────────────────────────── */
function StickyProgress({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.3 });
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative">
      <motion.span
        style={{ width }}
        className="pointer-events-none fixed left-0 top-[60px] z-50 h-1 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500"
      />
      {children}
    </div>
  );
}

/* ─────────────────────────────  HORIZONTAL CARDS  ────────────────────────── */
/* Smooth scrolling: vertical wheel → horizontal glide; arrow keys; auto-snap */
function HorizontalCards() {
  const slides = useMemo(() => getSlides(), []);
  const scrollerRef = useRef(null);
  const [index, setIndex] = useState(0);

  // Eased horizontal scroll (smoother than native smooth)
  const smoothScrollTo = useCallback((container, targetLeft) => {
    const start = container.scrollLeft;
    const change = targetLeft - start;
    const duration = 420;
    const startTime = performance.now();
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const step = (now) => {
      const p = Math.min(1, (now - startTime) / duration);
      container.scrollLeft = start + change * ease(p);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  const goTo = useCallback(
    (i) => {
      const container = scrollerRef.current;
      if (!container) return;
      const clamped = Math.max(0, Math.min(i, slides.length - 1));
      const card = container.querySelectorAll("[data-slide-card='true']")[clamped];
      if (card) {
        const target = card.offsetLeft - container.offsetLeft;
        smoothScrollTo(container, target);
        setIndex(clamped);
      }
    },
    [slides.length, smoothScrollTo]
  );

  // Sync active index with scroll position
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const cards = Array.from(el.querySelectorAll("[data-slide-card='true']"));
      let nearest = 0;
      let best = Infinity;
      cards.forEach((c, i) => {
        const dx = Math.abs(c.offsetLeft - el.scrollLeft);
        if (dx < best) {
          best = dx;
          nearest = i;
        }
      });
      setIndex(nearest);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Translate vertical wheel to horizontal when hovering the carousel
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let wheelTimeout;
    const onWheel = (e) => {
      const canScrollHoriz = el.scrollWidth > el.clientWidth;
      if (!canScrollHoriz) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
        // Auto-snap to nearest after user stops scrolling
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          const cards = Array.from(el.querySelectorAll("[data-slide-card='true']"));
          let nearest = 0;
          let best = Infinity;
          cards.forEach((c, i) => {
            const dx = Math.abs(c.offsetLeft - el.scrollLeft);
            if (dx < best) {
              best = dx;
              nearest = i;
            }
          });
          goTo(nearest);
        }, 120);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goTo]);

  // Arrow keys (Left/Right or A/D)
  useEffect(() => {
    const onKey = (e) => {
      if (["ArrowRight", "KeyD"].includes(e.code)) {
        e.preventDefault();
        goTo(index + 1);
      } else if (["ArrowLeft", "KeyA"].includes(e.code)) {
        e.preventDefault();
        goTo(index - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, goTo]);

  return (
    <section id="slides" className="relative">
      <div
        ref={scrollerRef}
        className="no-scrollbar relative -mx-4 overflow-x-auto px-4 pb-24 pt-4 md:-mx-8 md:px-8"
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="Diapositivas de Mi Rutina Diaria"
      >
        <div className="flex snap-x snap-mandatory gap-6 md:gap-8">
          {slides.map((s, i) => (
            <SlideCard key={i} {...s} index={i} />
          ))}
        </div>
      </div>

      {/* index dots */}
      <div className="absolute inset-x-0 bottom-10 flex items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Ir a la diapositiva ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              index === i ? "bg-white/90" : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────  SLIDE CARD  ─────────────────────────────── */
function SlideCard({ time, title, text, tone = "violet", index = 0, emoji = "🕒" }) {
  const palette = {
    violet: "from-violet-500/30 to-fuchsia-500/30",
    cyan: "from-cyan-500/30 to-emerald-500/30",
    fuchsia: "from-fuchsia-500/30 to-pink-500/30",
    amber: "from-amber-400/30 to-orange-500/30",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ type: "spring", stiffness: 160, damping: 18, delay: index * 0.04 }}
      className="snap-center"
      data-slide-card="true"
    >
      <div className="group relative min-w-[85vw] max-w-[85vw] rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur md:min-w-[56vw] md:max-w-[56vw] md:p-8">
        <div className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br ${palette[tone]} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60`} />

        {/* header row: time chip + emoji */}
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80">
            {time}
          </span>
          <span className="text-2xl">{emoji}</span>
        </div>

        <h3 className="mt-3 text-xl font-semibold md:text-2xl">{title}</h3>

        {/* subtle divider instead of the big box */}
        <div className="mt-4 h-px w-full bg-gradient-to-r from-white/10 via-white/40 to-white/10" />

        {/* readable paragraph */}
        <p className="mt-5 max-w-prose text-[15.5px] leading-7 text-white/90">
          {text}
        </p>
      </div>
    </motion.article>
  );
}


/* ─────────────────────────────  SLIDES CONTENT  ─────────────────────────── */
/* Simple A2/A2+ sentences using your vocab only */
function getSlides() {
  return [
    {
      time: "6:30 a. m.",
      title: "Me despierto",
      text:
        "Me despierto a las seis y media y todavía tengo sueno. Me levanto despacio y apago la alarma del telefono. Me miro en el espejo para ver mi cara y me lavo un poco. Bebo agua en la manana, pero un poco toma un cafe. A mi no me gusta el cafe nada; no es bien para la selud, pero es bien para hacer el tarea. Yo preparo mi ropa para el día.",
      tone: "amber",
      emoji: "⏰",
    },
    {
      time: "6:40 a. m.",
      title: "Me ducho y me preparo",
      text:
        "Voy al bano y me ducho con agua caliente. Despues, me lavo la cara y me cepillo los dientes. Yo preparo rápido para no llegar tarde. Yo me visto con una chaqueta y unos pantalones; si tengo calor, me quito las ropas para el verano. Pongo las cosas para dejar el bano limpio.",
      tone: "violet",
      emoji: "🚿",
    },
    {
      time: "6:55 a. m.",
      title: "Desayuno simple",
      text:
        "Desayuno facil en la cocina, como pan o cereal. Despues de comer, mando un mensaje de texto a mi familia. Reviso mi mochila y guardo los utiles escolares que necesito. Antes de salir, miro el reloj para no voy tarde.",
      tone: "cyan",
      emoji: "🥣",
    },
    {
      time: "7:20 a. m.",
      title: "Salgo para la escuela",
      text:
        "Salgo de casa y voy a la escuela. A veces voy en carro y otras veces espero en el autobús. Cuando llego, subo y bajo las escaleras para ir a mi clase. saludo a mis amigos en el pasillo y me siento en mi silla al empiezo la clase.",
      tone: "fuchsia",
      emoji: "🚌",
    },
    {
      time: "8:20 a. m.",
      title: "Primera clase",
      text:
        "Vengo a la primera clase con mis materiales listos. Nosotros tenemos que escuchar al profesor, participar y tomar apuntes. Yo a veces oigo anuncios en el pasillo y la clase es silencio por un minuto. Me quedo en mi silla y trabajo para aprender.",
      tone: "amber",
      emoji: "📚",
    },
    {
      time: "10:45 a. m.",
      title: "Entre clases",
      text:
        "Camino por el pasillo de la escuela. Hablo un poco con mis amigos, pero no mucho para no llegar tarde. Guardo mis cuadernos y saco los libros para la proxima clase. Estoy preparado para continuar el día.",
      tone: "violet",
      emoji: "🏫",
    },
    {
      time: "12:00 p. m.",
      title: "Almuerzo",
      text:
        "Almuerzo con mis amigos en el patio de la escuela o en la cafetería. Comemos, conversamos y descansamos un poco. No tenemos nuestros telefonos. Después de comer, pongo la basura y regreso a mi clase.",
      tone: "cyan",
      emoji: "🥪",
    },
    {
      time: "1:20 p. m.",
      title: "Tarde en la escuela",
      text:
        "Voy a la clase y sigo con las clases. Tengo que leer, escribir y hacer actividades. Si hay tiempo, vemos un video corto o leemos un artículo. Yo trabajo  para terminar todo en clase y tengo menos tarea en mi casa.",
      tone: "fuchsia",
      emoji: "📝",
    },
    {
      time: "3:00 p. m.",
      title: "Voy a casa",
      text:
        "Me voy a casa por la tarde y descanso unos minutos. Ayudo en la cocina y preparo un bocadillo. Mando un mensaje de texto a mi madre. Despues, organizo mi escritorio para empezar la tarea.",
      tone: "amber",
      emoji: "🏠",
    },
    {
      time: "4:00 p. m.",
      title: "Hago la tarea",
      text:
        "Hago la tarea en mi dormitorio. Primero escribo las tareas mas importante y termino. Cuando termino, guardo los utiles escolares en mi mochila. Si no tengo mucha tarea, miro la televisionn un poco",
      tone: "violet",
      emoji: "🧑‍💻",
    },
    {
      time: "7:00 p. m.",
      title: "La noche",
      text:
        "Ceno con mi familia y hablamos. Despues, miro en el television o las noticias con ellos. A veces arreglo mi cuarto y pongo las cosas en. Me ducho, ejercicio y preparo la ropa para mañana.",
      tone: "cyan",
      emoji: "🍽️",
    },
    {
      time: "10:30 p. m.",
      title: "listo para dormir",
      text:
        "Me cepillo los dientes, me relajo y apago el teléfono. Me acuesto a las diez y media y trato de dormir rapido. Me quedo en casa si estoy enfermo para descansar y mejorar.",
      tone: " ",
      emoji: "🌙",
    },
  ];
}

/* ─────────────────────────────  LOADING  ─────────────────────────────────── */
function LoadingOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-[70] grid place-items-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="h-14 w-14 animate-pulse rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-500" />
        <p className="text-sm text-white/70">Cargando tu experiencia…</p>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────  FOOTER  ──────────────────────────────────── */
function Footer() {
  return (
    <footer className="mx-auto mt-10 max-w-7xl px-4 pb-16 pt-4 text-center text-xs text-white/50 md:px-8">
      Hecho con Next.js · Tailwind · Framer Motion
    </footer>
  );
}
