// src/app/api/expand-territory/route.ts
import { NextResponse } from "next/server";
import { generateVibesWithClaude } from "../../../utils/claude";

export async function POST(req: Request) {
  try {
    const { territory, originalContext, userContext } = await req.json();

    const expansionPrompt = `Given this creative territory for ${originalContext.product}:

Territory: ${territory.territory}
Original Intent: ${originalContext.approach.intent}
Original Vibes: ${originalContext.vibes.join(', ')}

${userContext.focusArea ? `Focus Area: ${userContext.focusArea}` : ''}
${userContext.primaryChannel ? `Primary Channel: ${userContext.primaryChannel}` : ''}
${userContext.targetAudience ? `Target Audience: ${userContext.targetAudience}` : ''}

Provide a detailed expansion of this territory in exactly this JSON format (return ONLY the JSON):

{
  "territory_expansion": {
    "visual_world": {
      "aesthetics": ["Array of key visual elements/principles"],
      "inspiration": ["Reference points/examples"],
      "signature_elements": ["Unique visual identifiers"]
    },
    "narrative_angles": {
      "key_stories": ["Potential narrative threads"],
      "messaging_themes": ["Core messages to explore"],
      "tone_guidance": "How to capture the voice"
    },
    "activation_opportunities": {
      "key_moments": ["Specific campaign moments"],
      "platform_ideas": ["Platform-specific opportunities"],
      "engagement_hooks": ["Ways to drive participation"]
    },
    "evolution_questions": ["Additional questions for further exploration"]
  }
}`;

    const expansion = await generateVibesWithClaude(
      originalContext.product,
      expansionPrompt,
      originalContext.vibes.join(', ')
    );

    return NextResponse.json({ expansion });
  } catch (error) {
    console.error("Error expanding territory:", error);
    return NextResponse.json(
      { error: "Failed to expand territory" },
      { status: 500 }
    );
  }
}