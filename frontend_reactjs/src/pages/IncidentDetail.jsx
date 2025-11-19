import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { IncidentDetail as IncidentDetailComponent } from '@/components/IncidentDetail';
import { CityMap } from '@/components/CityMap';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getIncidentById, updateIncident } from '@/lib/api';

export default function IncidentDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadIncident(params.id);
    }
  }, [params.id]);

  const loadIncident = async (id) => {
    try {
      const data = await getIncidentById(id);
      setIncident(data);
    } catch (error) {
      console.error('Error loading incident:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!incident) return;

    try {
      const updates = { status: newStatus };
      if (newStatus === 'resolved') {
        updates.resolvedAt = new Date().toISOString();
      }

      const updated = await updateIncident(incident.id, updates);
      setIncident({ ...incident, ...updated });
    } catch (error) {
      console.error('Error updating incident:', error);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading incident...</p>
        </div>
      </AppShell>
    );
  }

  if (!incident) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Incident not found</p>
          <Button className="mt-4" onClick={() => navigate('/incidents')}>
            Back to Incidents
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/incidents')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Incidents
        </Button>

        <IncidentDetailComponent
          incident={incident}
          onStatusChange={handleStatusChange}
          onAssign={() => console.log('Assign incident')}
        />

        {incident.location && (
          <CityMap
            markers={[
              {
                id: incident.id,
                position: [incident.location.lat || 0, incident.location.lng || 0],
                title: incident.title,
                description: incident.description,
                type: incident.type,
                status: incident.severity,
              },
            ]}
            center={[incident.location.lat || 0, incident.location.lng || 0]}
            zoom={15}
          />
        )}
      </div>
    </AppShell>
  );
}

