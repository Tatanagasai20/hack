import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { getSensors, deleteSensor } from '@/lib/api';
import { SensorDialog } from '@/components/SensorDialog';
import { cn } from '@/lib/utils';

export default function Sensors() {
  const [sensors, setSensors] = useState([]);
  const [filteredSensors, setFilteredSensors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [sensorToDelete, setSensorToDelete] = useState(null);

  useEffect(() => {
    loadSensors();
  }, []);

  useEffect(() => {
    filterSensors();
  }, [sensors, searchQuery, activeTab]);

  const loadSensors = async () => {
    try {
      const data = await getSensors();
      const sensorsList = data || [];
      setSensors(sensorsList);
    } catch (error) {
      console.error('Error loading sensors:', error);
      setSensors([]);
    } finally {
      setLoading(false);
    }
  };

  const filterSensors = () => {
    let filtered = sensors;

    if (activeTab !== 'all') {
      filtered = filtered.filter((sensor) => sensor.type?.toLowerCase() === activeTab.toLowerCase());
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (sensor) =>
          sensor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sensor.type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSensors(filtered);
  };

  const getTypeCounts = () => {
    return {
      all: sensors.length,
      air_quality: sensors.filter((s) => s.type?.toLowerCase() === 'air_quality' || s.type?.toLowerCase() === 'air quality').length,
      traffic: sensors.filter((s) => s.type?.toLowerCase() === 'traffic').length,
      noise: sensors.filter((s) => s.type?.toLowerCase() === 'noise').length,
      water: sensors.filter((s) => s.type?.toLowerCase() === 'water').length,
      weather: sensors.filter((s) => s.type?.toLowerCase() === 'weather').length,
    };
  };

  const counts = getTypeCounts();

  const handleCreate = () => {
    setSelectedSensor(null);
    setDialogOpen(true);
  };

  const handleEdit = (sensor) => {
    setSelectedSensor(sensor);
    setDialogOpen(true);
  };

  const handleDelete = (sensor) => {
    setSensorToDelete(sensor);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (sensorToDelete) {
      try {
        await deleteSensor(sensorToDelete.id);
        await loadSensors();
        setDeleteDialogOpen(false);
        setSensorToDelete(null);
      } catch (error) {
        console.error('Error deleting sensor:', error);
      }
    }
  };

  const handleDialogSuccess = () => {
    loadSensors();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'online':
      case 'ok':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'maintenance':
      case 'normal':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sensors</h1>
            <p className="text-muted-foreground mt-1">
              Monitor city infrastructure sensors
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Sensor
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sensors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="air_quality">Air Quality ({counts.air_quality})</TabsTrigger>
            <TabsTrigger value="traffic">Traffic ({counts.traffic})</TabsTrigger>
            <TabsTrigger value="noise">Noise ({counts.noise})</TabsTrigger>
            <TabsTrigger value="water">Water ({counts.water})</TabsTrigger>
            <TabsTrigger value="weather">Weather ({counts.weather})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === 'all' ? 'All Sensors' : `${activeTab} Sensors`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading sensors...
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSensors.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                              No sensors found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredSensors.map((sensor) => (
                            <TableRow key={sensor.id} className="cursor-pointer hover:bg-muted/50">
                              <TableCell className="font-medium">{sensor.id}</TableCell>
                              <TableCell className="capitalize">{sensor.type || 'N/A'}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={cn('capitalize', getStatusColor(sensor.status))}>
                                  {sensor.status || 'N/A'}
                                </Badge>
                              </TableCell>
                              <TableCell>{sensor.value !== null && sensor.value !== undefined ? sensor.value : 'N/A'}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {sensor.lastUpdated ? new Date(sensor.lastUpdated).toLocaleString() : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEdit(sensor);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(sensor);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <SensorDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          sensor={selectedSensor}
          onSuccess={handleDialogSuccess}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Sensor</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this sensor? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
}

