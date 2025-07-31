import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token || token === 'null' || token === 'undefined') {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    try {
      // Skip verification for old non-JWT tokens
      if (!token.includes('.') || token.startsWith('access_token_')) {
        return NextResponse.json(
          { success: false, message: 'Legacy token detected. Please login again.' },
          { status: 401 }
        );
      }

      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      if (!decoded.userId) {
        return NextResponse.json(
          { success: false, message: 'Invalid token payload' },
          { status: 401 }
        );
      }

      // Get fresh user data from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          patientProfile: true,
          doctorProfile: true,
          pharmacistProfile: true,
          mltProfile: true,
          hospital: true,
          pharmacy: true,
          laboratory: true,
          insuranceCompany: true
        }
      });

      if (!user || !user.isActive) {
        return NextResponse.json(
          { success: false, message: 'User not found or inactive' },
          { status: 401 }
        );
      }

      // Return success (frontend will use cached user data)
      return NextResponse.json({
        success: true,
        message: 'Token is valid',
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        }
      });

    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Get current user API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}