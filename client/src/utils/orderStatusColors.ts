

const statusColors: Record<string, "warning" | "info" | "primary" | "success" | "error"> = {
    pending: "warning",
    processing: "info",
    shipped: "primary",
    delivered: "success",
    cancelled: "error",
};

export default statusColors;
