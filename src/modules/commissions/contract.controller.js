const PDFDocument = require('pdfkit');
const Property = require('../properties/property.model');
const User = require('../users/user.model');

const generateContract = async (req, res) => {
  try {
    const { propertyId, buyerName, buyerEmail, sellerName, notaryName, price, date } = req.body;

    const property = await Property.findById(propertyId).populate('agent', 'name email');

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=contract-${propertyId}.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('REAL ESTATE CONTRACT', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).font('Helvetica').text(`Date: ${date || new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown(2);

    // Parties
    doc.fontSize(16).font('Helvetica-Bold').text('PARTIES');
    doc.moveDown();
    doc.fontSize(12).font('Helvetica');
    doc.text(`Seller: ${sellerName || property?.agent?.name || 'N/A'}`);
    doc.text(`Buyer: ${buyerName}`);
    doc.text(`Buyer Email: ${buyerEmail}`);
    if (notaryName) doc.text(`Notary: ${notaryName}`);
    doc.moveDown(2);

    // Property
    doc.fontSize(16).font('Helvetica-Bold').text('PROPERTY DETAILS');
    doc.moveDown();
    doc.fontSize(12).font('Helvetica');
    doc.text(`Title: ${property?.title || 'N/A'}`);
    doc.text(`Category: ${property?.category || 'N/A'}`);
    doc.text(`City: ${property?.location?.city || 'N/A'}`);
    doc.text(`Country: ${property?.location?.country || 'N/A'}`);
    doc.text(`Address: ${property?.location?.address || 'N/A'}`);
    doc.text(`Surface: ${property?.surface || 'N/A'} m²`);
    doc.text(`Rooms: ${property?.rooms || 'N/A'}`);
    doc.moveDown(2);

    // Price
    doc.fontSize(16).font('Helvetica-Bold').text('TRANSACTION');
    doc.moveDown();
    doc.fontSize(12).font('Helvetica');
    doc.text(`Sale Price: ${price || property?.price} EUR`);
    doc.text(`Transaction Type: ${property?.transactionType || 'sale'}`);
    doc.text(`ROI Score: ${property?.roiScore || 'N/A'}%`);
    doc.moveDown(2);

    // Terms
    doc.fontSize(16).font('Helvetica-Bold').text('TERMS & CONDITIONS');
    doc.moveDown();
    doc.fontSize(11).font('Helvetica').text(
      'Both parties agree to the terms of this contract. The property is sold as described above. ' +
      'All legal obligations must be fulfilled by both parties. This contract is legally binding ' +
      'once signed by all parties. Any disputes shall be resolved through legal arbitration.',
      { align: 'justify' }
    );
    doc.moveDown(3);

    // Signatures
    doc.fontSize(14).font('Helvetica-Bold').text('SIGNATURES');
    doc.moveDown(2);
    doc.fontSize(12).font('Helvetica');
    doc.text('Seller: _______________________          Date: ___________');
    doc.moveDown(2);
    doc.text('Buyer: _______________________          Date: ___________');
    doc.moveDown(2);
    if (notaryName) {
      doc.text('Notary: _______________________         Date: ___________');
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Error generating contract', error: err.message });
  }
};

module.exports = { generateContract };