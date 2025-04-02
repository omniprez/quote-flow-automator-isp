
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CustomerFormValues } from "./CustomerForm";
import { Check, FileText, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface QuoteReviewProps {
  customerId?: string;
  customerData?: CustomerFormValues;
  serviceId?: string;
  serviceName?: string;
  bandwidthId?: string;
  bandwidthValue?: number;
  bandwidthUnit?: string;
  monthlyPrice?: number;
  setupFee?: number;
  contractMonths?: number;
  selectedFeatures?: {
    ids: string[];
    names: string[];
    monthlyTotal: number;
    oneTimeTotal: number;
  };
  onQuoteGenerated?: (quoteId: string) => void;
}

export function QuoteReview({
  customerId,
  customerData,
  serviceId,
  serviceName,
  bandwidthId,
  bandwidthValue,
  bandwidthUnit,
  monthlyPrice = 0,
  setupFee = 0,
  contractMonths = 12,
  selectedFeatures,
  onQuoteGenerated,
}: QuoteReviewProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState("");
  const [quoteGenerated, setQuoteGenerated] = useState(false);
  const [quoteId, setQuoteId] = useState<string | null>(null);

  const totalMonthlyPrice = (monthlyPrice || 0) + (selectedFeatures?.monthlyTotal || 0);
  const totalOneTimeFee = (setupFee || 0) + (selectedFeatures?.oneTimeTotal || 0);

  // Get full service description including bandwidth
  const getServiceDescription = () => {
    if (!serviceName || !bandwidthValue || !bandwidthUnit) {
      return "Internet Service";
    }
    return `${serviceName} - ${bandwidthValue} ${bandwidthUnit}`;
  };

  const generateQuoteNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    return `Q${year}${month}-${random}`;
  };

  const handleGenerateQuote = async () => {
    if (!customerId) {
      toast.error("Missing customer information. Please complete the customer step.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Starting quote generation...");
      
      // Generate a unique quote number
      const quoteNumber = generateQuoteNumber();
      
      // Use current user ID as sales rep ID (in a real app, this would come from auth)
      // For demo we're using a fixed ID
      const salesRepId = "00000000-0000-0000-0000-000000000000";

      // First, get the columns of the quotes table to ensure we only insert valid columns
      const { data: columnsData, error: columnsError } = await supabase
        .from('quotes')
        .select('*')
        .limit(1);
        
      if (columnsError) {
        console.error("Error checking quotes table structure:", columnsError);
        throw new Error("Could not verify database structure");
      }
      
      // Get the column names from the returned data or fall back to a safe subset
      const validColumns = columnsData ? 
        Object.keys(columnsData[0] || {}) : 
        ['id', 'quote_number', 'customer_id', 'sales_rep_id', 'total_monthly_cost', 'total_one_time_cost', 'contract_term_months', 'notes', 'status', 'quote_date', 'created_at', 'updated_at'];
      
      console.log("Valid columns in quotes table:", validColumns);
      
      // Create quote data object with only valid columns
      const quoteData: Record<string, any> = {
        quote_number: quoteNumber,
        customer_id: customerId,
        sales_rep_id: salesRepId,
        total_monthly_cost: totalMonthlyPrice,
        total_one_time_cost: totalOneTimeFee,
        contract_term_months: contractMonths,
        notes: notes,
        status: "draft"
      };
      
      // Only add service_id if it's a valid column in the database
      if (validColumns.includes('service_id') && serviceId) {
        quoteData.service_id = serviceId;
      }
      
      // Add metadata about the service and bandwidth to the notes if they're not stored elsewhere
      if (!validColumns.includes('service_id') && serviceId && serviceName) {
        // Store service information in JSON format in the notes field for retrieval later
        const metadataObject = {
          service: {
            id: serviceId,
            name: serviceName
          },
          bandwidth: bandwidthId ? {
            id: bandwidthId,
            value: bandwidthValue,
            unit: bandwidthUnit
          } : null,
          features: selectedFeatures ? selectedFeatures.ids.map((id, index) => ({
            id,
            name: selectedFeatures.names[index]
          })) : []
        };
        
        // Prepend the metadata as a JSON comment at the beginning of the notes
        const metadataString = JSON.stringify(metadataObject);
        quoteData.notes = `<!-- QUOTE_METADATA: ${metadataString} -->\n${notes}`;
      }

      console.log("Inserting quote with data:", quoteData);

      // Insert the quote with only valid columns
      const { data: quote, error } = await supabase
        .from("quotes")
        .insert(quoteData)
        .select()
        .single();

      if (error) {
        console.error("Error details:", error);
        throw error;
      }

      console.log("Quote created successfully:", quote);

      // Store the relationship between the quote and the selected features
      if (selectedFeatures && selectedFeatures.ids.length > 0) {
        console.log("Selected features to be stored separately:", selectedFeatures.ids);
        
        // For each feature, create a record in a quote_features table (if it exists)
        // Note: Since we don't have a quote_features table in our schema yet, we'll just log this
        // In a real app, we would create this table and store the relationships
        
        // Here's how it would look if we had a quote_features table:
        // const { error: featuresError } = await supabase
        //   .from("quote_features")
        //   .insert(selectedFeatures.ids.map(featureId => ({
        //     quote_id: quote.id,
        //     feature_id: featureId
        //   })));
        // 
        // if (featuresError) {
        //   console.error("Error storing features:", featuresError);
        //   // We'll continue even if this fails, since the quote is created
        // }
      }

      toast.success("Quote generated successfully!");
      setQuoteGenerated(true);
      setQuoteId(quote.id);
      
      if (onQuoteGenerated) {
        onQuoteGenerated(quote.id);
      }
      
      // Wait a moment to show the success message before redirecting
      setTimeout(() => {
        navigate(`/quotes/${quote.id}`);
      }, 1500);
    } catch (error) {
      console.error("Error generating quote:", error);
      toast.error("Failed to generate quote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewQuote = () => {
    if (quoteId) {
      navigate(`/quotes/${quoteId}`);
    } else {
      toast.error("Quote ID not found");
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Quote Summary</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Review the details below before generating your quote.
            </p>
          </div>

          {/* Customer Information */}
          <div className="space-y-2">
            <h4 className="font-medium">Customer Information</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Company:</div>
              <div>{customerData?.company_name}</div>
              <div className="text-muted-foreground">Contact:</div>
              <div>{customerData?.contact_name}</div>
              <div className="text-muted-foreground">Email:</div>
              <div>{customerData?.email}</div>
              {customerData?.phone && (
                <>
                  <div className="text-muted-foreground">Phone:</div>
                  <div>{customerData.phone}</div>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Service Details */}
          <div className="space-y-2">
            <h4 className="font-medium">Service Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Service:</div>
              <div>{serviceName}</div>
              <div className="text-muted-foreground">Bandwidth:</div>
              <div>{bandwidthValue} {bandwidthUnit}</div>
              <div className="text-muted-foreground">Contract Term:</div>
              <div>{contractMonths} months</div>
            </div>
          </div>

          {/* Additional Features */}
          {selectedFeatures && selectedFeatures.names.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Additional Features</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {selectedFeatures.names.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <Separator />

          {/* Pricing Summary */}
          <div className="space-y-2">
            <h4 className="font-medium">Pricing Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{getServiceDescription()} Monthly:</span>
                <span>MUR {formatCurrency(monthlyPrice || 0)}</span>
              </div>
              {selectedFeatures && selectedFeatures.monthlyTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Additional Features Monthly:</span>
                  <span>MUR {formatCurrency(selectedFeatures.monthlyTotal)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium">
                <span>Total Monthly:</span>
                <span>MUR {formatCurrency(totalMonthlyPrice)}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Setup Fee:</span>
                <span>MUR {formatCurrency(setupFee || 0)}</span>
              </div>
              {selectedFeatures && selectedFeatures.oneTimeTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Additional Features One-Time:</span>
                  <span>MUR {formatCurrency(selectedFeatures.oneTimeTotal)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium">
                <span>Total One-Time Fees:</span>
                <span>MUR {formatCurrency(totalOneTimeFee)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes for this quote..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            {!quoteGenerated ? (
              <Button 
                onClick={handleGenerateQuote}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Quote
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleViewQuote}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Quote
                </Button>
                <Button variant="secondary">
                  <Check className="mr-2 h-4 w-4" />
                  Quote Generated
                </Button>
              </>
            )}
          </div>

          {/* Notice */}
          <p className="text-xs text-muted-foreground text-center">
            All prices are in Mauritian Rupees (MUR) and exclusive of VAT.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
