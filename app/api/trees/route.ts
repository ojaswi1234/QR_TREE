/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TreeModel from '@/models/Tree';

// GET all trees
export async function GET() {
  try {
    await connectDB();
    const trees = await TreeModel.find({}).sort({ tree_id: -1 });
    return NextResponse.json({ success: true, data: trees });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create new tree
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    console.log('[API] Creating tree:', body.common_name);
    
    // Generate new tree_id by finding the highest existing ID
    const lastTree = await TreeModel.findOne().sort({ tree_id: -1 });
    const newTreeId = lastTree ? lastTree.tree_id + 1 : 1;
    
    console.log('[API] Assigning tree_id:', newTreeId);
    
    // Create new tree with auto-generated ID
    const tree = await TreeModel.create({
      ...body,
      tree_id: newTreeId,
    });
    
    console.log('[API] ✅ Tree created in MongoDB with ID:', newTreeId);
    
    return NextResponse.json({ success: true, data: tree }, { status: 201 });
  } catch (error: any) {
    console.error('[API] ❌ Error creating tree:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
