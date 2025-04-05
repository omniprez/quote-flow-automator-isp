
interface RCQuoteFooterProps {
  currentPage: number;
  totalPages: number;
  companyAddress?: string;
  companyContact?: string;
  companyEmail?: string;
}

export function RCQuoteFooter({
  currentPage,
  totalPages,
  companyAddress = "5, President John Kennedy Street\nPort Louis, Republic of Mauritius",
  companyContact = "+(230) 211 7801",
  companyEmail = "mcs_sales@rogerscapital.mu",
}: RCQuoteFooterProps) {
  return (
    <div className="mt-auto pt-6 border-t text-xs text-gray-500 flex justify-between">
      <div>
        <p className="font-medium">RC Technology Services Ltd. BRN: C15139690</p>
        <p>{companyAddress}</p>
        <p>T: {companyContact} | E: {companyEmail}</p>
      </div>
      <div className="text-right">
        <div className="flex items-end justify-end h-full">
          <p className="mr-4">Rogers Capital</p>
          <p>Page {currentPage} of {totalPages}</p>
        </div>
      </div>
    </div>
  );
}
