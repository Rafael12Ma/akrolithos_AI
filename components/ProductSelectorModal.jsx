"use client";

import { useEffect, useState } from "react";

export default function ProductSelectorModal({ surface, onClose, onSelect }) {
  const limit = 24;

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
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

  useEffect(() => {
    setPage(1);
  }, [collection, color, finish, indoor, surface]);

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
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-neutral-950 rounded-2xl md:rounded-3xl w-full max-w-7xl h-[100dvh] md:h-[94vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 border-b border-neutral-800">
          <h2 className="text-lg md:text-xl font-semibold text-white">
            Select {surface === "wall" ? "Wall" : "Floor"} Stone
          </h2>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* SEARCH */}
        <div className="px-4 sm:px-6 md:px-10 py-4 border-b border-neutral-800">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="Search stone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 md:py-3 pl-11 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
              />

              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M16 10a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <p className="text-sm text-neutral-500">
              {displayedProducts.length} products
            </p>
          </div>
        </div>

        {/* MOBILE FILTER BUTTON */}
        <div className="md:hidden px-4 pb-4 pt-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full py-3 rounded-xl border border-neutral-700 text-sm text-neutral-300"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          {" "}
          {/* FILTERS */}
          <div
            className={`
            ${showFilters ? "block" : "hidden"}
            md:block
            w-full md:w-[300px]
            border-b md:border-b-0 md:border-r border-neutral-800
            p-4 md:p-6
            overflow-y-auto
            shrink-0
          `}
          >
            <div className="space-y-8">
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

              {(collection || color || finish || indoor) && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-neutral-400 hover:text-white"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
          {/* PRODUCT GRID */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 pb-24 md:pb-10">
            {loading ? (
              <p className="text-neutral-400">Loading products...</p>
            ) : displayedProducts.length === 0 ? (
              <div className="text-center text-neutral-400 mt-16">
                No products match your filters.
              </div>
            ) : (
              <div
                className="
                grid
                grid-cols-2
                sm:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
                gap-4 sm:gap-6 md:gap-8
              "
              >
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

                    <p className="mt-3 text-center text-sm md:text-base font-medium text-neutral-200 leading-tight line-clamp-2">
                      {p.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PAGINATION */}
        <div className="px-4 sm:px-6 md:px-10 py-4 md:py-6 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between gap-3 sticky bottom-0">
          {" "}
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

/* FILTER COMPONENT */

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
            className={`px-4 py-2.5 rounded-full text-sm border transition ${
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
