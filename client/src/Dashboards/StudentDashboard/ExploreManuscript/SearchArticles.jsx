import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
// import SearchBar from './SearchAutoComplete';
// import CategoryComponent from './Categories';

import { AutoComplete, Input, Button, ConfigProvider } from 'antd';

const ArticleList = () => {
  const [articles, setArticles] = useState([]); // State to hold articles
  const [open, setOpen] = useState(false); // State for alert
  const [selectedPdf, setSelectedPdf] = useState(null); // State for selected PDF
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:7000/api/student/search', { query });
      if (response.data.status === "ok") {
        const formattedResults = response.data.results.map(result => ({
          value: result.title,
          label: (
            <div>
              <h3 className="font-semibold">{highlightText(result.title, query)}</h3>
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

  // Function to highlight matched text
  const highlightText = (text, query) => {
    if (!query) return text;

    // Use a regex to find and wrap matching text in a span with a highlight style
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-[#1E1E]">{part}</span>
      ) : (
        part
      )
    );
  };

  // Fetch articles from the backend
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/student/articles');
        setArticles(response.data); // Set the fetched articles to state
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const handleArticleClick = (pdfUrl) => {
    setSelectedPdf(`http://localhost:7000/advicer/upload-files/${pdfUrl}`);
  };

  return (
    <div className="min-h-screen text-white p-6 ml-[300px]">
      <h1 className="text-[38px] font-bold mt-[20px] ml-[0px]">Manuscript</h1>
      <div className='absolute'> 
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
            options={results}
            onSearch={(value) => setQuery(value)}
            onSelect={handleSearch}
            size="xxl"
          >
            <Input
              size="large"
              placeholder="Search"
              onPressEnter={handleSearch}
              className="pl-10 ml-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </AutoComplete>
        </ConfigProvider>

        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>

      <header className="">
        <div className="items-center space-x-2 mr-[100px] mt-[25px] ">
          <div className="ml-[600px]">
            
            <br />
           
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
             
            </ConfigProvider>
          </div>
        </div>
      </header>

      <div className="articlesScroll flex mt-[100px]">
        <div className="w-3/4">
          {articles.map((article, index) => (
            <div
              key={index}
              onClick={() => handleArticleClick(article.pdf)}
              className="p-4 mb-4 rounded-lg cursor-pointer hover:bg-[#2F2F2F] transition duration-300 ease-in-out"
            >
              <h2 className="text-xl font-bold mb-2">{highlightText(article.title, query)}</h2>
              <p className="text-[#7C7C7C] text-sm mb-2">{highlightText(article.authors, query)}</p>
              <p className="text-[#7C7C7C] text-sm">
                <span className="font-bold">Date Uploaded:</span> {article.dateUploaded} &nbsp;&nbsp;
                <span className="font-bold">Published:</span> {article.datePublished}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Modal */}
      <Modal
        open={!!selectedPdf}
        onClose={() => setSelectedPdf(null)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          sx={{
            width: '80%',
            height: '80%',
            backgroundColor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            overflow: 'hidden',
          }}
        >
          <IconButton
            onClick={() => setSelectedPdf(null)}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedPdf && (
            <iframe
              src={selectedPdf}
              width="100%"
              height="100%"
              title="PDF Viewer"
              style={{ border: 'none' }}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ArticleList;
