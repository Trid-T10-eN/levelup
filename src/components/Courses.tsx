import React from 'react';
import HomeButton from './HomeButton';

const Courses = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <HomeButton />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Available Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Course cards will be added here later */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Coming Soon</h2>
            <p className="text-gray-600">Course content is being developed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;