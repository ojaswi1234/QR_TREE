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
    
    // Calculate age from planted_date
    let calculatedAge = 0;
    if (body.planted_date) {
      const plantedDate = new Date(body.planted_date);
      const today = new Date();
      let years = today.getFullYear() - plantedDate.getFullYear();
      const monthDiff = today.getMonth() - plantedDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < plantedDate.getDate())) {
        years--;
      }
      calculatedAge = Math.max(0, years);
    }
    
    // Check for duplicate: Common Name OR Scientific Name (Case Insensitive)
    // We escape special regex characters to prevent invalid regex errors if names contain them
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    const existingDuplicate = await TreeModel.findOne({
      $or: [
        { common_name: { $regex: new RegExp(`^${escapeRegExp(body.common_name.trim())}$`, 'i') } },
        { scientific_name: { $regex: new RegExp(`^${escapeRegExp(body.scientific_name.trim())}$`, 'i') } }
      ]
    });

    if (existingDuplicate) {
       console.log('[API] ⚠️ Duplicate found. ID:', existingDuplicate.tree_id);
       return NextResponse.json(
        { success: false, error: 'Tree with this Common Name or Scientific Name already exists.' },
        { status: 409 }
      );
    }

    // Generate new tree_id by finding the highest existing ID
    const lastTree = await TreeModel.findOne().sort({ tree_id: -1 });
    const newTreeId = lastTree ? lastTree.tree_id + 1 : 1;
    
    console.log('[API] Assigning tree_id:', newTreeId);
    
    // Create new tree with auto-generated ID and calculated age
    const tree = await TreeModel.create({
      ...body,
      tree_id: newTreeId,
      age: calculatedAge,
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
