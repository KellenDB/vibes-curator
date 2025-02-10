// src/app/api/generate-vibes/route.ts

import { NextResponse } from "next/server";
import { generateVibesWithOpenAI } from "../../../utils/openai"; // We'll define this next
import { generateVibesWithClaude } from "../../../utils/claude"; // We'll define this next

// Placeholder logic to handle the API request
export async function POST(req: Request) {
  const { product, direction, vibes, targetAudience, aiProvider = "claude" } = await req.json(); // Default to OpenAI

  let generatedVibes = "";

  try {
    // Handle interaction with OpenAI or Claude
    if (aiProvider === "openai") {
      generatedVibes = await generateVibesWithOpenAI(product, direction, vibes);
    } else if (aiProvider === "claude") {
      generatedVibes = await generateVibesWithClaude(product, direction, vibes);
    } else {
      throw new Error("Invalid AI provider");
    }

    return NextResponse.json({ generatedVibes });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
