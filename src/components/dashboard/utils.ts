import { Clock, CheckCircle2, XCircle } from 'lucide-react';

export const PRIMARY = '#7B2CBF';

export const statusConfig = {
  new:       { label: 'Nuevo',          color: 'text-primary',     bg: 'bg-primary/10',     border: 'border-primary/15',     dot: 'bg-primary',     hex: '#7B2CBF', icon: Clock },
  contacted: { label: 'En seguimiento', color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/15',   dot: 'bg-amber-400',   hex: '#f59e0b', icon: CheckCircle2 },
  closed:    { label: 'Cerrado',        color: 'text-[#CCFF00]',   bg: 'bg-[#CCFF00]/10',   border: 'border-[#CCFF00]/15',   dot: 'bg-[#CCFF00]',   hex: '#CCFF00', icon: XCircle },
};

export function timeAgo(d: string) {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(d).getTime()) / 60000));
  if (mins < 60) return `${mins}m`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h`;
  return `${Math.floor(mins / 1440)}d`;
}

export function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short' });
}
