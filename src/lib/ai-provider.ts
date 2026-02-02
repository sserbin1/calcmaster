/**
 * AI Provider for CalcMaster
 *
 * Uses the Design API tunnel (Cloudflare Tunnel to local Claude CLI)
 * Same infrastructure as SilentBox PBN but for calculator explanations
 */

// AI API configuration (reuses PBN Design API infrastructure)
const AI_API_URL = process.env.AI_API_URL || "https://api.monetiseclub.com";
const AI_API_KEY = process.env.AI_API_KEY || "";

export interface AIExplainRequest {
  calculatorType: string;
  calculatorName: string;
  inputs: Record<string, unknown>;
  result: {
    primary: { value: string | number; label?: string; unit?: string };
    secondary?: Array<{ label: string; value: string | number; unit?: string }>;
    advice?: string;
  };
}

export interface AIExplainResponse {
  explanation: string;
  source: "ai" | "fallback";
}

/**
 * Generate explanation using AI API (Claude via tunnel)
 */
export async function generateExplanation(
  request: AIExplainRequest
): Promise<AIExplainResponse> {
  // If no API key, use fallback
  if (!AI_API_KEY) {
    return {
      explanation: generateFallbackExplanation(request),
      source: "fallback",
    };
  }

  try {
    const prompt = buildPrompt(request);

    // Call AI API
    const response = await fetch(`${AI_API_URL}/explain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        maxTokens: 500,
        type: "calculator-explanation",
      }),
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`AI API returned ${response.status}`);
    }

    const data = await response.json();

    return {
      explanation: data.text || data.explanation || data.content,
      source: "ai",
    };
  } catch (error) {
    console.error("[AI Provider] Error:", error);
    return {
      explanation: generateFallbackExplanation(request),
      source: "fallback",
    };
  }
}

/**
 * Build prompt for explanation
 */
function buildPrompt(request: AIExplainRequest): string {
  return `You are a helpful calculator assistant. Explain the following calculation result in a friendly, educational way.

Calculator: ${request.calculatorName}
Type: ${request.calculatorType}

User Inputs:
${JSON.stringify(request.inputs, null, 2)}

Calculated Result:
Primary: ${request.result.primary.value} ${request.result.primary.unit || ""} (${request.result.primary.label || ""})
${request.result.secondary ? `Secondary: ${JSON.stringify(request.result.secondary)}` : ""}
${request.result.advice ? `Advice: ${request.result.advice}` : ""}

Please provide:
1. A brief explanation of what the result means (2-3 sentences)
2. One practical tip or insight based on this result
3. One thing to keep in mind or consider

Keep the response concise (under 150 words), friendly, and actionable. Use simple language.`;
}

/**
 * Generate fallback explanation when AI is unavailable
 */
function generateFallbackExplanation(request: AIExplainRequest): string {
  const { calculatorType, calculatorName, result } = request;
  const primaryValue = result.primary.value;
  const advice = result.advice;

  const explanations: Record<string, string> = {
    bmi: `Your BMI of ${primaryValue} is calculated using your height and weight. ${advice || "BMI is a general indicator of body composition, but it doesn't account for muscle mass or body fat distribution."}`,
    calories: `Based on your profile, your daily calorie target is ${primaryValue} calories. ${advice || "Remember that individual needs vary based on metabolism, activity level, and health goals."}`,
    tdee: `Your Total Daily Energy Expenditure (TDEE) is ${primaryValue} calories. This represents the total number of calories your body burns in a day. ${advice || "TDEE includes your basal metabolic rate plus calories burned through activity."}`,
    mortgage: `Your estimated monthly mortgage payment is ${primaryValue}. This includes principal and interest. ${advice || "Consider adding property taxes and insurance to get your full monthly housing cost."}`,
    loan: `Your loan payment would be ${primaryValue} per period. ${advice || "Paying extra towards principal can significantly reduce total interest paid."}`,
    "compound-interest": `Your investment will grow to ${primaryValue}. The power of compound interest means your money earns returns on both the principal and accumulated interest. ${advice || "Start early to maximize the benefits of compounding."}`,
    tip: `The suggested tip amount is ${primaryValue}. ${advice || "Tipping customs vary by location and service type."}`,
    age: `The calculated age is ${primaryValue}. ${advice || "This is based on the dates you provided."}`,
    percent: `The result is ${primaryValue}. ${advice || "Percentages are useful for comparing proportions across different scales."}`,
    "body-fat": `Your estimated body fat percentage is ${primaryValue}%. ${advice || "Body fat percentage is a better indicator of fitness than weight alone."}`,
    "ideal-weight": `Your ideal weight range is ${primaryValue}. ${advice || "Ideal weight varies based on body composition, muscle mass, and individual factors."}`,
    "due-date": `Your estimated due date is ${primaryValue}. ${advice || "Due dates are estimates - only about 5% of babies are born on their exact due date."}`,
    "ovulation": `Your estimated ovulation date is ${primaryValue}. ${advice || "Ovulation timing can vary. Consider tracking multiple cycles for accuracy."}`,
    sqft: `The calculated area is ${primaryValue}. ${advice || "Square footage is essential for material estimation and space planning."}`,
    paint: `You'll need approximately ${primaryValue} of paint. ${advice || "Consider buying slightly more to account for touch-ups and waste."}`,
    "random-number": `Your random number is ${primaryValue}. ${advice || "This number was generated using a cryptographically secure method."}`,
    dice: `You rolled ${primaryValue}. ${advice || "Each roll is independent and has equal probability."}`,
    "love": `Your compatibility score is ${primaryValue}%. ${advice || "Remember, this is just for fun! Real compatibility depends on communication, shared values, and effort."}`,
    gpa: `Your calculated GPA is ${primaryValue}. ${advice || "GPA is one measure of academic performance, but doesn't capture all aspects of learning."}`,
    grade: `Your grade is ${primaryValue}. ${advice || "Review any incorrect answers to improve your understanding."}`,
  };

  return (
    explanations[calculatorType] ||
    `Your ${calculatorName} result is ${primaryValue}. ${advice || "This calculation is based on the values you entered."}`
  );
}

/**
 * Check if AI API is available
 */
export async function isAIAvailable(): Promise<boolean> {
  if (!AI_API_KEY) return false;

  try {
    const response = await fetch(`${AI_API_URL}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    const data = await response.json();
    return data.status === "ok";
  } catch {
    return false;
  }
}
