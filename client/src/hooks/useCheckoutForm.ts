import { useState, useEffect } from "react";
import apiClient from "../services/api-client";

const initialFormState = {
    cardNumber: "",
    cardholderName: "",
    expirationDate: "",
    cvv: "",
    streetAddress: "",
    city: "",
    zipCode: "",
    country: "",
    phoneNumber: "",
    email: "",
};

const useCheckoutForm = (shipping: number, tax: number) => {
    const [form, setForm] = useState(initialFormState);
    const [errors, setErrors] =  useState<Record<string, string>>({});

    useEffect(() => {
        apiClient.get("/users/profile")
            .then((res) => {
                const data = res.data;
                setForm((prev) => ({
                    ...prev,
                    email: data.email || "",
                    phoneNumber: data.phoneNumber || "",
                    streetAddress: data.address?.street || "",
                    city: data.address?.city || "",
                    zipCode: data.address?.zipCode || "",
                    country: data.address?.country || "",
                }));
            })
            .catch(() => {});
    }, []);

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        if (field === "cardNumber") {
            value = value.replace(/\D/g, "").slice(0, 16);
            value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
        }

        if (field === "expirationDate") {
            value = value.replace(/\D/g, "").slice(0, 4);
            if (value.length >= 2) {
                const month = parseInt(value.slice(0, 2));
                if (month > 12) value = "12" + value.slice(2);
                if (month === 0) value = "01" + value.slice(2);
            }
            if (value.length >= 3) {
                value = value.replace(/(\d{2})(?=\d)/g, "$1/");
            }
        }

        if (field === "cvv") {
            value = value.replace(/\D/g, "").slice(0, 4);
        }
        
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!form.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
        if (!form.cardholderName.trim()) newErrors.cardholderName = "Cardholder name is required";
        if (!form.expirationDate.trim()) newErrors.expirationDate = "Expiration date is required";
        if (!form.cvv.trim()) newErrors.cvv = "CVV is required";
        if (!form.streetAddress.trim()) newErrors.streetAddress = "Street address is required";
        if (!form.city.trim()) newErrors.city = "City is required";
        if (!form.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
        if (!form.country.trim()) newErrors.country = "Country is required";
        if (!form.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
        if (!form.email.trim()) newErrors.email = "Email is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (onClose: () => void, onSuccess: (orderNumber: string) => void) => {
        if (!validate()) return;

        try {
            const response = await apiClient.post("/orders", {
                shipping,
                tax,
                shippingAddress: {
                    street: form.streetAddress,
                    city: form.city,
                    zipCode: form.zipCode,
                    country: form.country,
                },
            });

            setForm(initialFormState);
            setErrors({});
            onClose();
            onSuccess(response.data.orderNumber);
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    const handleClose = (onClose: () => void) => {
        setForm(initialFormState);
        setErrors({});
        onClose();
    };

    return {
        form,
        errors,
        handleChange,
        handleSubmit,
        handleClose,
    };
}

export default useCheckoutForm;
