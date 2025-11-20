import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { TimeSeriesChart } from '@/components/TimeSeriesChart';
import { KPICard } from '@/components/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Activity, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { getAlerts, getIncidents, getPredictions } from '@/lib/api';

export default function Analytics() {
  const [activeAlertsCount, setActiveAlertsCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const [predictionData, setPredictionData] = useState([]);
  const [predictionError, setPredictionError] = useState(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setPredictionError(null);
      const [alertsData, incidentsData, predictionsResult] = await Promise.allSettled([
        getAlerts(),
        getIncidents(),
        getPredictions(),
      ]);

      // Get active alerts count (critical + high priority)
      const alerts = alertsData.status === 'fulfilled' ? alertsData.value : [];
      const activeAlerts = alerts.filter(
        (a) => a.priority === 'critical' || a.priority === 'high'
      ).length;
      setActiveAlertsCount(activeAlerts);

      if (predictionsResult.status === 'fulfilled') {
        setPredictionData(predictionsResult.value || []);
      } else {
        setPredictionData([]);
        setPredictionError(
          predictionsResult.reason?.message || 'Prediction service unavailable'
        );
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
      setPredictionError(error.message);
      setPredictionData([]);
    } finally {
      setLoading(false);
    }
  };

  const averagePredictedSpeed =
    predictionData.length > 0
      ? Math.round(
          predictionData.reduce(
            (sum, item) => sum + (item.predicted_speed || 0),
            0
          ) / predictionData.length
        )
      : null;
  const mockTimeSeriesData = Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    value: Math.floor(Math.random() * 50) + 30,
  }));

  const incidentsByType = [
    { type: 'Traffic', count: 45 },
    { type: 'Infrastructure', count: 32 },
    { type: 'Safety', count: 28 },
    { type: 'Environment', count: 19 },
    { type: 'Public Services', count: 15 },
  ];

  const incidentsBySeverity = [
    { name: 'Critical', value: 8, color: '#ef4444' },
    { name: 'High', value: 23, color: '#f97316' },
    { name: 'Medium', value: 56, color: '#eab308' },
    { name: 'Low', value: 52, color: '#3b82f6' },
  ];

  const responseTimeData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
    avgTime: Math.floor(Math.random() * 30) + 15,
  }));

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Insights and trends for city operations
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            label="Avg Response Time"
            value="18 min"
            change={-8}
            trend="down"
            icon={<Activity className="h-5 w-5" />}
          />
          <KPICard
            label="Resolution Rate"
            value="94.2%"
            change={3.1}
            trend="up"
            icon={<CheckCircle className="h-5 w-5" />}
          />
          <KPICard
            label="Active Alerts"
            value={activeAlertsCount}
            change={-25}
            trend="down"
            icon={<AlertCircle className="h-5 w-5" />}
          />
          <KPICard
            label="Performance Score"
            value="8.7/10"
            change={5}
            trend="up"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          {averagePredictedSpeed !== null && (
            <KPICard
              label="AI Avg Speed"
              value={`${averagePredictedSpeed} km/h`}
              change={0}
              trend="up"
              icon={<TrendingUp className="h-5 w-5" />}
            />
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <TimeSeriesChart
            title="Incident Volume (24h)"
            data={mockTimeSeriesData}
            color="#ef4444"
            yAxisLabel="Incidents"
          />
          <TimeSeriesChart
            title="Sensor Alerts (24h)"
            data={mockTimeSeriesData.map((d) => ({
              ...d,
              value: Math.floor(Math.random() * 20) + 10,
            }))}
            color="#f97316"
            yAxisLabel="Alerts"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Incidents by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incidentsByType}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Incidents by Severity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incidentsBySeverity}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incidentsBySeverity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AI Traffic Predictions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Live feed from the FastAPI model service
            </p>
          </CardHeader>
          <CardContent>
            {predictionError && (
              <p className="text-sm text-destructive mb-4">{predictionError}</p>
            )}
            {predictionData.length === 0 && !predictionError && (
              <p className="text-sm text-muted-foreground">
                Waiting for prediction service to publish data...
              </p>
            )}
            <div className="space-y-4">
              {predictionData.slice(0, 6).map((item) => (
                <div
                  key={item.id || item.location}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-semibold">{item.location}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.latitude?.toFixed(3)}, {item.longitude?.toFixed(3)} · Hour{' '}
                      {item.hour}:00
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      {item.predicted_speed?.toFixed(1) ?? '--'} km/h
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Congestion: {item.congestion_index ?? '--'}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Response Time by Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" />
                <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="avgTime" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Power BI Embedded Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Power BI Dashboard Integration
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Configure VITE_PUBLIC_POWERBI_KEY in environment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

