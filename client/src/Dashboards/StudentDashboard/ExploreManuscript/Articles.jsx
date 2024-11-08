import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ConfigProvider } from 'antd';
import SearchBar from './SearchAutoComplete'; // Assuming this is a separate component
import CategoryComponent from './Categories'; // Assuming this is a separate component

const ArticleList = () => {
  const [articles, setArticles] = useState([]); // State for all articles
  const [query, setQuery] = useState(''); // State for search query
  const [filteredArticles, setFilteredArticles] = useState([]); // State for filtered articles

  // Fetch articles data from the API
  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/advicer/get-files'); // Replace with your actual endpoint
      if (response.data && response.data.status === 'ok' && Array.isArray(response.data.results)) {
        // Map the response data into a format we can use
        const formattedResults = response.data.results.map((result) => ({
          title: result.title,
          authors: result.authors,
          dateUploaded: result.dateUploaded,
          datePublished: result.datePublished,
          pdfFile: result.pdfFile, // Ensure 'pdfFile' field exists in your API response
        }));
        setArticles(formattedResults); // Set the fetched articles
        setFilteredArticles(formattedResults); // Initialize filtered articles
      } else {
        console.log('No articles found or response format is incorrect');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  // Fetch articles when the component mounts
  useEffect(() => {
    fetchArticles();
  }, []);

  // Handle search input
  const handleSearch = (value) => {
    setQuery(value);
    if (value.length > 2) {
      // Filter articles based on search query
      const filtered = articles.filter((article) =>
        article.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredArticles(filtered);
    } else {
      // Show all articles if query is less than 3 characters
      setFilteredArticles(articles);
    }
  };

  return (
    <div className="min-h-screen text-white p-6 ml-[300px]">
      <header className="header justify-between items-center fixed">
        <div className="items-center space-x-2 mr-[100px] mt-[25px]">
          <div className="ml-[200px]">
            <h1 className="text-[38px] font-bold mt-[20px] ml-2">Manuscript</h1>
            <br />
            <CategoryComponent />
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#222222',
                  colorBgBase: '#222222',
                  colorTextBase: 'white',
                  zIndex: 1,
                },
              }}
            >
              <SearchBar setQuery={handleSearch} /> {/* Pass handleSearch function to SearchBar */}
            </ConfigProvider>
          </div>
        </div>
      </header>

      {/* Articles Section */}
      <div className="articlesScroll flex">
        <div className="w-3/4 mt-[120px]">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <div
                key={index}
                className="p-4 mb-4 cursor-pointer rounded-lg hover:bg-[#2F2F2F] transition duration-300 ease-in-out"
              >
                <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                <p className="text-[#7C7C7C] text-sm mb-2">by {article.authors}</p>
                <p className="text-[#7C7C7C] text-sm">
                  <span className="font-bold">Date Uploaded:</span> {article.dateUploaded} &nbsp;&nbsp;
                  <span className="font-bold">Published:</span> {article.datePublished}
                </p>
                {article.pdfFile && (
                  <a
                    href={article.pdfFile} // Ensure this is a valid link
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View PDF
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="text-[#7C7C7C] text-sm">No articles found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
