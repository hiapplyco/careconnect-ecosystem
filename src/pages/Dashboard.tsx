
import { useEffect } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Routes, Route } from "react-router-dom";
import DashboardOverview from "@/pages/dashboard/DashboardOverview";
import DashboardSchedule from "@/pages/dashboard/DashboardSchedule";
import DashboardClients from "@/pages/dashboard/DashboardClients";
import DashboardEarnings from "@/pages/dashboard/DashboardEarnings";
import DashboardKnowledge from "@/pages/dashboard/DashboardKnowledge";
import DashboardGrowth from "@/pages/dashboard/DashboardGrowth";
import DashboardCommunity from "@/pages/dashboard/DashboardCommunity";
import DashboardReviews from "@/pages/dashboard/DashboardReviews";
import DashboardSettings from "@/pages/dashboard/DashboardSettings";
import DashboardProfile from "@/pages/dashboard/DashboardProfile";
import PIAProfile from "@/pages/admin/PIAProfile";
import { PIATable } from "@/components/admin/pia/PIATable";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const Dashboard = () => {
  // Use the hook to check authentication status
  useAuthRedirect({ role: 'caregiver' });

  return (
    <DashboardShell>
      <Routes>
        <Route index element={<DashboardOverview />} />
        <Route path="profile" element={<DashboardProfile />} />
        <Route path="schedule" element={<DashboardSchedule />} />
        <Route path="clients" element={<DashboardClients />} />
        <Route path="earnings" element={<DashboardEarnings />} />
        <Route path="knowledge" element={<DashboardKnowledge />} />
        <Route path="growth" element={<DashboardGrowth />} />
        <Route path="community" element={<DashboardCommunity />} />
        <Route path="reviews" element={<DashboardReviews />} />
        <Route path="settings" element={<DashboardSettings />} />
        <Route path="admin/pia/:id" element={<PIAProfile />} />
        <Route path="admin/pia-table" element={<PIATable />} />
      </Routes>
    </DashboardShell>
  );
};

export default Dashboard;
