"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (term: string) => void;
  basePath: string; // The URL path to redirect to on search
  paramName?: string; // e.g., 'search' or 'q'
}

export default function SearchBar({
  placeholder = "제목, 내용, 작성자, 첨부파일명으로 검색",
  onSearch,
  basePath,
  paramName = "search",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get(paramName) || "";
  
  const [inputValue, setInputValue] = useState(currentSearch);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    const trimmed = inputValue.trim();
    setIsLoading(true);
    
    // Optional callback
    if (onSearch) {
      onSearch(trimmed);
    }
    
    // Server-side navigation
    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) {
      params.set(paramName, trimmed);
    } else {
      params.delete(paramName);
    }
    params.delete("page"); // Reset page to 1
    
    router.push(`${basePath}?${params.toString()}`);
    // Loading state will be reset when component unmounts/remounts or could just leave it since server navigation occurs
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleReset = () => {
    setInputValue("");
    setIsLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    params.delete(paramName);
    params.delete("page");
    router.push(`${basePath}?${params.toString()}`);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.85rem 1rem 0.85rem 2.75rem',
            border: '1px solid var(--color-border)',
            borderRadius: '100px',
            fontSize: 'var(--fs-sm)',
            outline: 'none',
            transition: 'all 0.2s',
            background: 'var(--color-surface)',
          }}
        />
        <style>{`
          input[type="text"]:focus {
            border-color: var(--color-primary) !important;
            box-shadow: 0 0 0 3px rgba(12,45,72,0.08) !important;
          }
        `}</style>
        {/* Search Icon inside input */}
        <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        {inputValue && (
          <button 
            onClick={handleReset}
            disabled={isLoading}
            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            aria-label="검색어 초기화"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>
      <button 
        onClick={handleSearch} 
        disabled={isLoading}
        style={{
          padding: '0 1.5rem',
          background: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '100px',
          fontWeight: 600,
          fontSize: 'var(--fs-sm)',
          cursor: isLoading ? 'wait' : 'pointer',
          opacity: isLoading ? 0.7 : 1,
          transition: 'all 0.2s',
          whiteSpace: 'nowrap'
        }}
      >
        {isLoading ? '검색 중...' : '검색'}
      </button>
    </div>
  );
}
