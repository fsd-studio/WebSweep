"use client"

import { useCallback, useId, useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import dataset from '/public/data/dataset-websweep.json';
import { useDataCollection } from 'context/DataCollectionContext';
import Pagination from './Pagination';

const normalize = (str = '') =>
  String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const uniqueFrom = (arr) => Array.from(new Set((arr || []).filter(Boolean)));

function TypeaheadInput({ id, label, value, onChange, onSelect, source = [] }) {
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(() => {
    const q = normalize(value);
    if (!q) return source.slice(0, 8);
    return source.filter((s) => normalize(s).includes(q)).slice(0, 8);
  }, [source, value]);

  const handleSelect = useCallback(
    (val) => {
      onChange(val);
      onSelect && onSelect(val);
      setOpen(false);
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
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        placeholder={label}
        className="py-3 text-black border border-gray-300 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 rounded-full w-full shadow-sm"
        type="text"
        autoComplete="off"
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



export default function DataCollectionModule() {

  const categories = useMemo(
    () => uniqueFrom((dataset || []).map((c) => c.category)),
    []
  );

  const citiesAll = useMemo(
    () => uniqueFrom((dataset || []).map((c) => c.city)),
    []
  );

  const cantonsAll = useMemo(
    () => uniqueFrom((dataset || []).map((c) => c.canton)),
    []
  );

  const cityToCanton = useMemo(() => {
    const m = new Map();
    for (const item of dataset || []) {
      if (item?.city && item?.canton) {
        const k = normalize(item.city);
        if (!m.has(k)) m.set(k, item.canton);
      }
    }
    return m;
  }, []);

  const cantonToCities = useMemo(() => {
    const m = new Map();
    for (const item of dataset || []) {
      if (item?.canton && item?.city) {
        const k = normalize(item.canton);
        if (!m.has(k)) m.set(k, new Set());
        m.get(k).add(item.city);
      }
    }
    const out = new Map();
    for (const [k, set] of m.entries()) out.set(k, Array.from(set));
    return out;
  }, []);

  const categoryId = useId();
  const cityId = useId();
  const cantonId = useId();

  const { 
    category, 
    setCategory, 
    canton, 
    setCanton, 
    city, 
    setCity, 
    currentPage, 
    setCurrentPage 
  } = useDataCollection();

  const [applied, setApplied] = useState({ category: '', city: '', canton: '' });
  
  const [filtered, setFiltered] = useState([]);

  const cantonSource = useMemo(() => {
    const mapped = city ? cityToCanton.get(normalize(city)) : null;
    return mapped ? [mapped] : cantonsAll;
  }, [city, cityToCanton, cantonsAll]);

  const citySource = useMemo(() => {
    const k = canton ? normalize(canton) : null;
    if (k && cantonToCities.has(k)) return cantonToCities.get(k);
    return citiesAll;
  }, [canton, cantonToCities, citiesAll]);

  const handleCitySelect = useCallback(
    (val) => {
      const mapped = cityToCanton.get(normalize(val));
      if (mapped) setCanton(mapped);
    },
    [cityToCanton]
  );

  const handleCantonSelectOrChange = useCallback(
    (val) => {
      // If current city doesn't belong to selected canton, clear it
      if (city) {
        const mapped = cityToCanton.get(normalize(city));
        if (mapped && normalize(mapped) !== normalize(val)) {
          setCity('');
        }
      }
    },
    [city, cityToCanton]
  );

  const handleSearch = useCallback(() => {
  const ac = normalize(category || '');
  const aCity = normalize(city || '');
  const aCanton = normalize(canton || '');

  setApplied({ category, city, canton });
  setCurrentPage(1);

  setFiltered(
    (dataset || []).filter((item) => {
      const okCategory = !ac || (item.category && normalize(item.category).includes(ac));
      const okCity = !aCity || (item.city && normalize(item.city).includes(aCity));
      const okCanton = !aCanton || (item.canton && normalize(item.canton).includes(aCanton));
      return okCategory && okCity && okCanton;
    }));
  }, [category, city, canton, dataset]);


  const handleClear = useCallback(() => {
    setFiltered([])
    setCategory('');
    setCity('');
    setCanton('');
    setApplied({ category: '', city: '', canton: '' });
  }, []);

  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="mb-4 text-2xl text-gray-900 font-semibold">Search websites by</div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
          >
            <FiSearch />
            Search
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-3 rounded-full shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            Clear
          </button>
        </div>
        <div className="text-sm text-gray-700">
          <span className="font-medium">Matching records: </span>
          {filtered.length}
        </div>
      </div>

      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} filtered={filtered}/>
    </section>
  );
}
