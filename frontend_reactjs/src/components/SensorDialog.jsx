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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createSensor, updateSensor } from '@/lib/api';

export function SensorDialog({ open, onOpenChange, sensor, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: 'traffic',
    status: 'online',
    value: 0,
  });

  useEffect(() => {
    if (sensor) {
      setFormData({
        type: sensor.type || 'traffic',
        status: sensor.status || 'online',
        value: sensor.value || sensor.lastReading?.value || 0,
      });
    } else {
      setFormData({
        type: 'traffic',
        status: 'online',
        value: 0,
      });
    }
    setError('');
  }, [sensor, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (sensor) {
        await updateSensor(sensor.id, formData);
      } else {
        await createSensor(formData);
      }
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      setError(err.message || 'Failed to save sensor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{sensor ? 'Edit Sensor' : 'Create New Sensor'}</DialogTitle>
          <DialogDescription>
            {sensor ? 'Update sensor details' : 'Add a new sensor to the system'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="traffic">Traffic</SelectItem>
                    <SelectItem value="air_quality">Air Quality</SelectItem>
                    <SelectItem value="noise">Noise</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="weather">Weather</SelectItem>
                    <SelectItem value="Temperature">Temperature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="OK">OK</SelectItem>
                    <SelectItem value="NORMAL">NORMAL</SelectItem>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, value: (parseFloat(formData.value) || 0) - 1 })}
                >
                  -
                </Button>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  placeholder="Enter sensor value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                  className="flex-1"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, value: (parseFloat(formData.value) || 0) + 1 })}
                >
                  +
                </Button>
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : sensor ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

