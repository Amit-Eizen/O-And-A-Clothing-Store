import apiClient from "../services/api-client";

export const getAvatarLetters = (name: string): string => {
    if (!name) return "?";
    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export const formatDate = (isoString: string): string => {
    return new Date(isoString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const getImageUrl = (path: string): string => {
    return `${apiClient.defaults.baseURL}${path}`;
};