'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Incident } from '@/lib/types';
import { AlertCircle, AlertTriangle, Info, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function IncidentTable({ incidents, onRowClick, onEdit, onDelete }) {
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

  const getSeverityIcon = (severity) => {
    switch (severity) {
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Severity</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Reported</TableHead>
            {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={(onEdit || onDelete) ? 7 : 6} className="text-center text-muted-foreground">
                No incidents found
              </TableCell>
            </TableRow>
          ) : (
            incidents.map((incident) => (
              <TableRow
                key={incident.id}
                className={cn(
                  'cursor-pointer hover:bg-muted/50',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(incident)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className={cn('capitalize', getSeverityColor(incident.severity))}>
                      {getSeverityIcon(incident.severity)}
                      <span className="ml-1">{incident.severity}</span>
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{incident.title}</TableCell>
                <TableCell className="capitalize">{incident.type}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('capitalize', getStatusColor(incident.status))}>
                    {incident.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground italic">
  {incident.location
    ? typeof incident.location === 'string'
      ? incident.location
      : incident.location?.address
    : 'Unknown Location'}
</TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {new Date(incident.reportedAt).toLocaleString()}
                </TableCell>
                {(onEdit || onDelete) && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(incident);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(incident);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

