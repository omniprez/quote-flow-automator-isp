
import { formatCurrency } from "@/lib/formatters";

interface QuoteSummaryTableProps {
  serviceData?: any;
  bandwidthData?: any;
  featuresData?: any[];
  quoteData: any;
  primaryColor?: string;
}

export function QuoteSummaryTable({
  serviceData,
  bandwidthData,
  featuresData = [],
  quoteData,
  primaryColor = "#000",
}: QuoteSummaryTableProps) {
  // Custom style for primary color elements
  const headerStyle = {
    color: primaryColor
  };
  
  // Format the service description to include the service name and bandwidth
  const getServiceDescription = () => {
    if (!serviceData) return "Internet Service";
    
    let description = serviceData.name;
    
    // Add bandwidth if available
    if (bandwidthData) {
      description += ` - ${bandwidthData.bandwidth} ${bandwidthData.unit}`;
    }
    
    return description;
  };

  return (
    <div className="mb-8">
      <h3 className="font-bold mb-4" style={headerStyle}>Quote Summary</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr style={{backgroundColor: `${primaryColor}10`}}>
            <th className="py-2 px-4 text-left">Description</th>
            <th className="py-2 px-4 text-right">One-time Fee</th>
            <th className="py-2 px-4 text-right">Monthly Fee</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-3 px-4">{getServiceDescription()}</td>
            <td className="py-3 px-4 text-right">
              MUR {formatCurrency(serviceData?.setup_fee || 0)}
            </td>
            <td className="py-3 px-4 text-right">
              MUR {formatCurrency(bandwidthData?.monthly_price || 0)}
            </td>
          </tr>
          
          {featuresData && featuresData.length > 0 && featuresData.map((feature, index) => (
            <tr key={index} className="border-b">
              <td className="py-3 px-4">{feature.name}</td>
              <td className="py-3 px-4 text-right">
                MUR {formatCurrency(feature.one_time_fee || 0)}
              </td>
              <td className="py-3 px-4 text-right">
                MUR {formatCurrency(feature.monthly_price || 0)}
              </td>
            </tr>
          ))}
          
          <tr className="font-medium" style={{backgroundColor: `${primaryColor}05`}}>
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
  );
}
