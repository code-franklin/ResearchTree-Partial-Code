import React, { useState } from 'react';
import axios from 'axios';

import { UserOutlined } from '@ant-design/icons';
import { AutoComplete, ConfigProvider, Input, Button } from 'antd';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:7000/api/advicer/search', { query });
      if (response.data.status === "ok") {
        // Format results for AutoComplete
        const formattedResults = response.data.results.map(result => ({
          value: result.title,
          label: (
            <div>
              <h3 className="font-semibold">{result.title}</h3>
              <p className="text-sm text-gray-300">by {result.authors}</p>
              <p className="text-sm text-gray-400">Date Uploaded: {result.dateUploaded}</p>
              <p className="text-sm text-gray-400">Date Published: {result.datePublished}</p>
            </div>
          ),
        }));
        setResults(formattedResults);

        const analysisResponse = await axios.post('http://localhost:7000/api/advicer/analyze', { text: query });
        if (analysisResponse.status === 200) {
          setAnalysis(analysisResponse.data);
        }
      }
    } catch (err) {
      setError('Error searching PDF files');
      console.error("Error searching PDF files:", err);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Search Bar */}
      <ConfigProvider
        theme={{
          components: {
            AutoComplete: {
              colorPrimary: '#222222',
              algorithm: true,
            },
            Input: {
              colorPrimary: '#222222',
              colorBgBase: '#222222',
              colorTextBase: 'white',
              colorBorder: '#1E1E1E',
              colorPrimaryHover: '#1E1E1E',
              colorPrimaryActive: '#222222',
              controlOutline: '#1E1E1E',
              controlHeightLG: 59,
              borderRadiusLG: 100,
              algorithm: true,
            },
          },
        }}
      >
        <AutoComplete
          popupClassName="certain-category-search-dropdown"
          popupMatchSelectWidth={1080}
          style={{ width: 1080 }}
          options={results}  // Updated to show formatted results
          onSearch={(value) => setQuery(value)}
          onSelect={handleSearch}  // Trigger search when item selected
          size="xxl"
        >
          <Input
            size="large"
            placeholder="Search"
            onPressEnter={handleSearch}  // Search on Enter key press
            className="pl-10 ml-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </AutoComplete>
      </ConfigProvider>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Display Results (for further details below the search bar) */}
      <div className="w-full max-w-xxl mt-6 p-4 rounded-lg">
        <div className="w-3/4">
          {results.length > 0 ? (
            results.map((result, index) => (
              <div key={index} className="p-4 mb-4 cursor-pointer rounded-lg hover:bg-[#2F2F2F] transition duration-300 ease-in-out">
                <h2 className="text-xl font-bold mb-2">{result.value}</h2>
                <p className="text-[#7C7C7C] text-sm mb-2">
                  <span className="font-bold">Authors:</span> {result.authors}
                </p>
                <p className="text-[#7C7C7C] text-sm">
                  <span className="font-bold">Date Uploaded:</span> {result.dateUploaded} <br />
                  <span className="font-bold">Date Published:</span> {result.datePublished}
                </p>
              </div>
            ))
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;