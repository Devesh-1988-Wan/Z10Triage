import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bug, TrendingUp, Users, Clock, Shield, Zap } from 'lucide-react';

const icons = {
  Bug,
  TrendingUp,
  Users,
  Clock,
  Shield,
  Zap,
};

interface InfoCardWidgetProps {
  heading: string;
  text: string;
  iconName?: keyof typeof icons;
  imageUrl?: string;
}

export const InfoCardWidget: React.FC<InfoCardWidgetProps> = ({
  heading,
  text,
  iconName,
  imageUrl,
}) => {
  const IconComponent = iconName ? icons[iconName] : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          {IconComponent && <IconComponent className="h-8 w-8" />}
          <CardTitle>{heading}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {imageUrl && <img src={imageUrl} alt={heading} className="rounded-md" />}
        <p>{text}</p>
      </CardContent>
    </Card>
  );
};