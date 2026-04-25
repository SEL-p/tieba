import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'VENDEUR') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const platform = params.platform; // facebook, instagram, tiktok
    
    // In a real application, this is where you would redirect to:
    // https://www.facebook.com/v16.0/dialog/oauth?client_id=...&redirect_uri=...
    // https://api.tiktok.com/v1/oauth/authorize?client_key=...&response_type=code...
    
    // Here we simulate a successful OAuth callback that gives us an Access Token
    const mockAccessToken = `${platform}_access_token_${Math.random().toString(36).substr(2, 9)}`;

    let updateData = {};
    if (platform === 'facebook') updateData.facebookAccessToken = mockAccessToken;
    if (platform === 'instagram') updateData.instagramAccessToken = mockAccessToken;
    if (platform === 'tiktok') updateData.tiktokAccessToken = mockAccessToken;

    await prisma.seller.update({
      where: { userId: session.user.id },
      data: updateData
    });

    // Redirect back to dashboard with success message
    const baseUrl = request.nextUrl.origin;
    return NextResponse.redirect(`${baseUrl}/vendeur/dashboard?social_success=${platform}`);

  } catch (error) {
    console.error(`Error connecting ${params.platform} API:`, error);
    const baseUrl = request.nextUrl.origin;
    return NextResponse.redirect(`${baseUrl}/vendeur/dashboard?social_error=${params.platform}`);
  }
}
