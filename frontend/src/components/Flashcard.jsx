import React from 'react';

export default function Flashcard({ question, answer, isFlipped, onFlip }) {
  return (
    /* 1. We lock the outer container to a stable height and add a margin-bottom. 
          We use inline style for perspective because Tailwind doesn't support it natively. */
    <div 
      className="w-full max-w-xl mx-auto h-72 mb-12 cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={onFlip}
    >
      {/* 2. Transition container. We control the 3D space with transformStyle and the rotation 
            dynamically based on the isFlipped prop. */}
      <div 
        className="relative w-full h-full duration-500 transition-transform"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        
        {/* FRONT SIDE (Question) */}
        {/* 3. We apply backfaceVisibility: hidden so this side completely hides when turned away. */}
        <div 
          className="absolute inset-0 border-4 border-black bg-white p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-center">
            <span className="text-xs font-bold text-purple-600 tracking-widest uppercase block mb-3">Question ❓</span>
            <div className="overflow-y-auto max-h-40 flex items-center justify-center">
              <p className="text-lg font-bold text-slate-800 leading-relaxed text-center">
                {question}
              </p>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 font-medium">Click to reveal answer</p>
        </div>

        {/* BACK SIDE (Answer) */}
        {/* 4. We initialize this card already rotated by 180 degrees so it reveals itself 
              correctly when the parent container flips. */}
        <div 
          className="absolute inset-0 border-4 border-black bg-purple-50 p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="text-center">
            <span className="text-xs font-bold text-purple-700 tracking-widest uppercase block mb-3">Answer ✨</span>
            <div className="overflow-y-auto max-h-40 flex items-center justify-center">
              <p className="text-sm md:text-base font-semibold text-purple-950 leading-relaxed text-center">
                {answer}
              </p>
            </div>
          </div>
          <p className="text-center text-xs text-purple-400 font-medium">Click to flip back</p>
        </div>

      </div>
    </div>
  );
}