import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2, FileDown, Presentation, Link, Users, Globe, Copy, Check } from 'lucide-react';
import { PublishingConfig } from '@/types/dashboardBuilder';
import { useToast } from '@/hooks/use-toast';

interface PublishingPanelProps {
  dashboardId: string;
  config: PublishingConfig;
  onConfigChange: (config: PublishingConfig) => void;
  onExportPDF: () => void;
  onExportPowerPoint: () => void;
  onGenerateEmbedCode: () => string;
  onGeneratePublicLink: () => string;
}

export const PublishingPanel: React.FC<PublishingPanelProps> = ({
  dashboardId,
  config,
  onConfigChange,
  onExportPDF,
  onExportPowerPoint,
  onGenerateEmbedCode,
  onGeneratePublicLink
}) => {
  const { toast } = useToast();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [embedCode, setEmbedCode] = useState('');
  const [publicLink, setPublicLink] = useState('');

  const copyToClipboard = async (text: string, itemName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemName);
      toast({ title: "Copied!", description: `${itemName} copied to clipboard` });
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      toast({ title: "Error", description: "Failed to copy to clipboard", variant: "destructive" });
    }
  };

  const handleGenerateEmbedCode = () => {
    const code = onGenerateEmbedCode();
    setEmbedCode(code);
  };

  const handleGeneratePublicLink = () => {
    const link = onGeneratePublicLink();
    setPublicLink(link);
  };

  const updateInternalConfig = (key: keyof PublishingConfig['internal'], value: any) => {
    onConfigChange({
      ...config,
      internal: { ...config.internal, [key]: value }
    });
  };

  const updateExternalConfig = (key: keyof PublishingConfig['external'], value: any) => {
    onConfigChange({
      ...config,
      external: { ...config.external, [key]: value }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Publishing & Sharing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="internal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="internal">Internal Sharing</TabsTrigger>
            <TabsTrigger value="external">External Publishing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="internal" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="team-sharing">Share with Team</Label>
                  <p className="text-sm text-muted-foreground">Allow team members to view this dashboard</p>
                </div>
                <Switch
                  id="team-sharing"
                  checked={config.internal.shareWithTeam}
                  onCheckedChange={(checked) => updateInternalConfig('shareWithTeam', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Role-Based Access</Label>
                <div className="space-y-2">
                  {['admin', 'editor', 'viewer'].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={role}
                        checked={config.internal.roleBasedAccess.includes(role)}
                        onChange={(e) => {
                          const roles = e.target.checked
                            ? [...config.internal.roleBasedAccess, role]
                            : config.internal.roleBasedAccess.filter(r => r !== role);
                          updateInternalConfig('roleBasedAccess', roles);
                        }}
                      />
                      <Label htmlFor={role} className="capitalize">
                        {role}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Department Access</Label>
                <Input
                  placeholder="e.g., Engineering, Marketing, Sales"
                  value={config.internal.departments.join(', ')}
                  onChange={(e) => {
                    const departments = e.target.value.split(',').map(d => d.trim()).filter(Boolean);
                    updateInternalConfig('departments', departments);
                  }}
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {config.internal.departments.map((dept) => (
                    <Badge key={dept} variant="secondary">
                      {dept}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(`${window.location.origin}/dashboard/${dashboardId}`, 'Internal Link')}
                  className="w-full"
                >
                  {copiedItem === 'Internal Link' ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  Copy Internal Link
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="external" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pdf-export">PDF Export</Label>
                  <p className="text-sm text-muted-foreground">Enable PDF export functionality</p>
                </div>
                <Switch
                  id="pdf-export"
                  checked={config.external.pdfExport}
                  onCheckedChange={(checked) => updateExternalConfig('pdfExport', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ppt-export">PowerPoint Export</Label>
                  <p className="text-sm text-muted-foreground">Enable PowerPoint export functionality</p>
                </div>
                <Switch
                  id="ppt-export"
                  checked={config.external.powerPointExport}
                  onCheckedChange={(checked) => updateExternalConfig('powerPointExport', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="embed-url">Embed URL</Label>
                  <p className="text-sm text-muted-foreground">Generate embeddable iframe code</p>
                </div>
                <Switch
                  id="embed-url"
                  checked={config.external.embedUrl}
                  onCheckedChange={(checked) => updateExternalConfig('embedUrl', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="public-link">Public Link</Label>
                  <p className="text-sm text-muted-foreground">Create a public shareable link</p>
                </div>
                <Switch
                  id="public-link"
                  checked={config.external.publicLink}
                  onCheckedChange={(checked) => updateExternalConfig('publicLink', checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={onExportPDF}
                  disabled={!config.external.pdfExport}
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={onExportPowerPoint}
                  disabled={!config.external.powerPointExport}
                >
                  <Presentation className="w-4 h-4 mr-2" />
                  Export PPT
                </Button>
              </div>

              {config.external.embedUrl && (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={handleGenerateEmbedCode}
                    className="w-full"
                  >
                    <Link className="w-4 h-4 mr-2" />
                    Generate Embed Code
                  </Button>
                  {embedCode && (
                    <div className="space-y-2">
                      <Label>Embed Code</Label>
                      <div className="relative">
                        <textarea
                          readOnly
                          value={embedCode}
                          className="w-full p-2 text-sm border rounded resize-none h-20"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(embedCode, 'Embed Code')}
                        >
                          {copiedItem === 'Embed Code' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {config.external.publicLink && (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={handleGeneratePublicLink}
                    className="w-full"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Generate Public Link
                  </Button>
                  {publicLink && (
                    <div className="space-y-2">
                      <Label>Public Link</Label>
                      <div className="flex gap-2">
                        <Input readOnly value={publicLink} />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => copyToClipboard(publicLink, 'Public Link')}
                        >
                          {copiedItem === 'Public Link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};