import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface HeaderWidgetProps {
  title: string;
}

export const HeaderWidget: React.FC<HeaderWidgetProps> = ({ title }) => {
  return (
    <Card className="shadow-none border-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
    </Card>
  );
};