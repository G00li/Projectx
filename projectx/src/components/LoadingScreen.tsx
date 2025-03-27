"use client";

const LoadingScreen = ({ message = "Carregando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="relative w-24 h-24">
        {/* Logo animado */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0,0,256,256" 
          className="w-full h-full"
        >
          <g 
            fill="none" 
            stroke="#cdcaca" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="animate-draw"
          >
            <path d="M8.70117,3.85742c-0.61329,-0.02179 -1.23434,0.18747 -1.71289,0.63281c-0.00131,0.0013 -0.00261,0.0026 -0.00391,0.00391l-4.10742,3.86133c-0.9581,0.89161 -1.01218,2.41942 -0.12109,3.37695c0.00194,0.00261 0.00389,0.00522 0.00586,0.00781l10.76758,11.37305c0.27335,0.28756 0.69084,0.38635 1.06407,0.25178c0.37323,-0.13457 0.63163,-0.47704 0.65858,-0.87288l0.15039,-2.19531l2.0293,0.19141c0.35047,0.0332 0.69258,-0.1203 0.90078,-0.40417c0.2082,-0.28387 0.25182,-0.6563 0.11484,-0.9806l-0.94336,-2.24023l2.34375,0.35938c0.42245,0.06516 0.83961,-0.14536 1.03814,-0.52389c0.19853,-0.37854 0.13455,-0.84141 -0.15923,-1.15189l-10.35937,-10.9375c-0.44594,-0.47828 -1.05273,-0.73016 -1.66602,-0.75195z" transform="scale(5.12,5.12)" />
            <path d="M35.67969,5c-0.66925,0 -1.30708,0.28615 -1.75586,0.7793l-10.45703,11.48438c-0.22916,0.25175 -0.31453,0.60277 -0.22656,0.93164l-0.16602,-0.49414l-5.85547,6.46289c-0.73525,0.81066 -0.73308,2.06052 0.00391,2.86914c0.00065,0.00065 0.0013,0.0013 0.00195,0.00195l9.7793,10.64258c0.01695,0.01757 0.03454,0.0345 0.05273,0.05078l6.87109,7.4668c0.0013,0.00131 0.0026,0.00261 0.00391,0.00391c0.45086,0.48343 1.08398,0.76172 1.74805,0.76172h9.9668c0.55256,0 1.04415,-0.36245 1.24023,-0.8125c0.19583,-0.44947 0.12607,-1.0587 -0.25,-1.46289v-0.00195l-16.75,-18l16.75586,-18.40039v-0.00195c0.74387,-0.81721 0.12554,-2.28125 -0.99609,-2.28125z" transform="scale(5.12,5.12)" />
          </g>
        </svg>
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