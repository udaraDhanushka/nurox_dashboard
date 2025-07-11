import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { DoctorDashboard } from '@/components/dashboard/doctor/doctor-dashboard';
import { PharmacistDashboard } from '@/components/dashboard/pharmacist/pharmacist-dashboard';
import { LabDashboard } from '@/components/dashboard/lab/lab-dashboard';
import { InsurerDashboard } from '@/components/dashboard/insurer/insurer-dashboard';
import { AdminDashboard } from '@/components/dashboard/admin/admin-dashboard';

// List of valid roles
const validRoles = ['doctor', 'pharmacist', 'lab', 'insurer', 'admin'];

// Required for static site generation with dynamic routes
export function generateStaticParams() {
  return validRoles.map((role) => ({
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

  return (
    <DashboardLayout role={params.role}>
      {params.role === 'doctor' && <DoctorDashboard />}
      {params.role === 'pharmacist' && <PharmacistDashboard />}
      {params.role === 'lab' && <LabDashboard />}
      {params.role === 'insurer' && <InsurerDashboard />}
      {params.role === 'admin' && <AdminDashboard />}
    </DashboardLayout>
  );
}