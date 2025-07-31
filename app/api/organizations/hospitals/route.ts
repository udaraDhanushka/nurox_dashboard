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
    const newHospital = {
      id: `hospital_${Date.now()}`,
      name: body.name,
      registrationNumber: body.registrationNumber,
      licenseNumber: body.licenseNumber,
      address: body.address,
      phone: body.phone,
      email: body.email,
      contactPerson: body.contactPerson,
      specialties: body.specialties || [],
      bedCount: body.bedCount || 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      _count: { users: 0 }
    };

    return NextResponse.json({
      success: true,
      message: 'Hospital created successfully',
      data: newHospital
    });
  } catch (error) {
    console.error('Error creating hospital:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create hospital'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Mock hospitals data
    const hospitals = [
      {
        id: '1',
        name: 'General Hospital',
        status: 'ACTIVE',
        createdAt: '2024-01-15T09:00:00Z',
        _count: { users: 45 }
      },
      {
        id: '2',
        name: 'City Medical Center',
        status: 'ACTIVE',
        createdAt: '2024-02-20T10:30:00Z',
        _count: { users: 32 }
      }
    ];

    return NextResponse.json({
      success: true,
      message: 'Hospitals retrieved successfully',
      data: hospitals
    });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch hospitals'
    }, { status: 500 });
  }
}