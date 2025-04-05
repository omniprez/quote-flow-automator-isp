
import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface CompanySettings {
  companyLogo: string;
  companyName: string;
  companyAddress: string;
  companyContact: string;
  companyEmail: string;
  primaryColor: string;
}

export interface BrandingTemplate {
  name: string;
  settings: CompanySettings;
}

export function useCompanyBranding() {
  // Company branding states
  const [companyLogo, setCompanyLogo] = useState<string>("/lovable-uploads/1b83d0bf-d1e0-4307-a20b-c1cae596873e.png");
  const [companyName, setCompanyName] = useState<string>("Rogers Capital Technology Services Ltd");
  const [companyAddress, setCompanyAddress] = useState<string>("5, President John Kennedy Street\nPort Louis, Republic of Mauritius");
  const [companyContact, setCompanyContact] = useState<string>("+(230) 211 7801");
  const [companyEmail, setCompanyEmail] = useState<string>("mcs_sales@rogerscapital.mu");
  const [primaryColor, setPrimaryColor] = useState<string>("#3b82f6");
  
  // Template states
  const [templateName, setTemplateName] = useState<string>("");
  const [savedTemplates, setSavedTemplates] = useState<BrandingTemplate[]>([]);
  
  // Load company settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('companySettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.companyLogo) setCompanyLogo(settings.companyLogo);
        if (settings.companyName) setCompanyName(settings.companyName);
        if (settings.companyAddress) setCompanyAddress(settings.companyAddress);
        if (settings.companyContact) setCompanyContact(settings.companyContact);
        if (settings.companyEmail) setCompanyEmail(settings.companyEmail);
        if (settings.primaryColor) setPrimaryColor(settings.primaryColor);
      } catch (e) {
        console.error("Error parsing company settings:", e);
      }
    } else {
      // Save default settings to localStorage if none exist
      const defaultSettings = {
        companyLogo: "/lovable-uploads/1b83d0bf-d1e0-4307-a20b-c1cae596873e.png",
        companyName: "Rogers Capital Technology Services Ltd",
        companyAddress: "5, President John Kennedy Street\nPort Louis, Republic of Mauritius",
        companyContact: "+(230) 211 7801",
        companyEmail: "mcs_sales@rogerscapital.mu",
        primaryColor: "#3b82f6"
      };
      localStorage.setItem('companySettings', JSON.stringify(defaultSettings));
    }
    
    // Load saved templates from localStorage
    const savedTemplatesData = localStorage.getItem('quoteTemplates');
    if (savedTemplatesData) {
      try {
        const templates = JSON.parse(savedTemplatesData);
        setSavedTemplates(templates);
      } catch (e) {
        console.error("Error parsing templates:", e);
      }
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      companyLogo,
      companyName,
      companyAddress,
      companyContact,
      companyEmail,
      primaryColor
    };
    
    localStorage.setItem('companySettings', JSON.stringify(settings));
    toast.success("Company branding saved successfully");
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCompanyLogo(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to save current settings as a template
  const saveTemplate = (name: string) => {
    const settings = {
      companyLogo,
      companyName,
      companyAddress,
      companyContact,
      companyEmail,
      primaryColor
    };

    const updatedTemplates = [
      ...savedTemplates,
      { name, settings }
    ];

    setSavedTemplates(updatedTemplates);
    localStorage.setItem('quoteTemplates', JSON.stringify(updatedTemplates));
    toast.success(`Template "${name}" saved successfully`);
  };

  // Function to apply a saved template
  const applyTemplate = (index: number) => {
    if (index < 0 || index >= savedTemplates.length) return;
    
    const template = savedTemplates[index];
    const settings = template.settings;
    
    // Apply template settings
    if (settings.companyLogo) setCompanyLogo(settings.companyLogo);
    if (settings.companyName) setCompanyName(settings.companyName);
    if (settings.companyAddress) setCompanyAddress(settings.companyAddress);
    if (settings.companyContact) setCompanyContact(settings.companyContact);
    if (settings.companyEmail) setCompanyEmail(settings.companyEmail);
    if (settings.primaryColor) setPrimaryColor(settings.primaryColor);
    
    toast.success(`Template "${template.name}" applied successfully`);
  };

  // Function to delete a saved template
  const deleteTemplate = (index: number) => {
    if (index < 0 || index >= savedTemplates.length) return;
    
    const updatedTemplates = [...savedTemplates];
    const deletedName = updatedTemplates[index].name;
    updatedTemplates.splice(index, 1);
    
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('quoteTemplates', JSON.stringify(updatedTemplates));
    toast.success(`Template "${deletedName}" deleted`);
  };

  // Function to handle template file upload
  const uploadTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For now, just show a toast notification since we can't process docx files in the browser
    toast.info(`File "${file.name}" uploaded. Note: Processing DOCX files directly is not supported in this web app.`);
    
    // Create a template entry with the file name
    const templateEntry = {
      name: file.name.replace('.docx', ''),
      settings: {
        companyLogo,
        companyName,
        companyAddress,
        companyContact,
        companyEmail,
        primaryColor
      }
    };
    
    const updatedTemplates = [...savedTemplates, templateEntry];
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('quoteTemplates', JSON.stringify(updatedTemplates));
  };

  return {
    companyLogo,
    companyName,
    companyAddress,
    companyContact,
    companyEmail,
    primaryColor,
    templateName,
    savedTemplates,
    setCompanyName,
    setCompanyAddress,
    setCompanyContact,
    setCompanyEmail,
    setPrimaryColor,
    setTemplateName,
    handleLogoChange,
    saveSettings,
    saveTemplate,
    applyTemplate,
    deleteTemplate,
    uploadTemplate
  };
}
