import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const DEFAULTS = {
  search: '',
  city: '',
  industry: '',
  company_size: '',
  is_tech: '',
  page: '1',
  sort: 'organisation_name',
  order: 'asc',
};

function parseParams(searchParams) {
  const state = {};
  for (const [key, defaultVal] of Object.entries(DEFAULTS)) {
    state[key] = searchParams.get(key) || defaultVal;
  }
  return state;
}

export default function useSyncURL() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => parseParams(searchParams));
  const debounceRef = useRef(null);
  const isInternalUpdate = useRef(false);

  // Sync from URL → state (only for external URL changes like back/forward)
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    setFilters(parseParams(searchParams));
  }, [searchParams]);

  const updateFilters = useCallback((updates) => {
    setFilters(prev => {
      const next = { ...prev, ...updates };
      // Reset page when changing search/filter params
      if ('search' in updates || 'city' in updates || 'industry' in updates ||
          'company_size' in updates || 'is_tech' in updates) {
        next.page = '1';
      }

      // Debounce URL updates
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        isInternalUpdate.current = true;
        const params = new URLSearchParams();
        for (const [key, val] of Object.entries(next)) {
          if (val && val !== DEFAULTS[key]) {
            params.set(key, val);
          }
        }
        setSearchParams(params, { replace: true });
      }, 300);

      return next;
    });
  }, [setSearchParams]);

  return { filters, updateFilters };
}
