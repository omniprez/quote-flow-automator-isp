
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

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
  const [logoError, setLogoError] = useState(false);
  
  // Reset logo error state when companyLogo changes
  useEffect(() => {
    setLogoError(false);
  }, [companyLogo]);
  
  return (
    <div className="border rounded-md p-4">
      <h3 className="text-md font-medium mb-2">Branding Settings</h3>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="logo">Company Logo</Label>
          <div className="flex items-center gap-4">
            {companyLogo && (
              <div className="relative h-12 w-24 flex items-center justify-center bg-gray-100 rounded">
                <img 
                  src={companyLogo} 
                  alt="Company Logo" 
                  className="h-12 max-w-full object-contain"
                  onError={(e) => {
                    console.error("Logo failed to load in settings:", e);
                    setLogoError(true);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {logoError && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-red-500">
                    Logo error
                  </div>
                )}
              </div>
            )}
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={onLogoChange}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Recommended size: 240px × 64px. Use PNG or JPEG format.
          </p>
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
