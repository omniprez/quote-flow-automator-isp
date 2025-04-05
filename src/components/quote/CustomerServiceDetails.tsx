
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
  
  console.log("Rendering CustomerServiceDetails with tighter spacing");
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      <div>
        <h3 className="font-bold mb-1 text-sm" style={headerStyle}>Customer</h3>
        <p className="font-medium text-sm mb-0 leading-tight">{customerData.company_name}</p>
        <p className="text-xs mb-0 leading-tight">Contact: {customerData.contact_name}</p>
        <p className="text-xs mb-0 leading-tight">Email: {customerData.email}</p>
        {customerData.phone && <p className="text-xs mb-0 leading-tight">Phone: {customerData.phone}</p>}
        {customerData.address && (
          <>
            <p className="mt-1 text-xs mb-0 leading-tight">{customerData.address}</p>
            <p className="text-xs mb-0 leading-tight">{customerData.city}{customerData.city && customerData.country ? ", " : ""}{customerData.country}</p>
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
