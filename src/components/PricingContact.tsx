import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Section } from "@/components/shared";

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

export function Pricing() {
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

export function Contact() {
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

export function Footer() {
  return (
    <footer className="py-8 text-center border-t" style={{ background: "#111122", borderColor: "rgba(255,255,255,0.06)" }}>
      <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
        © 2024 Anna.English — Репетитор английского языка · Москва / Онлайн
      </p>
    </footer>
  );
}
