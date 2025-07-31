import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'registrationNumber', 'licenseNumber', 'address', 'phone', 'email', 'contactPerson'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({
          success: false,
          message: `${field} is required`
        }, { status: 400 });
      }
    }

    // Mock response - in a real app, this would save to database
    const newLaboratory = {
      id: `lab_${Date.now()}`,
      name: body.name,
      registrationNumber: body.registrationNumber,
      licenseNumber: body.licenseNumber,
      address: body.address,
      phone: body.phone,
      email: body.email,
      contactPerson: body.contactPerson,
      testTypes: body.testTypes || [],
      hospitalId: body.hospitalId || null,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      _count: { users: 0 }
    };

    return NextResponse.json({
      success: true,
      message: 'Laboratory created successfully',
      data: newLaboratory
    });
  } catch (error) {
    console.error('Error creating laboratory:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create laboratory'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Mock laboratories data
    const laboratories = [
      {
        id: '1',
        name: 'Diagnostic Lab',
        status: 'ACTIVE',
        createdAt: '2024-01-25T11:00:00Z',
        _count: { users: 18 }
      },
      {
        id: '2',
        name: 'Medical Testing Center',
        status: 'PENDING_APPROVAL',
        createdAt: '2024-03-10T16:45:00Z',
        _count: { users: 5 },
        hospitalId: '2'
      }
    ];

    return NextResponse.json({
      success: true,
      message: 'Laboratories retrieved successfully',
      data: laboratories
    });
  } catch (error) {
    console.error('Error fetching laboratories:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch laboratories'
    }, { status: 500 });
  }
}