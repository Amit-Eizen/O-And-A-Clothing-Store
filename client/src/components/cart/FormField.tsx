import { TextField, Typography } from "@mui/material";

interface FormFieldProps {
    label: string;
    placeholder: string;
    value: string;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    mb?: number;
}

const FormField = ({ label, placeholder, value, error, onChange, mb = 2 }: FormFieldProps) => {
    return (
        <>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#666", mb: 0.5 }}>{label}</Typography>
            <TextField
                fullWidth
                size="small"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error}
                sx={{ mb, "& .MuiInputBase-input": { fontSize: 13 } }}
            />
        </>
    );
}

export default FormField;
