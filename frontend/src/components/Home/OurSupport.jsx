import React from "react";

const features = [
  {
    title: "Customized Strategies",
    description:
      "We understand that every business is unique. Our tailored strategies are designed to meet specific goals needs.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
        className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 
          2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 
          1.13l-2.685.8.8-2.685a4.5 4.5 0 0 
          1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
      </svg>
    ),
  },
  {
    title: "Proven Results",
    description:
      "We have a track record of delivering measurable results, helping businesses grow their online presence.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
        className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 
          12c0 1.01-.195 1.98-.546 2.897a15.96 
          15.96 0 0 1-2.612 3.165 15.96 15.96 0 
          1-3.165 2.612c-.917.351-1.887.546-2.897.546s-1.98-.195-2.897-.546a15.96 
          15.96 0 0 1-3.165-2.612 15.96 15.96 
          0 0 1-2.612-3.165C3.195 13.98 3 13.01 
          3 12s.195-1.98.546-2.897a15.96 15.96 
          0 0 1 2.612-3.165 15.96 15.96 0 0 
          1 3.165-2.612C10.02 3.195 10.99 3 
          12 3s1.98.195 2.897.546a15.96 15.96 
          0 0 1 3.165 2.612 15.96 15.96 0 0 
          1 2.612 3.165c.351.917.546 1.887.546 2.897Z" />
      </svg>
    ),
  },
  {
    title: "Transparent Reporting",
    description:
      "We believe in transparency and keep you informed with regular reports and insights into your campaign performance.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
        className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 
          0 0 0-3.375-3.375h-1.5A1.125 1.125 
          0 0 1 13.5 7.125v-1.5a3.375 3.375 
          0 0 0-3.375-3.375H8.25m.75 12 
          3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 
          0-1.125.504-1.125 1.125v17.25c0 
          .621.504 1.125 1.125 
          1.125h12.75c.621 0 1.125-.504 
          1.125-1.125V11.25a9 9 0 0 
          0-9-9Z" />
      </svg>
    ),
  },
  {
    title: "Client-Centric Approach",
    description:
      "Your success is priority. We work closely with you to understand your business and deliver solutions real impact.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
        className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 
          0 3.75 3.75 0 0 1 7.5 0ZM4.501 
          20.118a7.5 7.5 0 0 1 14.998 
          0A17.933 17.933 0 0 1 12 21.75c-2.676 
          0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    title: "Our team of experts leverages",
    description:
      "Our team of experts leverages the latest tools and techniques to deliver results that matter and techniques to deliver.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
        className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 
          19.644v-4.992m0 0h4.992m-4.993 
          0 3.181 3.181m0 0 1.58-1.58M8.25 
          6.75h9.75m-9.75 3h9.75m-9.75 
          3h9.75M9 16.5h.008v.008H9v-.008Zm.375 
          0a.375.375 0 1 1-.75 0 .375.375 0 
          0 1 .75 0Z" />
      </svg>
    ),
  },
];

const OurSupport = () => {
  return (
    <div className="bg-[#FCFBFC] py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-gray-300">
        
        <div className="p-6 border-b border-gray-300">
          <h2 className="text-4xl md:text-5xl font-normal text-gray-900 leading-tight mb-5">
            We support <br /> your every step
          </h2>
          <p className="text-gray-600 text-md max-w-md">
            Find more than just a house, find your sanctuary. Explore our curated listings.
          </p>
        </div>

        {features.map((item, i) => (
          <div
            key={i}
            className={`text-center p-6 ${
              i % 3 !== 2 ? "border-l" : ""
            } ${i < 3 ? "border-b" : ""} border-gray-300 bg-white`}
          >
            <div className="w-16 h-16 rounded-full bg-[#6366B7] flex items-center justify-center mx-auto mb-6">
              {item.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {item.title}
            </h3>
            <p className="text-gray-600 text-base">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurSupport;
