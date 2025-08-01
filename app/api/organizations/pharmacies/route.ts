import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'name',
      'registrationNumber',
      'licenseNumber',
      'address',
      'phone',
      'email',
      'contactPerson',
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            message: `${field} is required`,
          },
          { status: 400 }
        );
      }
    }

    // Mock response - in a real app, this would save to database
    const newPharmacy = {
      id: `pharmacy_${Date.now()}`,
      name: body.name,
      registrationNumber: body.registrationNumber,
      licenseNumber: body.licenseNumber,
      address: body.address,
      phone: body.phone,
      email: body.email,
      contactPerson: body.contactPerson,
      hospitalId: body.hospitalId || null,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      _count: { users: 0 },
    };

    return NextResponse.json({
      success: true,
      message: 'Pharmacy created successfully',
      data: newPharmacy,
    });
  } catch (error) {
    console.error('Error creating pharmacy:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create pharmacy',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Mock pharmacies data
    const pharmacies = [
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
    ];

    return NextResponse.json({
      success: true,
      message: 'Pharmacies retrieved successfully',
      data: pharmacies,
    });
  } catch (error) {
    console.error('Error fetching pharmacies:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch pharmacies',
      },
      { status: 500 }
    );
  }
}
