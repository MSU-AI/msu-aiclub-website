import React from 'react';
import { Button } from "~/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, baseUrl }) => {
  const getPageUrl = (page: number) => {
    const url = new URL(baseUrl, 'http://placeholder.com');
    url.searchParams.set('page', page.toString());
    return url.pathname + url.search;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <Button
        asChild
        disabled={currentPage === 1}
        variant="outline"
      >
        <a href={getPageUrl(currentPage - 1)}>Previous</a>
      </Button>
      <span>{`Page ${currentPage} of ${totalPages}`}</span>
      <Button
        asChild
        disabled={currentPage === totalPages}
        variant="outline"
      >
        <a href={getPageUrl(currentPage + 1)}>Next</a>
      </Button>
    </div>
  );
};

export default Pagination;