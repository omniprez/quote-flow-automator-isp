
interface RCTermsConditionsProps {
  primaryColor?: string;
}

export function RCTermsConditions({
  primaryColor = "#003366",
}: RCTermsConditionsProps) {
  return (
    <div className="my-4">
      <h3 className="bg-blue-800 text-white p-1 font-medium">Terms and Conditions</h3>
      
      <div className="p-2 border border-blue-800 text-sm">
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Our Prices which the Client hereby agrees to, VAT is charged on all goods and services supplied.
          </li>
          <li>
            The prices quoted in this document are only for providing the services specified herein and should be read in conjunction with the contract. The Customer shall submit a duly signed letter of intent or a Purchase Order each referring to the Quotation reference number addressed to Rogers Capital Technology Services Ltd.
          </li>
          <li>
            The Sales period validity is for a period of 30 calendar days from the issued date.
          </li>
          <li>
            This document shall be treated for a period of 90 (ninety) days from the date of issue as follows:
            <ul className="list-disc pl-6 mt-1">
              <li>One-Off Costs: non-refundable</li>
              <li>
                MRCs:
                <ul className="list-disc pl-6 mt-1">
                  <li>100% upon acceptance of offer</li>
                  <li>80% upon starting of installation</li>
                  <li>50% upon activation.</li>
                </ul>
              </li>
              <li>
                Invoices for the monthly prepayment charges are issued in advance on the 15th of the preceding month and in case where revenue is collected for part period, the relevant invoices shall be raised on the day of activation.
              </li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
}
