import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const sellerId = params.sellerId;

    if (!sellerId) {
      return NextResponse.json({ error: 'Missing seller ID' }, { status: 400 });
    }

    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
      include: {
        products: {
          where: { inStock: true }
        }
      }
    });

    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    const host = request.headers.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    // Build the XML for Facebook/Instagram Commerce Manager
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n`;
    xml += `  <channel>\n`;
    xml += `    <title>Catalogue ${seller.businessName} - Tieba Market</title>\n`;
    xml += `    <link>${baseUrl}/boutique/${seller.userId}</link>\n`;
    xml += `    <description>Produits synchronisés de la boutique ${seller.businessName}</description>\n`;

    seller.products.forEach(product => {
      // Ensure absolute URLs for images and links
      const productLink = `${baseUrl}/produit/${product.id}`;
      const imageUrl = product.image?.startsWith('http') 
        ? product.image 
        : `${baseUrl}${product.image || '/placeholder-product.png'}`;

      xml += `    <item>\n`;
      xml += `      <g:id>${product.id}</g:id>\n`;
      xml += `      <g:title><![CDATA[${product.name}]]></g:title>\n`;
      xml += `      <g:description><![CDATA[${product.description || product.name}]]></g:description>\n`;
      xml += `      <g:link>${productLink}</g:link>\n`;
      xml += `      <g:image_link>${imageUrl}</g:image_link>\n`;
      xml += `      <g:brand><![CDATA[${seller.businessName}]]></g:brand>\n`;
      xml += `      <g:condition>new</g:condition>\n`;
      xml += `      <g:availability>in stock</g:availability>\n`;
      xml += `      <g:price>${product.price} XOF</g:price>\n`;
      if (product.originalPrice) {
        xml += `      <g:sale_price>${product.price} XOF</g:sale_price>\n`;
        xml += `      <g:price>${product.originalPrice} XOF</g:price>\n`;
      }
      xml += `    </item>\n`;
    });

    xml += `  </channel>\n`;
    xml += `</rss>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate'
      }
    });

  } catch (error) {
    console.error('Error generating catalog feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
