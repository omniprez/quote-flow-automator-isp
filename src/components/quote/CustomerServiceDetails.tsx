
interface CustomerServiceDetailsProps {
  customerData: any;
  serviceData?: any;
  bandwidthData?: any;
  quoteData: any;
  primaryColor?: string;
}

export function CustomerServiceDetails({
  customerData,
  serviceData,
  bandwidthData,
  quoteData,
  primaryColor = "#000",
}: CustomerServiceDetailsProps) {
  // Custom style for primary color elements
  const headerStyle = {
    color: primaryColor
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <h3 className="font-bold mb-1 text-sm" style={headerStyle}>Customer</h3>
        <p className="font-medium text-sm mb-0">{customerData.company_name}</p>
        <p className="text-xs mb-0">Contact: {customerData.contact_name}</p>
        <p className="text-xs mb-0">Email: {customerData.email}</p>
        {customerData.phone && <p className="text-xs mb-0">Phone: {customerData.phone}</p>}
        {customerData.address && (
          <>
            <p className="mt-0 text-xs mb-0">{customerData.address}</p>
            <p className="text-xs mb-0">{customerData.city}{customerData.city && customerData.country ? ", " : ""}{customerData.country}</p>
          </>
        )}
      </div>
      <div>
        <h3 className="font-bold mb-1 text-sm" style={headerStyle}>Service Details</h3>
        <table className="w-full text-xs">
          <tbody>
            <tr>
              <td className="py-0 text-muted-foreground">Service:</td>
              <td className="py-0">{serviceData?.name || "Internet Connectivity Service"}</td>
            </tr>
            <tr>
              <td className="py-0 text-muted-foreground">Bandwidth:</td>
              <td className="py-0">
                {bandwidthData 
                  ? `${bandwidthData.bandwidth} ${bandwidthData.unit}` 
                  : "As specified"}
              </td>
            </tr>
            <tr>
              <td className="py-0 text-muted-foreground">Contract Term:</td>
              <td className="py-0">{quoteData.contract_term_months} months</td>
            </tr>
            <tr>
              <td className="py-0 text-muted-foreground">Status:</td>
              <td className="py-0 capitalize">{quoteData.status}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
