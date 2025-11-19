import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { KPICard } from '@/components/KPICard';
import { IncidentTable } from '@/components/IncidentTable';
import { TimeSeriesChart } from '@/components/TimeSeriesChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Radio, Camera, Activity } from 'lucide-react';
import { getIncidents, getActiveIncidentsCount, getOnlineSensorsCount, getOnlineCamerasCount } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeIncidentsCount, setActiveIncidentsCount] = useState(0);
  const [onlineSensorsCount, setOnlineSensorsCount] = useState(0);
  const [onlineCamerasCount, setOnlineCamerasCount] = useState(0);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('urbanopsUser');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
      loadDashboardData();
    }
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('urbanopsUser');
    navigate('/login');
  };

  // Load incidents data from backend API
  const loadDashboardData = async () => {
    try {
      const [incidentsData, activeCount, sensorsCount, camerasCount] = await Promise.allSettled([
        getIncidents(),
        getActiveIncidentsCount(),
        getOnlineSensorsCount(),
        getOnlineCamerasCount(),
      ]);

      // Get recent 5 incidents, handle errors gracefully
      const incidents = incidentsData.status === 'fulfilled' ? incidentsData.value : [];
      const recentIncidents = (incidents || []).slice(0, 5);
      setIncidents(recentIncidents);
      setActiveIncidentsCount(activeCount.status === 'fulfilled' ? activeCount.value : 0);
      setOnlineSensorsCount(sensorsCount.status === 'fulfilled' ? sensorsCount.value : 0);
      setOnlineCamerasCount(camerasCount.status === 'fulfilled' ? camerasCount.value : 0);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set defaults on error
      setIncidents([]);
      setActiveIncidentsCount(0);
      setOnlineSensorsCount(0);
      setOnlineCamerasCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Mock chart data
  const mockChartData = Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    value: Math.floor(Math.random() * 50) + 50,
  }));

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header with user info + logout */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Real-time overview of city operations
            </p>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.name} ({user.role})
              </span>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            label="Active Incidents"
            value={activeIncidentsCount}
            change={-12}
            trend="down"
            icon={<AlertCircle className="h-5 w-5" />}
          />
          <KPICard
            label="Online Sensors"
            value={onlineSensorsCount}
            change={3}
            trend="up"
            icon={<Radio className="h-5 w-5" />}
          />
          <KPICard
            label="CCTV Cameras"
            value={onlineCamerasCount}
            change={0}
            trend="neutral"
            icon={<Camera className="h-5 w-5" />}
          />
          <KPICard
            label="System Health"
            value="98.5%"
            change={1.2}
            trend="up"
            icon={<Activity className="h-5 w-5" />}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TimeSeriesChart
            title="Incident Trends (24h)"
            data={mockChartData}
            color="#ef4444"
            yAxisLabel="Incidents"
          />
          <TimeSeriesChart
            title="Sensor Activity (24h)"
            data={mockChartData.map((d) => ({
              ...d,
              value: Math.floor(Math.random() * 30) + 70,
            }))}
            color="#3b82f6"
            yAxisLabel="Readings"
          />
        </div>

        {/* Recent Incidents Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading incidents...
              </div>
            ) : (
              <IncidentTable
                incidents={incidents}
                onRowClick={(incident) => navigate(`/incidents/${incident.id}`)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

