import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { CityMap } from '@/components/CityMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getIncidents, getSensors, getCCTVCameras } from '@/lib/api';

export default function Map() {
  const [incidents, setIncidents] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      const [incidentsData, sensorsData, camerasData] = await Promise.allSettled([
        getIncidents().then(data => (data || []).filter(inc => inc.status?.toLowerCase() === 'active')),
        getSensors().then(data => (data || []).filter(s => s.status?.toLowerCase() === 'online')),
        getCCTVCameras().then(data => (data || []).filter(c => c.status?.toLowerCase() === 'online')),
      ]);

      // Handle each promise result independently
      setIncidents(incidentsData.status === 'fulfilled' ? incidentsData.value : []);
      setSensors(sensorsData.status === 'fulfilled' ? sensorsData.value : []);
      setCameras(camerasData.status === 'fulfilled' ? camerasData.value : []);
    } catch (error) {
      console.error('Error loading map data:', error);
      // Set empty arrays on error to prevent crashes
      setIncidents([]);
      setSensors([]);
      setCameras([]);
    }
  };

  const getMapMarkers = () => {
    let markers = [];

    if (activeTab === 'all' || activeTab === 'incidents') {
      markers = [
        ...markers,
        ...incidents.map((inc) => ({
          id: inc.id,
          position: [inc.location?.lat || 0, inc.location?.lng || 0],
          title: inc.title,
          description: inc.description,
          type: 'incident',
          status: inc.severity,
        })),
      ];
    }

    if (activeTab === 'all' || activeTab === 'sensors') {
      markers = [
        ...markers,
        ...sensors.map((sensor) => ({
          id: sensor.id,
          position: [sensor.location?.lat || 0, sensor.location?.lng || 0],
          title: sensor.name,
          description: `${sensor.type} sensor`,
          type: 'sensor',
          status: sensor.status,
        })),
      ];
    }

    if (activeTab === 'all' || activeTab === 'cameras') {
      markers = [
        ...markers,
        ...cameras.map((cam) => ({
          id: cam.id,
          position: [cam.location?.lat || 0, cam.location?.lng || 0],
          title: cam.name,
          description: 'CCTV Camera',
          type: 'camera',
          status: cam.status,
        })),
      ];
    }

    return markers;
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">City Map</h1>
          <p className="text-muted-foreground mt-1">
            Real-time geospatial view of city infrastructure
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="incidents">
              Incidents
              <Badge variant="secondary" className="ml-2">
                {incidents.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="sensors">
              Sensors
              <Badge variant="secondary" className="ml-2">
                {sensors.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="cameras">
              Cameras
              <Badge variant="secondary" className="ml-2">
                {cameras.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <CityMap markers={getMapMarkers()} center={[40.7128, -74.006]} zoom={12} />
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{incidents.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Showing on map
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Online Sensors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sensors.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Actively monitoring
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active Cameras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cameras.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Live streaming
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

