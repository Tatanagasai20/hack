import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { IncidentTable } from '@/components/IncidentTable';
import { IncidentDialog } from '@/components/IncidentDialog';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search } from 'lucide-react';
import { getIncidents, deleteIncident } from '@/lib/api';

export default function Incidents() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [incidentToDelete, setIncidentToDelete] = useState(null);

  useEffect(() => {
    loadIncidents();
  }, []);

  useEffect(() => {
    filterIncidents();
  }, [incidents, searchQuery, activeTab]);

  const loadIncidents = async () => {
    try {
      const data = await getIncidents();
      setIncidents(data || []);
    } catch (error) {
      console.error('Error loading incidents:', error);
      // Set empty array on error to prevent crashes
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterIncidents = () => {
    let filtered = incidents;

    if (activeTab !== 'all') {
      filtered = filtered.filter((inc) => inc.status?.toLowerCase() === activeTab.toLowerCase());
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (inc) =>
          inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inc.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredIncidents(filtered);
  };

  const getStatusCounts = () => {
    return {
      all: incidents.length,
      active: incidents.filter((i) => i.status?.toLowerCase() === 'active').length,
      investigating: incidents.filter((i) => i.status?.toLowerCase() === 'investigating').length,
      resolved: incidents.filter((i) => i.status?.toLowerCase() === 'resolved').length,
      closed: incidents.filter((i) => i.status?.toLowerCase() === 'closed').length,
    };
  };

  const counts = getStatusCounts();

  const handleCreate = () => {
    setSelectedIncident(null);
    setDialogOpen(true);
  };

  const handleEdit = (incident) => {
    setSelectedIncident(incident);
    setDialogOpen(true);
  };

  const handleDelete = (incident) => {
    setIncidentToDelete(incident);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (incidentToDelete) {
      try {
        await deleteIncident(incidentToDelete.id);
        await loadIncidents();
        setDeleteDialogOpen(false);
        setIncidentToDelete(null);
      } catch (error) {
        console.error('Error deleting incident:', error);
      }
    }
  };

  const handleDialogSuccess = () => {
    loadIncidents();
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Incidents</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track city incidents
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Incident
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="active">Active ({counts.active})</TabsTrigger>
            <TabsTrigger value="investigating">
              Investigating ({counts.investigating})
            </TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({counts.resolved})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({counts.closed})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === 'all' ? 'All Incidents' : `${activeTab} Incidents`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading incidents...
                  </div>
                ) : (
                  <IncidentTable
                    incidents={filteredIncidents}
                    onRowClick={(incident) => navigate(`/incidents/${incident.id}`)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <IncidentDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          incident={selectedIncident}
          onSuccess={handleDialogSuccess}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Incident</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this incident? This action cannot be undone.
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

