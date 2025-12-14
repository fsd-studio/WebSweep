"use client"

import { useCallback, useId, useMemo, useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useDataCollection } from 'context/DataCollectionContext';
import Pagination from './Pagination';
import { searchWebsites } from 'app/actions/search';

/**
 * Normalizes a string by converting it to lower case, removing diacritics, and trimming whitespace.
 * This is used for case-insensitive and diacritic-insensitive searching and comparison.
 * @param {string} [str=''] - The string to normalize.
 * @returns {string} The normalized string.
 */
const normalize = (str = '') =>
  String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

/**
 * Creates an array of unique non-falsy values from an input array.
 * @param {Array<any>} arr - The input array.
 * @returns {Array<any>} Array of unique, truthy elements.
 */
const uniqueFrom = (arr) => Array.from(new Set((arr || []).filter(Boolean)));

/**
 * A reusable input component with typeahead (autocomplete) suggestion functionality.
 * * @param {object} props - Component props.
 * @param {string} props.id - The unique HTML ID for the input and listbox association.
 * @param {string} props.label - The placeholder label for the input.
 * @param {string} props.value - The current value of the input.
 * @param {function(string): void} props.onChange - Handler called when input value changes.
 * @param {function(string): void} [props.onSelect] - Handler called when a suggestion is selected.
 * @param {string[]} [props.source=[]] - Array of strings used for suggestions.
 * @returns {JSX.Element}
 */
function TypeaheadInput({ id, label, value, onChange, onSelect, source = [] }) {
  const [open, setOpen] = useState(false);

  // Memoized calculation of suggestions based on the current input value (q)
  const suggestions = useMemo(() => {
    const q = normalize(value);
    // If query is empty, show the first 8 items; otherwise, filter based on inclusion
    if (!q) return source.slice(0, 8);
    return source.filter((s) => normalize(s).includes(q)).slice(0, 8);
  }, [source, value]);

  // Handler for selecting a suggestion from the list
  const handleSelect = useCallback(
    (val) => {
      onChange(val);
      onSelect && onSelect(val);
      setOpen(false); // Close the dropdown after selection
    },
    [onChange, onSelect]
  );

  return (
    <div className="relative w-full">
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        // Use setTimeout to allow click/onMouseDown events on suggestions to register before closing
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        placeholder={label}
        className="py-3 text-black border border-gray-300 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 rounded-full w-full shadow-sm"
        type="text"
        autoComplete="off"
        // ARIA attributes for accessibility
        aria-autocomplete="list"
        aria-controls={`${id}-listbox`}
        aria-expanded={open}
      />
      {open && suggestions.length > 0 && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg"
        >
          {suggestions.map((s) => (
            <li
              key={s}
              role="option"
              // Prevent input blur event from firing when clicking on suggestion (critical for usability)
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(s)}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


/**
 * Main module for searching and displaying website data, migrated from local JSON to Prisma via Server Actions.
 * * It manages filter states, fetches data from the server, handles sorting, and displays results using pagination.
 * * @returns {JSX.Element}
 */
export default function DataCollectionModule() {
  
  // State to hold the full initial dataset fetched from the DB (used to populate typeahead sources)
  const [dbData, setDbData] = useState([]);
  // State to hold the current list of records matching the user's search criteria
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Alias for clarity: dbData holds the full dataset needed for filtering/dropdowns
  const datasetWithIds = dbData; 
  
  // --- Core Data Fetching Function ---
  /**
   * Fetches data from the server using the `searchWebsites` Server Action.
   * @param {import('@/actions/search').Filters} [filters={}] - Search filters to apply.
   * @param {boolean} isInitial - If true, sets the full `dbData` for dropdowns; otherwise sets `searchResults`.
   */
  const fetchAndSetData = useCallback(async (filters = {}, isInitial = false) => {
    setIsLoading(true);
    setError(null);
    try {
      // Call the server action directly
      const data = await searchWebsites(filters);
      
      if (isInitial) {
        // Sets the complete list (e.g., all cities/cantons) for dropdown sources
        setDbData(data);
      } else {
        // Sets the filtered list for the results table
        setSearchResults(data);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unknown error occurred while fetching data.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Effect for Initial Data Fetch ---
  useEffect(() => {
    // Fetch all data (empty filters) on component mount to populate the unique value lists
    fetchAndSetData({}, true); 
  }, [fetchAndSetData]); // Dependency on useCallback prevents infinite loop
  
  // --- Memoized Data Structures (Dependent on fetched dbData) ---
  
  const categories = useMemo(
    () => uniqueFrom((datasetWithIds || []).map((c) => c.category)),
    [datasetWithIds]
  );

  const citiesAll = useMemo(
    () => uniqueFrom((datasetWithIds || []).map((c) => c.city)),
    [datasetWithIds]
  );

  const cantonsAll = useMemo(
    () => uniqueFrom((datasetWithIds || []).map((c) => c.canton)),
    [datasetWithIds]
  );

  // Map: normalized_city -> canton (used for setting canton when city is selected)
  const cityToCanton = useMemo(() => {
    const m = new Map();
    for (const item of datasetWithIds || []) {
      if (item?.city && item?.canton) {
        const k = normalize(item.city);
        if (!m.has(k)) m.set(k, item.canton);
      }
    }
    return m;
  }, [datasetWithIds]);

  // Map: normalized_canton -> array_of_cities (used for filtering cities when canton is selected)
  const cantonToCities = useMemo(() => {
    const m = new Map();
    for (const item of datasetWithIds || []) {
      if (item?.canton && item?.city) {
        const k = normalize(item.canton);
        if (!m.has(k)) m.set(k, new Set());
        m.get(k).add(item.city);
      }
    }
    const out = new Map();
    for (const [k, set] of m.entries()) out.set(k, Array.from(set));
    return out;
  }, [datasetWithIds]);
  // --- End of Data Structures ---

  const categoryId = useId();
  const cityId = useId();
  const cantonId = useId();

  // Context hook for shared state management
  const { 
    computedData,
    category, 
    setCategory, 
    canton, 
    setCanton, 
    city, 
    setCity, 
    currentPage, 
    setCurrentPage,
    searchApplied, // Tracks the last search filter applied (used for display context)
    setSearchApplied,
  } = useDataCollection();

  const [sortKey, setSortKey] = useState('none'); 
  const [sortOrder, setSortOrder] = useState('asc'); 

  // Source list for Canton Typeahead (filtered if a city is currently selected)
  const cantonSource = useMemo(() => {
    const mapped = city ? cityToCanton.get(normalize(city)) : null;
    return mapped ? [mapped] : cantonsAll;
  }, [city, cityToCanton, cantonsAll]);

  // Source list for City Typeahead (filtered if a canton is currently selected)
  const citySource = useMemo(() => {
    const k = canton ? normalize(canton) : null;
    if (k && cantonToCities.has(k)) return cantonToCities.get(k);
    return citiesAll;
  }, [canton, cantonToCities, citiesAll]);

  // Handler: When a city is selected, automatically set the corresponding canton
  const handleCitySelect = useCallback(
    (val) => {
      const mapped = cityToCanton.get(normalize(val));
      if (mapped) setCanton(mapped);
    },
    [cityToCanton, setCanton]
  );

  // Handler: When a canton is selected or manually changed, check if the current city belongs to it.
  const handleCantonSelectOrChange = useCallback(
    (val) => {
      setCanton(val);
      // If current city doesn't belong to selected canton, clear the city filter
      if (city) {
        const mapped = cityToCanton.get(normalize(city));
        if (mapped && normalize(mapped) !== normalize(val)) {
          setCity('');
        }
      }
    },
    [city, cityToCanton, setCity, setCanton]
  );

  // The filtered list is now the result from the last successful Server Action call
  const filtered = searchResults;


  /**
   * Retrieves the specific score for an item based on the sort key.
   * @param {object} item - The website data item.
   * @param {'geo' | 'seo' | 'performance' | 'general' | 'none'} key - The score type key.
   * @returns {number | null} The score value, or null if missing.
   */
  const scoreFor = useCallback(
    (item, key) => {
      // computedData contains external, calculated scores stored by item ID (from context)
      const data = computedData?.[item.id]; 
      if (!data) return null;
      switch (key) {
        case 'geo':
          return Number.isFinite(data.GLOBAL?.GEO?.composite?.score)
            ? data.GLOBAL.GEO.composite.score
            : null;
        case 'seo':
          return data.MOBILE?.SEO?.score != null
            ? data.MOBILE.SEO.score * 100
            : null;
        case 'performance':
          return data.DESKTOP?.PERFORMANCE?.score != null
            ? data.DESKTOP.PERFORMANCE.score * 100
            : null;
        case 'general':
          return Number.isFinite(data.GENERAL?.SUMMARY?.score)
            ? data.GENERAL.SUMMARY.score
            : null;
        default:
          return null;
      }
    },
    [computedData]
  );

  /**
   * Memoized list of filtered results, sorted based on the current `sortKey` and `sortOrder`.
   */
  const sorted = useMemo(() => {
    if (!filtered.length || sortKey === 'none') return filtered;
    
    // Create a copy to avoid mutating state
    return [...filtered].sort((a, b) => {
      const aScore = scoreFor(a, sortKey);
      const bScore = scoreFor(b, sortKey);
      
      const missingA = aScore == null || !Number.isFinite(aScore);
      const missingB = bScore == null || !Number.isFinite(bScore);
      
      // Push items with missing scores to the bottom
      if (missingA && missingB) return 0;
      if (missingA) return 1; 
      if (missingB) return -1;
      
      // Sort based on order
      return sortOrder === 'desc' ? bScore - aScore : aScore - bScore;
    });
  }, [filtered, sortKey, sortOrder, scoreFor]);

  /**
   * Toggles the sorting state when a column header is clicked.
   * @param {'geo' | 'seo' | 'performance' | 'general'} key - The score key to sort by.
   */
  const handleSortToggle = useCallback(
    (key) => {
      setCurrentPage(1); // Reset to first page on new sort
      if (sortKey !== key) {
        setSortKey(key);
        setSortOrder('asc');
      } else {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      }
    },
    [sortKey, setCurrentPage]
  );

  /**
   * Executes the search operation by calling the Server Action with current filter values.
   */
  const handleSearch = useCallback(() => {
    setSearchApplied({ category, city, canton });
    setCurrentPage(1); // Reset to first page on new search
    
    // Triggers the Server Action via the client helper function
    fetchAndSetData({ category, city, canton }, false); 
    
  }, [category, city, canton, setSearchApplied, setCurrentPage, fetchAndSetData]);


  /**
   * Clears all current filter states and search results.
   */
  const handleClear = useCallback(() => {
    setCategory('');
    setCity('');
    setCanton('');
    setSearchApplied(null);
    setCurrentPage(1);
    setSearchResults([]); // Clears the displayed results table
  }, [setCategory, setCity, setCanton, setSearchApplied, setCurrentPage]);

  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="mb-4 text-2xl text-gray-900 font-semibold">Search websites by</div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Canton Input */}
        <div className="flex flex-col">
          <label htmlFor={cantonId} className="mb-1 text-sm text-gray-600">
            Canton
          </label>
          <TypeaheadInput
            id={cantonId}
            label="Search canton"
            value={canton}
            onChange={setCanton}
            onSelect={handleCantonSelectOrChange}
            source={cantonSource}
          />
        </div>

        {/* City Input */}
        <div className="flex flex-col">
          <label htmlFor={cityId} className="mb-1 text-sm text-gray-600">
            City
          </label>
          <TypeaheadInput
            id={cityId}
            label="Search city"
            value={city}
            onChange={setCity}
            onSelect={handleCitySelect}
            source={citySource}
          />
        </div>

        {/* Category Input */}
        <div className="flex flex-col">
          <label htmlFor={categoryId} className="mb-1 text-sm text-gray-600">
            Category
          </label>
          <TypeaheadInput
            id={categoryId}
            label="Search category"
            value={category}
            onChange={setCategory}
            source={categories}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-full shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40"
            disabled={isLoading} 
          >
            <FiSearch />
            {isLoading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-3 rounded-full shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            disabled={isLoading}
          >
            Clear
          </button>
        </div>
        <div className="text-sm text-gray-700">
          <span className="font-medium">Matching records: </span>
          {isLoading ? '...' : filtered.length}
        </div>
      </div>
      
      {/* Error Display */}
      {error && <div className="mt-4 p-3 text-red-700 bg-red-100 border border-red-200 rounded-lg">{error}</div>}

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        filtered={sorted}
        onSort={handleSortToggle}
        sortKey={sortKey}
        sortOrder={sortOrder}
      />
    </section>
  );
}