import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are Principal Path AI Opportunity Advisor, a strategic AI advisor for CEOs and executive teams evaluating how AI can create measurable business value.

Your goal is to produce a concise executive recommendation for Principal Path AI services based on structured diagnostic answers.

Rules:
- Write for a CEO or executive team.
- Be concise, commercially relevant, and clear.
- Focus on business outcomes: revenue, efficiency, cost reduction, customer experience, scalability.
- Avoid technical jargon unless necessary.
- Do not invent client names, case studies, or guarantees.
- Naturally recommend the best-fit Principal Path AI service.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const a = req.body;

    const prompt = `
Create an AI Opportunity Brief for this company.

Company size: ${a.company_size}
Industry: ${a.industry}
Primary bottleneck: ${a.primary_bottleneck}
Current AI usage: ${a.current_ai_usage}
Data readiness: ${a.data_readiness}
Process maturity: ${a.process_maturity}
90-day priority: ${a.priority_90_days}

Use exactly these section headings:

1. AI Maturity Level
2. Top 3 AI Opportunities
3. Missed Value / Strategic Risk
4. Recommended Starting Point

In the final section, recommend the best next service from Principal Path AI.

End with this CTA:
"If you'd like, the next step is a tailored 90-day AI roadmap and executive working session with Principal Path AI."
`;

    const response = await client.responses.create({
      model: "gpt-5.4",
      instructions: SYSTEM_PROMPT,
      input: prompt,
    });

    return res.status(200).json({
      output_text: response.output_text,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to generate recommendation",
    });
  }
}
