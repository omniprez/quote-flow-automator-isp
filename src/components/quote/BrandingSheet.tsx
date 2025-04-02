
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  SheetClose, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TemplateManager } from "./TemplateManager";
import { BrandingSettings } from "./BrandingSettings";

interface BrandingSheetProps {
  companyLogo: string;
  companyName: string;
  companyAddress: string;
  companyContact: string;
  companyEmail: string;
  primaryColor: string;
  savedTemplates: { name: string; settings: any }[];
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCompanyNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCompanyAddressChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCompanyContactChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCompanyEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrimaryColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyTemplate: (index: number) => void;
  onDeleteTemplate: (index: number) => void;
  onSaveTemplate: (name: string) => void;
  onUploadTemplate: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveSettings: () => void;
}

export function BrandingSheet({
  companyLogo,
  companyName,
  companyAddress,
  companyContact,
  companyEmail,
  primaryColor,
  savedTemplates,
  onLogoChange,
  onCompanyNameChange,
  onCompanyAddressChange,
  onCompanyContactChange,
  onCompanyEmailChange,
  onPrimaryColorChange,
  onApplyTemplate,
  onDeleteTemplate,
  onSaveTemplate,
  onUploadTemplate,
  onSaveSettings
}: BrandingSheetProps) {
  const sheetCloseRef = useRef<HTMLButtonElement>(null);

  const closeSheet = () => {
    if (sheetCloseRef.current) {
      sheetCloseRef.current.click();
    }
  };

  return (
    <SheetContent className="overflow-y-auto">
      <SheetClose ref={sheetCloseRef} className="hidden" />
      <SheetHeader>
        <SheetTitle>Company Branding</SheetTitle>
        <SheetDescription>
          Customize your quote with your company branding
        </SheetDescription>
      </SheetHeader>
      
      <ScrollArea className="h-[calc(100vh-180px)] pr-4">
        <div className="space-y-6 pt-4">
          <TemplateManager
            companyLogo={companyLogo}
            companyName={companyName}
            companyAddress={companyAddress}
            companyContact={companyContact}
            companyEmail={companyEmail}
            primaryColor={primaryColor}
            savedTemplates={savedTemplates}
            onApplyTemplate={onApplyTemplate}
            onDeleteTemplate={onDeleteTemplate}
            onSaveTemplate={onSaveTemplate}
            onUploadTemplate={onUploadTemplate}
          />
          
          <BrandingSettings
            companyLogo={companyLogo}
            companyName={companyName}
            companyAddress={companyAddress}
            companyContact={companyContact}
            companyEmail={companyEmail}
            primaryColor={primaryColor}
            onLogoChange={onLogoChange}
            onCompanyNameChange={onCompanyNameChange}
            onCompanyAddressChange={onCompanyAddressChange}
            onCompanyContactChange={onCompanyContactChange}
            onCompanyEmailChange={onCompanyEmailChange}
            onPrimaryColorChange={onPrimaryColorChange}
          />
        </div>
      </ScrollArea>
      
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={closeSheet}>Cancel</Button>
        <Button onClick={() => {
          onSaveSettings();
          closeSheet();
        }}>
          Save Changes
        </Button>
      </div>
    </SheetContent>
  );
}
