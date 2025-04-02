
interface QuoteNotesProps {
  notes?: string;
  primaryColor?: string;
}

export function QuoteNotes({
  notes,
  primaryColor = "#000",
}: QuoteNotesProps) {
  if (!notes) return null;
  
  // Custom style for primary color elements
  const headerStyle = {
    color: primaryColor
  };
  
  return (
    <div className="mb-8">
      <h3 className="font-bold mb-2" style={headerStyle}>Notes</h3>
      <p className="text-sm whitespace-pre-line">{notes}</p>
    </div>
  );
}
