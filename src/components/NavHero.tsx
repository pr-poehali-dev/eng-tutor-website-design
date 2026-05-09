import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { TUTOR_IMAGE } from "@/components/shared";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { href: "#about", label: "Обо мне" },
    { href: "#services", label: "Услуги" },
    { href: "#advantages", label: "Преимущества" },
    { href: "#reviews", label: "Отзывы" },
    { href: "#pricing", label: "Цены" },
    { href: "#contact", label: "Контакты" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#F7F3EE]/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
        <a href="#hero" className="font-serif text-xl font-medium tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--dark)" }}>
          Anna<span style={{ color: "var(--indigo)" }}>.</span>English
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link text-sm font-medium" style={{ color: "var(--dark)" }}>{l.label}</a>
          ))}
        </nav>

        <a href="#contact" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-105"
          style={{ background: "var(--indigo)" }}>
          Записаться
        </a>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Меню">
          <Icon name={open ? "X" : "Menu"} size={22} />
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4" style={{ background: "var(--cream)" }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-base font-medium py-1 border-b border-gray-100" style={{ color: "var(--dark)" }}
              onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a href="#contact" className="mt-2 text-center px-5 py-3 rounded-full text-sm font-semibold text-white"
            style={{ background: "var(--indigo)" }} onClick={() => setOpen(false)}>Записаться</a>
        </div>
      )}
    </header>
  );
}

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden noise-bg pt-20" style={{ background: "var(--cream)" }}>
      <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--indigo-light) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ background: "rgba(61,90,153,0.1)", color: "var(--indigo)" }}>
            🎓 Репетитор английского языка
          </div>

          <h1 className="animate-fade-up delay-100 leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.6rem,6vw,4.2rem)", fontWeight: 400, color: "var(--dark)", lineHeight: 1.1 }}>
            Говорите по-английски<br />
            <em style={{ color: "var(--indigo)", fontStyle: "italic" }}>с удовольствием</em>
          </h1>

          <p className="animate-fade-up delay-200 text-lg leading-relaxed mb-10 max-w-md" style={{ color: "var(--text-muted)" }}>
            Индивидуальные занятия онлайн и офлайн. Любой уровень. Первый урок — бесплатно.
          </p>

          <div className="animate-fade-up delay-300 flex flex-wrap gap-4">
            <a href="#contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-105 shadow-lg"
              style={{ background: "var(--indigo)", boxShadow: "0 8px 24px rgba(61,90,153,0.35)" }}>
              Записаться на пробный урок
              <Icon name="ArrowRight" size={18} />
            </a>
            <a href="#pricing" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold border-2 transition-all duration-200 hover:scale-105"
              style={{ borderColor: "var(--dark)", color: "var(--dark)" }}>
              Узнать цены
            </a>
          </div>

          <div className="animate-fade-up delay-400 flex gap-8 mt-12">
            {[
              { num: "7+", label: "лет опыта" },
              { num: "200+", label: "учеников" },
              { num: "95%", label: "достигли цели" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--indigo)" }}>{s.num}</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-scale-in delay-300 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: "4/5" }}>
            <img src={TUTOR_IMAGE} alt="Репетитор" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 60%, rgba(26,26,46,0.4) 100%)" }} />
          </div>
          <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">🇬🇧</span>
            <div>
              <p className="font-semibold text-sm" style={{ color: "var(--dark)" }}>Кембриджский сертификат</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>CELTA + CPE</p>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {["🧑‍🎓","👩‍💼","👨‍💻"].map((e,i) => <span key={i} className="text-lg">{e}</span>)}
            </div>
            <div>
              <p className="font-semibold text-xs" style={{ color: "var(--dark)" }}>Новые ученики</p>
              <p className="text-xs" style={{ color: "var(--indigo)" }}>+12 в этом месяце</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
