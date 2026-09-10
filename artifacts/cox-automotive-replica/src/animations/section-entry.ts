import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface SectionStep {
  selector: string;
  y?: number;
  duration?: number;
  stagger?: number;
  at?: number;
  from?: gsap.TweenVars;
}

export function initSectionEntry(scopedEl: HTMLElement, trigger: string, steps: SectionStep[]): () => void {
  const addIsIn = () => {
    const targetsEl = scopedEl.matches(trigger) ? [scopedEl] : Array.from(scopedEl.querySelectorAll<HTMLElement>(trigger));
    targetsEl.forEach((s) => s.classList.add('is-in'));
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    addIsIn();
    return () => {};
  }

  const targets: HTMLElement[] = [];
  steps.forEach((s) => {
    scopedEl.querySelectorAll<HTMLElement>(s.selector).forEach((el) => targets.push(el));
  });

  const clearEntryTransforms = () => {
    targets.forEach((el) => gsap.set(el, { clearProps: 'transform,opacity,visibility' }));
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top 72%',
      once: true,
      onEnter: addIsIn,
    },
  });

  steps.forEach((s) => {
    tl.from(s.selector, {
      y: s.y ?? 18,
      autoAlpha: 0,
      duration: s.duration ?? 0.55,
      ease: 'power3.out',
      stagger: s.stagger,
      ...s.from,
    }, s.at);
  });

  tl.eventCallback('onComplete', clearEntryTransforms);

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
    targets.forEach((el) => gsap.set(el, { clearProps: 'transform,opacity,visibility' }));
  };
}