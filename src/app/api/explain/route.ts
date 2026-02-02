import { NextRequest, NextResponse } from 'next/server'
import { generateExplanation, type AIExplainRequest } from '@/lib/ai-provider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const explainRequest: AIExplainRequest = {
      calculatorType: body.calculatorType,
      calculatorName: body.calculatorName,
      inputs: body.inputs,
      result: body.result,
    }

    const response = await generateExplanation(explainRequest)

    return NextResponse.json(response)
  } catch (error) {
    console.error('AI Explanation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    )
  }
}
