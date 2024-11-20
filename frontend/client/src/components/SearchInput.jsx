import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

export default function SearchInput({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <div className="relative mt-2 rounded-md shadow-sm px-4">
        <input
          type="text"
          name="search"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="block w-full rounded-md border-0 py-1.5 pl-3 pr-48 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Nhập từ khóa tìm kiếm!"
        />
        <button
          onClick={handleSearch}
          className="absolute inset-y-0 right-0 flex items-center px-6 text-gray-400"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
