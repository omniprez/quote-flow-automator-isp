
import { 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { HtmlTemplateEditor } from "@/components/quote/HtmlTemplateEditor";

interface HtmlTemplateDialogProps {
  onApplyTemplate: (html: string) => void;
}

export function HtmlTemplateDialog({ onApplyTemplate }: HtmlTemplateDialogProps) {
  return (
    <DialogContent className="max-w-4xl h-[90vh]">
      <DialogHeader>
        <DialogTitle>HTML Template Editor</DialogTitle>
        <DialogDescription>
          Create and manage HTML templates for your quotes
        </DialogDescription>
      </DialogHeader>
      <div className="pt-4">
        <HtmlTemplateEditor onApplyTemplate={onApplyTemplate} />
      </div>
    </DialogContent>
  );
}
