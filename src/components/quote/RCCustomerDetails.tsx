
interface RCCustomerDetailsProps {
  customerData: any;
  primaryColor?: string;
}

export function RCCustomerDetails({
  customerData,
  primaryColor = "#003366",
}: RCCustomerDetailsProps) {
  return (
    <div className="my-4">
      <div className="bg-blue-800 text-white p-1 font-medium">
        <h3>Customer Details</h3>
      </div>
      
      <div className="grid gap-1 mb-4">
        <div className="grid grid-cols-2 border border-blue-800">
          <div className="bg-blue-800 text-white p-1 font-medium">Company Name (Customer)</div>
          <div className="bg-blue-800 text-white p-1 font-medium border-l border-white">VAT Number</div>
          <div className="p-1 border-t border-blue-800">{customerData.company_name}</div>
          <div className="p-1 border-t border-l border-blue-800">
            {customerData.vat_number || 'Not Provided'}
          </div>
        </div>

        <div className="grid grid-cols-3 border border-blue-800">
          <div className="bg-blue-800 text-white p-1 font-medium">Billing Address</div>
          <div className="bg-blue-800 text-white p-1 font-medium border-l border-white">Telephone</div>
          <div className="bg-blue-800 text-white p-1 font-medium border-l border-white">Fax</div>
          
          <div className="p-1 border-t border-blue-800 min-h-[50px]">
            {customerData.address || 'Not Provided'}
            {customerData.city && <div>{customerData.city}</div>}
            {customerData.country && <div>{customerData.country}</div>}
          </div>
          <div className="p-1 border-t border-l border-blue-800">
            {customerData.phone || 'Not Provided'}
          </div>
          <div className="p-1 border-t border-l border-blue-800">
            {customerData.fax || 'Not Provided'}
          </div>
        </div>

        {/* Contact Details - General */}
        <div className="grid grid-cols-2 border border-blue-800">
          <div className="col-span-2 bg-blue-800 text-white p-1 font-medium">Contact Details - General</div>
          <div className="p-1 border-t border-blue-800 min-h-[30px]">
            {customerData.contact_name || 'Not Provided'}
          </div>
          <div className="p-1 border-t border-l border-blue-800">
            {customerData.email || 'Not Provided'}
          </div>
        </div>

        {/* Contact Details - Primary Contact */}
        <div className="grid grid-cols-3 border border-blue-800">
          <div className="col-span-3 bg-blue-800 text-white p-1 font-medium">Contact Details - Primary Contact</div>
          <div className="p-1 border-t border-blue-800">Full Name:</div>
          <div className="p-1 border-t border-l border-blue-800 col-span-2 min-h-[30px]">
            {customerData.primary_contact_name || customerData.contact_name || 'Not Provided'}
          </div>
          <div className="p-1 border-t border-blue-800">Telephone:</div>
          <div className="p-1 border-t border-l border-blue-800 col-span-2">
            {customerData.primary_contact_phone || customerData.phone || 'Not Provided'}
          </div>
          <div className="p-1 border-t border-blue-800">Email:</div>
          <div className="p-1 border-t border-l border-blue-800 col-span-2">
            {customerData.primary_contact_email || customerData.email || 'Not Provided'}
          </div>
        </div>

        {/* Contact Details - Technical Contact */}
        <div className="grid grid-cols-3 border border-blue-800">
          <div className="col-span-3 bg-blue-800 text-white p-1 font-medium">Contact Details - Technical Contact</div>
          <div className="p-1 border-t border-blue-800">Full Name:</div>
          <div className="p-1 border-t border-l border-blue-800 col-span-2 min-h-[30px]">
            {customerData.technical_contact_name || 'Not Provided'}
          </div>
          <div className="p-1 border-t border-blue-800">Telephone:</div>
          <div className="p-1 border-t border-l border-blue-800 col-span-2">
            {customerData.technical_contact_phone || 'Not Provided'}
          </div>
          <div className="p-1 border-t border-blue-800">Email:</div>
          <div className="p-1 border-t border-l border-blue-800 col-span-2">
            {customerData.technical_contact_email || 'Not Provided'}
          </div>
        </div>

        {/* Contact Details - Billing Contact */}
        <div className="grid grid-cols-3 border border-blue-800">
          <div className="col-span-3 bg-blue-800 text-white p-1 font-medium">Contact Details - Billing Contact</div>
          <div className="p-1 border-t border-blue-800">Full Name:</div>
          <div className="p-1 border-t border-l border-blue-800 col-span-2 min-h-[30px]">
            {customerData.billing_contact_name || 'Not Provided'}
          </div>
          <div className="p-1 border-t border-blue-800">Telephone:</div>
          <div className="p-1 border-t border-l border-blue-800 col-span-2">
            {customerData.billing_contact_phone || 'Not Provided'}
          </div>
          <div className="p-1 border-t border-blue-800">Email:</div>
          <div className="p-1 border-t border-l border-blue-800 col-span-2">
            {customerData.billing_contact_email || 'Not Provided'}
          </div>
        </div>
        
        {/* Service Details */}
        <div className="grid grid-cols-1 border border-blue-800">
          <div className="bg-blue-800 text-white p-1 font-medium">Service Details</div>
          <div className="p-1 border-t border-blue-800 min-h-[50px]">
            {customerData.service_details || 'Standard service as per agreement.'}
          </div>
        </div>
      </div>
    </div>
  );
}
