import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { DoctorDashboard } from '@/components/dashboard/doctor/doctor-dashboard';
import { PharmacistDashboard } from '@/components/dashboard/pharmacist/pharmacist-dashboard';
import { LabDashboard } from '@/components/dashboard/lab/lab-dashboard';
import { InsurerDashboard } from '@/components/dashboard/insurer/insurer-dashboard';
import { AdminDashboard } from '@/components/dashboard/admin/admin-dashboard';
import { HospitalDashboard } from '@/components/dashboard/hospital/hospital-dashboard';
import { PharmacyDashboard } from '@/components/dashboard/pharmacy/pharmacy-dashboard';
import { getValidRoutes } from '@/lib/roles';

// Get all valid routes from roles configuration
const validRoles = getValidRoutes();

// Required for static site generation with dynamic routes
export function generateStaticParams() {
  return validRoles.map(role => ({
    role: role,
  }));
}

interface DashboardPageProps {
  params: {
    role: string;
  };
}

export default function DashboardPage({ params }: DashboardPageProps) {
  // Redirect to login if role is not valid
  if (!validRoles.includes(params.role)) {
    redirect('/login');
  }

  const renderDashboard = () => {
    switch (params.role) {
      case 'doctor':
        return <DoctorDashboard />;
      case 'pharmacist':
        return <PharmacistDashboard />;
      case 'mlt':
        return <LabDashboard />;
      case 'lab':
        return <LabDashboard />;
      case 'hospital':
        return <HospitalDashboard />;
      case 'pharmacy':
        return <PharmacyDashboard />;
      case 'insurer':
        return <InsurerDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Access denied. This role is restricted to mobile app only.</div>;
    }
  };

  return <DashboardLayout role={params.role}>{renderDashboard()}</DashboardLayout>;
}
