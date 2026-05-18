import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { OrgDashboard } from '@/components/dashboard/OrgDashboard';
import type { Project } from '@/components/dashboard/types';

export default function TrackerView() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('token', token)
        .single();
      
      if (data && !error) {
        // Enforce required count fields if missing from public query
        setProject({
          ...data,
          leads_count: data.leads_count ?? 0,
          events_count: data.events_count ?? 0
        } as Project);
      }
      setLoading(false);
    };
    fetchProject();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-muted-foreground gap-3">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-sm font-medium">Cargando panel de analítica...</p>
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/hub/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <OrgDashboard 
        project={project} 
        multiProject={false} 
        onBack={() => {}} 
        onSignOut={() => { window.location.href = '/hub/login'; }} 
        userEmail="Invitado"
      />
    </div>
  );
}
