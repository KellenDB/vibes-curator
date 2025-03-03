// src/utils/claude.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generateVibesWithClaude(product: string, direction: string, vibes: string) {
  try {
    console.log('Sending request to Claude...');
    
    const response = await anthropic.messages.create({
      //model: 'claude-3-opus-20240229',
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      temperature: 0.9,
      messages: [{
        role: 'user',
        content: `You are a strategic thought partner to an experienced heads of marketing and design. Your goal is to help guide creative brainstorming that will eventually lead to campaign directions in a natural, exploratory way. Your role is to help anchor the thinking for your creative team to build upon with their own ideas and direction, while lending your expertise to help give perspective on *how* to approach the brief. Generate high-level thinking and guide towards creative directions matching the following format exactly. Be sure to provide some high-level rationale for any direction youre guiding towards. Return ONLY a valid JSON object with no additional text or formatting.

Input:
Product: ${product}
Direction: ${direction}
Vibes: ${vibes}

Required response format:
{
  "Approach": {
    "vibes": ["vibe1", "vibe2", "vibe3"],
    "intent": "3-4 concise, professional sentences identifying key insights and opportunities. Focus on specific angles rather than generic statements."
  },
  "Brainstorm": {
    "workthrough": "3-4 paragraphs exploring connected creative possibilities. Build insights that link different aspects naturally. How do we take the "vibes" and spin them into a unique take. Include specific ideas while leaving room for interpretation. Use paragraph breaks for flow."
  },
  ]
    "Creative_Territories": [
    {
      "territory": "Name/identifier for this direction",
      "Mood & Tone": "Emotional landscape and feel, could include light directional elements like colors, textures, etc. but not necessarily",
      "Unique_Angles": ["Cultural relevance/connections, timely trends/zeitgeist, and/or differentiators that make this direction special/unique"],
      "Key_Questions": [
        "Multiple thought-provoking questions tied back to the territory, mood/tone, and/or unique angles to explore that will help set this direction apart"
      ]
}

Style and content guidance:
- Approach: This is detailing YOUR approach to brainstorming around the opportunity -- how youre thinking about/approaching the situation, not an actual suggested direction for the specific opportunity. Professional but casual in tone - be direct while maintaining strategic nuance -- no marketing jargon. Highlight specific insights about the product/brand and key things that should help frame our approach to breaking down the problem. Dig deeper below the surface and try to get to the core of how to make the end result stand out from other campaigns.
- Brainstorm: Natural, thoughtful exploration that builds connected ideas. If youre highlighting obvious/surface level things, then youre missing the mark. Start by breaking down the situation and highlighting the core elements before going into any kind of specific direction. Avoid generic contrasts and call out potential common pitfalls -- push for surprising, fresh and high-impact ideas that will result in highly shareble digital moments. Push for fresh angles while maintaining authenticity. Use a conversational tone that meanders through your thinking, just like a real brainstroming session. You're not just providing a direction, youre showing a way to think about the problem and context.
- Refined Concepts: Detailed but leave room for interpretation. Each section should provide some thoughtful description and rationale and then end with a thought-provoking question to help the user take a step further. Provide 2-3 refined concepts.

Example approach 1:
"The goal here is to make jewelry feel personal and genuine. We want it to be timeless, but not in a traditional, overdone way. We're after that understated luxury that doesn't scream for attention, but still stands out in a subtle, elegant way. Think quiet confidence—pieces that people wear to reflect their personality, not to show off. We need to make Jared Jewelry feel approachable, not stuffy or overly formal, while still conveying that it's refined. This isn't about flashy, 'look-at-me' jewelry—it's about creating an aura of sophistication without all the noise. Let's focus on crafting a modern yet timeless image that feels authentic and real to the audience, while still conveying that high-end appeal."

Example approach 2:
"This campaign is about the collision of two unexpected worlds—Bad Bunnys effortlessly cool, genre-defying presence and Dominos Pizza, a staple of everyday indulgence. The opportunity lies in elevating pizza beyond late-night cravings and turning it into a statement of taste and lifestyle. How do we make Dominos feel like a cultural moment rather than just a meal? How do we tap into Bad Bunnys world—his aesthetic, his energy—without losing the accessibility that makes Dominos beloved? The challenge is balancing mass appeal with an aura of exclusivity, making pizza feel fresh, stylish, and undeniably cool."

Example brainstorm  1:
"Avoid anything that feels overly stylized or 'staged.' Instead, focus on real moments, natural beauty, and a sense of being grounded. Consider subtle but striking visuals, like a couple walking down the street, the soft gleam of jewelry catching the light as they move.
Communicate that the jewelry is meant to enhance real moments, rather than be the centerpiece. For a modern yet timeless feel, use clean lines, minimalist design, and neutral tones with pops of richness.
Jewelry should be sleek but with small, unique details—like geometric forms or delicate accents—that give it a contemporary edge while maintaining a classic feel.
Think about light play, silhouettes, and soft-focus shots that suggest luxury without being too 'shiny' or over-the-top.
Art direction should emphasize understated luxury: settings that are elegant but not overly grandiose, such as an intimate art-deco café, a modern living room, or a cozy, softly lit apartment.
Balance high-end appeal with warmth and inclusivity—jewelry should feel special, yet effortlessly wearable for both major events and everyday moments."

Example brainstorm 2:
"Color Palette: Think neon greens, electric purples, and chrome accents for "cozy." Feel free to explore non-traditional cozy colors—what feels disruptive and luxurious while still grounded in Snoop's world? For "comfy," consider bold contrasts, neon pops, or something unexpected that challenges typical streetwear aesthetics.
Mood & Tone: Cozy isnt just about softness—lets aim for a luxe, high-end take on comfort. "Comfy" should bring confidence with ease, but we want to explore the balance between energy and relaxed vibes. How can you make these ideas feel alive without being forced?
Settings: Consider environments where relaxation meets edge. How could an industrial chic vibe or a retro lounge feel infused with Snoops style? For "comfy," try capturing the energy of an urban environment, but think outside the box—where would Snoop feel at ease, but also exude effortless cool?
Textures & Styling: Play with textures that feel elevated—think about fabric choices like velvet or metallics for "cozy," but dont limit yourself to traditional coziness. How can you make the styling feel luxurious without losing Snoops street influence? For "comfy," mix streetwear elements with unexpected layers—what could push the boundaries of comfort?
Snoops Signature: Integrate Snoops personal style subtly—gold chains, oversized sunglasses, or a relaxed hat—but think about how his persona can influence other details. How can Snoops swagger inform the design beyond just the obvious accessories?
Visual Concepts: We gave a couple of starting points, but feel free to challenge the traditional interpretations of "cozy" or "comfy." For "cozy," think about intimate moments with edge, like neon reflections on a cold surface, or for "comfy," explore how we can make a relaxed scene feel unexpectedly dynamic.
Photography Style: Dont be afraid to experiment with lighting techniques that play with neon, shadows, or unconventional setups. How can you use light to elevate the vibe—whether its capturing energy or creating moments of calm?
Innovative Touches: Were looking for something special with these shoes. Play with glow-in-the-dark or elements that make the shoes pop in new ways. How can light, reflections, or textures transform the ordinary into something iconic?"

Remember to return ONLY valid JSON with no additional text or formatting.`
      }],
    });

    console.log('Full Claude response:', JSON.stringify(response, null, 2));
    console.log('Claude response received');

    if (!response.content || response.content.length === 0) {
      throw new Error('Empty response from Claude');
    }

    const contentBlock = response.content[0];
    
    if (!contentBlock || !('text' in contentBlock)) {
      throw new Error('Invalid content block structure');
    }

    const textContent = contentBlock.text;
    
    if (!textContent) {
      throw new Error('Empty text content from Claude');
    }

    try {
      // First try to find a valid JSON object in the text
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : textContent;
      
      // Clean the JSON string: remove control characters and ensure proper escaping
      const cleanJsonString = jsonString
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/\\[rnt]/g, ' ') // Convert escaped whitespace to actual spaces
        .replace(/\n/g, '\\n') // Properly escape newlines
        .replace(/\r/g, '\\r') // Properly escape carriage returns
        .replace(/\t/g, '\\t') // Properly escape tabs
        .replace(/\\/g, '\\\\') // Double escape backslashes
        .replace(/\\\\\"/g, '\\"') // Fix double-escaped quotes
        .replace(/[^\x20-\x7E]/g, '') // Remove non-printable chars
        .replace(/\\\\n/g, '\\n') // Fix over-escaped newlines
        .replace(/\\\\r/g, '\\r') // Fix over-escaped carriage returns
        .replace(/\\\\t/g, '\\t'); // Fix over-escaped tabs
      
      // Try to parse the cleaned JSON
      try {
        return JSON.parse(cleanJsonString);
      } catch (cleanError) {
        console.error('Error parsing cleaned JSON string:', cleanError);
        
        // Try an alternative approach - rebuild the JSON manually
        const manualJsonFix = manuallyFixJson(textContent);
        return manualJsonFix;
      }
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      
      // Try one more fallback approach with basic fixes
      try {
        // Create a safety wrapper for JSON parsing
        const safeJsonParse = (jsonString: string) => {
          try {
            return { result: JSON.parse(jsonString), error: null };
          } catch (error) {
            return { result: null, error };
          }
        };
        
        // Replace "smart" quotes with regular quotes
        const simpleFixed = textContent
          .replace(/[\u2018\u2019]/g, "'")
          .replace(/[\u201C\u201D]/g, '"');
          
        const { result, error } = safeJsonParse(simpleFixed);
        
        if (result) return result;
        
        // If we're still here, we couldn't parse the JSON properly
        throw new Error('Failed to parse AI response - please try again with a simpler request');
      } catch (finalError) {
        console.error('Final error parsing Claude response:', finalError);
        throw new Error('Unable to parse the AI response. Please try again or modify your input.');
      }
    }
  } catch (error) {
    console.error('Error generating vibes with Claude:', error);
    throw error;
  }
}

// Helper function to check if we have enough valid JSON
function manuallyFixJson(text: string) {
  // Instead of trying to build a generic response, we'll throw an error
  // to ensure transparency with the user
  throw new Error('We encountered an issue processing the AI response. Please try again with a simpler description or different wording.');
}

// New function specifically for territory expansion
export async function expandTerritory(territory: any, context: any, prompt: string) {
  try {
    console.log('Expanding territory with Claude...');
    
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      temperature: 0.9,
      messages: [{
        role: 'user',
        content: prompt
      }],
    });

    console.log('Territory expansion response received');

    if (!response.content || response.content.length === 0) {
      throw new Error('Empty response from Claude');
    }

    const contentBlock = response.content[0];
    
    if (!contentBlock || !('text' in contentBlock)) {
      throw new Error('Invalid content block structure');
    }

    const textContent = contentBlock.text;
    
    if (!textContent) {
      throw new Error('Empty text content from Claude');
    }

    try {
      // Same robust parsing as above
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : textContent;
      
      const cleanJsonString = jsonString
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        .replace(/\\[rnt]/g, ' ')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
        .replace(/\\/g, '\\\\')
        .replace(/\\\\\"/g, '\\"')
        .replace(/[^\x20-\x7E]/g, '')
        .replace(/\\\\n/g, '\\n')
        .replace(/\\\\r/g, '\\r')
        .replace(/\\\\t/g, '\\t');
      
      try {
        return JSON.parse(cleanJsonString);
      } catch (cleanError) {
        console.error('Error parsing cleaned expansion JSON:', cleanError);
        
        // Don't use a fallback, be transparent about the error
        throw new Error('We encountered an issue processing the territory expansion. Please try again with a different approach or contact support.');
      }
    } catch (parseError) {
      console.error('Error parsing territory expansion:', parseError);
      throw new Error('We encountered an issue understanding the AI response. Please try again or modify your input.');
    }
  } catch (error) {
    console.error('Error expanding territory with Claude:', error);
    throw error;
  }
}