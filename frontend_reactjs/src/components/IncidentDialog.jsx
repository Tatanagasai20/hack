import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createIncident, updateIncident } from '@/lib/api';

export function IncidentDialog({ open, onOpenChange, incident, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    status: 'active',
    severity: 'medium',
  });

  // 🔹 Load or reset form data when opening dialog
  useEffect(() => {
    if (incident) {
      setFormData({
        description: incident.description || incident.title || '',
        location:
          typeof incident.location === 'string'
            ? incident.location
            : incident.location?.address || '',
        status: incident.status || 'active',
        severity: incident.severity || 'medium',
      });
    } else {
      setFormData({
        description: '',
        location: '',
        status: 'active',
        severity: 'medium',
      });
    }
    setError('');
  }, [incident, open]);

  // 🛰 Auto-detect user's current location when creating a new incident
  useEffect(() => {
    if (!incident && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();

            const detectedLocation =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.display_name ||
              'Unknown Location';

            setFormData((prev) => ({
              ...prev,
              location: detectedLocation,
            }));
          } catch (error) {
            console.error('Error fetching location:', error);
          }
        },
        (error) => {
          console.warn('Geolocation not available or permission denied:', error);
        }
      );
    }
  }, [incident]);

  // ✅ Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      location: formData.location?.trim() || 'Unknown Location',
      title: formData.description.slice(0, 30),
      reported: incident?.reported || new Date().toISOString(),
    };

    try {
      if (incident) {
        await updateIncident(incident.id, payload);
      } else {
        await createIncident(payload);
      }
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error('Error saving incident:', err);
      setError(err.message || 'Failed to save incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card text-card-foreground border border-border shadow-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            {incident ? 'Edit Incident' : 'Create New Incident'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {incident
              ? 'Update the details of an existing incident.'
              : 'Record a new incident in the system.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter detailed description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder={
                  formData.location
                    ? 'Enter location (you can edit if needed)'
                    : 'Detecting your location...'
                }
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
              {!formData.location && (
                <p className="text-xs text-muted-foreground italic">
                  Please allow location access to auto-detect your area.
                </p>
              )}
            </div>

            {/* Status + Severity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) =>
                    setFormData({ ...formData, severity: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-secondary text-primary-foreground transition-all"
            >
              {loading ? 'Saving...' : incident ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
