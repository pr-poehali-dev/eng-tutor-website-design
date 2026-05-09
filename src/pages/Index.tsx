import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const TUTOR_IMAGE = "https://cdn.poehali.dev/projects/b92bf928-8a76-4120-a776-95c7582ddd4b/files/21d6d3b9-c0ae-463d-a74a-27158608dc33.jpg";

/* ── Intersection Observer hook ── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { ref, visible };
}

/* ── Animated section wrapper ── */
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} id={id} className={`${className} ${visible ? "animate-fade-up" : "opacity-0"}`}>
      {children}
    </div>
  );
}

/* ── NAV ── */
function Nav() {
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

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link text-sm font-medium" style={{ color: "var(--dark)" }}>{l.label}</a>
          ))}
        </nav>

        <a href="#contact" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-105"
          style={{ background: "var(--indigo)" }}>
          Записаться
        </a>

        {/* Mobile burger */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Меню">
          <Icon name={open ? "X" : "Menu"} size={22} />
        </button>
      </div>

      {/* Mobile menu */}
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

/* ── HERO ── */
function Hero() {
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

/* ── ABOUT ── */
function About() {
  const { ref, visible } = useInView();
  return (
    <section id="about" className="py-24" style={{ background: "var(--dark)" }}>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div ref={ref} className={`${visible ? "animate-fade-up" : "opacity-0"}`}>
          <div className="section-divider mb-6" />
          <h2 className="mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "white", lineHeight: 1.15 }}>
            Обо мне
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.7)" }}>
            Меня зовут Анна. Я сертифицированный преподаватель английского языка с дипломом CELTA и 7 годами практики. Работала в Лондоне, преподаю онлайн ученикам из 15 стран.
          </p>
          <p className="text-lg leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.7)" }}>
            Мой подход — это индивидуальная программа под ваши цели: разговорный клуб, подготовка к IELTS / TOEFL, деловой английский или с нуля.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "GraduationCap", text: "CELTA Cambridge" },
              { icon: "Globe", text: "Жила в Лондоне 3 года" },
              { icon: "Star", text: "Рейтинг 4.9 / 5.0" },
              { icon: "Users", text: "Группы и индивидуально" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Icon name={f.icon as string} fallback="Star" size={18} style={{ color: "var(--indigo-light)" }} />
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${visible ? "animate-fade-up delay-300" : "opacity-0"} relative`}>
          <div className="quote-mark absolute -top-4 -left-2 select-none" style={{ opacity: 0.2, color: "var(--gold)" }}>"</div>
          <blockquote className="relative z-10 pl-8" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 300, color: "white", lineHeight: 1.5, fontStyle: "italic" }}>
            Язык — это не набор правил. Это живой инструмент, который открывает двери в любой точке мира.
          </blockquote>
          <div className="mt-8 pl-8 flex items-center gap-4">
            <img src={TUTOR_IMAGE} alt="Анна" className="w-12 h-12 rounded-full object-cover" style={{ border: "2px solid var(--gold)" }} />
            <div>
              <p className="font-semibold text-white">Анна</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Преподаватель английского</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── SERVICES ── */
const services = [
  { icon: "MessageCircle", title: "Разговорный английский", desc: "Практика живого общения. Темы, идиомы, произношение. Говорите уверенно уже с первых уроков.", tag: "Популярно" },
  { icon: "BookOpen", title: "Подготовка к IELTS / TOEFL", desc: "Системная подготовка к международным экзаменам. Разбор всех секций, тестовые работы, стратегии.", tag: "" },
  { icon: "Briefcase", title: "Деловой английский", desc: "Переписка, презентации, переговоры. Для специалистов и руководителей, работающих с иностранными партнёрами.", tag: "" },
  { icon: "Baby", title: "Английский с нуля", desc: "Мягкое и последовательное введение в язык. Для тех, кто только начинает или хочет восстановить базу.", tag: "" },
  { icon: "Laptop", title: "Онлайн-занятия", desc: "Zoom или Google Meet. Удобно, гибко, из любой точки мира. Все материалы в облаке.", tag: "" },
  { icon: "Users", title: "Мини-группы", desc: "До 4 человек. Экономия бюджета, живое взаимодействие и командная практика.", tag: "Новинка" },
];

function Services() {
  return (
    <section id="services" className="py-24" style={{ background: "var(--cream)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <Section className="text-center mb-16">
          <div className="section-divider mx-auto mb-6" />
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "var(--dark)" }}>
            Услуги
          </h2>
          <p className="mt-4 max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Выберите направление, которое подходит именно вам
          </p>
        </Section>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <Section key={s.title} className={`card-hover relative bg-white rounded-2xl p-7 delay-${i * 100}`} style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
              {s.tag && (
                <span className="absolute top-5 right-5 text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(61,90,153,0.12)", color: "var(--indigo)" }}>{s.tag}</span>
              )}
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(61,90,153,0.1)" }}>
                <Icon name={s.icon as string} fallback="Star" size={22} style={{ color: "var(--indigo)" }} />
              </div>
              <h3 className="font-semibold text-lg mb-3" style={{ color: "var(--dark)" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
            </Section>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── ADVANTAGES ── */
const advantages = [
  { num: "01", title: "Индивидуальная программа", desc: "Я разрабатываю учебный план лично под ваши цели, темп и стиль восприятия." },
  { num: "02", title: "Живой результат", desc: "Уже после 3–5 уроков вы замечаете прогресс. Никакой зубрёжки — только практика." },
  { num: "03", title: "Гибкое расписание", desc: "Занятия в удобное время: утро, вечер, выходные. Перенос урока без штрафов." },
  { num: "04", title: "Все материалы включены", desc: "Учебники, аудио, карточки, домашние задания — всё предоставляю бесплатно." },
];

function Advantages() {
  return (
    <section id="advantages" className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #2D3561 100%)" }}>
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto px-6">
        <Section className="text-center mb-16">
          <div className="section-divider mx-auto mb-6" />
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "white" }}>
            Почему выбирают меня
          </h2>
        </Section>

        <div className="grid md:grid-cols-2 gap-8">
          {advantages.map((a, i) => (
            <Section key={a.num} className={`flex gap-6 delay-${i * 100}`}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3rem", fontWeight: 300, color: "var(--gold)", opacity: 0.6, lineHeight: 1 }}>{a.num}</span>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-white">{a.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{a.desc}</p>
              </div>
            </Section>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── REVIEWS ── */
const reviews = [
  { name: "Мария К.", role: "Сдала IELTS 7.5", text: "За 4 месяца подготовки Анна помогла мне вырасти с 5.0 до 7.5. Чёткая система, отличные материалы и постоянная поддержка.", stars: 5 },
  { name: "Дмитрий В.", role: "Product Manager", text: "Начал с нулевого уровня. Через год веду переговоры с иностранными клиентами. Анна — лучший преподаватель, с которым я занимался.", stars: 5 },
  { name: "Елена Т.", role: "Студентка", text: "Занималась онлайн из другого города. Очень удобно и эффективно. Уже через 2 месяца начала смотреть сериалы без субтитров!", stars: 5 },
];

function Reviews() {
  return (
    <section id="reviews" className="py-24" style={{ background: "var(--cream)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <Section className="text-center mb-16">
          <div className="section-divider mx-auto mb-6" />
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "var(--dark)" }}>
            Отзывы учеников
          </h2>
        </Section>

        <div className="grid md:grid-cols-3 gap-7">
          {reviews.map((r, i) => (
            <Section key={r.name} className={`card-hover bg-white rounded-2xl p-8 relative delay-${i * 150}`} style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
              <div className="quote-mark absolute top-4 right-6 select-none" style={{ fontSize: "4rem", lineHeight: 1 }}>"</div>
              <div className="flex gap-1 mb-5">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <Icon key={j} name="Star" size={15} style={{ color: "var(--gold)", fill: "var(--gold)" }} />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>{r.text}</p>
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--dark)" }}>{r.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--indigo)" }}>{r.role}</p>
              </div>
            </Section>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PRICING ── */
const plans = [
  {
    name: "Старт",
    price: "1 500",
    unit: "/ урок",
    desc: "Идеально для знакомства",
    popular: false,
    features: [
      { text: "1 урок в неделю (60 мин)", ok: true },
      { text: "Индивидуальная программа", ok: true },
      { text: "Все учебные материалы", ok: true },
      { text: "Домашние задания", ok: true },
      { text: "Проверка домашних заданий", ok: false },
      { text: "Неограниченные вопросы в чат", ok: false },
    ],
    cta: "Выбрать",
  },
  {
    name: "Прогресс",
    price: "5 200",
    unit: "/ месяц",
    desc: "Самый популярный выбор",
    popular: true,
    features: [
      { text: "2 урока в неделю (60 мин)", ok: true },
      { text: "Индивидуальная программа", ok: true },
      { text: "Все учебные материалы", ok: true },
      { text: "Домашние задания", ok: true },
      { text: "Проверка домашних заданий", ok: true },
      { text: "Неограниченные вопросы в чат", ok: false },
    ],
    cta: "Записаться",
  },
  {
    name: "Интенсив",
    price: "8 900",
    unit: "/ месяц",
    desc: "Максимальный результат",
    popular: false,
    features: [
      { text: "3 урока в неделю (60 мин)", ok: true },
      { text: "Индивидуальная программа", ok: true },
      { text: "Все учебные материалы", ok: true },
      { text: "Домашние задания", ok: true },
      { text: "Проверка домашних заданий", ok: true },
      { text: "Неограниченные вопросы в чат", ok: true },
    ],
    cta: "Выбрать",
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-24" style={{ background: "#F0ECE6" }}>
      <div className="max-w-6xl mx-auto px-6">
        <Section className="text-center mb-16">
          <div className="section-divider mx-auto mb-6" />
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "var(--dark)" }}>
            Пакеты занятий и цены
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-sm" style={{ color: "var(--text-muted)" }}>
            Первый пробный урок — <strong style={{ color: "var(--indigo)" }}>бесплатно</strong>. Без обязательств.
          </p>
        </Section>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((p, i) => (
            <Section key={p.name} className={`relative flex flex-col rounded-2xl p-8 delay-${i * 150} ${p.popular ? "popular-ring bg-white" : "bg-white"}`}
              style={{ border: p.popular ? "none" : "1px solid rgba(0,0,0,0.08)" }}>
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold text-white"
                  style={{ background: "var(--indigo)" }}>Самый популярный</div>
              )}
              <div className="mb-6">
                <p className="font-semibold text-sm mb-1" style={{ color: "var(--text-muted)" }}>{p.name}</p>
                <div className="flex items-end gap-1 mb-1">
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.8rem", fontWeight: 500, color: "var(--dark)", lineHeight: 1 }}>{p.price} ₽</span>
                  <span className="text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>{p.unit}</span>
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{p.desc}</p>
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {p.features.map((f) => (
                  <li key={f.text} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: f.ok ? "rgba(61,90,153,0.12)" : "rgba(0,0,0,0.06)" }}>
                      <Icon name={f.ok ? "Check" : "Minus"} size={12} style={{ color: f.ok ? "var(--indigo)" : "#999" }} />
                    </div>
                    <span style={{ color: f.ok ? "var(--dark)" : "var(--text-muted)", opacity: f.ok ? 1 : 0.5 }}>{f.text}</span>
                  </li>
                ))}
              </ul>

              <a href="#contact"
                className={`w-full text-center py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105 block ${p.popular ? "text-white hover:opacity-90" : "border-2 hover:bg-gray-50"}`}
                style={p.popular
                  ? { background: "var(--indigo)", boxShadow: "0 6px 20px rgba(61,90,153,0.3)" }
                  : { borderColor: "var(--dark)", color: "var(--dark)" }}>
                {p.cta}
              </a>
            </Section>
          ))}
        </div>

        <Section className="mt-10 text-center">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            * Цены указаны в рублях. Возможна оплата по карте, СБП или переводом.
          </p>
        </Section>
      </div>
    </section>
  );
}

/* ── CONTACT FORM ── */
function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", goal: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section id="contact" className="py-24" style={{ background: "var(--dark)" }}>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
        <Section>
          <div className="section-divider mb-6" />
          <h2 className="mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "white", lineHeight: 1.15 }}>
            Запишитесь на<br />
            <em style={{ color: "var(--indigo-light)", fontStyle: "italic" }}>пробный урок</em>
          </h2>
          <p className="text-base leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.65)" }}>
            Оставьте заявку, и я свяжусь с вами в течение 2 часов. Первый урок — бесплатно, без обязательств.
          </p>

          <div className="space-y-5">
            {[
              { icon: "Phone", label: "+7 (999) 123-45-67" },
              { icon: "Mail", label: "anna@english.ru" },
              { icon: "MapPin", label: "Москва / Онлайн" },
              { icon: "Clock", label: "Пн–Вс: 9:00–21:00" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.08)" }}>
                  <Icon name={c.icon as string} fallback="Phone" size={18} style={{ color: "var(--indigo-light)" }} />
                </div>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>{c.label}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section className="delay-200">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ background: "rgba(61,90,153,0.2)" }}>
                <Icon name="CheckCircle" size={32} style={{ color: "var(--indigo-light)" }} />
              </div>
              <h3 className="text-xl font-semibold text-white">Заявка отправлена!</h3>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Я свяжусь с вами в ближайшее время.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: "name", label: "Ваше имя", type: "text", placeholder: "Иван Петров" },
                { name: "phone", label: "Телефон", type: "tel", placeholder: "+7 (999) 000-00-00" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>{f.label}</label>
                  <input
                    type={f.type}
                    name={f.name}
                    required
                    placeholder={f.placeholder}
                    value={form[f.name as keyof typeof form]}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "white" }}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>Цель обучения</label>
                <select
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none appearance-none"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: form.goal ? "white" : "rgba(255,255,255,0.4)" }}
                >
                  <option value="" disabled>Выберите цель</option>
                  <option value="travel" style={{ color: "#000" }}>Разговорный / путешествия</option>
                  <option value="ielts" style={{ color: "#000" }}>Подготовка к IELTS / TOEFL</option>
                  <option value="business" style={{ color: "#000" }}>Деловой английский</option>
                  <option value="zero" style={{ color: "#000" }}>С нуля</option>
                  <option value="other" style={{ color: "#000" }}>Другое</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>Комментарий</label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Расскажите о своём уровне и пожеланиях..."
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "white" }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] mt-2"
                style={{ background: "var(--indigo)", boxShadow: "0 8px 24px rgba(61,90,153,0.4)" }}
              >
                Записаться на пробный урок
              </button>
              <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
              </p>
            </form>
          )}
        </Section>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function Footer() {
  return (
    <footer className="py-8 text-center border-t" style={{ background: "#111122", borderColor: "rgba(255,255,255,0.06)" }}>
      <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
        © 2024 Anna.English — Репетитор английского языка · Москва / Онлайн
      </p>
    </footer>
  );
}

/* ── PAGE ── */
export default function Index() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Golos Text', sans-serif" }}>
      <Nav />
      <Hero />
      <About />
      <Services />
      <Advantages />
      <Reviews />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}