const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Question = require("./models/question");
const UserProgress = require("./models/userProgress");

const runCleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const validQuestionIds = (await Question.find({}, { _id: 1 })).map((q) =>
      q._id.toString()
    );

    const allProgress = await UserProgress.find({}).lean();
    const invalid = allProgress.filter(
      (entry) => !entry.question || !validQuestionIds.includes(entry.question.toString())
    );

    console.log(`Found invalid progress rows: ${invalid.length}`);

    if (invalid.length > 0) {
      const invalidIds = invalid.map((entry) => entry._id);
      const result = await UserProgress.deleteMany({ _id: { $in: invalidIds } });
      console.log(`Deleted invalid progress rows: ${result.deletedCount}`);
    }

    const remaining = await UserProgress.countDocuments();
    console.log(`Remaining progress rows: ${remaining}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runCleanup();
