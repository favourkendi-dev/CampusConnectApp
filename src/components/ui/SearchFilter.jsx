import { useState } from 'react';
import { SlidersHorizontal, X, Check } from 'lucide-react';

const SearchFilter = ({ filters, activeFilters, onFilterChange, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeCount > 0
            ? 'bg-primary-100 text-primary-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {activeCount > 0 && (
              <button
                onClick={onClear}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {filter.label}
                </label>
                
                {filter.type === 'select' && (
                  <select
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => onFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All</option>
                    {filter.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                )}

                {filter.type === 'checkbox' && (
                  <div className="space-y-2">
                    {filter.options.map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          activeFilters[filter.key]?.includes(opt.value)
                            ? 'bg-primary-600 border-primary-600'
                            : 'border-gray-300'
                        }`}>
                          {activeFilters[filter.key]?.includes(opt.value) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={activeFilters[filter.key]?.includes(opt.value) || false}
                          onChange={(e) => {
                            const current = activeFilters[filter.key] || [];
                            const updated = e.target.checked
                              ? [...current, opt.value]
                              : current.filter((v) => v !== opt.value);
                            onFilterChange(filter.key, updated);
                          }}
                        />
                        <span className="text-sm text-gray-600">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                )}

                {filter.type === 'range' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={activeFilters[filter.key]?.min || ''}
                      onChange={(e) => onFilterChange(filter.key, {
                        ...activeFilters[filter.key],
                        min: e.target.value,
                      })}
                      className="w-20 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={activeFilters[filter.key]?.max || ''}
                      onChange={(e) => onFilterChange(filter.key, {
                        ...activeFilters[filter.key],
                        max: e.target.value,
                      })}
                      className="w-20 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;