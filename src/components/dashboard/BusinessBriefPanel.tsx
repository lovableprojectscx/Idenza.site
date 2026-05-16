import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, CheckCircle2, Building2, Users, Zap, Package, Target, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { BusinessBrief } from './types';
import { parseBrief } from './types';

interface Props {
  projectId: string;
  description: string | null;
  onSaved: (description: string) => void;
  onGoToAudit?: () => void;
}

const FIELDS: {
  key: keyof Omit<BusinessBrief, 'v'>;
  label: string;
  placeholder: string;
  icon: React.ElementType;
  hint: string;
}[] = [
  {
    key: 'summary',
    label: 'Resumen del negocio',
    placeholder: 'Ej: Somos una clínica odontológica en Medellín con 10 años de experiencia atendiendo familias...',
    icon: Building2,
    hint: 'Describe tu empresa en 2-3 oraciones. Qué hacés, dónde estás, cuánto tiempo llevás.',
  },
  {
    key: 'audience',
    label: 'Audiencia objetivo',
    placeholder: 'Ej: Familias de clase media-alta en Medellín, personas entre 25-55 años que buscan tratamientos de ortodoncia...',
    icon: Users,
    hint: 'A quién le vendés. Sé específico con edad, ubicación, necesidades.',
  },
  {
    key: 'value_prop',
    label: 'Propuesta de valor / Diferencial',
    placeholder: 'Ej: Somos la única clínica en la zona con tecnología 3D para diseño de sonrisas y turnos el mismo día...',
    icon: Zap,
    hint: 'Por qué te eligen a vos y no a la competencia. Qué te hace único.',
  },
  {
    key: 'services',
    label: 'Productos y servicios',
    placeholder: 'Ej: Ortodoncia, implantes, blanqueamiento, diseño de sonrisa, odontopediatría. Precios desde $200.000 COP...',
    icon: Package,
    hint: 'Lista tus servicios principales. Incluí rangos de precio si podés.',
  },
  {
    key: 'goals',
    label: 'Objetivos del sitio web',
    placeholder: 'Ej: Que los visitantes agenden una consulta de diagnóstico gratuita. También que descarguen nuestra guía de precios...',
    icon: Target,
    hint: 'Qué acción querés que hagan los visitantes. Cuál es el objetivo principal.',
  },
  {
    key: 'challenges',
    label: 'Desafíos actuales',
    placeholder: 'Ej: Muchas visitas pero pocos turnos agendados. Competimos con clínicas más baratas. No sé de qué ciudad me llegan las visitas...',
    icon: AlertCircle,
    hint: 'Qué problemas tenés hoy con tu web o negocio digital. Sé honesto.',
  },
];

// Umbral mínimo para considerar un campo "completado" — consistente con la barra de progreso
const MIN_CHARS = 10;

export function BusinessBriefPanel({ projectId, description, onSaved, onGoToAudit }: Props) {
  const existing = parseBrief(description);

  const [form, setForm] = useState<Omit<BusinessBrief, 'v'>>({
    summary:    existing?.summary    || '',
    audience:   existing?.audience   || '',
    value_prop: existing?.value_prop || '',
    services:   existing?.services   || '',
    goals:      existing?.goals      || '',
    challenges: existing?.challenges || '',
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasSavedOnce, setHasSavedOnce] = useState(!!existing);
  const [error, setError] = useState('');

  // Usa el mismo umbral en ambos lugares
  const filled = FIELDS.filter(f => form[f.key].trim().length >= MIN_CHARS).length;
  const isComplete = filled === FIELDS.length;

  const handleSave = async () => {
    const incomplete = FIELDS.find(f => form[f.key].trim().length < MIN_CHARS);
    if (incomplete) {
      setError(`El campo "${incomplete.label}" es muy corto. Agregá más detalle.`);
      return;
    }

    setSaving(true);
    setError('');

    const brief: BusinessBrief = { v: 1, ...form };
    const jsonDescription = JSON.stringify(brief);

    const { error: dbError } = await supabase
      .from('organizations')
      .update({ description: jsonDescription })
      .eq('id', projectId);

    if (dbError) {
      setError('Error al guardar. Verificá tu conexión e intentá de nuevo.');
    } else {
      setSaved(true);
      setHasSavedOnce(true);
      onSaved(jsonDescription);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-mono text-primary/60 uppercase tracking-[0.3em] mb-2">Perfil de negocio</div>
        <h2 className="text-xl font-bold font-sora text-white/90 mb-1">Contexto para el Asesor IA</h2>
        <p className="text-sm text-white/30 leading-relaxed">
          Esta información le permite al Asesor IA conocer tu negocio en profundidad y darte recomendaciones realmente útiles, no consejos genéricos.
        </p>
      </div>

      {/* Barra de progreso */}
      <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
        <div className="flex gap-1 flex-1">
          {FIELDS.map((f, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                form[f.key].trim().length >= MIN_CHARS ? 'bg-[#CCFF00]' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-mono text-white/25 shrink-0">{filled}/6</span>
        {isComplete && onGoToAudit && (
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onGoToAudit}
            className="flex items-center gap-1.5 text-[10px] text-[#CCFF00] font-mono bg-[#CCFF00]/8 border border-[#CCFF00]/15 px-2.5 py-1 rounded-lg hover:bg-[#CCFF00]/15 transition-colors shrink-0"
          >
            <CheckCircle2 size={10} />
            Ver auditoría
            <ArrowRight size={10} />
          </motion.button>
        )}
      </div>

      {/* Campos */}
      <div className="space-y-4">
        {FIELDS.map((field, i) => {
          const Icon = field.icon;
          const val = form[field.key];
          const done = val.trim().length >= MIN_CHARS;

          return (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-[#080d1a] border rounded-2xl p-4 sm:p-5 transition-all duration-200 ${
                done ? 'border-emerald-500/15' : 'border-white/5 hover:border-white/8'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${done ? 'bg-emerald-500/15' : 'bg-white/[0.04]'}`}>
                  <Icon size={12} className={done ? 'text-[#CCFF00]' : 'text-white/30'} />
                </div>
                <label className={`text-sm font-semibold ${done ? 'text-white/80' : 'text-white/50'}`}>
                  {field.label}
                </label>
                {!done && val.trim().length > 0 && (
                  <span className="ml-auto text-[10px] font-mono text-white/15">
                    {MIN_CHARS - val.trim().length} caracteres más
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/20 mb-3 leading-relaxed">{field.hint}</p>
              <textarea
                value={val}
                onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                rows={2}
                className="w-full bg-white/[0.03] border border-white/6 hover:border-white/10 focus:border-primary/30 rounded-xl px-4 py-3 text-sm text-white/70 placeholder:text-white/10 outline-none transition-all duration-200 resize-none leading-relaxed"
              />
            </motion.div>
          );
        })}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400/70 text-xs bg-red-500/6 border border-red-500/10 rounded-xl px-4 py-3">
          <AlertCircle size={13} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <p className="text-xs text-white/15">
          {hasSavedOnce ? 'Perfil guardado — podés editarlo cuando quieras.' : 'Aún no guardaste este perfil.'}
        </p>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            saved
              ? 'bg-emerald-500/15 border border-emerald-500/25 text-[#CCFF00]'
              : 'bg-primary/15 border border-primary/20 text-primary/80 hover:bg-primary/25 hover:text-primary disabled:opacity-40'
          }`}
        >
          {saving ? (
            <><Loader2 size={14} className="animate-spin" />Guardando...</>
          ) : saved ? (
            <><CheckCircle2 size={14} />Guardado</>
          ) : (
            <><Save size={14} />Guardar perfil</>
          )}
        </motion.button>
      </div>
    </div>
  );
}
