import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { UserRole, getDefaultRoute, requiresProfile, requiresOrganization, hasDashboardAccess } from '@/lib/roles';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';
const JWT_EXPIRES_IN = '24h';

// Database authentication function
async function validateUserCredentials(email: string, password: string) {
  try {
    // Find user with all related data
    const user = await prisma.user.findUnique({
      where: { email },
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

    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    if (!user.isActive) {
      return { success: false, message: 'Account is disabled' };
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Validate role-specific requirements
    const userRole = user.role as UserRole;
    
    // Check if user has dashboard access
    if (!hasDashboardAccess(userRole)) {
      return { 
        success: false, 
        message: `Dashboard access denied. ${userRole === UserRole.PATIENT ? 'Patients' : 'Insurance Agents'} must use the Nurox Mobile App.`,
        requiresMobileApp: true,
        role: userRole
      };
    }
    
    // Check if profile is required and exists
    if (requiresProfile(userRole)) {
      const hasProfile = 
        (userRole === UserRole.PATIENT && user.patientProfile) ||
        (userRole === UserRole.DOCTOR && user.doctorProfile) ||
        (userRole === UserRole.PHARMACIST && user.pharmacistProfile) ||
        (userRole === UserRole.MLT && user.mltProfile);
      
      if (!hasProfile) {
        return { 
          success: false, 
          message: 'Profile setup required. Please complete your profile.',
          requiresProfileSetup: true,
          role: userRole
        };
      }
    }
    
    // Check if organization affiliation is required
    if (requiresOrganization(userRole)) {
      const hasOrganization = 
        (userRole === UserRole.HOSPITAL_ADMIN && user.hospitalId) ||
        (userRole === UserRole.PHARMACY_ADMIN && user.pharmacyId) ||
        (userRole === UserRole.LAB_ADMIN && user.laboratoryId) ||
        ([UserRole.INSURANCE_ADMIN, UserRole.INSURANCE_AGENT].includes(userRole) && user.insuranceId);
      
      if (!hasOrganization) {
        return { 
          success: false, 
          message: 'Organization affiliation required. Please contact your administrator.',
          requiresOrganization: true,
          role: userRole
        };
      }
    }

    // Create user object with name field for frontend
    const userForResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`.trim(),
      role: user.role,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      profileImage: user.profileImage,
      language: user.language,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      // Organization affiliations
      hospitalId: user.hospitalId,
      pharmacyId: user.pharmacyId,
      laboratoryId: user.laboratoryId,
      insuranceId: user.insuranceId,
      // Related data
      patientProfile: user.patientProfile,
      doctorProfile: user.doctorProfile,
      pharmacistProfile: user.pharmacistProfile,
      mltProfile: user.mltProfile,
      hospital: user.hospital,
      pharmacy: user.pharmacy,
      laboratory: user.laboratory,
      insuranceCompany: user.insuranceCompany,
      // Add default route for redirection
      defaultRoute: getDefaultRoute(userRole)
    };

    return {
      success: true,
      user: userForResponse
    };
  } catch (error) {
    console.error('Database authentication error:', error);
    return { success: false, message: 'Authentication failed' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate credentials
    const result = await validateUserCredentials(email, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT tokens
    const tokenPayload = {
      userId: result.user!.id,
      email: result.user!.email,
      role: result.user!.role,
      iat: Math.floor(Date.now() / 1000)
    };
    
    const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign(
      { ...tokenPayload, type: 'refresh' }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      }
    });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}