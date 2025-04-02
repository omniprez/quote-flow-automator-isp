
interface TermsConditionsProps {
  primaryColor?: string;
}

export function TermsConditions({
  primaryColor = "#000",
}: TermsConditionsProps) {
  // Custom style for primary color elements
  const headerStyle = {
    color: primaryColor
  };
  
  return (
    <div className="mt-8 text-sm">
      <h3 className="font-bold mb-2" style={headerStyle}>Terms & Conditions</h3>
      <ol className="list-decimal pl-5 space-y-1">
        <li>All prices are in Mauritian Rupees (MUR) and exclusive of VAT.</li>
        <li>This quote is valid for 30 days from the issue date.</li>
        <li>Installation timeline will be confirmed upon acceptance of the quote.</li>
        <li>Payment terms: 50% advance payment, 50% upon installation completion.</li>
        <li>Service level agreement details will be provided upon request.</li>
      </ol>
    </div>
  );
}
