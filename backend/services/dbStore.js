import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Question from '../models/Question.js';
import UserProgress from '../models/UserProgress.js';
import Placement from '../models/Placement.js';
import Goal from '../models/Goal.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import { getDBStatus } from '../config/db.js';

let questionsSeed = [];
try {
  const questionPaths = [
    path.join(process.cwd(), 'backend', 'data', 'questions.json'),
    path.join(process.cwd(), '..', 'backend', 'data', 'questions.json'),
  ];
  const questionPath = questionPaths.find((candidate) => fs.existsSync(candidate));
  if (!questionPath) throw new Error('questions.json not found');
  const data = fs.readFileSync(questionPath, 'utf8');
  questionsSeed = JSON.parse(data);
} catch (e) {
  console.error('Failed to load questions.json seed file:', e);
}

const memoryStore = {
  users: [],
  questions: [],
  userProgress: [],
  placements: [],
  goals: [],
  resumeAnalyses: [],
};

export const initializeData = async () => {
  try {
    if (getDBStatus()) {
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
    } else {
      if (memoryStore.questions.length === 0) {
        memoryStore.questions = questionsSeed.map((q, idx) => ({
          _id: `q_${idx + 1}`,
          ...q,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        console.log(`Loaded ${memoryStore.questions.length} questions into local store`);
      }
    }
  } catch (err) {
    console.error('Data initialization error:', err.message);
  }
};

export const DB = {
  async findUserByEmail(email) {
    if (getDBStatus()) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    return memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (getDBStatus()) {
      return await User.findById(id).select('-password -targetCompanies');
    }
    const user = memoryStore.users.find((u) => u._id.toString() === id.toString());
    if (!user) return null;
    const { password, targetCompanies, ...rest } = user;
    return rest;
  },

  async createUser(userData) {
    if (getDBStatus()) {
      return await User.create(userData);
    }
    const newUser = {
      _id: `u_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      ...userData,
      email: userData.email.toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.users.push(newUser);
    return newUser;
  },

  async updateUser(id, updateData) {
    if (getDBStatus()) {
      return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password -targetCompanies');
    }
    const idx = memoryStore.users.findIndex((u) => u._id.toString() === id.toString());
    if (idx === -1) return null;
    memoryStore.users[idx] = {
      ...memoryStore.users[idx],
      ...updateData,
      updatedAt: new Date(),
    };
    const { password, targetCompanies, ...rest } = memoryStore.users[idx];
    return rest;
  },

  async getAllQuestions() {
    if (getDBStatus()) {
      return await Question.find().lean();
    }
    return [...memoryStore.questions];
  },

  async getQuestionById(id) {
    if (getDBStatus()) {
      return await Question.findById(id).lean();
    }
    return memoryStore.questions.find((q) => q._id.toString() === id.toString()) || null;
  },

  async createQuestion(questionData) {
    if (getDBStatus()) {
      return await Question.create(questionData);
    }
    const newQ = {
      _id: `q_${Date.now()}`,
      ...questionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.questions.push(newQ);
    return newQ;
  },

  async updateQuestion(id, updateData) {
    if (getDBStatus()) {
      return await Question.findByIdAndUpdate(id, updateData, { new: true });
    }
    const idx = memoryStore.questions.findIndex((q) => q._id.toString() === id.toString());
    if (idx === -1) return null;
    memoryStore.questions[idx] = { ...memoryStore.questions[idx], ...updateData, updatedAt: new Date() };
    return memoryStore.questions[idx];
  },

  async deleteQuestion(id) {
    if (getDBStatus()) {
      return await Question.findByIdAndDelete(id);
    }
    const idx = memoryStore.questions.findIndex((q) => q._id.toString() === id.toString());
    if (idx !== -1) {
      memoryStore.questions.splice(idx, 1);
      return true;
    }
    return false;
  },

  async getUserProgress(userId) {
    if (getDBStatus()) {
      return await UserProgress.find({ user: userId }).populate('question').lean();
    }
    return memoryStore.userProgress
      .filter((p) => p.user.toString() === userId.toString())
      .map((p) => {
        const q = memoryStore.questions.find((item) => item._id.toString() === p.question.toString());
        return {
          ...p,
          question: q || p.question,
        };
      });
  },

  async getProgressByQuestion(userId, questionId) {
    if (getDBStatus()) {
      return await UserProgress.findOne({ user: userId, question: questionId });
    }
    return (
      memoryStore.userProgress.find(
        (p) => p.user.toString() === userId.toString() && p.question.toString() === questionId.toString()
      ) || null
    );
  },

  async upsertUserProgress(userId, questionId, updateData) {
    if (getDBStatus()) {
      return await UserProgress.findOneAndUpdate(
        { user: userId, question: questionId },
        { $set: updateData },
        { new: true, upsert: true }
      ).populate('question');
    }
    let record = memoryStore.userProgress.find(
      (p) => p.user.toString() === userId.toString() && p.question.toString() === questionId.toString()
    );
    if (!record) {
      record = {
        _id: `prog_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        user: userId,
        question: questionId,
        status: 'Not Started',
        favorite: false,
        notes: '',
        revisionStage: 0,
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.userProgress.push(record);
    } else {
      Object.assign(record, updateData, { updatedAt: new Date() });
    }
    const q = memoryStore.questions.find((item) => item._id.toString() === questionId.toString());
    return { ...record, question: q || questionId };
  },

  async getPlacements(userId) {
    if (getDBStatus()) {
      return await Placement.find({ user: userId }).sort({ createdAt: -1 }).lean();
    }
    return memoryStore.placements
      .filter((p) => p.user.toString() === userId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async createPlacement(userId, placementData) {
    if (getDBStatus()) {
      return await Placement.create({ ...placementData, user: userId });
    }
    const newPlacement = {
      _id: `place_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      user: userId,
      ...placementData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.placements.push(newPlacement);
    return newPlacement;
  },

  async updatePlacement(userId, placementId, updateData) {
    if (getDBStatus()) {
      return await Placement.findOneAndUpdate(
        { _id: placementId, user: userId },
        { $set: updateData },
        { new: true }
      );
    }
    const idx = memoryStore.placements.findIndex(
      (p) => p._id.toString() === placementId.toString() && p.user.toString() === userId.toString()
    );
    if (idx === -1) return null;
    memoryStore.placements[idx] = { ...memoryStore.placements[idx], ...updateData, updatedAt: new Date() };
    return memoryStore.placements[idx];
  },

  async deletePlacement(userId, placementId) {
    if (getDBStatus()) {
      return await Placement.findOneAndDelete({ _id: placementId, user: userId });
    }
    const idx = memoryStore.placements.findIndex(
      (p) => p._id.toString() === placementId.toString() && p.user.toString() === userId.toString()
    );
    if (idx !== -1) {
      memoryStore.placements.splice(idx, 1);
      return true;
    }
    return false;
  },

  async getGoals(userId) {
    if (getDBStatus()) {
      return await Goal.find({ user: userId }).sort({ createdAt: -1 }).lean();
    }
    return memoryStore.goals
      .filter((g) => g.user.toString() === userId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async createGoal(userId, goalData) {
    if (getDBStatus()) {
      return await Goal.create({ ...goalData, user: userId });
    }
    const newGoal = {
      _id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      user: userId,
      ...goalData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.goals.push(newGoal);
    return newGoal;
  },

  async updateGoal(userId, goalId, updateData) {
    if (getDBStatus()) {
      return await Goal.findOneAndUpdate(
        { _id: goalId, user: userId },
        { $set: updateData },
        { new: true }
      );
    }
    const idx = memoryStore.goals.findIndex(
      (g) => g._id.toString() === goalId.toString() && g.user.toString() === userId.toString()
    );
    if (idx === -1) return null;
    memoryStore.goals[idx] = { ...memoryStore.goals[idx], ...updateData, updatedAt: new Date() };
    return memoryStore.goals[idx];
  },

  async deleteGoal(userId, goalId) {
    if (getDBStatus()) {
      return await Goal.findOneAndDelete({ _id: goalId, user: userId });
    }
    const idx = memoryStore.goals.findIndex(
      (g) => g._id.toString() === goalId.toString() && g.user.toString() === userId.toString()
    );
    if (idx !== -1) {
      memoryStore.goals.splice(idx, 1);
      return true;
    }
    return false;
  },

  async getResumeAnalyses(userId) {
    if (getDBStatus()) {
      return await ResumeAnalysis.find({ user: userId }).sort({ createdAt: -1 }).lean();
    }
    return memoryStore.resumeAnalyses
      .filter((r) => r.user.toString() === userId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async createResumeAnalysis(userId, analysisData) {
    if (getDBStatus()) {
      return await ResumeAnalysis.create({ ...analysisData, user: userId });
    }
    const newAnalysis = {
      _id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      user: userId,
      ...analysisData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.resumeAnalyses.push(newAnalysis);
    return newAnalysis;
  },
};
