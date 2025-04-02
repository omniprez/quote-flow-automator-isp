
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TemplateManagerProps {
  companyLogo: string;
  companyName: string;
  companyAddress: string;
  companyContact: string;
  companyEmail: string;
  primaryColor: string;
  onApplyTemplate: (index: number) => void;
  onDeleteTemplate: (index: number) => void;
  onSaveTemplate: (name: string) => void;
  onUploadTemplate: (e: React.ChangeEvent<HTMLInputElement>) => void;
  savedTemplates: { name: string, settings: any }[];
}

export function TemplateManager({
  companyLogo,
  companyName,
  companyAddress,
  companyContact,
  companyEmail,
  primaryColor,
  onApplyTemplate,
  onDeleteTemplate,
  onSaveTemplate,
  onUploadTemplate,
  savedTemplates
}: TemplateManagerProps) {
  const [templateName, setTemplateName] = useState<string>("");

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    
    onSaveTemplate(templateName);
    setTemplateName("");
  };

  return (
    <div className="border rounded-md p-4">
      <h3 className="text-md font-medium mb-2">Templates</h3>
      
      {/* Upload template file */}
      <div className="grid gap-2 mb-4">
        <Label htmlFor="templateUpload">Upload Template (.docx)</Label>
        <div className="flex gap-2">
          <Input
            id="templateUpload"
            type="file"
            accept=".docx"
            onChange={onUploadTemplate}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Upload a DOCX template to save its name and your current branding settings.
        </p>
      </div>
      
      {/* Save current as template */}
      <div className="grid gap-2 mb-4">
        <Label htmlFor="templateName">Save Current as Template</Label>
        <div className="flex gap-2">
          <Input
            id="templateName"
            placeholder="Template name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
          <Button onClick={handleSaveTemplate}>Save</Button>
        </div>
      </div>
      
      {/* Saved templates list */}
      {savedTemplates.length > 0 && (
        <div className="mt-4">
          <Label>Saved Templates</Label>
          <div className="mt-2 space-y-2">
            {savedTemplates.map((template, index) => (
              <div key={index} className="flex items-center justify-between border p-2 rounded">
                <span className="text-sm font-medium">{template.name}</span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onApplyTemplate(index)}
                  >
                    Apply
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => onDeleteTemplate(index)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
