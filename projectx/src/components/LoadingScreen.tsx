"use client";

const LoadingScreen = ({ message = "Carregando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="relative">
        {/* Círculo externo pulsante */}
        <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20 w-16 h-16" />
        
        {/* Círculo girando */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/30" />
          <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin" />
        </div>
      </div>

      {/* Texto com efeito de fade */}
      <div className="mt-8 text-center">
        <span className="text-lg text-gray-200 font-medium animate-pulse">
          {message}
        </span>
        <div className="mt-2 flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 