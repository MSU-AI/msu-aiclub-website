'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "~/components/ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "~/components/ui/input";

const SearchButton: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSearchQuery(searchParams.get('query') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    performSearch('');
  };

  const performSearch = (query: string) => {
    const url = query
      ? `/posts?query=${encodeURIComponent(query.trim())}`
      : '/posts';
    
    // Force a server-side navigation
    window.location.href = url;
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center">
      <Input
        type="text"
        placeholder="Search posts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mr-2"
      />
      <Button type="submit" variant="outline" size="icon" className="mr-2">
        <MagnifyingGlassIcon className="h-4 w-4" />
      </Button>
      {searchQuery && (
        <Button type="button" variant="outline" size="sm" onClick={handleClear}>
          Clear
        </Button>
      )}
    </form>
  );
};

export default SearchButton;