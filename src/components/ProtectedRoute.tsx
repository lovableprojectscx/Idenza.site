import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

// CRM privado — solo el admin (Jack) tiene acceso.
// No hay dashboard de clientes; cualquier ruta protegida
// exige autenticación y, si requireAdmin=true, rol de admin.
const ProtectedRoute = ({ children, requireAdmin = false }: Props) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-primary/50" />
      </div>
    );
  }

  if (!user) return <Navigate to="/hub/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/hub/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
