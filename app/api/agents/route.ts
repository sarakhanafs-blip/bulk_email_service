// app/api/agents/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all agents
export async function GET() {
  try {
    const agents = await prisma.agent.findMany();
    return NextResponse.json(agents || []);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
  }
}

// POST create a new agent
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // ✅ Debug log
    console.log("Received agent:", data);

    const agent = await prisma.agent.create({
      data: {
        name: data.name,
        email: data.email,
        phone: String(data.phone),
        company: data.company,
        address: data.address,
        city: data.city,
        country: data.country,
      },
    });

    return NextResponse.json(agent);
  } catch (error) {
    console.error("Error inserting agent:", error);
    return NextResponse.json({ error: "Failed to add agent" }, { status: 500 });
  }
}