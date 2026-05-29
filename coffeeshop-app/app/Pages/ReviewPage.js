'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function ReviewPage() {
  const ratingsData = [
    { label: '5', count: '0', percentage: '0%' },
    { label: '4', count: '0', percentage: '0%' },
    { label: '3', count: '0', percentage: '0%' },
    { label: '2', count: '0', percentage: '0%' },
    { label: '1', count: '0', percentage: '0%' },
  ];

  const [formData, setFormData] = useState({
    rating: 0,
    name: '',
    email: '',
    review: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.rating === 0) return alert('Please select a star rating!');

    alert('Thank you for your review!');
    setFormData({ rating: 0, name: '', email: '', review: '' });
  };

  return (
    <div className="min-h-screen bg-[#1a0f0a] text-[#f5e6d3] px-6 py-12 md:py-20 font-sans relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(180,100,20,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 items-center">
          
          <div className="md:col-span-7 space-y-3.5">
            {ratingsData.map((row) => (
              <div key={row.label} className="flex items-center text-xs font-bold tracking-widest text-[#f5e6d3]/70">
                <span className="w-14">{row.label}</span>
                <Star className="w-4 h-4 text-stone-700 mx-2 flex-shrink-0" />
                <div className="flex-1 bg-[#140b07] h-2 rounded-full mx-4 border border-white/[0.03] overflow-hidden">
                  <div 
                    className="bg-[#e8a44a] h-full rounded-full transition-all duration-300" 
                    style={{ width: row.percentage }}
                  />
                </div>
                <span className="w-10 text-right font-medium text-[#f5e6d3]/50">{row.count}</span>
              </div>
            ))}
          </div>

          <div className="md:col-span-5 bg-white/[0.02] border border-[#b46414]/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm">
            <h1 className="text-6xl font-black text-stone-700 mb-1 tracking-tight">0.0</h1>
            <div className="flex space-x-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-stone-700" />
              ))}
            </div>
            <p className="text-[#f5e6d3]/50 text-xs font-bold tracking-widest uppercase">0 Ratings</p>
          </div>

        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[#f5e6d3] uppercase tracking-wider mb-6 text-center md:text-left">Add a Review</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-xs font-bold text-[#f5e6d3]/70 tracking-widest uppercase mb-2">
                Add Your Rating <span className="text-red-400">*</span>
              </label>
              <div className="flex space-x-1.5">
                {[...Array(5)].map((_, i) => {
                  const ratingValue = i + 1;
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setFormData({ ...formData, rating: ratingValue })}
                      onMouseEnter={() => setHoveredRating(ratingValue)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transition-transform active:scale-90"
                    >
                      <Star 
                        className={`w-6 h-6 transition-colors ${
                          ratingValue <= (hoveredRating || formData.rating)
                            ? 'fill-[#e8a44a] text-[#e8a44a]'
                            : 'text-stone-700'
                        }`} 
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#f5e6d3]/70 tracking-widest uppercase mb-1.5">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Juan Dela Cruz"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#140b07] px-4 py-3 text-sm border border-[#b46414]/20 rounded-lg text-[#f5e6d3] focus:outline-none focus:ring-1 focus:ring-[#e8a44a] focus:border-[#e8a44a] placeholder-stone-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#f5e6d3]/70 tracking-widest uppercase mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="JuanDelaCruz@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#140b07] px-4 py-3 text-sm border border-[#b46414]/20 rounded-lg text-[#f5e6d3] focus:outline-none focus:ring-1 focus:ring-[#e8a44a] focus:border-[#e8a44a] placeholder-stone-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#f5e6d3]/70 tracking-widest uppercase mb-1.5">
                Write Your Review <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Write here..."
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                className="w-full bg-[#140b07] px-4 py-3 text-sm border border-[#b46414]/20 rounded-lg text-[#f5e6d3] focus:outline-none focus:ring-1 focus:ring-[#e8a44a] focus:border-[#e8a44a] placeholder-stone-600 resize-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-transparent text-[#e8a44a] border border-[#e8a44a] hover:bg-[#e8a44a] hover:text-[#1a0f0a] font-bold py-3.5 rounded-lg transition-all duration-200 text-xs tracking-widest uppercase shadow-sm active:translate-y-[1px]"
            >
              Submit Review
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}