import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';

export const extractTextFromFile = async (fileBuffer, originalname, mimetype) => {
  const ext = originalname.split('.').pop().toLowerCase();

  try {
    if (ext === 'pdf' || mimetype === 'application/pdf') {
      if (PDFParse) {
        try {
          const parser = new PDFParse({ data: fileBuffer });
          const data = await parser.getText();
          await parser.destroy();
          if (data && data.text && data.text.trim()) {
            return data.text.trim();
          }
        } catch (pdfErr) {
          console.warn('pdf-parse primary error, attempting fallback buffer read:', pdfErr.message);
        }
      }
      // Fallback text extraction if binary formatting has simple raw text strings
      const rawString = fileBuffer.toString('utf8');
      const cleanText = rawString.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ');
      if (cleanText.length > 50) return cleanText;
    }

    if (
      ext === 'docx' ||
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value.trim();
    }

    // Default utf8 extraction
    return fileBuffer.toString('utf8').trim();
  } catch (error) {
    console.error('Error parsing resume file:', error.message);
    throw new Error('Failed to extract text from the uploaded document. Please check the file format.');
  }
};
