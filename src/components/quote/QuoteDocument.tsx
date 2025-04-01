
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent } from "@/components/ui/card";

interface QuoteDocumentProps {
  quoteData: any;
  customerData: any;
  serviceData?: any;
  bandwidthData?: any;
  featuresData?: any[];
}

export function QuoteDocument({ 
  quoteData, 
  customerData,
  serviceData,
  bandwidthData,
  featuresData = []
}: QuoteDocumentProps) {
  if (!quoteData || !customerData) {
    return <div>No data available</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-1">QUOTE</h1>
          <p className="text-lg">#{quoteData.quote_number}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Date: {new Date(quoteData.quote_date).toLocaleDateString()}
          </p>
          {quoteData.expiration_date && (
            <p className="text-sm text-muted-foreground">
              Valid until: {new Date(quoteData.expiration_date).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <h2 className="font-bold text-xl">ISP Services Ltd</h2>
          <p className="mt-1">Ebene CyberCity</p>
          <p>Ebene, Mauritius</p>
          <p className="mt-1">Tel: +230 123 4567</p>
          <p>Email: sales@ispservices.mu</p>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Customer and Service Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="font-bold mb-2">Customer</h3>
          <p className="font-medium">{customerData.company_name}</p>
          <p>Contact: {customerData.contact_name}</p>
          <p>Email: {customerData.email}</p>
          {customerData.phone && <p>Phone: {customerData.phone}</p>}
          {customerData.address && (
            <>
              <p className="mt-1">{customerData.address}</p>
              <p>{customerData.city}{customerData.city && customerData.country ? ", " : ""}{customerData.country}</p>
            </>
          )}
        </div>
        <div>
          <h3 className="font-bold mb-2">Service Details</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1 text-muted-foreground">Service:</td>
                <td className="py-1">{serviceData?.name || "Internet Connectivity Service"}</td>
              </tr>
              <tr>
                <td className="py-1 text-muted-foreground">Bandwidth:</td>
                <td className="py-1">
                  {bandwidthData 
                    ? `${bandwidthData.bandwidth} ${bandwidthData.unit}` 
                    : "As specified"}
                </td>
              </tr>
              <tr>
                <td className="py-1 text-muted-foreground">Contract Term:</td>
                <td className="py-1">{quoteData.contract_term_months} months</td>
              </tr>
              <tr>
                <td className="py-1 text-muted-foreground">Status:</td>
                <td className="py-1 capitalize">{quoteData.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Details */}
      <div className="mb-8">
        <h3 className="font-bold mb-4">Quote Summary</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-right">One-time Fee</th>
              <th className="py-2 px-4 text-right">Monthly Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3 px-4">Base Service</td>
              <td className="py-3 px-4 text-right">
                MUR {formatCurrency(serviceData?.setup_fee || 0)}
              </td>
              <td className="py-3 px-4 text-right">
                MUR {formatCurrency(bandwidthData?.monthly_price || 0)}
              </td>
            </tr>
            
            {featuresData.map((feature, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4">{feature.name}</td>
                <td className="py-3 px-4 text-right">
                  MUR {formatCurrency(feature.one_time_fee)}
                </td>
                <td className="py-3 px-4 text-right">
                  MUR {formatCurrency(feature.monthly_price)}
                </td>
              </tr>
            ))}
            
            <tr className="font-medium">
              <td className="py-3 px-4">Total</td>
              <td className="py-3 px-4 text-right">
                MUR {formatCurrency(quoteData.total_one_time_cost)}
              </td>
              <td className="py-3 px-4 text-right">
                MUR {formatCurrency(quoteData.total_monthly_cost)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Notes */}
      {quoteData.notes && (
        <div className="mb-8">
          <h3 className="font-bold mb-2">Notes</h3>
          <p className="text-sm whitespace-pre-line">{quoteData.notes}</p>
        </div>
      )}

      {/* Terms and conditions */}
      <div className="mt-8 text-sm">
        <h3 className="font-bold mb-2">Terms & Conditions</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>All prices are in Mauritian Rupees (MUR) and exclusive of VAT.</li>
          <li>This quote is valid for 30 days from the issue date.</li>
          <li>Installation timeline will be confirmed upon acceptance of the quote.</li>
          <li>Payment terms: 50% advance payment, 50% upon installation completion.</li>
          <li>Service level agreement details will be provided upon request.</li>
        </ol>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-4 border-t text-sm text-center text-muted-foreground">
        <p>Thank you for your business!</p>
        <p className="mt-1">For any questions, please contact your account manager or call +230 123 4567</p>
      </div>
    </div>
  );
}
