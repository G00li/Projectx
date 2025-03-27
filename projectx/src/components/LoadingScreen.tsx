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
            <path d="M8.63281,5.84375c0.09741,0.00372 0.1937,0.04743 0.27148,0.13086c0.0013,0.00196 0.0026,0.00391 0.00391,0.00586l8.35742,8.82227l-1.22461,-0.1875c-0.35768,-0.05493 -0.71713,0.08764 -0.93992,0.3728c-0.22279,0.28517 -0.27415,0.66844 -0.1343,1.0022l0.98828,2.34961l-1.38672,-0.13086c-0.26858,-0.02536 -0.53602,0.05887 -0.7416,0.23356c-0.20558,0.17469 -0.33187,0.42502 -0.3502,0.69418l-0.06445,0.94531l-9.19141,-9.71094c-0.15492,-0.16647 -0.14832,-0.39835 0.01758,-0.55273c0.0013,-0.00065 0.00261,-0.0013 0.00391,-0.00195l4.10938,-3.86328h0.00195c0.08338,-0.07681 0.18189,-0.11309 0.2793,-0.10937z" transform="scale(5.12,5.12)" />
            <path d="M28.5957,27.22852l15.56836,16.73242h-8.48437c-0.10793,0 -0.21001,-0.04443 -0.28516,-0.125l-6.74219,-7.32617c-0.55807,-2.30049 -0.91781,-4.32547 -0.88867,-5.98242c0.02342,-1.33167 0.27488,-2.40059 0.83203,-3.29883z" transform="scale(5.12,5.12)" />
            <path d="M14.95508,29.79688c-0.03387,-0.00107 -0.06776,-0.00042 -0.10156,0.00195l-2.47266,0.15234c-0.25655,0.01584 -0.49715,0.12984 -0.67187,0.31836l-8.95508,9.66016h0.00195c-0.89068,0.9571 -0.83546,2.48508 0.12109,3.37695c0.00452,0.00395 0.00908,0.00785 0.01367,0.01172l4.25391,3.81836h0.00195c0.95719,0.88929 2.48357,0.83693 3.375,-0.11914c0.00065,-0.00065 0.0013,-0.0013 0.00195,-0.00195l9.44531,-10.18555c0.1378,-0.14894 0.22703,-0.33626 0.25586,-0.53711l0.37305,-2.58984c0.04813,-0.33271 -0.07411,-0.66734 -0.32537,-0.89068c-0.25126,-0.22334 -0.59791,-0.30551 -0.92268,-0.2187l-3.3457,0.89453l-0.08789,-2.72461c-0.01708,-0.52446 -0.4366,-0.94653 -0.96094,-0.9668z" transform="scale(5.12,5.12)" />
            <path d="M13.94922,31.85938l0.0957,2.95313c0.00994,0.30493 0.15853,0.58864 0.40351,0.77047c0.24498,0.18183 0.55956,0.2419 0.85431,0.16312l3.09961,-0.82812l-0.11328,0.78125l-9.22852,9.95313c-0.15612,0.16745 -0.38583,0.17681 -0.55273,0.02148c-0.00451,-0.0046 -0.00907,-0.00916 -0.01367,-0.01367l-4.25391,-3.81641v-0.00195c-0.16573,-0.15604 -0.1743,-0.38447 -0.01953,-0.55078c0,-0.00065 0,-0.0013 0,-0.00195l8.68164,-9.36523z" transform="scale(5.12,5.12)" />
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