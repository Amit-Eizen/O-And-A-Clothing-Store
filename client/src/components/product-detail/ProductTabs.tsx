import { Box, Tabs, Tab } from "@mui/material";
import DescriptionTab from "./DescriptionTab";
import ReviewsTab from "./ReviewsTab";
import ShippingTab from "./ShippingTab";

interface ProductTabsProps {
    product: {
        description: string;
        features: string[];
        rating: number;
        reviewCount: number;
        reviewBreakdown: { stars: number; percentage: number }[];
        shippingInfo: string;
        returnsInfo: string;
    };
    activeTab: number;
    onTabChange: (tab: number) => void;
}

const ProductTabs = ({ product, activeTab, onTabChange }: ProductTabsProps) => {
    return (
        <Box>
            <Tabs
                value={activeTab}
                onChange={(_e, newValue) => onTabChange(newValue)}
                sx={{
                    borderBottom: "1px solid #eee",
                    "& .MuiTab-root": {
                        fontSize: 13,
                        letterSpacing: 1,
                        color: "#999",
                        "&.Mui-selected": {
                            color: "#000",
                        },
                    },
                    "& .MuiTabs-indicator": {
                        backgroundColor: "#c8a951",
                    },
                }}
            >
                <Tab label="Description" />
                <Tab label={`Reviews (${product.reviewCount})`} />
                <Tab label="Shipping & Returns" />
            </Tabs>

            {activeTab === 0 && (
                <DescriptionTab
                    description={product.description}
                    features={product.features}
                />
            )}

            {activeTab === 1 && (
                <ReviewsTab
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    reviewBreakdown={product.reviewBreakdown}
                />
            )}

            {activeTab === 2 && (
                <ShippingTab
                    shippingInfo={product.shippingInfo}
                    returnsInfo={product.returnsInfo}
                />
            )}
        </Box>
    );
};

export default ProductTabs;
