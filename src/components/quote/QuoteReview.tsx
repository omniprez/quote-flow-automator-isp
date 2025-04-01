
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CustomerFormValues } from "./CustomerForm";
import { Check, FileText, Loader2 } from "lucide-react";

interface QuoteReviewProps {
  customerId?: string; // Made optional with ?
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState("");
  const [quoteGenerated, setQuoteGenerated] = useState(false);
  const [quoteId, setQuoteId] = useState<string | null>(null);

  const totalMonthlyPrice = (monthlyPrice || 0) + (selectedFeatures?.monthlyTotal || 0);
  const totalOneTimeFee = (setupFee || 0) + (selectedFeatures?.oneTimeTotal || 0);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const generateQuoteNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    return `Q${year}${month}-${random}`;
  };

  const handleGenerateQuote = async () => {
    if (!customerId || !serviceId || !bandwidthId) {
      toast.error("Missing required information. Please complete all previous steps.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a unique quote number
      const quoteNumber = generateQuoteNumber();
      
      // Use current user ID as sales rep ID (in a real app, this would come from auth)
      // For demo we're using a fixed ID
      const salesRepId = "00000000-0000-0000-0000-000000000000";

      // Insert the quote
      const { data: quote, error } = await supabase
        .from("quotes")
        .insert({
          quote_number: quoteNumber,
          customer_id: customerId,
          sales_rep_id: salesRepId,
          total_monthly_cost: totalMonthlyPrice,
          total_one_time_cost: totalOneTimeFee,
          contract_term_months: contractMonths,
          notes: notes,
          status: "draft"
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Save quote details and features in another table if needed
      // This would typically be done in a real application
      
      toast.success("Quote generated successfully!");
      setQuoteGenerated(true);
      setQuoteId(quote.id);
      
      if (onQuoteGenerated) {
        onQuoteGenerated(quote.id);
      }
    } catch (error) {
      console.error("Error generating quote:", error);
      toast.error("Failed to generate quote");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewQuote = () => {
    // In a real app, this would navigate to the quote view page
    toast.info("Quote viewing functionality will be implemented later");
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
                <span className="text-muted-foreground">Base Service Monthly:</span>
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
