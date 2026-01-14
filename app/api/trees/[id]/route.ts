/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TreeModel from '@/models/Tree';

// GET single tree by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    console.log('[API] Fetching tree with ID:', id);
    
    const tree = await TreeModel.findOne({ tree_id: parseInt(id) });
    
    if (!tree) {
      console.log('[API] ❌ Tree not found in MongoDB');
      return NextResponse.json(
        { success: false, error: 'Tree not found' },
        { status: 404 }
      );
    }
    
    console.log('[API] ✅ Tree found:', tree.common_name);
    return NextResponse.json({ success: true, data: tree });
  } catch (error: any) {
    console.error('[API] ❌ Error fetching tree:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update tree
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();
    
    console.log('[API] Updating tree ID:', id);
    
    const tree = await TreeModel.findOneAndUpdate(
      { tree_id: parseInt(id) },
      body,
      { new: true, runValidators: true, upsert: false }
    );
    
    if (!tree) {
      console.log('[API] ❌ Tree not found for update');
      return NextResponse.json(
        { success: false, error: 'Tree not found' },
        { status: 404 }
      );
    }
    
    console.log('[API] ✅ Tree updated:', tree.common_name);
    return NextResponse.json({ success: true, data: tree });
  } catch (error: any) {
    console.error('[API] ❌ Error updating tree:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE tree
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const tree = await TreeModel.findOneAndDelete({ tree_id: parseInt(id) });
    
    if (!tree) {
      return NextResponse.json(
        { success: false, error: 'Tree not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: tree });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
