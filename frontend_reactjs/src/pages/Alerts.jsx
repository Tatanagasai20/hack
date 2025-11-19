import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, AlertCircle, AlertTriangle, Info, Edit, Trash2 } from 'lucide-react';
import { getAlerts, deleteAlert } from '@/lib/api';
import { cn } from '@/lib/utils';
import { AlertDialog } from '@/components/AlertDialog';
import {
  AlertDialog as ConfirmDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button as ActionButton } from '@/components/ui/button';

export default function Alerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [alertToDelete, setAlertToDelete] = useState(null);

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, searchQuery, activeTab]);

  const loadAlerts = async () => {
    try {
      const data = await getAlerts();
      setAlerts(data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAlerts = () => {
    let filtered = alerts;

    if (activeTab !== 'all') {
      filtered = filtered.filter((alert) => alert.priority?.toLowerCase() === activeTab.toLowerCase());
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (alert) =>
          alert.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alert.message?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAlerts(filtered);
  };

  const getPriorityCounts = () => {
    return {
      all: alerts.length,
      critical: alerts.filter((a) => a.priority?.toLowerCase() === 'critical').length,
      high: alerts.filter((a) => a.priority?.toLowerCase() === 'high').length,
      medium: alerts.filter((a) => a.priority?.toLowerCase() === 'medium').length,
      low: alerts.filter((a) => a.priority?.toLowerCase() === 'low').length,
    };
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500 hover:bg-red-600';
      case 'high':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return <AlertCircle className="h-4 w-4" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4" />;
      case 'low':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const counts = getPriorityCounts();

  const handleCreate = () => {
    setSelectedAlert(null);
    setDialogOpen(true);
  };

  const handleEdit = (alert) => {
    setSelectedAlert(alert);
    setDialogOpen(true);
  };

  const handleDelete = (alert) => {
    setAlertToDelete(alert);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (alertToDelete) {
      try {
        await deleteAlert(alertToDelete.id);
        await loadAlerts();
        setDeleteDialogOpen(false);
        setAlertToDelete(null);
      } catch (error) {
        console.error('Error deleting alert:', error);
      }
    }
  };

  const handleDialogSuccess = () => {
    loadAlerts();
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Alerts</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage system alerts
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Alert
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="critical">Critical ({counts.critical})</TabsTrigger>
            <TabsTrigger value="high">High ({counts.high})</TabsTrigger>
            <TabsTrigger value="medium">Medium ({counts.medium})</TabsTrigger>
            <TabsTrigger value="low">Low ({counts.low})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === 'all' ? 'All Alerts' : `${activeTab} Alerts`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading alerts...
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Priority</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAlerts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                              No alerts found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredAlerts.map((alert) => (
                            <TableRow
                              key={alert.id}
                              className="cursor-pointer hover:bg-muted/50"
                            >
                              <TableCell>
                                <Badge className={cn('capitalize', getPriorityColor(alert.priority))}>
                                  {getPriorityIcon(alert.priority)}
                                  <span className="ml-1">{alert.priority || 'medium'}</span>
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                {alert.title || 'Untitled Alert'}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {alert.message || 'No message'}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {alert.timestamp
                                  ? new Date(alert.timestamp).toLocaleString()
                                  : 'Unknown'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <ActionButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEdit(alert);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </ActionButton>
                                  <ActionButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(alert);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </ActionButton>
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

        <AlertDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          alert={selectedAlert}
          onSuccess={handleDialogSuccess}
        />

        <ConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Alert</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this alert? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </ConfirmDialog>
      </div>
    </AppShell>
  );
}

