import { GoogleGenAI } from '@google/genai';

let aiClient = null;

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
};

export const analyzeResume = async (resumeText) => {
  const ai = getAIClient();

  if (!ai) {
    throw new Error('GEMINI_API_KEY is required for resume analysis.');
  }

  const prompt = `You are an expert Technical Recruiter and ATS (Applicant Tracking System) Evaluation Engine for Software Engineering candidates.
Analyze the following resume text carefully and provide a rigorous, objective ATS compatibility estimate and actionable feedback.

Resume Text:
"""
${resumeText.slice(0, 8000)}
"""

Return ONLY a JSON object with this exact schema:
{
  "atsScore": number (0 to 100 representing realistic AI-based ATS compatibility estimate),
  "sectionScores": {
    "contact": number (0-100),
    "summary": number (0-100),
    "skills": number (0-100),
    "experience": number (0-100),
    "education": number (0-100),
    "projects": number (0-100)
  },
  "strengths": [string, string, string],
  "weaknesses": [string, string],
  "missingKeywords": [string, string, string, string, string],
  "suggestions": [string, string, string, string]
}
Do not include markdown formatting, backticks, or other text outside the JSON object.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text;
    if (!responseText) throw new Error('Empty response from Gemini API');

    const cleanJson = responseText.trim().replace(/^```json/, '').replace(/```$/, '').trim();
    const parsed = JSON.parse(cleanJson);
    return parsed;
  } catch (error) {
    console.error('Gemini API Resume Analysis Error:', error.message);
    throw error;
  }
};

