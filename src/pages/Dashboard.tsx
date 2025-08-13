import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { MetricCard } from '@/components/MetricCard';
import { BugChart } from '@/components/BugChart';
import { CustomerSupportTable } from '@/components/CustomerSupportTable';
import { DevelopmentPipeline } from '@/components/DevelopmentPipeline';
import { generatePDF } from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';
import { Bug, TrendingUp, Users, Clock, Shield, Zap } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    bugReports, 
    customerTickets, 
    developmentTickets, 
    dashboardMetrics, 
    isLoading, 
    error, 
    refetch 
  } = useDashboardData();
  const { toast } = useToast();

  const handleExportPdf = async () => {
    try {
      await generatePDF('dashboard-content', 'z10-dashboard-report');
      toast({
        title: "PDF Generated",
        description: "Dashboard report has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  if (isLoading) {
    return (
      <DashboardLayout onExportPdf={handleExportPdf}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout onExportPdf={handleExportPdf}>
      <div id="dashboard-content" className="space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Z10 Updates - August 13, 2025
          </h1>
          <p className="text-muted-foreground">
            Development progress, bug tracking, and customer support overview
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            title="Bugs Fixed This Week"
            value={286}
            change={{ value: "+18%", trend: "up" }}
            icon={Bug}
            description="Marked as Dev Done"
          />
          <MetricCard
            title="Total Tickets Resolved"
            value={328}
            change={{ value: "+12%", trend: "up" }}
            icon={TrendingUp}
            description="Including Tasks/Stories/Bugs"
          />
          <MetricCard
            title="Blocker Bugs"
            value={28}
            priority="blocker"
            icon={Shield}
            description="Highest priority issues"
          />
          <MetricCard
            title="Critical Bugs"
            value={157}
            priority="critical"
            icon={Bug}
            description="Requires immediate attention"
          />
          <MetricCard
            title="High Priority Bugs"
            value={466}
            priority="high"
            icon={Clock}
            description="Important but not critical"
          />
          <MetricCard
            title="Active Customer Support"
            value={4}
            icon={Users}
            description="Live & WIP tickets"
          />
        </div>

        {/* Charts Section */}
        <BugChart />

        {/* Stability Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Functional Stability"
            value="91%"
            change={{ value: "+2%", trend: "up" }}
            icon={Zap}
            description="Webstore, DAM, Tenant issues"
          />
          <MetricCard
            title="Performance"
            value="4%"
            priority="critical"
            icon={TrendingUp}
            description="Cart checkout slowness"
          />
          <MetricCard
            title="Queries"
            value="3%"
            priority="medium"
            icon={Bug}
            description="Checkout & font issues"
          />
          <MetricCard
            title="Look & Feel"
            value="2%"
            priority="low"
            icon={Shield}
            description="UI & display issues"
          />
        </div>

        {/* Customer Support Table */}
        <CustomerSupportTable customerTickets={customerTickets} />

        {/* Development Pipeline */}
        <DevelopmentPipeline />

        {/* Admin Forms - Only show for admins */}
        {isAdmin && (
          <AdminForms 
            onDataUpdate={refetch}
            bugReports={bugReports}
            customerTickets={customerTickets}
            developmentTickets={developmentTickets}
          />
        )}

        {/* Footer Information */}
        <div className="bg-gradient-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-3">Security & Infrastructure Updates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Security Fixes - In Progress</h4>
              <p className="text-muted-foreground">
                Customer reported vulnerabilities are being addressed with priority fixes.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Commerce Connector 2.0 - 96% Complete</h4>
              <p className="text-muted-foreground">
                CC2.0 integration completed with additional requirements implementation.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">GraphQL Phase III</h4>
              <p className="text-muted-foreground">
                Development on hold due to bandwidth. Training sessions continue (last session: Aug 20th).
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Hotfix Version 10.2.1.2</h4>
              <p className="text-muted-foreground">
                Planned for critical priority tenant tickets across multiple customers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};