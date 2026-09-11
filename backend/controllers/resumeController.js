import ResumeAnalysis from '../models/ResumeAnalysis.js';
import { extractTextFromFile } from '../services/resumeParserService.js';
import { analyzeResume } from '../services/geminiService.js';

export const analyzeResumeFile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF or DOCX resume document.',
      });
    }

    const { originalname, mimetype, buffer } = req.file;

    // Extract text from document
    const extractedText = await extractTextFromFile(buffer, originalname, mimetype);

    if (!extractedText || extractedText.trim().length < 40) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract sufficient text from the document. Please verify the file is not empty or image-only scanned.',
      });
    }

    // Call Gemini ATS analysis
    const analysisResult = await analyzeResume(extractedText);

    // Save analysis record
    const saved = await ResumeAnalysis.create({
      user: userId,
      filename: originalname,
      atsScore: analysisResult.atsScore || 75,
      sectionScores: analysisResult.sectionScores || {},
      strengths: analysisResult.strengths || [],
      weaknesses: analysisResult.weaknesses || [],
      missingKeywords: analysisResult.missingKeywords || [],
      suggestions: analysisResult.suggestions || [],
      extractedText: extractedText.slice(0, 5000),
    });

    res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully.',
      analysis: saved,
    });
  } catch (error) {
    next(error);
  }
};

export const getResumeHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const history = await ResumeAnalysis.find({ user: userId }).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    next(error);
  }
};
