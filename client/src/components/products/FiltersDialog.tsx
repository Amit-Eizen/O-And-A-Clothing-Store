import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Typography, IconButton, Select, MenuItem,
    FormControl, Checkbox, FormControlLabel, Slider, Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const types = ["Dresses", "Jeans", "Jackets", "T-Shirts", "Pants", "Bags", "Shoes", "Coats", "Blouses", "Sweaters", "Skirts", "Sets"];
const categories = ["Women", "Men", "Accessories"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
    { name: "Black", hex: "#000" },
    { name: "White", hex: "#fff" },
    { name: "Gold", hex: "#c8a951" },
    { name: "Brown", hex: "#8B4513" },
    { name: "Blue", hex: "#1E40AF" },
    { name: "Red", hex: "#991B1B" },
    { name: "Grey", hex: "#9CA3AF" },
    { name: "Beige", hex: "#F5DEB3" },
    { name: "Navy", hex: "#1a1a3a" },
];

interface FiltersDialogProps {
    open: boolean;
    onClose: () => void;
    filters: {
        sortBy: string;
        priceRange: number[];
        selectedSizes: string[];
        selectedColors: string[];
        selectedTypes: string[];
        selectedCategories: string[];
    };
    onUpdateFilters: (filters: FiltersDialogProps["filters"]) => void;
    showCategoryFilter?: boolean;
}

const FiltersDialog = ({ open, onClose, filters, onUpdateFilters, showCategoryFilter }: FiltersDialogProps) => {
    const { sortBy, priceRange, selectedSizes, selectedColors, selectedTypes, selectedCategories } = filters;

    const toggle = (field: "selectedSizes" | "selectedColors" | "selectedTypes" | "selectedCategories", value: string) => {
        const current = filters[field];
        const updated = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        onUpdateFilters({ ...filters, [field]: updated });
    };

    const clearAll = () => {
        onUpdateFilters({
            sortBy: "featured",
            priceRange: [0, 1000],
            selectedSizes: [],
            selectedColors: [],
            selectedTypes: [],
            selectedCategories: [],
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth={false} sx={{ "& .MuiDialog-paper": { width: 750, maxHeight: 645 } }}>
            {/* Header */}
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography component="span" variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
                    Filters & Sort
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ display: "flex", gap: 6 }}>
                    {/* Left Column */}
                    <Box sx={{ flex: 1 }}>
                        {/* Sort By */}
                        <Typography sx={{ fontWeight: 700, fontSize: 11, letterSpacing: 1, mb: 1.5 }}>SORT BY</Typography>
                        <FormControl fullWidth size="small" sx={{ mb: 3, "& .MuiSelect-select": { fontSize: 13 } }}>
                            <Select value={sortBy} onChange={(e) => onUpdateFilters({ ...filters, sortBy: e.target.value })}>
                                <MenuItem value="featured">Featured</MenuItem>
                                <MenuItem value="newest">Newest</MenuItem>
                                <MenuItem value="price-low">Price: Low to High</MenuItem>
                                <MenuItem value="price-high">Price: High to Low</MenuItem>
                                <MenuItem value="popular">Most Popular</MenuItem>
                            </Select>
                        </FormControl>

                        {showCategoryFilter && (
                            <>
                                <Typography sx={{ fontWeight: 700, fontSize: 11, letterSpacing: 1, mb: 1.5 }}>CATEGORY</Typography>
                                <Box sx={{ mb: 3 }}>
                                    {categories.map((cat) => (
                                        <FormControlLabel
                                            key={cat}
                                            control={
                                                <Checkbox
                                                    checked={selectedCategories.includes(cat.toLowerCase())}
                                                    onChange={() => toggle("selectedCategories", cat.toLowerCase())}
                                                    size="small"
                                                />
                                            }
                                            label={cat}
                                            sx={{ display: "block", mb: 0.5, "& .MuiTypography-root": { fontSize: 12 } }}
                                        />
                                    ))}
                                </Box>
                            </>
                        )}

                        {/* Type */}
                        <Typography sx={{ fontWeight: 700, fontSize: 11, letterSpacing: 1, mb: 1.5 }}>TYPE</Typography>
                        <Box sx={{ mb: 3 }}>
                            {types.map((type) => (
                                <FormControlLabel
                                    key={type}
                                    control={
                                        <Checkbox
                                            checked={selectedTypes.includes(type)}
                                            onChange={() => toggle("selectedTypes", type)}

                                            size="small"
                                        />
                                    }
                                    label={type}
                                    sx={{ display: "block", mb: 0.5, "& .MuiTypography-root": { fontSize: 12 } }}
                                />
                            ))}
                        </Box>

                        {/* Price Range */}
                        <Typography sx={{ fontWeight: 700, fontSize: 11, letterSpacing: 1, mb: 1.5 }}>PRICE RANGE</Typography>
                        <Slider
                            value={priceRange}
                            onChange={(_, val) => onUpdateFilters({ ...filters, priceRange: val as number[] })}
                            min={0}
                            max={1000}
                            sx={{ color: "#000" }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography sx={{ fontSize: 11 }}>${filters.priceRange[0]}</Typography>
                            <Typography sx={{ fontSize: 11 }}>${filters.priceRange[1]}</Typography>
                        </Box>
                    </Box>

                    {/* Right Column */}
                    <Box sx={{ flex: 1 }}>
                        {/* Size */}
                        <Typography sx={{ fontWeight: 700, fontSize: 11, letterSpacing: 1, mb: 1.5 }}>SIZE</Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                            {sizes.map((size) => (
                                <Box
                                    key={size}
                                    onClick={() => toggle("selectedSizes", size)}
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        border: selectedSizes.includes(size) ? "2px solid #c8a951" : "1px solid #ddd",
                                        borderRadius: 1,
                                        cursor: "pointer",
                                        fontSize: 11,
                                        fontWeight: 500,
                                        "&:hover": { borderColor: "#c8a951" },
                                    }}
                                >  
                                    {size}
                                </Box>
                            ))}
                        </Box>

                        {/* Color */}
                        <Typography sx={{ fontWeight: 700, fontSize: 11, letterSpacing: 1, mb: 1.5 }}>COLOR</Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                            {colors.map((color) => (
                                <Box
                                    key={color.name}
                                    onClick={() => toggle("selectedColors", color.name)}
                                    sx={{
                                        width: 26,
                                        height: 26,
                                        backgroundColor: color.hex,
                                        borderRadius: "50%",
                                        border: selectedColors.includes(color.name) ? "2px solid #c8a951" : "2px solid #eee",
                                        cursor: "pointer",
                                        "&:hover": { borderColor: "#c8a951" },
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            { /* Footer Buttons */ }
            <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2 }}>
                <Typography
                    onClick={clearAll}
                    sx={{ color: "#999", fontSize: 12, cursor: "pointer", textDecoration: "underline", "&:hover": { color: "#000" } }}
                >
                    Clear All
                </Typography>
                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        backgroundColor: "#c8a951",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 12,
                        letterSpacing: 1,
                        px: 4,
                        "&:hover": { backgroundColor: "#b89841" },
                    }}
                >
                    APPLY FILTERS
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FiltersDialog;