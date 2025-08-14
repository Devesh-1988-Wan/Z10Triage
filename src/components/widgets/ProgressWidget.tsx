import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Clock, CheckCircle } from 'lucide-react';

interface ProgressWidgetProps {
  title?: string;
  description?: string;
  data?: {
    projectName: string;
    completion: number;
    status: 'on-track' | 'delayed' | 'completed' | 'planning';
    dueDate: string;
    team: string;
  }[];
}

const defaultData = [
  {
    projectName: "Commerce Connector 2.0",
    completion: 96,
    status: 'on-track' as const,
    dueDate: "2024-08-30",
    team: "Backend Team"
  },
  {
    projectName: "GraphQL Phase III",
    completion: 45,
    status: 'delayed' as const,
    dueDate: "2024-09-15",
    team: "API Team"
  },
  {
    projectName: "Security Audit",
    completion: 78,
    status: 'on-track' as const,
    dueDate: "2024-08-25",
    team: "Security Team"
  }
];

const statusColors = {
  'on-track': 'bg-success text-success-foreground',
  'delayed': 'bg-destructive text-destructive-foreground',
  'completed': 'bg-primary text-primary-foreground',
  'planning': 'bg-muted text-muted-foreground'
};

export const ProgressWidget: React.FC<ProgressWidgetProps> = ({ 
  title = "Project Progress", 
  description = "Track development milestones and delivery status",
  data = defaultData 
}) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((project, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">{project.projectName}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{project.team}</span>
                  </div>
                </div>
                <Badge className={statusColors[project.status]}>
                  {project.status === 'on-track' && <TrendingUp className="w-3 h-3 mr-1" />}
                  {project.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {project.status.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{project.completion}%</span>
                </div>
                <Progress 
                  value={project.completion} 
                  className="h-3"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};