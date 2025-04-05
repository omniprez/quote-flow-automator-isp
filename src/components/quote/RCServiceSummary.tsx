
import { formatCurrency } from "@/lib/formatters";

interface RCServiceSummaryProps {
  serviceData?: any;
  bandwidthData?: any;
  featuresData?: any[];
  quoteData: any;
  primaryColor?: string;
}

export function RCServiceSummary({
  serviceData,
  bandwidthData,
  featuresData = [],
  quoteData,
  primaryColor = "#003366",
}: RCServiceSummaryProps) {
  return (
    <div className="my-4">
      <div className="border border-blue-800 bg-gray-100 p-2 text-sm mb-4">
        <p>The total of service charges is based on a contract term of {quoteData.contract_term_months} month/s.</p>
        <p>Billing starts as from activation date.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-800 text-white">
              <th className="p-1 text-left border border-blue-800">Service</th>
              <th className="p-1 text-center border border-blue-800">Quantity</th>
              <th className="p-1 text-center border border-blue-800">Installation Charge (MUR)</th>
              <th className="p-1 text-center border border-blue-800">Monthly Recurring Charge (MUR)</th>
              <th className="p-1 text-center border border-blue-800">Total (MUR)</th>
            </tr>
          </thead>
          <tbody>
            {/* Main Service */}
            <tr>
              <td className="p-1 border border-blue-800">
                {serviceData?.name || "Internet Service"} 
                {bandwidthData && ` - ${bandwidthData.bandwidth} ${bandwidthData.unit}`}
              </td>
              <td className="p-1 text-center border border-blue-800">1</td>
              <td className="p-1 text-right border border-blue-800">
                {formatCurrency(serviceData?.setup_fee || 0)}
              </td>
              <td className="p-1 text-right border border-blue-800">
                {formatCurrency(bandwidthData?.monthly_price || 0)}
              </td>
              <td className="p-1 text-right border border-blue-800">
                {formatCurrency((serviceData?.setup_fee || 0) + 
                  (quoteData.contract_term_months * (bandwidthData?.monthly_price || 0)))}
              </td>
            </tr>
            
            {/* Additional Features */}
            {featuresData.map((feature, index) => (
              <tr key={index}>
                <td className="p-1 border border-blue-800">{feature.name}</td>
                <td className="p-1 text-center border border-blue-800">1</td>
                <td className="p-1 text-right border border-blue-800">
                  {formatCurrency(feature.one_time_fee || 0)}
                </td>
                <td className="p-1 text-right border border-blue-800">
                  {formatCurrency(feature.monthly_price || 0)}
                </td>
                <td className="p-1 text-right border border-blue-800">
                  {formatCurrency((feature.one_time_fee || 0) + 
                    (quoteData.contract_term_months * (feature.monthly_price || 0)))}
                </td>
              </tr>
            ))}
            
            {/* Empty rows for future additions */}
            {[...Array(5 - Math.min(featuresData.length, 5))].map((_, index) => (
              <tr key={`empty-${index}`}>
                <td className="p-1 border border-blue-800">&nbsp;</td>
                <td className="p-1 border border-blue-800">&nbsp;</td>
                <td className="p-1 border border-blue-800">&nbsp;</td>
                <td className="p-1 border border-blue-800">&nbsp;</td>
                <td className="p-1 border border-blue-800">&nbsp;</td>
              </tr>
            ))}
            
            {/* Subtotal Row */}
            <tr className="font-medium">
              <td colSpan={2} className="p-1 text-right border border-blue-800">Subtotal</td>
              <td className="p-1 text-right border border-blue-800">
                {formatCurrency(quoteData.total_one_time_cost)}
              </td>
              <td className="p-1 text-right border border-blue-800">
                {formatCurrency(quoteData.total_monthly_cost)}
              </td>
              <td className="p-1 text-right border border-blue-800">
                {formatCurrency(quoteData.total_one_time_cost + (quoteData.contract_term_months * quoteData.total_monthly_cost))}
              </td>
            </tr>
            
            {/* VAT Row */}
            <tr>
              <td colSpan={2} className="p-1 text-right border border-blue-800">VAT 15%</td>
              <td className="p-1 text-right border border-blue-800">
                {formatCurrency(quoteData.total_one_time_cost * 0.15)}
              </td>
              <td className="p-1 text-right border border-blue-800">
                {formatCurrency(quoteData.total_monthly_cost * 0.15)}
              </td>
              <td className="p-1 text-right border border-blue-800">
                {formatCurrency((quoteData.total_one_time_cost + (quoteData.contract_term_months * quoteData.total_monthly_cost)) * 0.15)}
              </td>
            </tr>
            
            {/* Total Row */}
            <tr className="font-bold">
              <td colSpan={2} className="p-1 text-right border border-blue-800">Total (MUR)</td>
              <td className="p-1 text-right border border-blue-800">
                {formatCurrency(quoteData.total_one_time_cost * 1.15)}
              </td>
              <td className="p-1 text-right border border-blue-800">
                {formatCurrency(quoteData.total_monthly_cost * 1.15)}
              </td>
              <td className="p-1 text-right border border-blue-800">
                {formatCurrency((quoteData.total_one_time_cost + (quoteData.contract_term_months * quoteData.total_monthly_cost)) * 1.15)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
