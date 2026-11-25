'use client';

import { type ReactNode, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';

type Route = '/' | '/about-us' | '/services' | '/process' | '/testimonials' | '/contact' | '/privacy' | '/privacy-policy' | '/sms-terms';

const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL;

const languageFields: Record<'English' | 'Français', string[]> = {
  English: ['Health', 'Finance', 'Education', 'Legal Document', 'Immigration', 'Corporate', 'Technical', 'Marketing', 'Personal', 'Government'],
  Français: ['Santé', 'Finance', 'Éducation', 'Document juridique', 'Immigration', 'Entreprise', 'Technique', 'Marketing', 'Personnel', 'Administration'],
};

export function ServicesDropdown({ active, open, onOpenChange, onNavigate }: { active: Route; open: boolean; onOpenChange: (open: boolean) => void; onNavigate: (path: Route) => void }) {
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const HIDE_DELAY = 150;

  const SiteLink = ({ href, children, className = '', ariaCurrent }: { href: Route; children: React.ReactNode; className?: string; ariaCurrent?: 'page' }) => (
    <a className={className} href={`${base}${href === '/' ? '/' : href}`} aria-current={ariaCurrent} onClick={(event) => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); onNavigate(href); } }}>{children}</a>
  );

  const openServices = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    onOpenChange(true);
  };

  const closeServices = () => {
    closeTimer.current = setTimeout(() => { closeTimer.current = null; onOpenChange(false); }, HIDE_DELAY);
  };

  return (
    <div className="services-nav-item" onMouseEnter={openServices} onMouseLeave={closeServices}>
      <DropdownMenu open={open} onOpenChange={onOpenChange} modal={false}>
        <DropdownMenuTrigger asChild>
          <a className={`dropdown-trigger cursor-pointer flex items-center gap-1 ${active === '/services' ? 'text-primary' : ''}`} role="button" aria-haspopup="true" aria-expanded={open} onClick={(event) => { event.preventDefault(); onOpenChange(!open); }}>
            Services
            <ChevronDown className="ml-1 size-3" />
          </a>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="services-dropdown-root" onMouseEnter={openServices} onMouseLeave={closeServices}>
          <div className="services-dropdown flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-1">
              <DropdownMenuLabel className="services-dropdown-label">English</DropdownMenuLabel>
              {languageFields.English.map((field) => (
                <DropdownMenuItem key={field} className="services-dropdown-item" onSelect={() => onNavigate('/services')}>{field}</DropdownMenuItem>
              ))}
            </div>
            <div className="flex flex-col gap-1 border-l border-muted pl-6">
              <DropdownMenuLabel className="services-dropdown-label">Français</DropdownMenuLabel>
              {languageFields.Français.map((field) => (
                <DropdownMenuItem key={field} className="services-dropdown-item" onSelect={() => onNavigate('/services')}>{field}</DropdownMenuItem>
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
