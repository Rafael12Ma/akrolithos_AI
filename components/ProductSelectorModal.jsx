"use client";

import { useEffect, useState } from "react";

export default function ProductSelectorModal({ surface, onClose, onSelect }) {
  const limit = 24;

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [collection, setCollection] = useState("");
  const [color, setColor] = useState("");
  const [finish, setFinish] = useState("");
  const [indoor, setIndoor] = useState("");

  const [facets, setFacets] = useState({
    collections: [],
    colors: [],
    finishes: [],
    indoor: [],
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [collection, color, finish, indoor, surface]);

  // Fetch products
  useEffect(() => {
    fetchProducts(page);
  }, [page, collection, color, finish, indoor, surface]);

  const fetchProducts = async (pageNumber) => {
    setLoading(true);

    const params = new URLSearchParams({
      surface,
      page: pageNumber,
      limit,
    });

    if (collection) params.append("collection", collection);
    if (color) params.append("color", color);
    if (finish) params.append("finish", finish);
    if (indoor) params.append("indoor", indoor);

    const res = await fetch(`/api/products?${params}`);
    const response = await res.json();

    setProducts(response.data || []);
    setTotal(response.total || 0);
    setTotalPages(response.totalPages || 1);
    setFacets(response.facets || {});

    setLoading(false);
  };

  const resetFilters = () => {
    setCollection("");
    setColor("");
    setFinish("");
    setIndoor("");
  };

  const displayedProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-neutral-950 rounded-3xl w-full max-w-7xl h-[94vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="px-10 pt-8 pb-6 border-b border-neutral-800">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Select {surface} surface
              </h2>
              <p className="text-neutral-400 text-sm mt-1">{total} results</p>
            </div>

            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-white text-xl transition"
            >
              ✕
            </button>
          </div>

          {/* SEARCH */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Search product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-neutral-600 transition text-sm"
            />
          </div>

          {/* ACTIVE FILTERS */}
          {(collection || color || finish || indoor) && (
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="text-neutral-400 text-sm">Active filters:</span>

              {collection && (
                <FilterTag
                  label={collection}
                  onClick={() => setCollection("")}
                />
              )}
              {color && (
                <FilterTag label={color} onClick={() => setColor("")} />
              )}
              {finish && (
                <FilterTag label={finish} onClick={() => setFinish("")} />
              )}
              {indoor && (
                <FilterTag label={indoor} onClick={() => setIndoor("")} />
              )}

              <button
                onClick={resetFilters}
                className="text-xs text-neutral-400 underline ml-3"
              >
                Reset all
              </button>
            </div>
          )}

          {/* FILTER CHIPS */}
          <div className="mt-4 max-h-[100px] overflow-y-auto pr-2 space-y-3">
            {" "}
            <FilterGroup
              title="Collection"
              options={facets.collections}
              active={collection}
              onSelect={setCollection}
            />
            <FilterGroup
              title="Color"
              options={facets.colors}
              active={color}
              onSelect={setColor}
            />
            <FilterGroup
              title="Finish"
              options={facets.finishes}
              active={finish}
              onSelect={setFinish}
            />
            <FilterGroup
              title="Indoor / Outdoor"
              options={facets.indoor}
              active={indoor}
              onSelect={setIndoor}
            />
          </div>
        </div>
        {/* PRODUCT GRID */}
        <div className="flex-1 overflow-y-auto px-10 py-8 min-h-0">
          {loading ? (
            <p className="text-neutral-400">Loading products...</p>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center text-neutral-400 mt-16">
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {displayedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelect(p)}
                  className="group cursor-pointer"
                >
                  <div className="rounded-2xl overflow-hidden bg-neutral-900 transition duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-black/40">
                    <div className="w-full aspect-[4/3] overflow-hidden">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-center text-base font-medium text-neutral-200 group-hover:text-white transition">
                    {p.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="px-10 py-6 border-t border-neutral-800 flex items-center justify-between">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="text-sm text-neutral-400 hover:text-white transition disabled:opacity-30"
          >
            Previous
          </button>

          <div className="text-sm text-neutral-400">
            Page <span className="text-white font-medium">{page}</span> of{" "}
            <span className="text-white font-medium">{totalPages}</span>
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="text-sm text-neutral-400 hover:text-white transition disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   SMALL REUSABLE COMPONENTS
---------------------------- */

function FilterGroup({ title, options = [], active, onSelect }) {
  if (!options || options.length === 0) return null;

  return (
    <div>
      <p className="text-sm text-neutral-400 mb-3">{title}</p>
      <div className="flex flex-wrap gap-3">
        {options.map((item) => (
          <button
            key={item}
            onClick={() => onSelect(active === item ? "" : item)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              active === item
                ? "bg-white text-black border-white"
                : "bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-neutral-500"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterTag({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded-full bg-white text-black text-xs"
    >
      {label} ✕
    </button>
  );
}
