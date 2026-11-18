import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import User from "@/models/userModel";
import { getUserFromRequest } from "@/controllers/authController";

// PUT - Save avatar config (matches AvatarConfig type from AvatarCustomiser.tsx)
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const userId = await getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { gender, skin, hairStyle, hairColor, eyeColor, outfit, outfitColor, accessory, expression } = body;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Only update fields that were provided
    const update: Record<string, any> = {};
    if (gender     !== undefined) update.gender      = gender;
    if (skin       !== undefined) update.skin        = skin;
    if (hairStyle  !== undefined) update.hairStyle   = hairStyle;
    if (hairColor  !== undefined) update.hairColor   = hairColor;
    if (eyeColor   !== undefined) update.eyeColor    = eyeColor;
    if (outfit     !== undefined) update.outfit      = outfit;
    if (outfitColor!== undefined) update.outfitColor = outfitColor;
    if (accessory  !== undefined) update.accessory   = accessory;
    if (expression !== undefined) update.expression  = expression;

    user.avatar = { ...user.avatar?.toObject?.() ?? user.avatar, ...update };
    await user.save();

    return NextResponse.json({ success: true, message: "Avatar updated", avatar: user.avatar }, { status: 200 });
  } catch (error: any) {
    console.error("Update avatar error:", error);
    return NextResponse.json({ success: false, message: "Failed to update avatar" }, { status: 500 });
  }
}
