const Question = require("../models/question");

const getAllQuestions = async (req, res) => {

    try {

        const { search, difficulty, topic, platform } = req.query;
        let filter = {};

        if (search) {
            filter.title = {
                $regex: search,
                $options: "i",
            };
        }

        if (difficulty) {
            filter.difficulty = difficulty;
        }

        if (topic) {
            filter.topic = topic;
        }

        if (platform) {
            filter.platform = platform;
        }

        const questions = await Question.find(filter);

        res.status(200).json({
            success: true,
            count: questions.length,
            questions,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

};

const getSingleQuestion = async (req, res) => {

    try {

        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        res.status(200).json({
            success: true,
            question,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const searchQuestions = async (req, res) => {

    try {

        const keyword = req.query.keyword;

        const questions = await Question.find({
            title: {
                $regex: keyword,
                $options: "i",
            },
        });

        res.status(200).json({
            success: true,
            count: questions.length,
            questions,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const filterQuestions = async (req, res) => {

    try {

        const { difficulty, topic } = req.query;
        const filter = {};

        if (difficulty) {
            filter.difficulty = difficulty;
        }
        if (topic) {
            filter.topic = topic;
        }

        const questions = await Question.find(filter);
        res.status(200).json({
            success: true,
            count: questions.length,
            questions,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getAllQuestions,
    getSingleQuestion,
    searchQuestions,
    filterQuestions
};