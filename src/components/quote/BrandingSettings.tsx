
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BrandingSettingsProps {
  companyLogo: string;
  companyName: string;
  companyAddress: string;
  companyContact: string;
  companyEmail: string;
  primaryColor: string;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCompanyNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCompanyAddressChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCompanyContactChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCompanyEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrimaryColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BrandingSettings({
  companyLogo,
  companyName,
  companyAddress,
  companyContact,
  companyEmail,
  primaryColor,
  onLogoChange,
  onCompanyNameChange,
  onCompanyAddressChange,
  onCompanyContactChange,
  onCompanyEmailChange,
  onPrimaryColorChange
}: BrandingSettingsProps) {
  return (
    <div className="border rounded-md p-4">
      <h3 className="text-md font-medium mb-2">Branding Settings</h3>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="logo">Company Logo</Label>
          <div className="flex items-center gap-4">
            {companyLogo && (
              <img 
                src={companyLogo} 
                alt="Company Logo" 
                className="h-12 w-auto object-contain"
              />
            )}
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={onLogoChange}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={onCompanyNameChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="companyAddress">Company Address</Label>
          <Textarea
            id="companyAddress"
            value={companyAddress}
            onChange={onCompanyAddressChange}
            rows={2}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="companyContact">Phone Number</Label>
          <Input
            id="companyContact"
            value={companyContact}
            onChange={onCompanyContactChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="companyEmail">Email</Label>
          <Input
            id="companyEmail"
            type="email"
            value={companyEmail}
            onChange={onCompanyEmailChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="primaryColor">Primary Color</Label>
          <div className="flex gap-2">
            <Input
              id="primaryColor"
              type="color"
              value={primaryColor}
              onChange={onPrimaryColorChange}
              className="w-16 h-10 p-1"
            />
            <Input
              value={primaryColor}
              onChange={onPrimaryColorChange}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
