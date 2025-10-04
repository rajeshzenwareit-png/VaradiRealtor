// components/ListingsGrid.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchProperties } from '../services/api';
import ListingCard from './ListingCard';

// Try to map various fields/phrases into 'sale' | 'rent' | null
function normalizeItemType(item) {
  const candidates = [
    item?.type,
    item?.listingType,
    item?.status,
    item?.dealType,
    item?.category,
    item?.offerType,
    item?.propertyType,
    item?.purpose,          // sometimes "For Sale" / "For Rent"
  ]
    .filter(Boolean)
    .map(String);

  for (const raw of candidates) {
    const val = raw.toLowerCase();
    if (/\b(for\s*)?sale\b/.test(val) || /\bsell\b/.test(val) || /\bbuy\b/.test(val)) return 'sale';
    if (/\b(for\s*)?rent\b/.test(val) || /\brental\b/.test(val) || /\blease(d)?\b/.test(val)) return 'rent';
  }

  // boolean flags some schemas use
  if (item?.forSale === true || item?.isForSale === true) return 'sale';
  if (item?.forRent === true || item?.isForRent === true) return 'rent';

  return null; // unknown
}

export default function ListingsGrid(props){
  // existing navigation state
  const { state } = useLocation();
  const filtersFromState = state?.q ?? {};       // { type, location, price, pricerange, bedrooms, sort? }
  const filtersFromProps = props?.filters || {}; // optional { location, type, sort } from parent

  // Merge (props override state if both present)
  const filters = useMemo(() => ({ ...filtersFromState, ...filtersFromProps }), [filtersFromState, filtersFromProps]);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  console.log("Listingsgrid component:",listings)


  // Map UI sort → API sort param (backend optional)
  const apiParams = useMemo(() => {
    const p = { ...filters };
    if (filters.sort === 'latest')     p.sort = 'createdAt:desc';
    if (filters.sort === 'price-low')  p.sort = 'price:asc';
    if (filters.sort === 'price-high') p.sort = 'price:desc';
    if (p.type) p.type = String(p.type).toLowerCase(); // safe to send lowercase
    return p;
  }, [filters]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const data = await fetchProperties(apiParams); // backend can apply filters if supported
        if (alive) setListings(Array.isArray(data) ? data : []);
      } catch (e) {
        if (alive) setErr(e?.message || 'Failed to load properties');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [JSON.stringify(apiParams)]);

  // Client-side fallback filtering + sorting
  const visibleListings = useMemo(() => {
    let arr = [...listings];

    // 1) Location (case-insensitive substring). Only apply if user typed at least 2 chars.
    if (filters.location && String(filters.location).trim().length >= 2) {
      const q = String(filters.location).toLowerCase();
      arr = arr.filter(it => String(it.location || '').toLowerCase().includes(q));
    }

    // 2) Type (sale/rent). NON-STRICT:
    //    - If we can positively identify item type, we filter.
    //    - If we cannot identify, we keep the item (avoid empty results due to schema differences).
    if (filters.type) {
      const want = String(filters.type).toLowerCase();
      arr = arr.filter(it => {
        const norm = normalizeItemType(it);
        return norm === null ? true : norm === want;
      });
    }

    // 3) Sort fallback (if server didn’t sort)
    if (filters.sort === 'price-low') {
      arr.sort((a, b) => (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY));
    } else if (filters.sort === 'price-high') {
      arr.sort((a, b) => (b.price ?? Number.NEGATIVE_INFINITY) - (a.price ?? Number.NEGATIVE_INFINITY));
    } else if (filters.sort === 'latest') {
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return arr;
  }, [listings, filters.location, filters.type, filters.sort]);

  if (loading) return <p>Loading properties…</p>;
  if (err) return <p className="text-red-600">{err}</p>;
  if (!visibleListings.length) {
    // tiny debug hint for you while integrating; you can remove this block later
    console.debug('Filters used:', filters);
    console.debug('Got listings (count):', listings.length, listings.slice(0, 3));
    return <p className="text-gray-600">No properties match your filters.</p>;
  }

  return (
    <section className="mt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleListings.map(p => <ListingCard key={p._id || p.id} property={p} />)}
        </div>
    </section>
  );
}
