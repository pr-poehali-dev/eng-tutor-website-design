import { useState, useEffect, useRef } from "react";

export const TUTOR_IMAGE = "https://cdn.poehali.dev/projects/b92bf928-8a76-4120-a776-95c7582ddd4b/files/21d6d3b9-c0ae-463d-a74a-27158608dc33.jpg";

export function useInView(threshold = 0.15) {
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

export function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} id={id} className={`${className} ${visible ? "animate-fade-up" : "opacity-0"}`}>
      {children}
    </div>
  );
}
