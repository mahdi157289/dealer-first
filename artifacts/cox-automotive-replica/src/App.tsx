import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { CalendarClock, Eye, FileCheck, Mail, Phone, Zap } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initHomeAnimations } from '@/animations/home-intro';
import { initSectionEntry } from '@/animations/section-entry';
import gsap from 'gsap';
import { ServicesDropdown } from '@/components/services-dropdown';

const queryClient = new QueryClient();
const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL;
const asset = (name: string) => `${base}/images/${name}`;

type Route = '/' | '/about-us' | '/services' | '/process' | '/testimonials' | '/contact' | '/privacy' | '/privacy-policy' | '/sms-terms';
const routes: { label: string; path: Route }[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about-us' },
  { label: 'Services', path: '/services' },
  { label: 'Process', path: '/process' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'Contact', path: '/contact' },
];
const legalRoutes: { label: string; path: Route }[] = [
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'SMS Terms & Conditions', path: '/sms-terms' },
];

function pathFromLocation() {
  const raw = window.location.pathname.replace(/\/+$/, '') || '/';
  const withoutBase = base && base !== '/' && raw.startsWith(base) ? raw.slice(base.length) || '/' : raw;
  return ([...routes, ...legalRoutes, { path: '/privacy-policy' }].some((route) => route.path === withoutBase) ? withoutBase : '/') as Route;
}

function SiteLink({ href, children, className = '', onNavigate, ariaCurrent }: { href: Route; children: ReactNode; className?: string; onNavigate: (path: Route) => void; ariaCurrent?: 'page' }) {
  return <a className={className} href={`${base}${href === '/' ? '/' : href}`} aria-current={ariaCurrent} onClick={(event) => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); onNavigate(href); } }}>{children}</a>;
}

function Logo({ onNavigate, src = 'words-wize-global-logo.jpg' }: { onNavigate: (path: Route) => void; src?: string }) {
  return <SiteLink href="/" onNavigate={onNavigate} className="logo-lockup" aria-label="Words Wize Global home">
    <img className="brand-logo" src={asset(src)} alt="Words Wize Global" />
  </SiteLink>;
}

function Header({ active, onNavigate }: { active: Route; onNavigate: (path: Route) => void }) {
  const [mobile, setMobile] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScroll = useRef(0);
  const navigate = (path: Route) => { onNavigate(path); setMobile(false); setServicesOpen(false); if (hoverTimer.current) { clearTimeout(hoverTimer.current); hoverTimer.current = null; } };
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 140 && y > lastScroll.current) setHidden(true);
      else if (y < lastScroll.current) { setHidden(false); setMobile(false); }
      lastScroll.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const taglineCopies = Array.from({ length: 16 }, (_unused, index) => <span key={index} className="announcement-item"><strong>Words Wize Global / translate every word.</strong><span>Clear communication in any language.</span></span>);
  return <>
    <div className="announcement"><div className="announcement-scroll"><div className="announcement-track">{taglineCopies}</div></div><span className="announcement-divider" aria-hidden="true"></span><div className="announcement-contacts"><a href="mailto:hello@wordswize.global"><Mail size={12} />hello@wordswize.global</a><a href="tel:13178365808"><Phone size={12} />+1 317-836-5808</a></div></div>
    <header className={`header ${hidden ? 'header-hidden' : ''}`}>
      <nav className={`nav ${mobile ? 'mobile-open' : ''}`} aria-label="Primary navigation">
        <div className="nav-left"><Logo onNavigate={navigate} /><div className="nav-links">{routes.map((item) => item.path === '/services' ? (
          <ServicesDropdown active={active} open={servicesOpen} onOpenChange={setServicesOpen} onNavigate={onNavigate} />
        ) : (
          <SiteLink key={item.path} href={item.path} onNavigate={navigate} className={active === item.path ? 'active' : ''} ariaCurrent={active === item.path ? 'page' : undefined}>{item.label}</SiteLink>
        ))}</div></div>
        <div className="nav-right"><SiteLink className="button header-cta" href="/contact" onNavigate={navigate}>Start a conversation</SiteLink><button className="mobile-toggle" type="button" aria-expanded={mobile} onClick={() => setMobile(!mobile)}>{mobile ? 'Close menu' : 'Menu'}</button></div>
      </nav>
    </header>
  </>;
}

function PageHero({ eyebrow, title, intro, image, children, tone = 'dark' }: { eyebrow: string; title: ReactNode; intro: string; image: string; children?: ReactNode; tone?: 'dark' | 'light' }) {
  return <section className={`page-hero ${tone}`} style={{ backgroundImage: `linear-gradient(90deg, ${tone === 'dark' ? 'rgba(0,42,96,.97)' : 'rgba(246,248,251,.95)' } 12%, ${tone === 'dark' ? 'rgba(0,42,96,.74)' : 'rgba(246,248,251,.73)'} 61%, transparent 100%), url("${asset(image)}")` }}>
    <div className="container page-hero-inner"><div className="hero-kicker">{eyebrow}</div><h1>{title}</h1><p>{intro}</p>{children}</div>
    <div className="page-hero-index">Words Wize Global / {eyebrow}</div>
  </section>;
}

function SectionIntro({ eyebrow, title, copy, action }: { eyebrow: string; title: ReactNode; copy?: string; action?: ReactNode }) {
  return <div className="section-intro"><div><div className="eyebrow">{eyebrow}</div><h2 className="section-title">{title}</h2></div>{copy && <div className="intro-side"><p className="section-copy">{copy}</p>{action}</div>}</div>;
}

function ImageBand({ image, label, title, copy, flip = false }: { image: string; label: string; title: string; copy: string; flip?: boolean }) {
  return <section className={`image-band ${flip ? 'flip' : ''}`}><div className="image-band-image"><img src={asset(image)} alt={title} /></div><div className="image-band-copy"><div className="eyebrow">{label}</div><h2>{title}</h2><p>{copy}</p></div></section>;
}

function Counter({ to, prefix = '' }: { to: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = new Intl.NumberFormat('en-US');
    const duration = 1400;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = `${prefix}${fmt.format(Math.round(to * eased))}`;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, prefix]);
  return <span ref={ref}>{`${prefix}0`}</span>;
}

type StatTokens = { prefix: string; decimals: number; value: number; suffix: string } | null;

function parseStat(raw: string): StatTokens {
  const m = /^([^\d]*)([\d.,]+)([A-Za-z%]*)$/.exec(raw);
  if (!m) return null;
  const decimals = (m[2].split('.')[1] || '').length;
  return { prefix: m[1], decimals, value: parseFloat(m[2].replace(/,/g, '')), suffix: m[3] };
}

function StatNumber({ raw, animate }: { raw: string; animate: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tokens = parseStat(raw);
    if (!tokens) { el.textContent = raw; return; }
    const fmt = (v: number) => tokens.decimals > 0 ? v.toFixed(tokens.decimals) : new Intl.NumberFormat('en-US').format(Math.round(v));
    if (!animate) { el.textContent = `${tokens.prefix}${fmt(0)}${tokens.suffix}`; return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = `${tokens.prefix}${fmt(tokens.value)}${tokens.suffix}`; return; }
    const duration = 1400;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = `${tokens.prefix}${fmt(tokens.value * eased)}${tokens.suffix}`;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [raw, animate]);
  return <strong ref={ref} />;
}

function StatCell({ raw, label }: { raw: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    if (animate) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setAnimate(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setAnimate(true); io.disconnect(); }
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [animate]);
  return <div ref={ref}><StatNumber raw={raw} animate={animate} /><span>{label}</span></div>;
}

function Home({ onNavigate }: { onNavigate: (path: Route) => void }) {
  const homeRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = homeRef.current;
    if (!el) return;
    const ctx = initHomeAnimations(el);
    return () => ctx.revert();
  }, []);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const cue = document.querySelector<HTMLElement>('.hero-scroll');
        if (cue) cue.classList.toggle('faded', window.scrollY > 48);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return <><div ref={homeRef}>
    <section className="hero">
      <span className="hero-bg" style={{ backgroundImage: `url("${asset('hero-workstation.jpg')}")` }} aria-hidden="true" />
      <div className="hero-inner"><div className="hero-kicker">Translate every word.</div><h1>YOUR DOCUMENTS.<br /><em>TRANSLATED WITH PRECISION.</em></h1><p className="hero-intro">Words Wize Global provides certified document translation, interpretation, and localization for individuals and businesses across the United States.</p><div className="hero-actions"><SiteLink className="button" href="/contact" onNavigate={onNavigate}>Request a Free Translation Quote</SiteLink><SiteLink className="text-link hero-link" href="/services" onNavigate={onNavigate}>Explore our services</SiteLink></div><p className="hero-trust">Certified · Multilingual · Delivery on time</p></div>
      <div className="hero-proof">
        <div className="hero-eyebrow">Results / tracked</div>
        <div className="hero-stats"><div className="hero-stat"><Counter to={12450} /><span>Documents translated</span></div><div className="hero-stat"><Counter to={87} /><span>Languages supported</span></div><div className="hero-stat"><Counter to={2100} /><span>Clients served</span></div></div>
        <div className="hero-caption">Words Wize Global / Indianapolis, IN</div>
      </div>
      <div className="hero-scroll" aria-hidden="true"><span>Scroll</span><i></i></div>
    </section>
    <section className="trust-row"><div className="container trust-inner"><span className="trust-label">The work behind clear communication</span><div className="trust-items"><span className="trust-item"><span className="trust-chip"><Zap aria-hidden="true" /></span>Document translation</span><span className="trust-item"><span className="trust-chip"><CalendarClock aria-hidden="true" /></span>Interpretation</span><span className="trust-item"><span className="trust-chip"><FileCheck aria-hidden="true" /></span>Certification</span><span className="trust-item"><span className="trust-chip"><Eye aria-hidden="true" /></span>Localization</span></div></div></section>
    <section className="problem-section"><div className="container problem-grid"><div className="problem-heading"><div className="problem-index">01 / The barrier</div><div className="eyebrow">The language gap</div><h2>You Don't Always Need More Words.<br /><em>You Need the Right Words in the Right Language.</em></h2></div><div className="problem-copy"><p className="problem-lead">Businesses and individuals invest heavily in documents, contracts, and applications every year.</p><p>But when those documents are in the wrong language, opportunities stall. Contracts sit unsigned. Medical records go unread. Immigration paperwork gets rejected. Legal filings miss deadlines. The message is there—but the meaning is lost.</p><div className="problem-close"><strong>More paperwork doesn't fix a language barrier.</strong><span>Words Wize Global provides the certified translation and localization to keep your communication moving.</span></div></div></div></section>
    <WhyDealers />
    <section className="home-route-grid"><div className="container"><SectionIntro eyebrow="What we do" title={<>One Team.<br /><em>From Word to Meaning.</em></>} copy="Words Wize Global works as an extension of your communication—not another piece of software and not another consultant telling your team what they should be doing. We help do the work." action={<SiteLink className="button outline" href="/contact" onNavigate={onNavigate}>Find your fit</SiteLink>} /><div className="route-cards"><SiteLink href="/services" onNavigate={onNavigate} className="route-card"><span>01 / Certified Document Translation</span><strong>No document should be misunderstood because of a language barrier.</strong><b>↗</b></SiteLink><SiteLink href="/services" onNavigate={onNavigate} className="route-card dark-card"><span>02 / Interpretation Services</span><strong>More coverage for conversations that matter.</strong><b>↗</b></SiteLink><SiteLink href="/services" onNavigate={onNavigate} className="route-card image-card"><span>03 / Localization &amp; Transcription</span><strong>A submitted document isn&apos;t a finished translation.</strong><b>↗</b></SiteLink></div></div></section>
<CtaBand onNavigate={onNavigate} />
    </div>
  </>;
}

function About({ onNavigate }: { onNavigate: (path: Route) => void }) {
  const values = [['Linguist-led', 'We build around real language rhythms, not theory.'], ['Accuracy by default', 'Simple handoffs and useful visibility keep work moving.'], ['Tailored to your industry', 'Start with the pressure point that matters most to you.'], ['Long-term language partner', 'Improve the system as your communication grows and changes.']];
  return <><PageHero eyebrow="About us" title={<>The first call for clear communication in any language.</>} intro="Words Wize Global works alongside law firms, medical clinics, corporations, government agencies, immigrants, and students who want a more dependable way to translate documents and communicate across languages." image="about-collaboration.jpg"><SiteLink className="button" href="/contact" onNavigate={onNavigate}>Start a conversation</SiteLink></PageHero><section className="about-story"><div className="container about-grid"><div className="about-lead"><div className="eyebrow">Who we serve</div><h2>Communication by design.</h2></div><div className="about-body"><p>Big enough to need precision. Close enough to know every word matters. That is the space we understand.</p><p>We bring together experienced linguists, disciplined translation processing, and focused localization tools so your team can spend less time chasing language and more time running the work.</p><div className="about-points">{values.map(([title, text]) => <div className="about-point" key={title}><strong>{title}</strong><span>{text}</span></div>)}</div></div></div></section><ImageBand image="about-teamwork.jpg" label="A different kind of partner" title="Experience that stays close to the words." copy="The best translation support does not arrive with a thick playbook. It listens, finds the friction, and earns its place in the rhythm of your communication." flip /><section className="proof-stats"><div className="container"><SectionIntro eyebrow="The experience behind Words Wize Global" title={<>The Name Is New.<br /><em>The Experience Isn&apos;t.</em></>} copy="The team behind Words Wize Global has spent years working in translation, interpretation, and localization." /><div className="proof-stats-grid"><StatCell raw="12,450" label="Documents Translated" /><StatCell raw="87" label="Languages Supported" /><StatCell raw="2,100" label="Clients Served" /><StatCell raw="OVER 15" label="Years of Experience" /><StatCell raw="$2.4M" label="Words Translated" /></div></div></section><CtaBand onNavigate={onNavigate} /></>;
}

const services = [
  ['01 / CERTIFIED DOCUMENT TRANSLATION', 'Every word translated with care.', 'A focused translation layer that helps your documents move across languages without losing meaning, tone, or legal weight.', 'IMG_1434-1.png'],
  ['02 / INTERPRETATION SERVICES', 'Clearer conversations, fewer misunderstandings.', 'Keep multilingual communication moving with organized interpretation support designed around your setting and your audience.', 'instant-cash-step-4-web.jpg'],
  ['03 / LOCALIZATION & TRANSCRIPTION', 'Tools that fit the way you communicate.', 'Practical localization and transcription services that turn scattered language tasks into a clearer daily workflow.', 'cdk-inventory-strategy.png'],
];
function Services({ onNavigate }: { onNavigate: (path: Route) => void }) {
  return <><PageHero eyebrow="Services" title={<>The right help<br />at the right language.</>} intro="Choose one focused service or bring the pieces together. The work starts with where your communication feels the most friction." image="services-hero.jpg" tone="light"><SiteLink className="button" href="/contact" onNavigate={onNavigate}>Find your fit</SiteLink></PageHero><section className="services-page"><div className="container"><div className="service-stack">{services.map(([number, title, text, image], index) => <article className={`service-row ${index === 0 ? 'service-row-first' : ''}`} key={number}><div className="service-row-image"><img src={asset(image)} alt="" /></div><div className="service-row-copy"><div className="service-number">{number}</div><h2>{title}</h2><p>{text}</p><SiteLink className="text-link" href="/contact" onNavigate={onNavigate}>Talk through this service</SiteLink></div></article>)}</div></div></section><section className="service-note"><div className="container"><div className="eyebrow">One useful question</div><h2>Where does your message<br /><em>lose its meaning?</em></h2><SiteLink className="button outline" href="/contact" onNavigate={onNavigate}>Let&apos;s find it</SiteLink></div></section></>;
}

const processSteps = [['01', 'Receive your documents', 'We review your source files, languages, timeline, and industry requirements.'], ['02', 'Quote & timeline', 'You get a focused translation plan with clear pricing, deadlines, and a certified linguist assigned.'], ['03', 'Translate & certify', 'Our translators join your project with steady communication and useful visibility.'], ['04', 'Review & deliver', 'We look at quality, accuracy, and where the next useful improvement lives.']];
function Process({ onNavigate }: { onNavigate: (path: Route) => void }) {
  return <><PageHero eyebrow="Process" title={<>No mystery.<br /><em>Just momentum.</em></>} intro="You should always know what we are translating, what happens next, and how the work connects back to your message." image="process-hero.jpg"><SiteLink className="button" href="/contact" onNavigate={onNavigate}>Plan the first step</SiteLink></PageHero><section className="process-page"><div className="container"><SectionIntro eyebrow="A straightforward process" title={<>Four steps from<br />source to meaning.</>} copy="We keep the work visible and the plan practical. No black box, no handoff that disappears into the distance." /><div className="process-steps process-steps-light">{processSteps.map(([number, title, text]) => <article className="process-step" key={number}><div className="step-no">{number}</div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section><ImageBand image="process-collab.jpg" label="Work that compounds" title="A system that gets more useful over time." copy="The first win may be a translated document or a clear conversation. The bigger win is a partner that knows how to repeat it tomorrow." flip /><section className="process-checklist"><div className="container"><div className="eyebrow">What you can expect</div><div className="checklist-grid"><div className="process-card" style={{ backgroundImage: `linear-gradient(135deg, rgba(0,42,96,.96), rgba(0,42,96,.63)), url("${asset('process-card-2.jpg')}")` }}><strong>A clear owner</strong><span>Every workstream has a person responsible for its next move.</span><b>↗</b></div><div className="process-card" style={{ backgroundImage: `linear-gradient(135deg, rgba(0,42,96,.96), rgba(0,42,96,.63)), url("${asset('process-card-3.jpg')}")` }}><strong>Useful visibility</strong><span>See what is active, what needs attention, and what changed.</span><b>↗</b></div><div className="process-card" style={{ backgroundImage: `linear-gradient(135deg, rgba(0,42,96,.96), rgba(0,42,96,.63)), url("${asset('about-collaboration.jpg')}")` }}><strong>Clear communication</strong><span>Every language handled with precision and care.</span><b>↗</b></div></div></div></section></>;
}

const testimonials = [
  ['“We needed our contracts in three languages by Monday. Words Wize Global delivered certified translations on time, every time.”', 'General Counsel', 'Regional law firm'],
  ['“The certified translation of our patient intake forms made onboarding so much smoother.”', 'Practice Manager', 'Medical clinic'],
  ['“Finally a translation partner that understands legal tone and tight deadlines.”', 'Operations Lead', 'Corporate legal team'],
  ['“Clear, accurate, and delivered ahead of schedule. Exactly what our students needed for their applications.”', 'Director of Admissions', 'University'],
];
function Testimonials({ onNavigate }: { onNavigate: (path: Route) => void }) {
  return <><PageHero eyebrow="Testimonials" title={<>Proof in the<br /><em>daily details.</em></>} intro="Good support is felt in the small moments: the deadline met, the document accepted, the conversation understood." image="about-collaboration.jpg" tone="light"><SiteLink className="button" href="/contact" onNavigate={onNavigate}>Request a quote</SiteLink></PageHero><section className="case-study"><div className="container case-grid"><div><div className="eyebrow">Real client. Real result.</div><h2>Same Document.<br />Same Meaning.<br /><em>Any Language.</em></h2><strong className="case-result">87 Languages<br />Supported.</strong></div><blockquote><img src={asset('go-indy-autos-logo.png')} alt="Client logo" className="case-study-logo" />"We needed our contracts in three languages by Monday. Words Wize Global delivered certified translations on time, every time."<br /><span>General Counsel · Regional Law Firm</span></blockquote></div><div className="container case-note">Historical client result generated through work performed by the team now behind Words Wize Global.</div></section>
  <section className="testimonial-gallery"><div className="container"><img src={asset('about-teamwork.jpg')} alt="Client satisfaction" /><div><div className="eyebrow">A shared standard</div><h2>The win is not just the number.</h2><p>It is the calmer desk, the cleaner handoff, and the confidence to take the next customer as they arrive.</p><SiteLink className="text-link" href="/services" onNavigate={onNavigate}>Explore the support</SiteLink></div></div></section><CtaBand onNavigate={onNavigate} /></>;
}

type FormState = { firstName: string; lastName: string; clientName: string; workEmail: string; phoneNumber: string; website: string; sourceLanguage: string; targetLanguage: string; wordCount: string; needsHelpWith: string; message: string };
const emptyForm: FormState = { firstName: '', lastName: '', clientName: '', workEmail: '', phoneNumber: '', website: '', sourceLanguage: '', targetLanguage: '', wordCount: '', needsHelpWith: '', message: '' };
function ContactForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const update = (field: keyof FormState, value: string) => { setForm((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: undefined })); };
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const next: Partial<Record<keyof FormState, string>> = {}; (Object.keys(form) as (keyof FormState)[]).forEach((field) => { if (!form[field].trim()) next[field] = 'This field is required.'; }); if (form.workEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.workEmail)) next.workEmail = 'Enter a valid work email.'; setErrors(next); if (Object.keys(next).length) return; setSending(true); setSubmitError(''); try { const response = await fetch('https://formspree.io/f/mwlkvdlw', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ _gotcha: honeypot, _subject: `New translation quote request — ${form.clientName}`, 'First name': form.firstName, 'Last name': form.lastName, 'Client name': form.clientName, 'Work email': form.workEmail, 'Phone number': form.phoneNumber, 'Website': form.website, 'Source language': form.sourceLanguage, 'Target language': form.targetLanguage, 'Approximate word count': form.wordCount, 'What do you need help with': form.needsHelpWith, 'Message': form.message, 'SMS consent': smsConsent ? 'Yes' : 'No' }) }); if (!response.ok) throw new Error('Quote delivery failed'); setSubmitted(true); } catch { setSubmitError('We could not send your request right now. Please email hello@wordswize.global.') } finally { setSending(false); } };
  if (submitted) return <div className="success-state"><div className="eyebrow">Request received</div><h3>We&apos;ll take it from here.</h3><p>Thanks for reaching out to Words Wize Global. A member of our team will review your translation request and follow up with the next useful question.</p><button className="button outline" type="button" onClick={() => { setSubmitted(false); setForm(emptyForm); setSmsConsent(false); }}>Send another request</button></div>;
  return <form className="contact-form" onSubmit={submit} noValidate>{([['firstName', 'First name'], ['lastName', 'Last name'], ['clientName', 'Client name'], ['workEmail', 'Work email'], ['phoneNumber', 'Phone number'], ['website', 'Website'], ['sourceLanguage', 'Source language'], ['targetLanguage', 'Target language'], ['wordCount', 'Approximate word count']] as [keyof FormState, string][]).map(([field, label]) => <div className="field" key={field}><label htmlFor={field}>{label}</label><input id={field} type={field === 'workEmail' ? 'email' : field === 'phoneNumber' ? 'tel' : field === 'website' ? 'url' : 'text'} value={form[field]} onChange={(event) => update(field, event.target.value)} aria-invalid={Boolean(errors[field])} required />{errors[field] && <span className="field-error">{errors[field]}</span>}</div>)}<div className="field full"><label htmlFor="needsHelpWith">What do you need help with?</label><select id="needsHelpWith" value={form.needsHelpWith} onChange={(event) => update('needsHelpWith', event.target.value)} aria-invalid={Boolean(errors.needsHelpWith)} required><option value="">Choose one</option><option>Certified Document Translation</option><option>Interpretation Services</option><option>Localization &amp; Transcription</option><option>Not Sure Yet</option></select>{errors.needsHelpWith && <span className="field-error">{errors.needsHelpWith}</span>}</div><div className="field full"><label htmlFor="message">Tell us about your documents or translation needs.</label><textarea id="message" value={form.message} onChange={(event) => update('message', event.target.value)} aria-invalid={Boolean(errors.message)} required />{errors.message && <span className="field-error">{errors.message}</span>}</div><label className="sms-consent"><input type="checkbox" checked={smsConsent} onChange={(event) => setSmsConsent(event.target.checked)} /> <span>I consent to receive conversational and informational SMS messages from Words Wize Global LLC regarding my inqu</span></label></form>;
}

function Contact({ onNavigate }: { onNavigate: (path: Route) => void }) {
  return <><PageHero eyebrow="Contact" title={<>Bring us the<br /><em>messy part.</em></>} intro="Tell us where the operation feels stuck. We&apos;ll bring a clear point of view and start with the work that matters most." image="contact-conversation.jpg"><a className="text-link light-link" href="tel:13178365808">Call +1 317-836-5808</a></PageHero><section className="contact contact-page"><div className="container contact-grid"><div className="contact-intro"><div className="eyebrow">Let&apos;s talk shop</div><h2 className="section-title">A focused conversation can change the way the whole day runs.</h2><p className="section-copy">Share a little context and we&apos;ll get back to you with the next useful question — not a sales script.</p><div className="contact-details"><span>Words Wize Global LLC</span><a href="mailto:hello@wordswize.global">hello@wordswize.global</a><a href="tel:13178365808">+1 317-836-5808</a><address>711 E 65th Street<br />Office #300<br />Indianapolis, IN 46220</address><span className="office-note">Monday–Friday / 9:00 AM–6:00 PM ET<br />Serving clients nationwide across the United States.</span></div></div><ContactForm /></div></section><section className="contact-aside"><div className="container"><div><div className="eyebrow">Good to know</div><h2>Start with one useful conversation.</h2></div><div className="contact-aside-points"><span>01 / No obligation</span><span>02 / Practical first step</span><span>03 / Nationwide service area</span></div></div></section></>;
}

const detailedServices = [
  ['Certified Document Translation', 'Every word translated with care.', 'Words Wize Global provides certified translation of contracts, certificates, legal filings, medical records, and business documents, with accuracy and legal weight preserved across languages.', ['Birth and marriage certificates', 'Academic diplomas and transcripts', 'Contracts and legal agreements', 'Medical records and intake forms', 'Immigration paperwork', 'Corporate documents', 'Certified and notarized translations']],
  ['Interpretation Services', 'Clearer conversations, fewer misunderstandings.', 'Keep multilingual communication moving with organized interpretation support designed around your setting and your audience.', ['Medical appointment interpretation', 'Legal proceeding interpretation', 'Corporate meeting interpretation', 'Community and government interpretation', 'Consecutive and simultaneous interpretation', 'Over-the-phone and video remote interpretation']],
  ['Localization & Transcription', 'Tools that fit the way you communicate.', 'Practical localization and transcription services that turn scattered language tasks into a clearer daily workflow.', ['Website and software localization', 'Audio and video transcription', 'Subtitling and captioning', 'Marketing content adaptation', 'Proofreading and editing', 'Quality assurance review']],
];
function DetailedServices() {
  return <section className="detailed-services"><div className="container"><SectionIntro eyebrow="What we do" title={<>One Team.<br /><em>From Word to Meaning.</em></>} copy="Words Wize Global works as an extension of your communication—not another piece of software and not another consultant telling your team what they should be doing. We help do the work." /><div className="detailed-service-list">{detailedServices.map(([title, tagline, copy, items], index) => <article className="detailed-service" key={title as string}><div className="detailed-service-heading"><span>0{index + 1} / Service</span><h2>{title}</h2><strong>{tagline}</strong></div><div className="detailed-service-body"><p>{copy}</p><ul>{(items as string[]).map((item) => <li key={item}>{item}</li>)}</ul>{index === 2 && <small>Words Wize Global provides translation and localization services and is not a law firm or certified interpreter agency.</small>}</div></article>)}</div></div></section>;
}

const expandedProcess = [['01', 'Documents Received', 'Your source files arrive and are reviewed for language, subject matter, and formatting needs.'], ['02', 'Quote & Timeline', 'You receive a clear price, deadline, and the certified linguist assigned to your project.'], ['03', 'Translation & Certification', 'Our linguists translate with steady communication and useful visibility into progress.'], ['04', 'Quality Review', 'Translations are checked for accuracy, tone, and industry terminology before delivery.'], ['05', 'Delivery & Follow-Up', 'Certified translations arrive on time, with support for any follow-up questions.']];
function ExpandedProcess() {
  return <section className="expanded-process"><div className="container"><SectionIntro eyebrow="The process" title={<>Every Opportunity.<br /><em>A Next Step.</em></>} /><div className="expanded-process-grid">{expandedProcess.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>;
}

function WhyDealers() {
  return <section className="why-dealers"><div className="container why-grid"><div><div className="eyebrow">Why Words Wize</div><h2>Linguists.<br /><em>Not Software.</em></h2></div><div><p>The people behind Words Wize Global have spent years working in translation and localization.</p><p>We&apos;ve translated documents. Managed interpretation projects. Supported legal, medical, and corporate communication. Worked with clients and agencies. Used the CAT tools and TMS platforms linguists rely on every day.</p><p>We&apos;re not here to hand you another machine translation explaining what your words should say. We&apos;re here to help translate the work.</p></div></div></section>;
}

function SecuritySection({ onNavigate }: { onNavigate: (path: Route) => void }) {
  const practices = [['Certified Linguists', 'All translation work is performed by vetted, native-speaking linguists rather than uncontrolled machine translation.', 'SAP-_Automaster_Mich_Chris-2405-web.jpg'], ['Confidentiality Agreements', 'NDAs are used where supported to help protect access to sensitive documents.', 'cdk-inventory-strategy.png'], ['Role-Based Access', 'Personnel receive access based on the documents and information needed for their responsibilities.', '04142022-Cox-Automotive1158-web.jpg'], ['Restricted Data Use', 'Client and customer information is used only for authorized translation-service activities.', 'instant-cash-step-4-web.jpg'], ['Incident Response', 'Defined escalation and notification procedures support the response to suspected unauthorized access or data incidents.', 'Spotelson-IMG_8288-web.jpg'], ['Access Removal & Data Handling', 'When an engagement ends, access is revoked and client/customer information is handled according to applicable contractual, retention and deletion requirements.', 'dfw-20160914-3382-web.jpg']];
  const secRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = secRef.current;
    if (!el) return;
    return initSectionEntry(el, '.security-section', [
      { selector: '.security-section .section-intro .eyebrow', at: 0.1 },
      { selector: '.security-section .section-title', y: 26, duration: 0.7, at: 0.18 },
      { selector: '.security-section .section-copy', at: 0.26 },
      { selector: '.security-section .intro-side .button', y: 14, duration: 0.5, at: 0.31 },
      { selector: '.security-grid > div', y: 26, stagger: 0.08, at: 0.34 },
    ]);
  }, []);
  return <section ref={secRef} className="security-section"><div className="container"><SectionIntro eyebrow="Built around responsible access" title={<>Remote Doesn&apos;t<br /><em>Mean Uncontrolled.</em></>} copy="Handling sensitive documents requires disciplined access to client and customer information. Words Wize Global is building its operating model around controlled access, restricted use and defined information-handling practices." action={<SiteLink className="button outline" href="/contact" onNavigate={onNavigate}>Find your fit</SiteLink>} /><div className="security-grid">{practices.map(([title, copy, image], index) => <div key={title} className="security-card" style={{ backgroundImage: `linear-gradient(135deg, rgba(0,42,96,.96), rgba(0,42,96,.63)), url("${asset(image)}")` }}><span className="security-number">0{index + 1} / Practice</span><strong>{title}</strong><span>{copy}</span><b>↗</b></div>)}</div></div></section>;
}

function DiagnosticBand({ onNavigate }: { onNavigate: (path: Route) => void }) {
  const bandRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = bandRef.current;
    if (!el) return;
    return initSectionEntry(el, '.diagnostic-band', [
      { selector: '.diagnostic-band .eyebrow', at: 0.1 },
      { selector: '.diagnostic-band h2', y: 26, duration: 0.7, at: 0.18 },
      { selector: '.diagnostic-band p', at: 0.28 },
      { selector: '.diagnostic-band .button', y: 16, duration: 0.55, at: 0.36 },
    ]);
  }, []);
  return <section ref={bandRef} className="diagnostic-band"><div className="container diagnostic-inner"><div><div className="eyebrow">Free translation quote / 30 minutes</div><h2>Give Us 30 Minutes<br /><em>and Your Documents.</em></h2><p>We&apos;ll review what you need translated, the languages involved, your timeline, and your industry. If there are opportunities to communicate more clearly, we&apos;ll show you where.</p></div><SiteLink className="button" href="/contact" onNavigate={onNavigate}>Request Your Free Translation Quote</SiteLink></div></section>;
}

const businessWebsite = <a href="https://www.wordswize.global">https://www.wordswize.global</a>;
function LegalPage({ type }: { type: 'privacy' | 'sms' }) {
  const privacy = type === 'privacy';
  return <section className="legal-page"><div className="container legal-layout"><div className="legal-heading"><div className="eyebrow">Words Wize Global / Legal</div><h1>{privacy ? 'Privacy Policy' : 'SMS Terms & Conditions'}</h1><p>Words Wize Global LLC{privacy ? ' · Effective Date: 08/26/2026' : ''}</p></div><article className="legal-content">{privacy ? <><p>At Words Wize Global, we respect your privacy and are committed to protecting your personal information. This policy explains what data we collect, how we use it, and your rights.</p><h2>1. Information We Collect</h2><p>We collect only the information necessary to provide our SMS services, including:</p><ul><li>Your name, phone number, and email when you opt in for SMS notifications.</li><li>Operational data related to message delivery and service use.</li></ul><h2>2. How We Use Your Information</h2><p>We use your data responsibly to:</p><ul><li>Send SMS notifications, reminders, and operational updates.</li><li>Improve the quality of our services.</li><li>Respond to inquiries or requests submitted through our website.</li></ul><h2>3. Information Sharing</h2><p>Your SMS consent is never shared with third parties or affiliates.</p><p>Personal information is used exclusively by Words Wize Global for internal operations.</p><p>We do not sell, rent, or trade your data under any circumstances.</p><h2>4. Your Rights</h2><p>You can opt out at any time by replying STOP to any message.</p><p>For assistance, reply HELP or contact us via {businessWebsite}</p><h2>5. Accessibility</h2><p>Our Privacy Policy link is included on all forms where SMS consent is requested.</p><p>A link is also available in the footer of every website page: {businessWebsite}</p></> : <><p>By opting into SMS notifications from Words Wize Global, you agree to these terms.</p><h2>1. Types of Messages</h2><p>You may receive SMS messages for:</p><ul><li>Appointment reminders and operational alerts.</li><li>Order updates and account notifications.</li><li>Other relevant service-related communications.</li></ul><h2>2. Message Frequency</h2><p>Messaging frequency may vary depending on service needs.</p><h2>3. Charges</h2><p>Standard message and data rates may apply according to your mobile carrier.</p><h2>4. Opt-Out</h2><p>To stop receiving messages, reply STOP at any time.</p><p>For help, reply HELP or visit {businessWebsite}</p><h2>5. Consent</h2><p>By opting in, you authorize Words Wize Global to send operational SMS messages.</p><p>SMS consent is never shared with third parties or affiliates.</p><h2>6. Use of Data</h2><p>Your information is used solely to deliver the services described above.</p><h2>7. Reliability</h2><p>Words Wize Global works to ensure timely delivery, but is not responsible for delays caused by mobile carriers or network issues.</p><h2>8. Updates</h2><p>We may update this policy occasionally. Changes will be posted with an updated effective date. Continued use of SMS services signifies acceptance of the revised terms.</p></>}</article></div></section>;
}

function CtaBand({ onNavigate }: { onNavigate: (path: Route) => void }) { return <section className="cta-band"><div className="container cta-inner"><h2>Clear communication starts with one honest conversation.</h2><SiteLink className="button" href="/contact" onNavigate={onNavigate}>Start with Words Wize Global</SiteLink></div></section>; }

function VideoEntrance() {
  const [show, setShow] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduced) { setShow(false); return; }
    if (sessionStorage.getItem('words-wize-entrance-shown') === '1') { setShow(false); return; }
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, [reduced]);

  const finish = () => {
    sessionStorage.setItem('words-wize-entrance-shown', '1');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="video-entrance">
      <video ref={videoRef} className="video-entrance__video" preload="auto" poster={asset('hero-section.png')} onEnded={finish} aria-label="Words Wize Global introduction">
        <source src="/videos/words-wize-introduction.mp4" type="video/mp4" />
        <p className="video-entrance__fallback">Words Wize Global</p>
      </video>
      <div className="video-entrance__overlay" />
      <button className="video-entrance__skip" type="button" onClick={finish} aria-label="Skip introduction">Skip</button>
    </div>
  );
}

function Footer({ onNavigate }: { onNavigate: (path: Route) => void }) {
  return <footer className="footer"><div className="container"><div className="footer-main"><div><Logo onNavigate={onNavigate} src="words-wize-global-logo.jpg" /><p className="footer-note">Words Wize Global LLC<br />Built for Clear Communication.<br /><br />711 E 65th Street, Office #300<br />Indianapolis, IN 46220<br /><a href="tel:13178365808">+1 317-836-5808</a><a href="mailto:hello@wordswize.global">hello@wordswize.global</a></p></div><div><h3>Explore</h3>{routes.slice(0, 3).map((route) => <SiteLink href={route.path} onNavigate={onNavigate} key={route.path}>{route.label}</SiteLink>)}</div><div><h3>Company</h3>{routes.slice(3).map((route) => <SiteLink href={route.path} onNavigate={onNavigate} key={route.path}>{route.label}</SiteLink>)}</div><div><h3>Legal</h3>{legalRoutes.map((route) => <SiteLink href={route.path} onNavigate={onNavigate} key={route.path}>{route.label}</SiteLink>)}</div><div><h3>Social</h3><a href="https://www.instagram.com/wordswizeglobal/">Instagram</a><a href="https://www.facebook.com/wordswizeglobal">Facebook</a><a href="https://www.linkedin.com/company/words-wize-global">LinkedIn</a></div><div><h3>Start here</h3><p className="footer-note">A focused conversation can change the way the whole day runs.</p><SiteLink href="/contact" onNavigate={onNavigate}>Contact Words Wize Global ↗</SiteLink></div></div><div className="footer-bottom"><span>© 2026 Words Wize Global LLC. All rights reserved.<br />Words Wize Global provides translation and localization services and is not a law firm or certified interpreter agency.</span></div></div></footer>;
}

function App() {
  const [route, setRoute] = useState<Route>(pathFromLocation);
  const mainRef = useRef<HTMLElement>(null);
  const directionRef = useRef<'forward' | 'back'>('forward');
  const transitioningRef = useRef(false);
  const justTransitionedRef = useRef(false);
  const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const commitRoute = (next: Route, push: boolean) => {
    if (push) { const url = `${base}${next === '/' ? '/' : next}`; window.history.pushState({}, '', url); }
    justTransitionedRef.current = true;
    transitioningRef.current = false;
    window.scrollTo(0, 0);
    setRoute(next);
  };
  const navigate = (next: Route) => {
    if (next === route || transitioningRef.current) return;
    const el = mainRef.current;
    if (!el || prefersReduced() || next === route) { commitRoute(next, true); return; }
    transitioningRef.current = true;
    directionRef.current = 'forward';
    gsap.to(el, { autoAlpha: 0, y: -14, duration: 0.22, ease: 'power2.in', onComplete: () => commitRoute(next, true) });
  };
  useEffect(() => {
    const onPop = () => {
      const next = pathFromLocation();
      const el = mainRef.current;
      if (!el || prefersReduced() || next === route) { commitRoute(next, false); return; }
      transitioningRef.current = true;
      directionRef.current = 'back';
      gsap.to(el, { autoAlpha: 0, y: 14, duration: 0.2, ease: 'power2.in', onComplete: () => commitRoute(next, false) });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [route]);
  useLayoutEffect(() => {
    if (!justTransitionedRef.current) return;
    justTransitionedRef.current = false;
    const el = mainRef.current;
    if (!el || prefersReduced()) return;
    gsap.fromTo(el, { autoAlpha: 0, y: directionRef.current === 'back' ? -14 : 16 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power3.out', clearProps: 'transform' });
  }, [route]);
  const page = route === '/' ? <><Home onNavigate={navigate} /><SecuritySection onNavigate={navigate} /><DiagnosticBand onNavigate={navigate} /></> : route === '/about-us' ? <><About onNavigate={navigate} /><WhyDealers /></> : route === '/services' ? <><Services onNavigate={navigate} /><DetailedServices /></> : route === '/process' ? <><Process onNavigate={navigate} /><ExpandedProcess /></> : route === '/testimonials' ? <Testimonials onNavigate={navigate} /> : route === '/contact' ? <Contact onNavigate={navigate} /> : <LegalPage type={route === '/privacy-policy' || route === '/privacy' ? 'privacy' : 'sms'} />;
  useEffect(() => {
  const titles: Record<Route, string> = { '/': 'Words Wize Global | Translation & Localization Services', '/about-us': 'About Words Wize Global | Clear Communication by Design', '/services': 'Services | Words Wize Global', '/process': 'Process | Words Wize Global', '/testimonials': 'Testimonials | Words Wize Global', '/contact': 'Contact Words Wize Global', '/privacy': 'Privacy Policy | Words Wize Global', '/privacy-policy': 'Privacy Policy | Words Wize Global', '/sms-terms': 'SMS Terms & Conditions | Words Wize Global' };
  const descriptions: Record<Route, string> = {
    '/': 'Words Wize Global provides certified document translation, interpretation, and localization for individuals and businesses across the United States.',
    '/about-us': 'Words Wize Global works alongside law firms, medical clinics, corporations, government agencies, immigrants, and students who want clear communication in any language.',
    '/services': 'Choose one focused service or bring the pieces together: certified document translation, interpretation, localization, transcription, and proofreading.',
    '/process': 'A straightforward four-step process: receive documents, quote & timeline, translate & certify, review & deliver.',
    '/testimonials': 'Real results from clients working with the team behind Words Wize Global.',
    '/contact': 'Request a free translation quote. Tell us what you need translated and we will bring a clear point of view.',
    '/privacy': 'Words Wize Global LLC privacy policy.',
    '/privacy-policy': 'Words Wize Global LLC privacy policy.',
    '/sms-terms': 'Words Wize Global LLC SMS terms and conditions.',
  };
  document.title = titles[route];
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute('content', descriptions[route]);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', `https://www.wordswize.global${route === '/' ? '/' : route}`);
}, [route]);
  return <QueryClientProvider client={queryClient}><TooltipProvider><ErrorBoundary><div className="site"><Header active={route} onNavigate={navigate} /><main ref={mainRef} key={route}>{page}</main><Footer onNavigate={navigate} /></div><VideoEntrance /></ErrorBoundary><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;