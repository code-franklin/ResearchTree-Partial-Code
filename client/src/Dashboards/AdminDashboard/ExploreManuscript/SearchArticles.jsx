import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import { AutoComplete, Input, ConfigProvider, Pagination } from 'antd';
import 'ldrs/trefoil'




import PDFUploader from './PDFUploader';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return; // Only search if there's a query
   setLoading(true); // Start loading
    try {
      // Send the search query to the backend
      const response = await axios.post('http://localhost:7000/api/advicer/search', { query });

      if (response.data.status === "ok") {
        setArticles(response.data.results); // Set articles to display only search results
        setFilteredArticles(response.data.results); // Update filtered articles as well
        const analysisResponse = await axios.post('http://localhost:7000/api/advicer/analyze', { text: query });
        if (analysisResponse.status === 200) {
          setAnalysis(analysisResponse.data);
        }
      }
    } catch (err) {
      setError('No Manuscript Found');
      console.error("Error searching PDF files:", err);
    } finally {
      setLoading(false); // End loading
    }
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    // Case-insensitive regex to highlight matching query
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-[#1E1E]">{part}</span>
      ) : (
        part
      )
    );
  };

  const filterArticlesByYear = (year) => {
    if (year === "AnyTime") {
      setFilteredArticles(articles); // Show all articles
      return;
    }
    const filtered = articles.filter((article) => {
      const date = new Date(article.datePublished);
      return date.getFullYear() === year;
    });
    setFilteredArticles(filtered);
  };

  const getUniqueYears = (articles) => {
    const years = new Set(
      articles.map((article) => new Date(article.datePublished).getFullYear())
    );
    return Array.from(years).sort((a, b) => b - a); // Sort in descending order
  };
  
  

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/student/articles/search');
        console.log('Fetched Articles:', response.data); // Debugging
        setArticles(response.data);
        setFilteredArticles(response.data); // Show all articles initially
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    if (!query) fetchArticles(); // Fetch articles only if there's no search query
  }, [query]);

  const handleArticleClick = (pdfUrl) => {
    setSelectedPdf(`http://localhost:7000/public/files/${pdfUrl}`);
  };

  return (
    <div className="min-h-screen text-white p-6 ml-[300px]">
      <h1 className="text-[38px] font-bold mt-[20px] ml-[55px]">Manuscripts</h1>
     
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
          onSearch={(value) => setQuery(value)}
          onSelect={handleSearch}
          size="xxl"
        >
          <Input
            style={{
              marginLeft: '50px',
              position: 'absolute',
              top: '20px',
            
            
            
            }}
            size="large"
            placeholder="Search"
            onPressEnter={handleSearch}
            className="pl-10 ml-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </AutoComplete>
      </ConfigProvider>


      {/* <PDFUploader /> */}



      <div className="w-1/4 fixed text-right p-4 ml-[1200px] mb-[50px] w-[auto]">
      <p
        className="text-red-500 mr-[12.3px] mb-2 cursor-pointer"
        onClick={() => filterArticlesByYear("AnyTime")}
      >
        AnyTime
      </p>
      {getUniqueYears(articles).map((year) => (
        <p
          key={year}
          className="text-green-500 mb-2 cursor-pointer hover:text-red-500"
          onClick={() => filterArticlesByYear(year)}
        >
          Since {year}
        </p>
      ))}
    </div>
    
      {error && <p className="absolute mt-[4px] ml-[900px] text-red-500"><span className='mt-5'><ErrorIcon/></span>{error}</p>}

     {/* Loading Spinner */}
     {loading ? (
        <div className="flex justify-center items-center ml-[-350px] mt-[250px]">
         <l-trefoil
            size="100"
            stroke="7"
            stroke-length="0.15"
            bg-opacity="0.1"
            speed="1.4"
            color="#1E1E" 
        ></l-trefoil>
        </div>
      ) : (
        <div className="p-[50px] flex mt-[30px]">
          <div className="w-3/4">
            {filteredArticles.map((article, index) => (
              <div
                key={index}
                onClick={() => article.pdf && handleArticleClick(article.pdf)}
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
      )}

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
            borderRadius: '15px',
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
