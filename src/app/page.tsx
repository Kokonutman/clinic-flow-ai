'use client';

import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const reviews = [
  { 
    id: 1, 
    author: "selam sisay", 
    rating: 1, 
    date: "a year ago",
    image: "https://lh3.googleusercontent.com/a-/ALV-UjUA63melSf_uTlBzK73-sj0ZRFGj-7bEReG4GIxuzhmt0JS0Y3k=w90-h90-p-rp-mo-br100",
    text: "Whether it was to book an appointment, inquire about test results, or seek clarification on a medical concern, I was met with endless ringing and no response. This lack of communication made me feel neglected as a patient in need of attention and support." 
  },
  { 
    id: 2, 
    author: "Mckanna Ragland", 
    rating: 1, 
    date: "a year ago",
    image: "https://lh3.googleusercontent.com/a/ACg8ocIuomn3r0UR87S8nHtUUeGQjVm9RYbBCJpn4uJtIFZZeYFX7w=w90-h90-p-rp-mo-br100",
    text: "I was calling them for COVID tests and the first time she answer but then left me on hold for 30 minutes. What could you possibly be doing? I just want a covid test. I've called at least 20 times and always go straight to voicemail and I can't even leave a voicemail because their inbox is full." 
  },
  { 
    id: 3, 
    author: "Elyssa Sanderson", 
    rating: 1, 
    date: "5 years ago",
    image: "https://lh3.googleusercontent.com/a/ACg8ocKSOkiaMuf5mueRM6lSdqtvWpiFOpq1BjGsanBlFQ_tHd1qWW4=w90-h90-p-rp-mo-ba2-br100",
    text: "My main issue is I need my medical records and can't get a hold of nobody. I've been calling for the past 3 weeks and had to find out from the hospital y'all are gone. Because I can't get access to my files it's delaying my treatment here at home." 
  },
  { 
    id: 4, 
    author: "Taniayah Dorsett", 
    rating: 1, 
    date: "3 years ago",
    image: "https://lh3.googleusercontent.com/a-/ALV-UjWQEDDyO2dgL5VjKPofqfokffQdFq7DjsnRyURv7cZFIIc-nqVd=w90-h90-p-rp-mo-br100",
    text: "Can never get someone on the phone, they clearly do not care about student health which isn't surprising since Howard neglects it's students in every aspect. I've been tryna make an appointment for a week. They have terrible attitudes and service." 
  },
  { 
    id: 5, 
    author: "Krystal Grady", 
    rating: 1, 
    date: "5 years ago",
    image: "https://lh3.googleusercontent.com/a-/ALV-UjWV1ft-igcV86jUfVPLISumPnL7GuH6EK5nMDPx26BsOlDm_zO2Pg=w90-h90-p-rp-mo-br100",
    text: "They do not answer the phone and you can not get into contact them during the most important time- when incoming students are trying to get things done for housing. So irritating and irresponsible" 
  },
];

export default function Landing() {
  const router = useRouter();
  const reviewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = reviewsRef.current;
    if (!scrollContainer) return;

    const scrollContent = async () => {
      if (!scrollContainer) return;
      
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;
      let currentScroll = 0;

      while (true) {
        if (currentScroll >= scrollHeight - clientHeight) {
          currentScroll = 0;
          scrollContainer.scrollTop = 0;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        currentScroll += 0.5;
        scrollContainer.scrollTop = currentScroll;
        await new Promise(resolve => setTimeout(resolve, 30));
      }
    };

    scrollContent();
  }, []);

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{
      background: "linear-gradient(to right, #F9FAFB 0%, #F9FAFB 50%, #E6FFFB 50%, #D9F3FF 100%)"
    }}>
      <div className="max-w-[90rem] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-36 items-center">
        {/* Left Section */}
        <div className="space-y-10 lg:-ml-12">
          <p className="text-2xl font-semilight" style={{ color: '#03A64A' }}>
            REVOLUTIONIZING STUDENT HEALTHCARE
          </p>
          <h1 className="text-8xl font-bold" style={{ color: '#024059' }}>
            ClinicFlow <span style={{ color: '#04BF8A' }}>AI</span>
          </h1>
          <p className="text-3xl font-medium" style={{ color: '#026873' }}>
            Bison Ain't Leave You Waiting
          </p>
          <p className="text-gray-600 text-xl">
            A voice-powered AI front desk built to solve real problems in student healthcare.
            Designed to fix the commnunication crisis at college clinics starting with
            Howard University.
          </p>
          <div className="pt-6">
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-10 py-5 rounded-lg text-xl text-white font-semibold transition-all hover:scale-105"
              style={{ 
                backgroundColor: '#04BF8A',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#039C71'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#04BF8A'}
            >
              Try Demo
            </button>
          </div>
        </div>

        {/* Right Section - Review Card */}
        <div 
          className="bg-white rounded-2xl p-8 max-w-2xl mx-auto w-full lg:mr-[-2rem]"
          style={{ 
            boxShadow: '0 0 30px rgba(4, 191, 138, 0.67)',
          }}
        >
          <div className="flex items-start gap-4 mb-8">
            <Image 
              src="https://i.imgur.com/jRoM0Zml.png"
              alt="Howard University Health Center"
              width={64}
              height={64}
              className="rounded-xl object-cover"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2" style={{ color: '#024059' }}>
                Howard University Health Center
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-gray-900" style={{ color: '#026873' }}>2.2</span>
                <span className="text-xl" style={{ color: '#026873' }}>{renderStars(2)}</span>
                <span className="text-gray-600">(49 Google reviews)</span>
              </div>
            </div>
          </div>

          <div 
            ref={reviewsRef}
            className="h-[400px] overflow-hidden"
          >
            <div className="space-y-4">
              {[...reviews, ...reviews].map((review, index) => (
                <div 
                  key={`${review.id}-${index}`}
                  className="bg-gray-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-100 hover:scale-[1.02] active:scale-100"
                  style={{
                    transform: 'scale(1)',
                    transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  <div className="flex items-start gap-4">
                    <Image 
                      src={review.image}
                      alt={review.author}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{review.author}</span>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span>•</span>
                          <span>{review.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mt-2">{review.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}