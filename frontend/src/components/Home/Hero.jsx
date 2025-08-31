import React from 'react';
import { useNavigate } from 'react-router-dom';
 
const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-gray-50 to-white flex flex-col items-center px-4 relative overflow-hidden'>
      {/* Wave Background Elements */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-indigo-100/30 to-blue-100/30 rounded-full blur-3xl'></div>
      </div>

      {/* Content Container */}
      <div className='relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center'>
        {/* Main Title */}
        <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-tight leading-tight text-center text-gray-900 mb-6 mt-5 md:mt-16'>
          All Financial Under <br/> Control With Your Hand
        </h1>

        {/* Description */}
        <p className='text-sm sm:text-lg md:text-xl text-gray-600 text-center max-w-2xl mb-5 leading-relaxed'>
          Manage your money anywhere with our platform. Banking on-the-go has never been easier with our mobile app.
        </p>

        {/* Buttons */}
        <div className='relative z-1 flex flex-col sm:flex-row gap-4 mb-12 w-full max-w-md sm:max-w-none justify-center'>
          <button
           onClick={() => navigate('/login')}
          className='bg-white text-gray-900 shadow-lg hover:shadow-xl rounded-full px-8 py-4 text-lg font-semibold border border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1'>
            Get Started
          </button>
          <button
          onClick={() => navigate('/signup')}
          className='bg-[#6265B8] text-white shadow-lg hover:shadow-xl rounded-full px-8 py-4 text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1'>
            Join Now
          </button>
        </div>

        {/* Mockup Section with Wave Design */}
        <div className='w-full flex-1 relative flex items-center justify-center min-h-[400px] md:min-h-[500px]'>
          {/* Wave Background */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='relative'>
              {/* Outer Wave */}
              <div className='w-80 h-80 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full bg-gradient-to-br from-indigo-100/40 to-purple-100/40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse'></div>
              
              {/* Middle Wave */}
              <div className='w-64 h-64 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px] rounded-full bg-gradient-to-br from-indigo-200/30 to-purple-200/30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping'></div>
              
              {/* Inner Wave */}
              <div className='w-48 h-48 sm:w-64 sm:h-64 md:w-[300px] md:h-[300px] lg:w-[360px] lg:h-[360px] rounded-full bg-gradient-to-br from-indigo-300/20 to-purple-300/20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'></div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className='relative z-20 flex items-center justify-center'>
            {/* Phone Frame */}
            <div className='relative'>
              <div className='w-48 h-96 sm:w-56 sm:h-[450px] md:w-64 md:h-[500px] lg:w-72 lg:h-[550px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl'>
                {/* Screen */}
                <div className='w-full h-full bg-white rounded-[2.5rem] relative overflow-hidden'>
                  {/* Status Bar */}
                  <div className='h-6 bg-gray-50 flex items-center justify-between px-6 text-xs text-gray-700'>
                    <span>9:41</span>
                    <div className='flex gap-1'>
                      <div className='w-4 h-2 bg-green-500 rounded-sm'></div>
                      <div className='w-4 h-2 bg-gray-300 rounded-sm'></div>
                      <div className='w-4 h-2 bg-gray-300 rounded-sm'></div>
                    </div>
                  </div>
                  
                  {/* App Content */}
                  <div className='p-4 h-full bg-gradient-to-br from-indigo-50 to-purple-50'>
                    <div className='text-center mb-6'>
                      <h3 className='text-lg font-bold text-gray-900 mb-2'>FinanceApp</h3>
                      <div className='text-2xl font-bold text-indigo-600'>$12,450.00</div>
                      <div className='text-sm text-gray-500'>Available Balance</div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className='grid grid-cols-2 gap-3 mb-6'>
                      <div className='bg-white rounded-xl p-3 shadow-sm'>
                        <div className='w-8 h-8 bg-indigo-100 rounded-lg mb-2'></div>
                        <div className='text-xs font-medium text-gray-700'>Send</div>
                      </div>
                      <div className='bg-white rounded-xl p-3 shadow-sm'>
                        <div className='w-8 h-8 bg-purple-100 rounded-lg mb-2'></div>
                        <div className='text-xs font-medium text-gray-700'>Receive</div>
                      </div>
                    </div>
                    
                    {/* Transaction List */}
                    <div className='space-y-3'>
                      <div className='bg-white rounded-xl p-3 shadow-sm flex justify-between items-center'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>Coffee Shop</div>
                          <div className='text-xs text-gray-500'>Today</div>
                        </div>
                        <div className='text-sm font-bold text-red-500'>-$4.50</div>
                      </div>
                      <div className='bg-white rounded-xl p-3 shadow-sm flex justify-between items-center'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>Salary</div>
                          <div className='text-xs text-gray-500'>Yesterday</div>
                        </div>
                        <div className='text-sm font-bold text-green-500'>+$3,200.00</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Phone Reflection */}
              <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-48 h-24 sm:w-56 sm:h-28 md:w-64 md:h-32 lg:w-72 lg:h-36 bg-gradient-to-t from-gray-200/20 to-transparent rounded-b-[3rem] blur-sm opacity-30'></div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className='absolute top-10 left-10 w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full animate-bounce hidden md:block'></div>
          <div className='absolute bottom-20 right-10 w-12 h-12 bg-gradient-to-br from-green-300 to-teal-300 rounded-full animate-pulse hidden md:block'></div>
          <div className='absolute top-32 right-20 w-8 h-8 bg-gradient-to-br from-pink-300 to-red-300 rounded-full animate-ping hidden lg:block'></div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className='absolute bottom-0 left-0 right-0'>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className='relative block w-full h-12 sm:h-16 md:h-20'>
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className='fill-indigo-100'></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className='fill-indigo-200'></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className='fill-indigo-300'></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
