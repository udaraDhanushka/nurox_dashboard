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
    const newInsuranceCompany = {
      id: `insurance_${Date.now()}`,
      name: body.name,
      registrationNumber: body.registrationNumber,
      licenseNumber: body.licenseNumber,
      address: body.address,
      phone: body.phone,
      email: body.email,
      contactPerson: body.contactPerson,
      coverageTypes: body.coverageTypes || [],
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      _count: { users: 0 },
    };

    return NextResponse.json({
      success: true,
      message: 'Insurance company created successfully',
      data: newInsuranceCompany,
    });
  } catch (error) {
    console.error('Error creating insurance company:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create insurance company',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Mock insurance companies data
    const insuranceCompanies = [
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
    ];

    return NextResponse.json({
      success: true,
      message: 'Insurance companies retrieved successfully',
      data: insuranceCompanies,
    });
  } catch (error) {
    console.error('Error fetching insurance companies:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch insurance companies',
      },
      { status: 500 }
    );
  }
}
