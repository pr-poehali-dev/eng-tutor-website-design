import Icon from "@/components/ui/icon";
import { Section, useInView, TUTOR_IMAGE } from "@/components/shared";

export function About() {
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

const services = [
  { icon: "MessageCircle", title: "Разговорный английский", desc: "Практика живого общения. Темы, идиомы, произношение. Говорите уверенно уже с первых уроков.", tag: "Популярно" },
  { icon: "BookOpen", title: "Подготовка к IELTS / TOEFL", desc: "Системная подготовка к международным экзаменам. Разбор всех секций, тестовые работы, стратегии.", tag: "" },
  { icon: "Briefcase", title: "Деловой английский", desc: "Переписка, презентации, переговоры. Для специалистов и руководителей, работающих с иностранными партнёрами.", tag: "" },
  { icon: "Baby", title: "Английский с нуля", desc: "Мягкое и последовательное введение в язык. Для тех, кто только начинает или хочет восстановить базу.", tag: "" },
  { icon: "Laptop", title: "Онлайн-занятия", desc: "Zoom или Google Meet. Удобно, гибко, из любой точки мира. Все материалы в облаке.", tag: "" },
  { icon: "Users", title: "Мини-группы", desc: "До 4 человек. Экономия бюджета, живое взаимодействие и командная практика.", tag: "Новинка" },
];

export function Services() {
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

const advantages = [
  { num: "01", title: "Индивидуальная программа", desc: "Я разрабатываю учебный план лично под ваши цели, темп и стиль восприятия." },
  { num: "02", title: "Живой результат", desc: "Уже после 3–5 уроков вы замечаете прогресс. Никакой зубрёжки — только практика." },
  { num: "03", title: "Гибкое расписание", desc: "Занятия в удобное время: утро, вечер, выходные. Перенос урока без штрафов." },
  { num: "04", title: "Все материалы включены", desc: "Учебники, аудио, карточки, домашние задания — всё предоставляю бесплатно." },
];

export function Advantages() {
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

const reviews = [
  { name: "Мария К.", role: "Сдала IELTS 7.5", text: "За 4 месяца подготовки Анна помогла мне вырасти с 5.0 до 7.5. Чёткая система, отличные материалы и постоянная поддержка.", stars: 5 },
  { name: "Дмитрий В.", role: "Product Manager", text: "Начал с нулевого уровня. Через год веду переговоры с иностранными клиентами. Анна — лучший преподаватель, с которым я занимался.", stars: 5 },
  { name: "Елена Т.", role: "Студентка", text: "Занималась онлайн из другого города. Очень удобно и эффективно. Уже через 2 месяца начала смотреть сериалы без субтитров!", stars: 5 },
];

export function Reviews() {
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
