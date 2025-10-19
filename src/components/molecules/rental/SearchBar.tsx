'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateSearchQuery } from '@/store/slices/filtersSlice';

export interface SearchBarProps {
  className?: string;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  className = '',
  placeholder = 'Tìm kiếm thiết bị...',
  debounceMs = 500,
}) => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state: any) => state.filters.searchQuery);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isTyping, setIsTyping] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search effect
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set typing indicator
    if (localQuery !== searchQuery) {
      setIsTyping(true);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      if (localQuery !== searchQuery) {
        dispatch(updateSearchQuery(localQuery));
        setIsTyping(false);
      }
    }, debounceMs);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [localQuery, searchQuery, dispatch, debounceMs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Cancel debounce and search immediately
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    dispatch(updateSearchQuery(localQuery));
    setIsTyping(false);
  };

  const handleClear = () => {
    setLocalQuery('');
    dispatch(updateSearchQuery(''));
    setIsTyping(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="flex items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={localQuery}
            onChange={handleChange}
            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder={placeholder}
          />
          {isTyping && (
            <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
              <div className="flex items-center text-xs text-gray-400">
                <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang tìm...</span>
              </div>
            </div>
          )}
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-8 flex items-center pr-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          type="submit"
          className="ml-3 inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Tìm kiếm
        </button>
      </div>
    </form>
  );
};