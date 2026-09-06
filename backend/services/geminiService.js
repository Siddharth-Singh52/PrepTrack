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

// Fallback deterministic analyzer when Gemini key is not configured or network fails
const generateFallbackResumeAnalysis = (text) => {
  const lower = text.toLowerCase();
  const skillsFound = [];
  const commonTech = [
    'javascript', 'typescript', 'react', 'node.js', 'python', 'java', 'c++', 'sql',
    'mongodb', 'docker', 'aws', 'git', 'html', 'css', 'express', 'rest api', 'dsa'
  ];

  commonTech.forEach((tech) => {
    if (lower.includes(tech)) skillsFound.push(tech.toUpperCase());
  });

  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  const hasGithub = lower.includes('github');
  const hasLinkedin = lower.includes('linkedin');
  const hasProjects = lower.includes('project') || lower.includes('built');
  const hasExperience = lower.includes('experience') || lower.includes('intern') || lower.includes('engineer');
  const hasEducation = lower.includes('bachelor') || lower.includes('degree') || lower.includes('university') || lower.includes('college');

  let contactScore = (hasEmail ? 40 : 0) + (hasPhone ? 30 : 0) + (hasGithub || hasLinkedin ? 30 : 0);
  let summaryScore = lower.includes('summary') || lower.includes('objective') ? 85 : 65;
  let skillsScore = Math.min(100, Math.max(50, skillsFound.length * 12));
  let experienceScore = hasExperience ? 80 : 55;
  let educationScore = hasEducation ? 90 : 60;
  let projectsScore = hasProjects ? 85 : 60;

  const atsScore = Math.round(
    contactScore * 0.15 +
    summaryScore * 0.1 +
    skillsScore * 0.25 +
    experienceScore * 0.25 +
    educationScore * 0.1 +
    projectsScore * 0.15
  );

  return {
    atsScore: Math.min(95, Math.max(40, atsScore)),
    sectionScores: {
      contact: contactScore,
      summary: summaryScore,
      skills: skillsScore,
      experience: experienceScore,
      education: educationScore,
      projects: projectsScore,
    },
    strengths: [
      hasProjects ? 'Clear project descriptions with technical scope' : 'Well-defined technical background',
      skillsFound.length > 3 ? `Identified key core technologies: ${skillsFound.slice(0, 5).join(', ')}` : 'Readable font formatting and structure',
      hasEmail && hasPhone ? 'Complete direct contact channels (email & phone)' : 'Clean structural outline',
    ],
    weaknesses: [
      skillsFound.length < 6 ? 'Limited breadth of modern distributed systems/cloud keywords' : 'Quantifiable metric impact could be emphasized further',
      !lower.includes('%') && !lower.includes('reduced') ? 'Action verbs lack measurable numerical performance outcomes (e.g. improved latency by X%)' : 'Ensure consistent date formatting across sections',
    ],
    missingKeywords: ['Docker', 'CI/CD Pipelines', 'System Design', 'Unit Testing (Jest/Mocha)', 'Cloud Architecture (AWS/GCP)', 'Microservices'].filter(
      (k) => !lower.includes(k.toLowerCase())
    ),
    suggestions: [
      'Utilize the Google XYZ resume formula: Accomplished [X] as measured by [Y], by doing [Z].',
      'Integrate specific version control and automated deployment workflows into project bullet points.',
      'Ensure standard section headers (Experience, Skills, Education, Projects) for optimal ATS parsing accuracy.',
      'Highlight algorithmic problem solving and DSA benchmarks if applying for top product companies.',
    ],
  };
};

export const analyzeResume = async (resumeText) => {
  const ai = getAIClient();

  if (!ai) {
    console.log('Gemini API key not found. Using intelligent built-in resume ATS analyzer engine.');
    return generateFallbackResumeAnalysis(resumeText);
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
    return generateFallbackResumeAnalysis(resumeText);
  }
};

