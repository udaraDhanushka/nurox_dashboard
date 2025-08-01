import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock data for all organizations
    const organizationsData = {
      hospitals: [
        {
          id: '1',
          name: 'General Hospital',
          status: 'ACTIVE',
          createdAt: '2024-01-15T09:00:00Z',
          _count: { users: 45 },
        },
        {
          id: '2',
          name: 'City Medical Center',
          status: 'ACTIVE',
          createdAt: '2024-02-20T10:30:00Z',
          _count: { users: 32 },
        },
      ],
      pharmacies: [
        {
          id: '1',
          name: 'Central Pharmacy',
          status: 'ACTIVE',
          createdAt: '2024-01-10T08:00:00Z',
          _count: { users: 12 },
        },
        {
          id: '2',
          name: 'Health Plus Pharmacy',
          status: 'ACTIVE',
          createdAt: '2024-03-05T14:20:00Z',
          _count: { users: 8 },
          hospitalId: '1',
        },
      ],
      laboratories: [
        {
          id: '1',
          name: 'Diagnostic Lab',
          status: 'ACTIVE',
          createdAt: '2024-01-25T11:00:00Z',
          _count: { users: 18 },
        },
        {
          id: '2',
          name: 'Medical Testing Center',
          status: 'PENDING_APPROVAL',
          createdAt: '2024-03-10T16:45:00Z',
          _count: { users: 5 },
          hospitalId: '2',
        },
      ],
      insuranceCompanies: [
        {
          id: '1',
          name: 'Health Insurance Co.',
          status: 'ACTIVE',
          createdAt: '2024-02-01T09:15:00Z',
          _count: { users: 25 },
        },
        {
          id: '2',
          name: 'MediCare Plus',
          status: 'ACTIVE',
          createdAt: '2024-02-15T13:30:00Z',
          _count: { users: 15 },
        },
      ],
      summary: {
        totalHospitals: 2,
        totalPharmacies: 2,
        totalLaboratories: 2,
        totalInsuranceCompanies: 2,
      },
    };

    return NextResponse.json({
      success: true,
      message: 'Organizations retrieved successfully',
      data: organizationsData,
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch organizations',
      },
      { status: 500 }
    );
  }
}
