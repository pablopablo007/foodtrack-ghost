import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
    items: T[];
    itemsPerPage: number;
}

interface UsePaginationReturn<T> {
    currentItems: T[];
    currentPage: number;
    totalPages: number;
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    goToFirstPage: () => void;
    goToLastPage: () => void;
}

export function usePagination<T>({
    items,
    itemsPerPage,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    }, [items, currentPage, itemsPerPage]);

    const goToPage = (page: number) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    };

    const nextPage = () => {
        goToPage(currentPage + 1);
    };

    const prevPage = () => {
        goToPage(currentPage - 1);
    };

    const goToFirstPage = () => {
        setCurrentPage(1);
    };

    const goToLastPage = () => {
        setCurrentPage(totalPages);
    };

    return {
        currentItems,
        currentPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
        goToFirstPage,
        goToLastPage,
    };
}
