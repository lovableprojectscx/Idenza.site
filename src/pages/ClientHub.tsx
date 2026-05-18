import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { ProjectPicker } from '@/components/dashboard/ProjectPicker';
import { OrgDashboard } from '@/components/dashboard/OrgDashboard';
import { Loader2 } from 'lucide-react';
import type { Project } from '@/components/dashboard/types';

export default function ClientHub() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      const { data: memberships } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id);
        
      if (!memberships || memberships.length === 0) {
        setLoading(false);
        return;
      }
      
      const orgIds = memberships.map(m => m.organization_id);
      
      const { data: orgs } = await supabase
        .from('organizations')
        .select('*')
        .in('id', orgIds);
        
      if (orgs) {
        const enrichedOrgs = orgs.map(org => ({
          ...org,
          leads_count: org.leads_count ?? 0,
          events_count: org.events_count ?? 0
        })) as Project[];

        setProjects(enrichedOrgs);
        if (enrichedOrgs.length === 1) {
          setSelectedProject(enrichedOrgs[0]);
        }
      }
      setLoading(false);
    };
    
    fetchProjects();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-muted-foreground gap-3">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-sm font-medium">Cargando tus proyectos...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">No se encontraron proyectos</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-md">Tu cuenta no está vinculada a ningún proyecto activo. Por favor, comunícate con soporte.</p>
        <button onClick={signOut} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
          Cerrar sesión
        </button>
      </div>
    );
  }

  if (selectedProject) {
    return (
      <OrgDashboard 
        project={selectedProject} 
        multiProject={projects.length > 1}
        onBack={() => setSelectedProject(null)}
        onSignOut={signOut}
        userEmail={user?.email || ''}
      />
    );
  }

  return (
    <ProjectPicker 
      projects={projects}
      onSelect={setSelectedProject}
      onSignOut={signOut}
      userEmail={user?.email || ''}
    />
  );
}
