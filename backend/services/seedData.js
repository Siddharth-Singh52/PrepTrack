import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Question from '../models/Question.js';
import UserProgress from '../models/UserProgress.js';
import Placement from '../models/Placement.js';
import Goal from '../models/Goal.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';

const questionPaths = [
  path.join(process.cwd(), 'backend', 'data', 'questions.json'),
  path.join(process.cwd(), '..', 'backend', 'data', 'questions.json'),
];
const questionPath = questionPaths.find((candidate) => fs.existsSync(candidate));

if (!questionPath) {
  throw new Error('questions.json not found');
}

const questionsSeed = JSON.parse(fs.readFileSync(questionPath, 'utf8'));

export const initializeData = async () => {
  const models = [User, Question, UserProgress, Placement, Goal, ResumeAnalysis];
  const existingCollections = new Set(
    (await mongoose.connection.db.listCollections({}, { nameOnly: true }).toArray()).map(
      (collection) => collection.name
    )
  );

  for (const model of models) {
    if (!existingCollections.has(model.collection.name)) {
      await model.createCollection();
    }
    await model.createIndexes();
  }

  const operations = questionsSeed.map((question) => ({
    updateOne: {
      filter: { title: question.title },
      update: { $setOnInsert: question },
      upsert: true,
    },
  }));

  if (operations.length > 0) {
    const result = await Question.bulkWrite(operations, { ordered: false });
    const seededCount = result.upsertedCount || 0;
    console.log(
      `MongoDB questions ready: ${seededCount} new, ${questionsSeed.length - seededCount} already present`
    );
  }
};