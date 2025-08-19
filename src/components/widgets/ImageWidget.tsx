import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, AlertCircle } from 'lucide-react';
import { WidgetContent } from '@/types/widgetContent';

interface ImageWidgetProps {
  title?: string;
  description?: string;
  content?: WidgetContent[];
}

export const ImageWidget: React.FC<ImageWidgetProps> = ({ 
  title = "Image Gallery", 
  description = "Visual content and announcements",
  content = [] 
}) => {
  const [selectedImage, setSelectedImage] = useState<WidgetContent | null>(null);

  const handleImageClick = (item: WidgetContent) => {
    setSelectedImage(item);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {content.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No content available</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.map((item) => (
                <div
                  key={item.id}
                  className="group cursor-pointer rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-all duration-200"
                  onClick={() => handleImageClick(item)}
                >
                  {item.imageUrl && (
                    <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <h4 className="font-semibold text-sm mb-1 line-clamp-2">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {item.widgetType}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedImage && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-background rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
                        {selectedImage.description && (
                          <p className="text-muted-foreground mt-1">{selectedImage.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedImage(null)}
                      >
                        ✕
                      </Button>
                    </div>
                    
                    {selectedImage.imageUrl && (
                      <div className="mb-4">
                        <img
                          src={selectedImage.imageUrl}
                          alt={selectedImage.title}
                          className="w-full max-h-96 object-contain rounded-lg"
                        />
                      </div>
                    )}
                    
                    {selectedImage.content && (
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap">{selectedImage.content}</div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>Admin</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(selectedImage.createdAt).toLocaleString()}</span>
                      </div>
                      <Badge variant="outline">{selectedImage.widgetType}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};