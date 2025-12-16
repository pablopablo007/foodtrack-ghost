import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPrevious: () => void;
    onNext: () => void;
    onFirst: () => void;
    onLast: () => void;
    totalItems?: number;
    itemsPerPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    onPrevious,
    onNext,
    onFirst,
    onLast,
    totalItems,
    itemsPerPage,
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const startItem = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
    const endItem = totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            {totalItems && itemsPerPage && (
                <p className="text-sm text-slate-600">
                    Mostrando <span className="font-bold">{startItem}</span> a <span className="font-bold">{endItem}</span> de{' '}
                    <span className="font-bold">{totalItems}</span> resultados
                </p>
            )}

            <div className="flex items-center gap-2">
                <button
                    onClick={onFirst}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Primera página"
                >
                    <ChevronsLeft size={18} />
                </button>

                <button
                    onClick={onPrevious}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Página anterior"
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="flex gap-1">
                    {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-2 text-slate-400">...</span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(page as number)}
                                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${currentPage === page
                                            ? 'bg-orange-600 text-white'
                                            : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                                        }`}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <button
                    onClick={onNext}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Página siguiente"
                >
                    <ChevronRight size={18} />
                </button>

                <button
                    onClick={onLast}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Última página"
                >
                    <ChevronsRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
