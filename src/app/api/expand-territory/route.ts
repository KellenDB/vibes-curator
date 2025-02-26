// src/app/api/expand-territory/route.ts
import { NextResponse } from "next/server";
import { generateVibesWithClaude, expandTerritory } from "../../../utils/claude";

export async function POST(req: Request) {
  try {
    const { territory, originalContext, userContext, isUpdate } = await req.json();

    // Construct a focused prompt for Claude
    const expansionPrompt = `Given this creative territory for ${originalContext.product}:
    Territory: ${territory.territory}
    Essence: ${territory['Mood & Tone']}
    Original Approach: ${originalContext.approach?.intent || ''}
    
    ${userContext.focusArea ? `IMPORTANT Focus Area: ${userContext.focusArea}` : ''}
    ${userContext.primaryChannel ? `IMPORTANT Primary Channel: ${userContext.primaryChannel}` : ''}
    ${userContext.targetAudience ? `IMPORTANT Target Audience: ${userContext.targetAudience}` : ''}
    
    ${isUpdate ? 'This is an UPDATE request with new or refined context. Please revise your previous expansion to better align with the updated context above.' : ''}
    
    Provide a deep dive exploration of this territory that specifically addresses the focus areas, channels, and target audience mentioned above (if provided). Include:
    - Visual World (aesthetics, inspiration, signature elements)
    - Narrative Angles (stories, messaging, tone)
    - Activation Opportunities (moments, platforms, community)
    
    Return as JSON with the following exact structure and no additional text:
    
    {
      "visual_world": {
        "aesthetics": ["Array of 3-5 key visual elements and principles"],
        "inspiration": ["Array of 3-5 reference points or sources of inspiration"],
        "signature_elements": ["Array of 3-5 unique visual identifiers"]
      },
      "narrative_angles": {
        "key_stories": ["Array of 3-5 potential narrative threads to explore"],
        "messaging_themes": ["Array of 3-5 core thematic messages"],
        "tone_guidance": "One paragraph on capturing the right voice and tone"
      },
      "activation_opportunities": {
        "key_moments": ["Array of 3-5 specific campaign moments or touchpoints"],
        "platform_ideas": ["Array of 3-5 platform-specific opportunities"],
        "engagement_hooks": ["Array of 3-5 ways to drive audience participation"]
      },
      "evolution_questions": ["Array of 4-6 thought-provoking questions to further develop this territory"]
    }`;

    // Call Claude API using our dedicated expand territory function
    const expansion = await expandTerritory(
      territory,
      originalContext,
      expansionPrompt
    );

    // Return the response
    return NextResponse.json({ expansion });
  } catch (error) {
    console.error("Error expanding territory:", error);
    return NextResponse.json(
      { error: "Failed to expand territory" },
      { status: 500 }
    );
  }
}