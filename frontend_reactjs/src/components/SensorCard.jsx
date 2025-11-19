import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sensor } from '@/lib/types';
import { MapPin, Activity, Wind, Volume2, Droplet, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SensorCard({ sensor, onClick }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSensorIcon = () => {
    switch (sensor.type) {
      case 'air_quality':
        return <Wind className="h-5 w-5" />;
      case 'traffic':
        return <Activity className="h-5 w-5" />;
      case 'noise':
        return <Volume2 className="h-5 w-5" />;
      case 'water':
        return <Droplet className="h-5 w-5" />;
      case 'weather':
        return <Cloud className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <Card
      className={cn(
        'hover:shadow-lg transition-shadow cursor-pointer',
        onClick && 'hover:border-primary'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getSensorIcon()}
            <CardTitle className="text-lg">{sensor.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn('h-2 w-2 rounded-full', getStatusColor(sensor.status))} />
            <Badge variant="outline" className="capitalize">
              {sensor.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{sensor.location.address}</span>
          </div>
          {sensor.lastReading && (
            <div className="mt-4 rounded-md bg-secondary p-3">
              <div className="text-2xl font-bold">
                {sensor.lastReading.value} {sensor.lastReading.unit}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Last reading: {new Date(sensor.lastReading.timestamp).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

