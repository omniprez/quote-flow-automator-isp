// Cover page template that uses the uploaded image
export const COVER_PAGE_IMAGE_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
    .quote-container { max-width: 800px; margin: 0 auto; }
    
    /* Cover Page Styles using the uploaded image */
    .cover-page {
      position: relative;
      height: 1056px;
      width: 100%;
      background-image: url('/lovable-uploads/742007c0-8ba0-46f4-99ae-0d31b98214a3.png');
      background-size: cover;
      background-position: center;
      color: white;
      overflow: hidden;
      page-break-after: always;
    }
    
    .cover-content {
      position: absolute;
      bottom: 100px;
      left: 50px;
      z-index: 2;
      width: 300px;
    }
    
    .cover-content .label {
      font-size: 12px;
      margin-bottom: 5px;
      color: rgba(0,0,0,0.7);
      font-weight: bold;
    }
    
    .cover-content .value {
      font-size: 14px;
      margin-bottom: 15px;
      color: #000;
      background-color: rgba(255,255,255,0.8);
      padding: 5px;
    }
    
    /* Rest of the styles */
    .header { display: flex; justify-content: space-between; margin-bottom: 30px; padding: 20px; }
    .logo { max-height: 60px; }
    .quote-title { color: {{primaryColor}}; font-size: 24px; font-weight: bold; }
    .company-info { text-align: right; }
    .separator { height: 2px; background-color: {{primaryColor}}; opacity: 0.2; margin: 20px 0; }
    .section { margin-bottom: 20px; padding: 0 20px; }
    .section-title { color: {{primaryColor}}; font-weight: bold; margin-bottom: 10px; }
    .two-columns { display: flex; justify-content: space-between; flex-wrap: wrap; }
    .column { flex: 0 0 48%; }
    table { width: 100%; border-collapse: collapse; }
    table th { background-color: rgba(0,0,0,0.05); text-align: left; padding: 10px; }
    table td { padding: 10px; border-bottom: 1px solid #eee; }
    .text-right { text-align: right; }
    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; }
    
    @media print {
      .page-break { page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="quote-container">
    <!-- Cover Page using uploaded image -->
    <div class="cover-page">
      <div class="cover-content">
        <div class="label">To:</div>
        <div class="value">{{customerName}}<br>{{contactName}}<br>{{customerAddress}}<br>{{customerCity}}, {{customerCountry}}</div>
        
        <div class="label">From:</div>
        <div class="value">{{companyName}}<br>{{companyAddress}}<br>Tel: {{companyContact}}<br>Email: {{companyEmail}}</div>
        
        <div class="label">Quote Reference Number:</div>
        <div class="value">{{quoteNumber}}</div>
      </div>
    </div>
    
    <div class="page-break"></div>
    
    <!-- Rest of the quote content -->
    <!-- Header -->
    <div class="header">
      <div>
        <div class="quote-title">QUOTE</div>
        <div>#{{quoteNumber}}</div>
        <div style="font-size: 14px; color: #666; margin-top: 5px;">Date: {{quoteDate}}</div>
        <div style="font-size: 14px; color: #666;">Valid until: {{expirationDate}}</div>
      </div>
      <div class="company-info">
        <img src="{{companyLogo}}" alt="{{companyName}}" class="logo" />
        <div style="font-weight: bold; font-size: 18px; margin-top: 5px;">{{companyName}}</div>
        <div style="margin-top: 5px;">{{companyAddress}}</div>
        <div>Tel: {{companyContact}}</div>
        <div>Email: {{companyEmail}}</div>
      </div>
    </div>

    <div class="separator"></div>

    <!-- Customer and Service Info -->
    <div class="two-columns">
      <div class="column section">
        <div class="section-title">Customer</div>
        <div style="font-weight: 500;">{{customerName}}</div>
        <div>Contact: {{contactName}}</div>
        <div>Email: {{customerEmail}}</div>
        <div>Phone: {{customerPhone}}</div>
        <div style="margin-top: 5px;">{{customerAddress}}</div>
        <div>{{customerCity}}, {{customerCountry}}</div>
      </div>
      <div class="column section">
        <div class="section-title">Service Details</div>
        <table style="font-size: 14px;">
          <tr>
            <td style="color: #666;">Service:</td>
            <td>{{serviceName}}</td>
          </tr>
          <tr>
            <td style="color: #666;">Bandwidth:</td>
            <td>{{bandwidth}}</td>
          </tr>
          <tr>
            <td style="color: #666;">Contract Term:</td>
            <td>{{contractTerm}} months</td>
          </tr>
          <tr>
            <td style="color: #666;">Status:</td>
            <td style="text-transform: capitalize;">{{quoteStatus}}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Quote Summary -->
    <div class="section">
      <div class="section-title">Quote Summary</div>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-right">One-time Fee</th>
            <th class="text-right">Monthly Fee</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{serviceName}} - {{bandwidth}}</td>
            <td class="text-right">MUR {{serviceSetupFee}}</td>
            <td class="text-right">MUR {{bandwidthPrice}}</td>
          </tr>
          {{featuresRows}}
          <tr style="font-weight: 500; background-color: rgba(0,0,0,0.02);">
            <td>Total</td>
            <td class="text-right">MUR {{totalOneTime}}</td>
            <td class="text-right">MUR {{totalMonthly}}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Notes -->
    <div class="section">
      <div class="section-title">Notes</div>
      <div style="font-size: 14px; white-space: pre-line;">{{notes}}</div>
    </div>

    <!-- Terms and Conditions -->
    <div class="section">
      <div class="section-title">Terms & Conditions</div>
      <ol style="font-size: 14px; padding-left: 20px;">
        <li>All prices are in Mauritian Rupees (MUR) and exclusive of VAT.</li>
        <li>This quote is valid for 30 days from the issue date.</li>
        <li>Installation timeline will be confirmed upon acceptance of the quote.</li>
        <li>Payment terms: 50% advance payment, 50% upon installation completion.</li>
        <li>Service level agreement details will be provided upon request.</li>
      </ol>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div>Thank you for your business!</div>
      <div style="margin-top: 5px;">For any questions, please contact your account manager or call {{companyContact}}</div>
    </div>
  </div>
</body>
</html>
`;

// Let's add an option to use the image template in the HtmlTemplateEditor
export const getTemplateOptions = () => {
  return [
    {
      name: "Blue Cover Page with Uploaded Image",
      html: COVER_PAGE_IMAGE_TEMPLATE
    }
  ];
};
