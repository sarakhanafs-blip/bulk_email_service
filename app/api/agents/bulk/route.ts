import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const agents = await req.json();
    console.log("Received agents for bulk insert:", agents.length);

    const created = await prisma.agent.createMany({
      data: agents.map((a: any) => ({
        name: a.name,
        email: a.email,
        phone: a.phone,
        company: a.company,
        address: a.address,
        city: a.city,
        country: a.country,
        specialties: a.specialties || [],
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ success: true, count: created.count });
  } catch (error) {
    console.error("Bulk import error:", error);
    return NextResponse.json(
      { error: "Failed to import agents" },
      { status: 500 }
    );
  }
}
