import React from 'react';
import { Badge } from './ui/badge';

export function SectionHeader({ eyebrow, title, description, align = 'left', action, inverted = false }) {
  const alignment = align === 'center' ? 'mx-auto text-center items-center' : 'items-start';

  return (
    <div className={`flex max-w-3xl flex-col ${alignment}`}>
      {eyebrow ? <Badge variant={inverted ? 'solid' : 'default'} className={inverted ? 'bg-[#8A9C7A] text-white' : ''}>{eyebrow}</Badge> : null}
      <h2 className={`mt-4 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-5xl ${inverted ? 'text-white' : 'text-[var(--cpl-dark)]'}`}>
        {title}
      </h2>
      {description ? <p className={`mt-5 max-w-2xl text-sm leading-7 sm:text-base ${inverted ? 'text-white/60' : 'text-[var(--cpl-dark-muted)]'}`}>{description}</p> : null}
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}
