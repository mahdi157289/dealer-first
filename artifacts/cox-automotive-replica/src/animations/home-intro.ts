import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHomeAnimations(scopedEl: HTMLElement): gsap.Context {
  const ctx = gsap.context(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scopedEl.querySelectorAll('.problem-section, .proof-stats, .video-section, .why-dealers, .home-route-grid, .cta-band').forEach((s) => s.classList.add('is-in'));
      return;
    }

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo('.hero-bg', { scale: 1.12 }, { scale: 1, transformOrigin: 'center center', duration: 2.4, ease: 'power2.out' }, 0)
      .from('.hero-kicker', { y: 18, autoAlpha: 0, duration: 0.7 }, 0.15)
      .from('h1', { y: 24, autoAlpha: 0, duration: 0.8 }, 0.24)
      .from('.hero-intro', { y: 18, autoAlpha: 0, duration: 0.7 }, 0.33)
      .from('.hero-actions', { y: 18, autoAlpha: 0, duration: 0.7 }, 0.42)
      .from('.hero-trust', { y: 14, autoAlpha: 0, duration: 0.6 }, 0.51)
      .from('.hero-proof', { y: 30, x: 12, autoAlpha: 0, duration: 0.85 }, 0.55)
      .from('.hero-scroll', { autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, 1.25);

    gsap.to('.hero-inner', {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
    });
    gsap.to('.hero-bg', {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
    });

    const clearTrustTransforms = () => {
      scopedEl.querySelectorAll<HTMLElement>('.trust-item, .trust-label').forEach((el) => {
        gsap.set(el, { clearProps: 'transform,opacity,visibility' });
      });
    };
    gsap.from('.trust-label', {
      x: -10, autoAlpha: 0, duration: 0.6, ease: 'power3.out', onComplete: clearTrustTransforms,
      scrollTrigger: { trigger: '.trust-row', start: 'top 88%', once: true },
    });
    gsap.from('.trust-item', {
      y: 26, autoAlpha: 0, duration: 0.55, ease: 'power3.out', stagger: 0.09, onComplete: clearTrustTransforms,
      scrollTrigger: { trigger: '.trust-row', start: 'top 88%', once: true },
    });

    const clearProblemTransforms = () => {
      scopedEl.querySelectorAll<HTMLElement>('.problem-index, .problem-heading .eyebrow, .problem-grid h2, .problem-copy > p, .problem-close').forEach((el) => {
        gsap.set(el, { clearProps: 'transform,opacity,visibility' });
      });
    };
    gsap.timeline({
      scrollTrigger: {
        trigger: '.problem-section',
        start: 'top 72%',
        once: true,
        onEnter: () => scopedEl.querySelectorAll('.problem-section').forEach((s) => s.classList.add('is-in')),
      },
    })
      .from('.problem-index', { y: 20, autoAlpha: 0, duration: 0.55, ease: 'power3.out' }, 0.1)
      .from('.problem-heading .eyebrow', { y: 18, autoAlpha: 0, duration: 0.55, ease: 'power3.out' }, 0.17)
      .from('.problem-grid h2', { y: 26, autoAlpha: 0, duration: 0.7, ease: 'power3.out' }, 0.26)
      .from('.problem-lead', { y: 22, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0.32)
      .from('.problem-copy > p:not(.problem-lead)', { y: 18, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0.4)
      .from('.problem-close', { y: 18, autoAlpha: 0, duration: 0.6, ease: 'power3.out', onComplete: clearProblemTransforms }, 0.48);

    const clearProofTransforms = () => {
      scopedEl.querySelectorAll<HTMLElement>('.proof-stats .eyebrow, .proof-stats .section-title, .proof-stats .section-copy, .proof-stats-grid > div').forEach((el) => {
        gsap.set(el, { clearProps: 'transform,opacity,visibility' });
      });
    };
    gsap.timeline({
      scrollTrigger: {
        trigger: '.proof-stats',
        start: 'top 72%',
        once: true,
        onEnter: () => scopedEl.querySelectorAll('.proof-stats').forEach((s) => s.classList.add('is-in')),
      },
    })
      .from('.proof-stats .eyebrow', { y: 18, autoAlpha: 0, duration: 0.55, ease: 'power3.out' }, 0.1)
      .from('.proof-stats .section-title', { y: 26, autoAlpha: 0, duration: 0.7, ease: 'power3.out' }, 0.18)
      .from('.proof-stats .section-copy', { y: 18, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0.26)
      .from('.proof-stats-grid > div', { y: 26, autoAlpha: 0, duration: 0.6, ease: 'power3.out', stagger: 0.09, onComplete: clearProofTransforms }, 0.32);

    const clearVideoTransforms = () => {
      scopedEl.querySelectorAll<HTMLElement>('.video-section .section-intro .eyebrow, .video-section .section-title, .video-section .section-copy, .video-section .intro-side .text-link, .video-frame, .video-caption, .video-notes .eyebrow, .video-notes h3, .video-notes p, .note-list li').forEach((el) => {
        gsap.set(el, { clearProps: 'transform,opacity,visibility,clipPath' });
      });
    };
    gsap.timeline({
      scrollTrigger: {
        trigger: '.video-section',
        start: 'top 72%',
        once: true,
        onEnter: () => scopedEl.querySelectorAll('.video-section').forEach((s) => s.classList.add('is-in')),
      },
    })
      .from('.video-section .section-intro .eyebrow', { y: 18, autoAlpha: 0, duration: 0.55, ease: 'power3.out' }, 0.1)
      .from('.video-section .section-title', { y: 26, autoAlpha: 0, duration: 0.7, ease: 'power3.out' }, 0.18)
      .from('.video-section .section-copy', { y: 18, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0.26)
      .from('.video-section .intro-side .text-link', { y: 14, autoAlpha: 0, duration: 0.5, ease: 'power3.out' }, 0.31)
      .from('.video-frame', { clipPath: 'inset(0 100% 0 0)', duration: 1.1, ease: 'power4.inOut' }, 0.38)
      .from('.video-caption', { y: 16, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0.55)
      .from('.video-notes .eyebrow', { y: 18, autoAlpha: 0, duration: 0.5, ease: 'power3.out' }, 0.55)
      .from('.video-notes h3', { y: 22, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0.6)
      .from('.video-notes p', { y: 16, autoAlpha: 0, duration: 0.55, ease: 'power3.out' }, 0.66)
      .from('.note-list li', { y: 14, autoAlpha: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06, onComplete: clearVideoTransforms }, 0.68);

    const clearWhyTransforms = () => {
      scopedEl.querySelectorAll<HTMLElement>('.why-dealers .eyebrow, .why-dealers h2, .why-grid > div:nth-child(2) > p').forEach((el) => {
        gsap.set(el, { clearProps: 'transform,opacity,visibility' });
      });
    };
    gsap.timeline({
      scrollTrigger: {
        trigger: '.why-dealers',
        start: 'top 72%',
        once: true,
        onEnter: () => scopedEl.querySelectorAll('.why-dealers').forEach((s) => s.classList.add('is-in')),
      },
    })
      .from('.why-dealers .eyebrow', { y: 18, autoAlpha: 0, duration: 0.55, ease: 'power3.out' }, 0.1)
      .from('.why-dealers h2', { y: 26, autoAlpha: 0, duration: 0.7, ease: 'power3.out' }, 0.18)
      .from('.why-grid > div:nth-child(2) > p', { y: 18, autoAlpha: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06, onComplete: clearWhyTransforms }, 0.26);

    const clearRouteTransforms = () => {
      scopedEl.querySelectorAll<HTMLElement>('.home-route-grid .section-intro .eyebrow, .home-route-grid .section-title, .home-route-grid .section-copy, .home-route-grid .intro-side .button, .route-card').forEach((el) => {
        gsap.set(el, { clearProps: 'transform,opacity,visibility' });
      });
    };
    gsap.timeline({
      scrollTrigger: {
        trigger: '.home-route-grid',
        start: 'top 72%',
        once: true,
        onEnter: () => scopedEl.querySelectorAll('.home-route-grid').forEach((s) => s.classList.add('is-in')),
      },
    })
      .from('.home-route-grid .section-intro .eyebrow', { y: 18, autoAlpha: 0, duration: 0.55, ease: 'power3.out' }, 0.1)
      .from('.home-route-grid .section-title', { y: 26, autoAlpha: 0, duration: 0.7, ease: 'power3.out' }, 0.18)
      .from('.home-route-grid .section-copy', { y: 18, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0.26)
      .from('.home-route-grid .intro-side .button', { y: 14, autoAlpha: 0, duration: 0.5, ease: 'power3.out' }, 0.31)
      .from('.route-card', { y: 26, autoAlpha: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12, onComplete: clearRouteTransforms }, 0.34);

    const clearCtaTransforms = () => {
      scopedEl.querySelectorAll<HTMLElement>('.cta-band h2, .cta-band .button').forEach((el) => {
        gsap.set(el, { clearProps: 'transform,opacity,visibility' });
      });
    };
    gsap.timeline({
      scrollTrigger: {
        trigger: '.cta-band',
        start: 'top 72%',
        once: true,
        onEnter: () => scopedEl.querySelectorAll('.cta-band').forEach((s) => s.classList.add('is-in')),
      },
    })
      .from('.cta-band h2', { y: 26, autoAlpha: 0, duration: 0.7, ease: 'power3.out' }, 0.12)
      .from('.cta-band .button', { y: 16, autoAlpha: 0, duration: 0.55, ease: 'power3.out', onComplete: clearCtaTransforms }, 0.34);
  }, scopedEl);

  return ctx;
}