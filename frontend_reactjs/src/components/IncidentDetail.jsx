'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Incident } from '@/lib/types';
import { MapPin, Clock, User, Tag, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function IncidentDetail({ incident, onStatusChange, onAssign }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-2xl">{incident.title}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={cn('capitalize', getSeverityColor(incident.severity))}>
                  {incident.severity}
                </Badge>
                <Badge variant="outline" className={cn('capitalize', getStatusColor(incident.status))}>
                  {incident.status}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {incident.type}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              {incident.status !== 'resolved' && (
                <Button onClick={() => onStatusChange?.('resolved')}>
                  Mark Resolved
                </Button>
              )}
              {!incident.assignedTo && (
                <Button variant="outline" onClick={onAssign}>
                  Assign
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{incident.description}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{incident.location.address}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Timeline</p>
                <p className="text-sm text-muted-foreground">
                  Reported: {new Date(incident.reportedAt).toLocaleString()}
                </p>
                {incident.resolvedAt && (
                  <p className="text-sm text-muted-foreground">
                    Resolved: {new Date(incident.resolvedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {incident.assignedTo && (
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Assigned To</p>
                  <p className="text-sm text-muted-foreground">{incident.assignedTo}</p>
                </div>
              </div>
            )}

            {incident.tags.length > 0 && (
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {incident.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

