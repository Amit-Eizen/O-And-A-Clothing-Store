import { useState, useEffect, useRef, useCallback } from "react";
import { fetchFilteredProducts } from "../services/products-api";
import type { ProductFromServer } from "../services/products-api";
import type { CategoryFilters } from "./useCategoryFilters";

const PRODUCTS_PER_PAGE = 8;

const useCategoryProducts = (category: string, filters: CategoryFilters) => {
    const [products, setProducts] = useState<ProductFromServer[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(false);

    const isLoadingNextPage = useRef(false);
    const currentPage = useRef(1);
    const hasMore = useRef(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const buildFilterParams = useCallback((pageNumber: number) => {
        const params: any = {
            category: category,
            sort: filters.sortBy,
            page: pageNumber,
            limit: PRODUCTS_PER_PAGE,
        };

        if (filters.selectedTypes.length > 0) params.type = filters.selectedTypes;
        if (filters.priceRange[0] > 0) params.minPrice = filters.priceRange[0];
        if (filters.priceRange[1] < 1000) params.maxPrice = filters.priceRange[1];
        if (filters.selectedSizes.length > 0) params.sizes = filters.selectedSizes;
        if (filters.selectedColors.length > 0) params.colors = filters.selectedColors;

        return params;
    }, [category, filters]);

    // Load products (resets when category or filters change)
    useEffect(() => {
        let isEffectActive = true;

        const loadProducts = async () => {
            window.scrollTo(0, 0);
            setLoading(true);
            setProducts([]);
            currentPage.current = 1;
            hasMore.current = false;

            try {
                const result = await fetchFilteredProducts(buildFilterParams(1));
                if (!isEffectActive) return;

                setProducts(result.products);
                setTotalProducts(result.total);
                hasMore.current = result.products.length >= PRODUCTS_PER_PAGE;
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                if (isEffectActive) {
                    isLoadingNextPage.current = true;
                    setTimeout(() => {
                        setLoading(false);
                        isLoadingNextPage.current = false;
                    }, 500);
                }
            }
        };
        loadProducts();

        return () => { isEffectActive = false; };
    }, [buildFilterParams]);

    // Infinite scroll with IntersectionObserver
    useEffect(() => {
        let isEffectActive = true;

        const loadNextPage = async () => {
            if (isLoadingNextPage.current || !hasMore.current) return;

            isLoadingNextPage.current = true;
            setLoading(true);
            currentPage.current += 1;

            await new Promise((resolve) => setTimeout(resolve, 300));
            if (!isEffectActive) return;

            try {
                const result = await fetchFilteredProducts(buildFilterParams(currentPage.current));
                if (!isEffectActive) return;

                setProducts((prev) => {
                    const existingIds = new Set(prev.map(p => p._id));
                    const newProducts = result.products.filter(p => !existingIds.has(p._id));
                    return [...prev, ...newProducts];
                });

                hasMore.current = result.products.length >= PRODUCTS_PER_PAGE;
            } catch (error) {
                if (!isEffectActive) return;
                console.error("Error fetching next page of products:", error);
            } finally {
                if (isEffectActive) {
                    setLoading(false);
                    isLoadingNextPage.current = false;
                }
            }
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadNextPage();
            }
        });   

        const sentinel = sentinelRef.current;
        if (sentinel) {
            observer.observe(sentinel);
        }

        return () => {
            isEffectActive = false;
            if (sentinel) {
                observer.unobserve(sentinel);
            }
        };
    }, [buildFilterParams]);

    return { products, totalProducts, loading, sentinelRef };
};

export default useCategoryProducts;