"use client";

import { useEffect, useState } from "react";

export default function ProductSelectorModal({ surface, onClose, onSelect }) {
  const [total, setTotal] = useState(0);
  const limit = 24;
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const totalPages = Math.ceil(total / limit);
  const [collection, setCollection] = useState("");
  const [color, setColor] = useState("");
  const [finish, setFinish] = useState("");
  const [indoor, setIndoor] = useState("");

  const fetchProducts = async (pageNumber = 1) => {
    setLoading(true);

    const params = new URLSearchParams({
      surface,
      page: pageNumber,
      limit: 24,
    });

    if (collection) params.append("collection", collection);
    if (color) params.append("color", color);
    if (finish) params.append("finish", finish);
    if (indoor) params.append("indoor", indoor);

    const res = await fetch(`/api/products?${params.toString()}`);

    const response = await res.json();
    setProducts(response.data || []);
    setTotal(response.total || 0);

    if (Array.isArray(response)) {
      setProducts(response);
    } else {
      setProducts(response.data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(page);
  }, [surface, page, collection, color, finish, indoor]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-neutral-950 rounded-3xl w-full max-w-7xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {" "}
        <div className="bg-neutral-950 rounded-3xl w-full max-w-7xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
          {/* HEADER */}
          <div className="px-10 pt-8 pb-6 border-b border-neutral-800">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Select {surface} surface
                </h2>
                <p className="text-neutral-400 text-sm mt-1">
                  Browse and choose the perfect stone texture
                </p>
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
                placeholder="Search by product name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-neutral-600 transition text-sm"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-6">
            <select
              onChange={(e) => setCollection(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm"
            >
              <option value="">All Collections</option>
              <option value="rock-face">Rock Face</option>
              <option value="slate">Slate</option>
            </select>

            <select
              onChange={(e) => setColor(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm"
            >
              <option value="">All Colors</option>
              <option value="beige">Beige</option>
              <option value="grey">Grey</option>
              <option value="white">White</option>
            </select>

            <select
              onChange={(e) => setFinish(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm"
            >
              <option value="">All Finishes</option>
              <option value="natural">Natural</option>
              <option value="brushed">Brushed</option>
            </select>

            <select
              onChange={(e) => setIndoor(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm"
            >
              <option value="">Indoor & Outdoor</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>
          {/* PRODUCT GRID */}
          <div className="flex-1 overflow-y-auto px-10 py-8">
            {loading ? (
              <p className="text-neutral-400">Loading products...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredProducts.map((p) => (
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
              <span className="text-white font-medium">{totalPages || 1}</span>
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="text-sm text-neutral-400 hover:text-white transition disabled:opacity-30"
            >
              Next
            </button>
          </div>
          {filteredProducts.length === 0 && (
            <p className="text-neutral-400 my-10 text-center">
              No products match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
