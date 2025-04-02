
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <h3 className="font-bold mb-2" style={headerStyle}>Customer</h3>
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
        <h3 className="font-bold mb-2" style={headerStyle}>Service Details</h3>
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
  );
}
