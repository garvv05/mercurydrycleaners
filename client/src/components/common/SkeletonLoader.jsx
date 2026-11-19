import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 3 }) {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse space-y-4">
            <div className="h-48 bg-slate-200 rounded-xl w-full" />
            <div className="h-5 bg-slate-200 rounded-md w-3/4" />
            <div className="space-y-2">
              <div className="h-3.5 bg-slate-200 rounded-md w-full" />
              <div className="h-3.5 bg-slate-200 rounded-md w-5/6" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 bg-slate-200 rounded-md w-24" />
              <div className="h-8 bg-slate-200 rounded-lg w-28" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white rounded-xl p-4 border border-slate-100 animate-pulse space-y-3">
        <div className="h-8 bg-slate-200 rounded-md w-full" />
        {items.map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded-md w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="animate-pulse space-y-3">
      <div className="h-6 bg-slate-200 rounded-md w-1/3" />
      <div className="h-4 bg-slate-200 rounded-md w-2/3" />
    </div>
  );
}
