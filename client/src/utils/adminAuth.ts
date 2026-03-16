

export const isAdmin = (): boolean => {
    return localStorage.getItem("role") === "admin";
};

export const isLoggedIn = (): boolean => {
    return !!localStorage.getItem("token");
};
