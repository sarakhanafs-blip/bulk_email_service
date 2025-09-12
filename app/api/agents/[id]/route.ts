import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT - update agent
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updatedAgent = await prisma.agent.update({
      where: { id: Number(params.id) },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
      },
    });
    return NextResponse.json(updatedAgent);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 });
  }
}

// DELETE - remove agent
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.agent.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: "Agent deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 });
  }
}
