
interface QuoteNotesProps {
  notes?: string;
  primaryColor?: string;
}

export function QuoteNotes({
  notes,
  primaryColor = "#000",
}: QuoteNotesProps) {
  if (!notes) return null;
  
  // Extract actual notes content by removing metadata
  let cleanNotes = notes;
  
  // Check if notes contain metadata (in HTML comment format)
  if (notes.includes('<!-- QUOTE_METADATA:')) {
    // Extract just the user-visible notes part (everything after the closing -->)
    const metadataEndPos = notes.indexOf('-->');
    if (metadataEndPos !== -1) {
      cleanNotes = notes.substring(metadataEndPos + 3).trim();
    }
  }
  
  // If after removing metadata there's no content, don't render the notes section
  if (!cleanNotes) return null;
  
  // Custom style for primary color elements
  const headerStyle = {
    color: primaryColor
  };
  
  return (
    <div className="mb-8">
      <h3 className="font-bold mb-2" style={headerStyle}>Notes</h3>
      <p className="text-sm whitespace-pre-line">{cleanNotes}</p>
    </div>
  );
}
