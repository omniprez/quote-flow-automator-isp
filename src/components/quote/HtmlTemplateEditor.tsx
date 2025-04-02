
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Default HTML template with placeholders
const DEFAULT_HTML_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .quote-container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .logo { max-height: 60px; }
    .quote-title { color: {{primaryColor}}; font-size: 24px; font-weight: bold; }
    .company-info { text-align: right; }
    .separator { height: 2px; background-color: {{primaryColor}}; opacity: 0.2; margin: 20px 0; }
    .section { margin-bottom: 20px; }
    .section-title { color: {{primaryColor}}; font-weight: bold; margin-bottom: 10px; }
    .two-columns { display: flex; justify-content: space-between; flex-wrap: wrap; }
    .column { flex: 0 0 48%; }
    table { width: 100%; border-collapse: collapse; }
    table th { background-color: rgba(0,0,0,0.05); text-align: left; padding: 10px; }
    table td { padding: 10px; border-bottom: 1px solid #eee; }
    .text-right { text-align: right; }
    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="quote-container">
    <!-- Header -->
    <div class="header">
      <div>
        <div class="quote-title">QUOTE</div>
        <div>#{{quoteNumber}}</div>
        <div style="font-size: 14px; color: #666; margin-top: 5px;">Date: {{quoteDate}}</div>
        <div style="font-size: 14px; color: #666;">Valid until: {{expirationDate}}</div>
      </div>
      <div class="company-info">
        <img src="{{companyLogo}}" alt="{{companyName}}" class="logo" />
        <div style="font-weight: bold; font-size: 18px; margin-top: 5px;">{{companyName}}</div>
        <div style="margin-top: 5px;">{{companyAddress}}</div>
        <div>Tel: {{companyContact}}</div>
        <div>Email: {{companyEmail}}</div>
      </div>
    </div>

    <div class="separator"></div>

    <!-- Customer and Service Info -->
    <div class="two-columns">
      <div class="column section">
        <div class="section-title">Customer</div>
        <div style="font-weight: 500;">{{customerName}}</div>
        <div>Contact: {{contactName}}</div>
        <div>Email: {{customerEmail}}</div>
        <div>Phone: {{customerPhone}}</div>
        <div style="margin-top: 5px;">{{customerAddress}}</div>
        <div>{{customerCity}}, {{customerCountry}}</div>
      </div>
      <div class="column section">
        <div class="section-title">Service Details</div>
        <table style="font-size: 14px;">
          <tr>
            <td style="color: #666;">Service:</td>
            <td>{{serviceName}}</td>
          </tr>
          <tr>
            <td style="color: #666;">Bandwidth:</td>
            <td>{{bandwidth}}</td>
          </tr>
          <tr>
            <td style="color: #666;">Contract Term:</td>
            <td>{{contractTerm}} months</td>
          </tr>
          <tr>
            <td style="color: #666;">Status:</td>
            <td style="text-transform: capitalize;">{{quoteStatus}}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Quote Summary -->
    <div class="section">
      <div class="section-title">Quote Summary</div>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-right">One-time Fee</th>
            <th class="text-right">Monthly Fee</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{serviceName}} - {{bandwidth}}</td>
            <td class="text-right">MUR {{serviceSetupFee}}</td>
            <td class="text-right">MUR {{bandwidthPrice}}</td>
          </tr>
          {{featuresRows}}
          <tr style="font-weight: 500; background-color: rgba(0,0,0,0.02);">
            <td>Total</td>
            <td class="text-right">MUR {{totalOneTime}}</td>
            <td class="text-right">MUR {{totalMonthly}}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Notes -->
    <div class="section">
      <div class="section-title">Notes</div>
      <div style="font-size: 14px; white-space: pre-line;">{{notes}}</div>
    </div>

    <!-- Terms and Conditions -->
    <div class="section">
      <div class="section-title">Terms & Conditions</div>
      <ol style="font-size: 14px; padding-left: 20px;">
        <li>All prices are in Mauritian Rupees (MUR) and exclusive of VAT.</li>
        <li>This quote is valid for 30 days from the issue date.</li>
        <li>Installation timeline will be confirmed upon acceptance of the quote.</li>
        <li>Payment terms: 50% advance payment, 50% upon installation completion.</li>
        <li>Service level agreement details will be provided upon request.</li>
      </ol>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div>Thank you for your business!</div>
      <div style="margin-top: 5px;">For any questions, please contact your account manager or call {{companyContact}}</div>
    </div>
  </div>
</body>
</html>
`;

interface HtmlTemplateEditorProps {
  onApplyTemplate: (html: string) => void;
}

export function HtmlTemplateEditor({ onApplyTemplate }: HtmlTemplateEditorProps) {
  const [htmlTemplates, setHtmlTemplates] = useState<{ name: string, html: string }[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<string>(DEFAULT_HTML_TEMPLATE);
  const [templateName, setTemplateName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("edit");
  
  // Load templates from localStorage on mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem('htmlQuoteTemplates');
    if (savedTemplates) {
      try {
        setHtmlTemplates(JSON.parse(savedTemplates));
      } catch (error) {
        console.error("Error loading HTML templates:", error);
      }
    } else {
      // If no templates exist yet, save the default one
      const defaultTemplates = [{ name: "Default Template", html: DEFAULT_HTML_TEMPLATE }];
      localStorage.setItem('htmlQuoteTemplates', JSON.stringify(defaultTemplates));
      setHtmlTemplates(defaultTemplates);
    }
  }, []);
  
  // Save a new template or update existing one
  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    
    const existingIndex = htmlTemplates.findIndex(t => t.name === templateName);
    
    if (existingIndex >= 0) {
      // Update existing template
      const updatedTemplates = [...htmlTemplates];
      updatedTemplates[existingIndex].html = currentTemplate;
      setHtmlTemplates(updatedTemplates);
      localStorage.setItem('htmlQuoteTemplates', JSON.stringify(updatedTemplates));
      toast.success(`Template "${templateName}" updated`);
    } else {
      // Create new template
      const newTemplates = [...htmlTemplates, { name: templateName, html: currentTemplate }];
      setHtmlTemplates(newTemplates);
      localStorage.setItem('htmlQuoteTemplates', JSON.stringify(newTemplates));
      toast.success(`Template "${templateName}" saved`);
    }
  };
  
  // Load a template
  const handleLoadTemplate = (index: number) => {
    if (index >= 0 && index < htmlTemplates.length) {
      setCurrentTemplate(htmlTemplates[index].html);
      setTemplateName(htmlTemplates[index].name);
      toast.success(`Template "${htmlTemplates[index].name}" loaded`);
      setActiveTab("edit");
    }
  };
  
  // Delete a template
  const handleDeleteTemplate = (index: number) => {
    if (index >= 0 && index < htmlTemplates.length) {
      const templateName = htmlTemplates[index].name;
      const newTemplates = [...htmlTemplates];
      newTemplates.splice(index, 1);
      setHtmlTemplates(newTemplates);
      localStorage.setItem('htmlQuoteTemplates', JSON.stringify(newTemplates));
      toast.success(`Template "${templateName}" deleted`);
    }
  };
  
  // Apply the current template
  const handleApplyTemplate = () => {
    onApplyTemplate(currentTemplate);
    toast.success("HTML template applied");
  };
  
  // Reset to default template
  const handleResetToDefault = () => {
    setCurrentTemplate(DEFAULT_HTML_TEMPLATE);
    setTemplateName("");
    toast.info("Reset to default template");
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>HTML Quote Template Editor</CardTitle>
        <CardDescription>
          Create and manage HTML templates for your quotes with custom placeholders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="edit">Edit Template</TabsTrigger>
            <TabsTrigger value="manage">Manage Templates</TabsTrigger>
            <TabsTrigger value="help">Placeholders Help</TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="My Custom Template"
                />
              </div>
              <Button onClick={handleSaveTemplate} className="mt-6">Save Template</Button>
            </div>
            
            <div>
              <Label htmlFor="htmlTemplate">HTML Template Code</Label>
              <Textarea
                id="htmlTemplate"
                value={currentTemplate}
                onChange={(e) => setCurrentTemplate(e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleResetToDefault}>
                Reset to Default
              </Button>
              <Button onClick={handleApplyTemplate}>
                Apply Template
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="manage">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {htmlTemplates.map((template, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{template.name}</div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleLoadTemplate(index)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onApplyTemplate(template.html)}
                          >
                            Apply
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteTemplate(index)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="help">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Available Placeholders</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use these placeholders in your HTML template. They will be replaced with actual data when the quote is generated.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Quote Information</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <ul className="text-sm space-y-1">
                        <li><code>&#123;&#123;quoteNumber&#125;&#125;</code> - Quote reference number</li>
                        <li><code>&#123;&#123;quoteDate&#125;&#125;</code> - Quote issue date</li>
                        <li><code>&#123;&#123;quoteStatus&#125;&#125;</code> - Status of the quote</li>
                        <li><code>&#123;&#123;expirationDate&#125;&#125;</code> - Expiration date</li>
                        <li><code>&#123;&#123;totalMonthly&#125;&#125;</code> - Total monthly cost</li>
                        <li><code>&#123;&#123;totalOneTime&#125;&#125;</code> - Total one-time cost</li>
                        <li><code>&#123;&#123;contractTerm&#125;&#125;</code> - Contract term in months</li>
                        <li><code>&#123;&#123;notes&#125;&#125;</code> - Quote notes</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <ul className="text-sm space-y-1">
                        <li><code>&#123;&#123;customerName&#125;&#125;</code> - Customer company name</li>
                        <li><code>&#123;&#123;contactName&#125;&#125;</code> - Customer contact person</li>
                        <li><code>&#123;&#123;customerEmail&#125;&#125;</code> - Customer email</li>
                        <li><code>&#123;&#123;customerPhone&#125;&#125;</code> - Customer phone</li>
                        <li><code>&#123;&#123;customerAddress&#125;&#125;</code> - Street address</li>
                        <li><code>&#123;&#123;customerCity&#125;&#125;</code> - City</li>
                        <li><code>&#123;&#123;customerCountry&#125;&#125;</code> - Country</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Service Information</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <ul className="text-sm space-y-1">
                        <li><code>&#123;&#123;serviceName&#125;&#125;</code> - Service name</li>
                        <li><code>&#123;&#123;serviceSetupFee&#125;&#125;</code> - Service setup fee</li>
                        <li><code>&#123;&#123;bandwidth&#125;&#125;</code> - Bandwidth amount and unit</li>
                        <li><code>&#123;&#123;bandwidthPrice&#125;&#125;</code> - Bandwidth monthly price</li>
                        <li><code>&#123;&#123;featuresRows&#125;&#125;</code> - Features table rows (HTML)</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Company Information</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <ul className="text-sm space-y-1">
                        <li><code>&#123;&#123;companyLogo&#125;&#125;</code> - URL to company logo</li>
                        <li><code>&#123;&#123;companyName&#125;&#125;</code> - Company name</li>
                        <li><code>&#123;&#123;companyAddress&#125;&#125;</code> - Company address</li>
                        <li><code>&#123;&#123;companyContact&#125;&#125;</code> - Contact number</li>
                        <li><code>&#123;&#123;companyEmail&#125;&#125;</code> - Company email</li>
                        <li><code>&#123;&#123;primaryColor&#125;&#125;</code> - Primary brand color</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
