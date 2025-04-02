
interface QuoteFooterProps {
  companyContact?: string;
  primaryColor?: string;
}

export function QuoteFooter({
  companyContact = "+230 123 4567",
  primaryColor = "#000",
}: QuoteFooterProps) {
  return (
    <div className="mt-12 pt-4 border-t text-sm text-center text-muted-foreground" style={{borderColor: `${primaryColor}20`}}>
      <p>Thank you for your business!</p>
      <p className="mt-1">For any questions, please contact your account manager or call {companyContact}</p>
    </div>
  );
}
