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
        maxTokens: 1000,
        type: "calculator-explanation",
      }),
      signal: AbortSignal.timeout(30000),
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
  return `You are a knowledgeable health/finance/math expert providing insightful analysis of calculator results. Write in a warm, professional tone.

Calculator: ${request.calculatorName}
Type: ${request.calculatorType}

User Inputs:
${JSON.stringify(request.inputs, null, 2)}

Calculated Result:
Primary: ${request.result.primary.value} ${request.result.primary.unit || ""} (${request.result.primary.label || ""})
${request.result.secondary ? `Additional Results: ${JSON.stringify(request.result.secondary)}` : ""}
${request.result.advice ? `System Advice: ${request.result.advice}` : ""}

Write a comprehensive explanation (250-350 words) with the following structure:

**What This Means**
Explain the result in plain language. Put it in context — what range is it in? Is it good/bad/normal? Compare to population averages if relevant.

**Key Insights**
2-3 specific, actionable insights based on this exact result. Be specific to the numbers, not generic advice.

**What You Can Do**
1-2 practical next steps or recommendations tailored to this result.

**Keep In Mind**
One important caveat or limitation about this calculation method.

Use clear paragraphs. Be specific to the actual numbers provided. Avoid generic filler text.`;
}

/**
 * Generate rich fallback explanation when AI is unavailable
 */
function generateFallbackExplanation(request: AIExplainRequest): string {
  const { calculatorType, result, inputs } = request;
  const val = result.primary.value;
  const advice = result.advice;

  // Helper to format numbers
  const fmt = (n: unknown) => {
    const num = typeof n === "string" ? parseFloat(n) : (n as number);
    if (isNaN(num)) return String(n);
    return num.toLocaleString("en-US", { maximumFractionDigits: 1 });
  };

  const explanations: Record<string, () => string> = {
    bmi: () => {
      const bmi = typeof val === "string" ? parseFloat(val) : (val as number);
      let category = "normal weight";
      let detail = "";
      if (bmi < 18.5) {
        category = "underweight";
        detail = "This is below the healthy range. Being underweight can be associated with nutritional deficiencies, weakened immune function, and bone density issues. Consider consulting with a healthcare provider about reaching a healthier weight through balanced nutrition.";
      } else if (bmi < 25) {
        category = "normal weight";
        detail = "This falls within the healthy range (18.5-24.9). Maintaining this range is associated with lower risks of heart disease, type 2 diabetes, and certain cancers. Continue with balanced eating and regular physical activity to stay in this range.";
      } else if (bmi < 30) {
        category = "overweight";
        detail = "This is above the healthy range (25-29.9). Even modest weight loss of 5-10% of body weight can significantly improve blood pressure, cholesterol levels, and blood sugar control. Focus on sustainable lifestyle changes rather than rapid dieting.";
      } else {
        category = "obese";
        detail = "This falls in the obese range (30+). This level is associated with increased health risks. Working with a healthcare provider can help create a personalized plan. Small, consistent changes in diet and activity levels can lead to meaningful improvements over time.";
      }
      return `**What This Means**\nYour BMI of ${fmt(bmi)} places you in the "${category}" category according to the World Health Organization classification.\n\n${detail}\n\n**Key Insights**\nBMI is a screening tool, not a diagnostic one. It doesn't distinguish between muscle and fat mass — athletes may have a high BMI while being very fit. Factors like age, sex, ethnicity, and body composition all affect what's "healthy" for you individually.${advice ? `\n\n**Recommendation**\n${advice}` : ""}\n\n**Keep In Mind**\nBMI was developed using primarily European population data and may not be equally accurate across all ethnicities. Waist circumference and body fat percentage can provide additional insight into health risks.`;
    },

    calories: () => {
      return `**What This Means**\nYour estimated daily calorie need is ${fmt(val)} calories. This is the total energy your body requires to maintain your current weight given your activity level and body composition.\n\n**Key Insights**\nTo lose weight, aim for a deficit of 300-500 calories below this number — that translates to about 0.5-1 lb (0.25-0.5 kg) of weight loss per week, which is a healthy and sustainable rate. To gain weight, add 250-500 calories above this target.\n\nProtein intake matters as much as total calories. Aim for 0.7-1g of protein per pound of body weight to support muscle maintenance and satiety.\n\n**What You Can Do**\nTrack your food intake for a week using an app to see how your current eating compares to this target. Focus on nutrient-dense foods — vegetables, lean proteins, whole grains, and healthy fats — rather than just counting numbers.${advice ? `\n\n${advice}` : ""}\n\n**Keep In Mind**\nCalorie calculators provide estimates based on population averages. Your actual needs can vary by 10-15% based on genetics, metabolic adaptation, gut microbiome, sleep quality, and stress levels. Adjust based on real-world results over 2-3 weeks.`;
    },

    tdee: () => {
      return `**What This Means**\nYour Total Daily Energy Expenditure (TDEE) is ${fmt(val)} calories per day. This represents the total energy your body burns through all activities — from breathing and digestion to exercise and daily movement.\n\n**Key Insights**\nTDEE breaks down into several components: your Basal Metabolic Rate (BMR) accounts for about 60-70% of this total, the thermic effect of food uses about 10%, and physical activity accounts for the remaining 20-30%.\n\nIncreasing your non-exercise activity (walking, standing, fidgeting) — known as NEAT — can significantly impact your TDEE. Some studies show NEAT can vary by up to 2,000 calories between individuals.\n\n**What You Can Do**\nUse this number as your maintenance baseline. For fat loss, create a moderate deficit of 15-20% below your TDEE. For muscle building, add 10-15% above your TDEE combined with resistance training.\n\n**Keep In Mind**\nTDEE naturally fluctuates day-to-day and decreases with prolonged dieting due to metabolic adaptation. Periodic diet breaks (eating at maintenance for 1-2 weeks) can help counteract this adaptation.`;
    },

    mortgage: () => {
      return `**What This Means**\nYour estimated monthly mortgage payment is ${fmt(val)}. This represents the principal and interest portion of your monthly housing cost.\n\n**Key Insights**\nThe first years of your mortgage, most of your payment goes toward interest rather than building equity. On a 30-year mortgage, you may pay nearly as much in interest as the original loan amount. Even small additional principal payments early on can save tens of thousands over the life of the loan.\n\nFinancial advisors typically recommend that your total housing costs (mortgage + taxes + insurance) stay below 28% of your gross monthly income.\n\n**What You Can Do**\nConsider making one extra payment per year — this can shave 4-5 years off a 30-year mortgage. Also compare 15-year vs 30-year terms; the monthly payment is higher but total interest paid is dramatically lower.${advice ? `\n\n${advice}` : ""}\n\n**Keep In Mind**\nThis calculation shows principal and interest only. Your actual monthly payment will also include property taxes, homeowner's insurance, and possibly PMI (if your down payment is less than 20%).`;
    },

    loan: () => {
      return `**What This Means**\nYour loan payment will be ${fmt(val)} per payment period. This covers both the principal (the amount borrowed) and the interest (the cost of borrowing).\n\n**Key Insights**\nLoan amortization means your early payments are mostly interest. As the loan matures, a larger portion of each payment goes toward principal. Understanding this front-loaded interest structure can help you make smarter decisions about extra payments.\n\nThe total cost of the loan (all payments combined) versus the original amount borrowed reveals the true cost of borrowing. Even a 1% difference in interest rate can mean thousands of dollars over the loan term.\n\n**What You Can Do**\nIf possible, make extra payments toward the principal — even small amounts accelerate payoff significantly. Also check if your loan has a prepayment penalty before doing so.${advice ? `\n\n${advice}` : ""}\n\n**Keep In Mind**\nThis calculation assumes fixed-rate terms. Variable-rate loans will have fluctuating payments. Always read the fine print and understand the APR (which includes fees) versus the stated interest rate.`;
    },

    "compound-interest": () => {
      return `**What This Means**\nYour investment is projected to grow to ${fmt(val)}. The magic of compound interest means your money earns returns not just on your initial investment, but also on all previously accumulated interest.\n\n**Key Insights**\nAlbert Einstein reportedly called compound interest "the eighth wonder of the world." The key factors are: time (the longer you invest, the more powerful compounding becomes), rate of return, and consistency of contributions. Even a 1% higher annual return can mean dramatically different outcomes over decades.\n\nThe "Rule of 72" is a quick way to estimate doubling time: divide 72 by your annual return rate. At 7% returns, your money roughly doubles every ~10 years.\n\n**What You Can Do**\nStart as early as possible — time is the most powerful factor in compound growth. Automate your contributions so you invest consistently regardless of market conditions. Consider low-cost index funds to maximize returns after fees.${advice ? `\n\n${advice}` : ""}\n\n**Keep In Mind**\nThis projection assumes a constant rate of return. Real-world investments fluctuate — some years you'll earn more, some less. Inflation also reduces the purchasing power of future dollars. Consider using a "real return" (return minus inflation) for more realistic planning.`;
    },

    percent: () => {
      return `**What This Means**\nThe result is ${fmt(val)}. Percentages express a number as a fraction of 100, making it easy to compare proportions across different scales and contexts.\n\n**Key Insights**\nPercentages are everywhere in daily life — from sales discounts and tax rates to statistics and probability. Understanding percentage calculations helps with financial decisions, data interpretation, and academic work.\n\nA common pitfall: percentage increases and decreases aren't symmetrical. If something increases by 50% and then decreases by 50%, you don't end up where you started — you end up 25% lower.\n\n**What You Can Do**\nWhen comparing deals or offers, always convert to the same base for fair comparison. "Save 20% on $50" ($10 off) vs "Save $15" — the absolute number tells the real story.${advice ? `\n\n${advice}` : ""}\n\n**Keep In Mind**\nPercentage calculations are straightforward but context matters enormously. A 2% return means very different things in savings accounts versus stock investments, and percentages can be misleading with small sample sizes.`;
    },

    age: () => {
      return `**What This Means**\nThe calculated age is ${val}. This represents the time elapsed based on the dates you provided.\n\n**Key Insights**\nAge calculation across calendars and time zones can be surprisingly complex. Different cultures calculate age differently — in Korean tradition, everyone is 1 year old at birth and gains a year on New Year's Day rather than their birthday.\n\nFor legal purposes, the exact time of birth can matter — someone born at 11:59 PM on one date versus 12:01 AM the next day has different legal ages on certain dates.\n\n**Practical Applications**\nAge calculations are essential for legal eligibility (voting, driving, drinking age), retirement planning, insurance premiums, medical milestones, and more. Exact day-level precision matters for many official purposes.${advice ? `\n\n${advice}` : ""}\n\n**Keep In Mind**\nAge calculated here uses standard Gregorian calendar rules. Leap years add an extra day every 4 years (with exceptions), which is accounted for in the calculation.`;
    },

    "body-fat": () => {
      const bf = typeof val === "string" ? parseFloat(val) : (val as number);
      let assessment = "";
      if (inputs.gender === "male" || inputs.sex === "male") {
        if (bf < 6) assessment = "This is at the essential fat level. Extremely low body fat can compromise hormone production and immune function.";
        else if (bf < 14) assessment = "This is in the athletic range. This level is typical of competitive athletes and requires dedicated training and nutrition.";
        else if (bf < 18) assessment = "This is in the fitness range — healthy and active. Most fit, active men fall in this range.";
        else if (bf < 25) assessment = "This is in the average range for men. Generally healthy, though there may be room for improvement through regular exercise.";
        else assessment = "This is above the average range. Reducing body fat through a combination of resistance training and nutrition adjustments can improve health markers.";
      } else {
        if (bf < 14) assessment = "This is at the essential fat level. Women need higher essential fat than men for hormonal health and reproductive function.";
        else if (bf < 21) assessment = "This is in the athletic range. Typical for female competitive athletes and very active individuals.";
        else if (bf < 25) assessment = "This is in the fitness range — healthy and active. An excellent range for overall health and wellbeing.";
        else if (bf < 32) assessment = "This is in the average range for women. Generally healthy, with room for improvement through regular exercise.";
        else assessment = "This is above the average range. Gradual changes in nutrition and activity can help bring this to a healthier level over time.";
      }
      return `**What This Means**\nYour estimated body fat percentage is ${fmt(bf)}%. ${assessment}\n\n**Key Insights**\nBody fat percentage is a much better indicator of health and fitness than weight or BMI alone. Two people at the same weight can have vastly different body fat levels depending on muscle mass. Essential body fat is necessary for normal physiological function — it insulates organs, stores energy, and regulates hormones.\n\n**What You Can Do**\nResistance training (weight lifting) is the most effective way to improve body composition — it builds muscle while reducing fat. Combined with adequate protein intake (0.7-1g per pound of body weight) and a slight caloric deficit, you can recompose your body without extreme dieting.${advice ? `\n\n${advice}` : ""}\n\n**Keep In Mind**\nEstimation methods (calipers, formulas, bio-impedance) each have margins of error of 3-5%. For the most accurate measurement, DEXA scans or hydrostatic weighing are the gold standard. Track trends over time rather than fixating on a single reading.`;
    },

    "ideal-weight": () => {
      return `**What This Means**\nYour ideal weight range is ${val}. This is calculated based on established medical formulas that consider your height, age, and biological factors.\n\n**Key Insights**\nThere is no single "ideal weight" — it's a range. Multiple formulas exist (Devine, Robinson, Miller, Hamwi), and they each give slightly different results because they were derived from different population studies. The range between these formulas is often 5-15 lbs.\n\nBody composition matters more than the number on the scale. A muscular person may weigh more than their "ideal weight" while being in excellent health.\n\n**What You Can Do**\nFocus on how you feel, your energy levels, and health markers (blood pressure, cholesterol, blood sugar) rather than hitting an exact number. Sustainable habits — regular movement, balanced nutrition, adequate sleep — matter more than a target weight.${advice ? `\n\n${advice}` : ""}\n\n**Keep In Mind**\nIdeal weight formulas were developed from population data and represent statistical averages. Individual factors like bone density, muscle mass, ethnicity, and body frame size all influence what's truly ideal for you. Consult a healthcare provider for personalized guidance.`;
    },
  };

  const generator = explanations[calculatorType];
  if (generator) return generator();

  // Generic but detailed fallback
  const secondaryInfo = result.secondary && result.secondary.length > 0
    ? `\n\nAdditional results: ${result.secondary.map(s => `${s.label}: ${s.value}${s.unit ? " " + s.unit : ""}`).join(", ")}.`
    : "";

  return `**What This Means**\nYour ${request.calculatorName} result is ${fmt(val)}${result.primary.unit ? " " + result.primary.unit : ""}. This value is calculated using established formulas and the inputs you provided.${secondaryInfo}\n\n**Key Insights**\nThis calculation provides a useful reference point, but remember that calculators work with mathematical models — they give precise answers based on your inputs, but real-world outcomes can vary based on factors not captured in the formula.\n\n**What You Can Do**\nUse this result as a starting point for further research or decision-making. If this calculation is important for health, financial, or legal decisions, consider consulting with a professional who can account for your individual circumstances.${advice ? `\n\n**Recommendation**\n${advice}` : ""}\n\n**Keep In Mind**\nAll calculator results are estimates based on the formulas and inputs used. Small changes in inputs can sometimes lead to significantly different results, so try adjusting values to understand the sensitivity of the calculation.`;
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
