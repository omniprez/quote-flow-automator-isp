
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

// Function to preload image and verify it exists
const preloadImage = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};

// Default logo path that we know works
const DEFAULT_LOGO = "/lovable-uploads/1b83d0bf-d1e0-4307-a20b-c1cae596873e.png";

export function useCompanyBranding() {
  // Company branding states
  const [companyLogo, setCompanyLogo] = useState<string>(DEFAULT_LOGO);
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
    const loadSettings = async () => {
      const savedSettings = localStorage.getItem('companySettings');
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          
          // Verify the logo exists before setting it
          if (settings.companyLogo) {
            const logoExists = await preloadImage(settings.companyLogo);
            if (logoExists) {
              console.log("Logo verified and loaded:", settings.companyLogo);
              setCompanyLogo(settings.companyLogo);
            } else {
              console.warn("Saved logo doesn't exist, using default:", DEFAULT_LOGO);
              setCompanyLogo(DEFAULT_LOGO);
            }
          }
          
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
          companyLogo: DEFAULT_LOGO,
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
    };
    
    loadSettings();
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

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const logoDataUrl = e.target.result as string;
          console.log("Logo loaded from file, setting as data URL");
          
          // Verify the logo loads correctly
          const img = new Image();
          img.onload = () => {
            console.log("New logo verified and loaded successfully");
            setCompanyLogo(logoDataUrl);
          };
          img.onerror = () => {
            console.error("Failed to load new logo, reverting to default");
            setCompanyLogo(DEFAULT_LOGO);
            toast.error("Failed to load logo, using default");
          };
          img.src = logoDataUrl;
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
  const applyTemplate = async (index: number) => {
    if (index < 0 || index >= savedTemplates.length) return;
    
    const template = savedTemplates[index];
    const settings = template.settings;
    
    // Apply template settings
    if (settings.companyLogo) {
      // Verify the logo exists before setting it
      const logoExists = await preloadImage(settings.companyLogo);
      if (logoExists) {
        setCompanyLogo(settings.companyLogo);
      } else {
        setCompanyLogo(DEFAULT_LOGO);
        toast.warning("Template logo couldn't be loaded, using default");
      }
    }
    
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
