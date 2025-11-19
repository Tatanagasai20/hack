import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, MapPin, Edit, Trash2 } from 'lucide-react';
import { getCCTVCameras, deleteCamera } from '@/lib/api';
import { CameraDialog } from '@/components/CameraDialog';
import { cn } from '@/lib/utils';

export default function CCTV() {
  const [cameras, setCameras] = useState([]);
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [cameraToDelete, setCameraToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    loadCameras();
  }, []);

  useEffect(() => {
    filterCameras();
  }, [cameras, searchQuery]);

  const loadCameras = async () => {
    try {
      const data = await getCCTVCameras();
      setCameras(data || []);
    } catch (error) {
      console.error('Error loading cameras:', error);
      setCameras([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCameras = () => {
    let filtered = cameras;

    if (searchQuery) {
      filtered = filtered.filter(
        (camera) =>
          camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          camera.location?.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCameras(filtered);
  };

  const getStatusCounts = () => {
    return {
      online: cameras.filter((c) => c.status?.toLowerCase() === 'online').length,
      offline: cameras.filter((c) => c.status?.toLowerCase() === 'offline').length,
      maintenance: cameras.filter((c) => c.status?.toLowerCase() === 'maintenance').length,
    };
  };

  const counts = getStatusCounts();

  const handleCreate = () => {
    setSelectedCamera(null);
    setDialogOpen(true);
  };

  const handleEdit = (camera) => {
    setSelectedCamera(camera);
    setDialogOpen(true);
  };

  const handleDelete = (camera) => {
    setCameraToDelete(camera);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (cameraToDelete) {
      try {
        await deleteCamera(cameraToDelete.id);
        await loadCameras();
        setDeleteDialogOpen(false);
        setCameraToDelete(null);
      } catch (error) {
        console.error('Error deleting camera:', error);
      }
    }
  };

  const handleDialogSuccess = () => {
    loadCameras();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">CCTV Cameras</h1>
            <p className="text-muted-foreground mt-1">
              Monitor live camera feeds across the city
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Camera
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cameras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Online: {counts.online}
            </Badge>
            <Badge variant="outline" className="bg-red-100 text-red-800">
              Offline: {counts.offline}
            </Badge>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              Maintenance: {counts.maintenance}
            </Badge>
          </div>
        </div>

        <Tabs value={viewMode} onValueChange={setViewMode}>
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-6">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading cameras...
              </div>
            ) : filteredCameras.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <p className="text-center text-muted-foreground">No cameras found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {filteredCameras.map((camera) => (
                  <div key={camera.id} className="space-y-2">
                    <VideoPlayer
                      title={camera.name}
                      streamUrl={camera.streamUrl || ''}
                      status={camera.status}
                      lastSnapshot={camera.lastSnapshot}
                      onFullscreen={() => console.log('Fullscreen', camera.id)}
                    />
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{camera.location?.address || camera.location || 'Unknown Location'}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <Badge variant="outline" className={cn('capitalize', getStatusColor(camera.status))}>
                                {camera.status || 'offline'}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(camera)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(camera)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="table" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Cameras</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading cameras...
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCameras.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                              No cameras found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredCameras.map((camera) => (
                            <TableRow key={camera.id} className="cursor-pointer hover:bg-muted/50">
                              <TableCell className="font-medium">{camera.id}</TableCell>
                              <TableCell>{camera.name || `Camera ${camera.id}`}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {camera.location?.address || camera.location || 'Unknown Location'}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={cn('capitalize', getStatusColor(camera.status))}>
                                  {camera.status || 'offline'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {camera.lastUpdated ? new Date(camera.lastUpdated).toLocaleString() : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEdit(camera);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(camera);
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

        <CameraDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          camera={selectedCamera}
          onSuccess={handleDialogSuccess}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Camera</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this camera? This action cannot be undone.
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

