// ProfileCard.jsx
import React from 'react';

const ProfileCard = ({ avatar, name, role }) => {
  return (
    <div className="max-w-xs mx-auto border border-gray-200 rounded-lg shadow-md p-4 flex flex-col items-center">
      {/* Avatar */}
      <img
        className="w-24 h-24 rounded-full object-cover mb-4"
        src="/src/assets/logo.png"
       
      />

      {/* Name */}
      <h2 className="text-lg font-bold text-gray-800 text-center">FranklinMayad</h2>

      {/* Role */}
      <p className="text-gray-600 text-center">Student</p>
    </div>
  );
};

export default ProfileCard;
