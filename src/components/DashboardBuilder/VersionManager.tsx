import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Save, History, GitBranch, Eye, RotateCcw } from 'lucide-react';
import { DashboardVersion } from '@/types/dashboardBuilder';
import { formatDistanceToNow } from 'date-fns';

interface VersionManagerProps {
  currentVersion: number;
  versions: DashboardVersion[];
  onSaveVersion: (name: string, description?: string) => void;
  onLoadVersion: (version: DashboardVersion) => void;
  onPreviewVersion: (version: DashboardVersion) => void;
  onDeleteVersion: (versionId: string) => void;
}

export const VersionManager: React.FC<VersionManagerProps> = ({
  currentVersion,
  versions,
  onSaveVersion,
  onLoadVersion,
  onPreviewVersion,
  onDeleteVersion
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [versionDescription, setVersionDescription] = useState('');

  const handleSaveVersion = () => {
    if (versionName.trim()) {
      onSaveVersion(versionName.trim(), versionDescription.trim() || undefined);
      setVersionName('');
      setVersionDescription('');
      setIsDialogOpen(false);
    }
  };

  const sortedVersions = [...versions].sort((a, b) => b.version - a.version);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Version History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Current Version: {currentVersion}</p>
            <p className="text-sm text-muted-foreground">Working on unsaved changes</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Save Version
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Dashboard Version</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="version-name">Version Name</Label>
                  <Input
                    id="version-name"
                    value={versionName}
                    onChange={(e) => setVersionName(e.target.value)}
                    placeholder="e.g., Q4 2024 Release"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version-description">Description (Optional)</Label>
                  <Textarea
                    id="version-description"
                    value={versionDescription}
                    onChange={(e) => setVersionDescription(e.target.value)}
                    placeholder="Describe the changes in this version..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveVersion} disabled={!versionName.trim()}>
                  Save Version
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Saved Versions</h4>
          {sortedVersions.length === 0 ? (
            <p className="text-muted-foreground text-sm">No saved versions yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sortedVersions.map((version) => (
                <div
                  key={version.id}
                  className="p-3 border rounded-lg space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{version.name}</span>
                        <Badge variant="outline" className="text-xs">
                          v{version.version}
                        </Badge>
                        {version.isActive && (
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      {version.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {version.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Created {formatDistanceToNow(version.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPreviewVersion(version)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLoadVersion(version)}
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Restore
                    </Button>
                    {!version.isActive && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteVersion(version.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};