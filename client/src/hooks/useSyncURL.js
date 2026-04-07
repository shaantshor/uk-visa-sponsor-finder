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

export default function useSyncURL() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getState = useCallback(() => {
    const state = {};
    for (const [key, defaultVal] of Object.entries(DEFAULTS)) {
      state[key] = searchParams.get(key) || defaultVal;
    }
    return state;
  }, [searchParams]);

  const [filters, setFilters] = useState(getState);
  const debounceRef = useRef(null);

  useEffect(() => {
    setFilters(getState());
  }, [searchParams, getState]);

  const updateFilters = useCallback((updates) => {
    setFilters(prev => {
      const next = { ...prev, ...updates };
      if ('search' in updates || 'city' in updates || 'industry' in updates ||
          'company_size' in updates || 'is_tech' in updates) {
        next.page = '1';
      }

      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
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
