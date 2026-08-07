import api from "./api";

export const getDashboardAnalytics = async () => {

    const response = await api.get("/dashboard/analytics");

    return response.data;

};

export const getUpcomingDeadlines = async () => {

    const response = await api.get("/dashboardAnalytics/deadlines");

    return response.data;

};