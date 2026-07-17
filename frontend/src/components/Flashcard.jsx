import React from 'react';

export default function Flashcard({ 
  question, 
  answer, 
  isFlipped, 
  onFlip, 
  isEditing = false, 
  onUpdateField 
}) {
  
  // Stops the card from flipping over when typing inside an input box
  const handleInputContainerClick = (e) => {
    e.stopPropagation();
  };

  return (
    /* 1. Perspective container locked to a stable height */
    <div 
      className="w-full max-w-xl mx-auto h-72 mb-12 cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={!isEditing ? onFlip : undefined}
    >
      {/* 2. Transition container tracking rotation state */}
      <div 
        className="relative w-full h-full duration-500 transition-transform"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        
        {/* FRONT SIDE (Question) */}
        <div 
          className="absolute inset-0 border-4 border-black bg-white p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-center h-full flex flex-col">
            <span className="text-xs font-bold text-purple-600 tracking-widest uppercase block mb-3">Question ❓</span>
            <div className="overflow-y-auto flex-1 flex items-center justify-center w-full" onClick={handleInputContainerClick}>
              {isEditing ? (
                <textarea
                  className="nes-textarea w-full text-sm font-semibold p-2 border-2 border-black"
                  value={question}
                  rows="4"
                  onChange={(e) => onUpdateField('question', e.target.value)}
                />
              ) : (
                <p className="text-lg font-bold text-slate-800 leading-relaxed text-center">
                  {question}
                </p>
              )}
            </div>
          </div>
          {!isEditing && <p className="text-center text-xs text-slate-400 font-medium mt-2">Click to reveal answer</p>}
        </div>

        {/* BACK SIDE (Answer) */}
        <div 
          className="absolute inset-0 border-4 border-black bg-purple-50 p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="text-center h-full flex flex-col">
            <span className="text-xs font-bold text-purple-700 tracking-widest uppercase block mb-3">Answer ✨</span>
            <div className="overflow-y-auto flex-1 flex items-center justify-center w-full" onClick={handleInputContainerClick}>
              {isEditing ? (
                <textarea
                  className="nes-textarea w-full text-sm font-semibold p-2 border-2 border-black"
                  value={answer}
                  rows="4"
                  onChange={(e) => onUpdateField('answer', e.target.value)}
                />
              ) : (
                <p className="text-sm md:text-base font-semibold text-purple-950 leading-relaxed text-center">
                  {answer}
                </p>
              )}
            </div>
          </div>
          {!isEditing && <p className="text-center text-xs text-purple-400 font-medium mt-2">Click to flip back</p>}
        </div>

      </div>
    </div>
  );
}