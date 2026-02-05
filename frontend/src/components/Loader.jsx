import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <div className="relative flex items-center justify-center">
                {/* Outer Ring */}
                <div className="w-16 h-16 border-2 border-white/20 rounded-full animate-spin-slow"></div>

                {/* Inner Bars (Pause-like icon) */}
                <div className="absolute flex gap-1.5 h-6">
                    <div className="w-1.5 bg-white rounded-full animate-pulse"></div>
                    <div className="w-1.5 bg-white rounded-full animate-pulse delay-75"></div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
