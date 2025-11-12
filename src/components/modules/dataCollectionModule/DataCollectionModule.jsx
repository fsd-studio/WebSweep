"use client"

import { Suspense, useCallback, useEffect, useId, useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import dataset from '/public/data/dataset-websweep.json';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useDataCollection } from 'context/DataCollectionContext';
import ListItem from './ListItem';

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

function Pagination({ filtered = [], currentPage, setCurrentPage }) {
  const limit = 5;
  const totalPages = Math.ceil(filtered.length / limit);
  const start = (currentPage - 1) * limit;
  const currentPosts = filtered.slice(start, start + limit);

  return (
    <>
    <div className="mt-6 grid grid-cols-1 gap-4">
      <div className='flex justify-between font-semibold'>
        <div className='w-80 ms-4'>Title</div>

        <div className='flex font-normal'>
          <div className='w-20'>Geo</div>
          <div className='w-20'>Seo</div>
          <div className='w-20'>Performance</div>
        </div>

        <div className='me-11.5'>site</div>
      </div>
      {currentPosts.length === 0 ? (
        <div className="text-sm text-gray-500">No results found.</div> 
      ) : (
        currentPosts.map((item) => {
          const href = item.website ? (/^https?:\/\//i.test(item.website) ? item.website : `https://${item.website}`) : undefined;
          return (
              <ListItem key={item.id} href={href} item={item}/>
          );
        })
      )}
      </div>
      <div>
        <div className='flex items-center mt-6'>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className='rounded-2xl border flex items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 justify-center border-gray-200 bg-white px-3 py-2 shadow-sm'
          >
            <MdKeyboardArrowLeft className='mt-0.5 me-1'/> Prev 
          </button>
          <p style={{ margin: "0 10px" }}>
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className='rounded-2xl border flex items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 justify-center border-gray-200 bg-white px-3 py-2 shadow-sm'
            >
            Next <MdKeyboardArrowRight  className='mt-0.5 ms-1'/> 
          </button>
        </div>
      </div>
    </>

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

  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [canton, setCanton] = useState('');
  const [applied, setApplied] = useState({ category: '', city: '', canton: '' });

  const [currentPage, setCurrentPage] = useState(1);
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
