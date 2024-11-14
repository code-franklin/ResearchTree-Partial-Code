import React, { useState } from 'react';
import axios from 'axios';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:7000/api/advicer/search', { query });
      if (response.data.status === "ok") {
        setResults(response.data.results);

        const analysisResponse = await axios.post('http://localhost:7000/api/advicer/analyze', { text: query });
        if (analysisResponse.status === 200) {
          setAnalysis(analysisResponse.data);
        }
      }
    } catch (err) {
      setError('No saved data in database');
      console.error("Error searching PDF files:", err);
    }
  };

  return (
    <div className="absolute flex flex-col items-center bg-gray-900 text-white p-6 ml-[600px]">
      <h1 className="text-2xl font-bold mb-4">Search PDF Files</h1>
      
      <div className="flex w-full max-w-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query"
          className="w-full p-2 rounded-l-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 bg-indigo-600 hover:bg-indigo-700 rounded-r-lg font-semibold"
        >
          Search
        </button>
      </div>

      {error && <p className="mt-4 text-red-500">{error}</p>}

     

      

     {analysis && (
        <div className="w-full max-w-md mt-6 bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Analysis Result:</h2>
          <p className="text-gray-300">
            <strong>Sentiment Score:</strong> {analysis.sentimentScore}
          </p>
          <p className="text-gray-300">
            <strong>Sentiment Magnitude:</strong> {analysis.sentimentMagnitude}
          </p>
        </div>
      )} 
    </div>
  );
};

export default SearchComponent;
