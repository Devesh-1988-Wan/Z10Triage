import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface AnnouncementWidgetProps {
  title?: string;
  description?: string;
  announcements?: {
    id: string;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success' | 'important';
    date: string;
    author: string;
  }[];
}

const typeIcons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  important: Bell
};

const typeColors = {
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  warning: 'bg-orange-100 text-orange-800 border-orange-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  important: 'bg-red-100 text-red-800 border-red-200'
};

export const AnnouncementWidget: React.FC<AnnouncementWidgetProps> = ({ 
  title = "Announcements", 
  description = "Important updates and notifications",
  announcements = [] 
}) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.map((announcement) => {
            const IconComponent = typeIcons[announcement.type];
            return (
              <div
                key={announcement.id}
                className={`p-4 rounded-lg border-l-4 ${typeColors[announcement.type]}`}
              >
                <div className="flex items-start gap-3">
                  <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold">{announcement.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {announcement.type}
                      </Badge>
                    </div>
                    <p className="text-sm opacity-90">{announcement.content}</p>
                    <div className="flex items-center gap-2 text-xs opacity-75">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(announcement.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{announcement.author}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};