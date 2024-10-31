import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Article.css';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip'


import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

import SearchBar from './Search'
import { ConfigProvider } from 'antd';


import CategoryComponent from './Categories'
const articles = [
  {
    title: 'Exploring the Impact of Artificial Intelligence on Healthcare: A Comprehensive Analysis of Adoption, Challenges, and Future Directions',
    authors: 'Franklin Mayad, Daniel De Torres, Lada Milera',
    dateUploaded: 'October 23 2023',
    datePublished: 'October 23 2023',
    highlight: true,
  },

  {
    title: 'Understanding the Role of Blockchain Technology in Supply Chain Management: Opportunities, Challenges, and Implementation Strategies',
    authors: 'Franklin Mayad, Daniel De Torres, Lada Milera',
    dateUploaded: 'October 23 2023',
    datePublished: 'October 23 2023',
  },

  {
    title: 'Examining the Effects of Social Media Usage on Mental Health: A Longitudinal Study among Adolescents and Young Adults',
    authors: 'Franklin Mayad, Daniel De Torres, Lada Milera',
    dateUploaded: 'October 23 2023',
    datePublished: 'October 23 2023',
  },

  {
    title: 'Exploring the Impact of Artificial Intelligence on Healthcare: A Comprehensive Analysis of Adoption, Challenges, and Future Directions',
    authors: 'Franklin Mayad, Daniel De Torres, Lada Milera',
    dateUploaded: 'October 23 2023',
    datePublished: 'October 23 2023',
    highlight: true,
  },

  {
    title: 'Investigating Sustainable Energy Solutions for Urban Environments: Integration of Renewable Resources and Smart Grid Technologies',
    authors: 'Franklin Mayad, Daniel De Torres, Lada Milera',
    dateUploaded: 'October 23 2023',
    datePublished: 'October 23 2023',
  },

  {
    title: 'The Influence of Cultural Factors on Consumer Behavior: A Cross-Cultural Analysis of Purchase Decisions in Global Markets',
    authors: 'Franklin Mayad, Daniel De Torres, Lada Milera',
    dateUploaded: 'October 23 2023',
    datePublished: 'October 23 2023',
  },

  {
    title: 'Enhancing Cybersecurity in the Internet of Things (IoT) Era: Challenges, Solutions, and Future Trends',
    authors: 'Franklin Mayad, Daniel De Torres, Lada Milera',
    dateUploaded: 'October 23 2023',
    datePublished: 'October 23 2023',
  },

  {
    title: 'Understanding the Role of Blockchain Technology in Supply Chain Management: Opportunities, Challenges, and Implementation Strategies',
    authors: 'Franklin Mayad, Daniel De Torres, Lada Milera',
    dateUploaded: 'October 23 2023',
    datePublished: 'October 23 2023',
  },

  {
    title: 'The Influence of Cultural Factors on Consumer Behavior: A Cross-Cultural Analysis of Purchase Decisions in Global Markets',
    authors: 'Franklin Mayad, Daniel De Torres, Lada Milera',
    dateUploaded: 'October 23 2023',
    datePublished: 'October 23 2023',
  },

  {
    title: 'Understanding the Role of Blockchain Technology in Supply Chain Management: Opportunities, Challenges, and Implementation Strategies',
    authors: 'Franklin Mayad, Daniel De Torres, Lada Milera',
    dateUploaded: 'October 23 2023',
    datePublished: 'October 23 2023',
  },
  
  {
    title: 'The Influence of Cultural Factors on Consumer Behavior: A Cross-Cultural Analysis of Purchase Decisions in Global Markets',
    authors: 'Franklin Mayad, Daniel De Torres, Lada Milera',
    dateUploaded: 'October 23 2023',
    datePublished: 'October 23 2023',
  },
  
];

const ArticleList = () => {
  
  const [open, setOpen] = React.useState(false); // Start with the alert closed

  // Function to handle the button click
  const handleClick = () => {
      setOpen(true); // Open the alert when the button is clicked

      // Automatically close the alert after 3 seconds
      setTimeout(() => {
          setOpen(false);
      }, 3000); // 3000 milliseconds = 3 seconds
  };

  return (
   <div>


    <div className="min-h-screen text-white p-6 ml-[300px]">
    
<div className="topcomponent fixed">
  
<Tooltip title="Notification" arrow><img className="inline-block cursor-pointer  mr-2 mb-0" src="/src/assets/notification.png" alt="Notification" /></Tooltip>

</div>
  
      <header className="header justify-between items-center fixed">
       
        <div className="items-center space-x-2 mr-[20px] mt-[25px] ">
        
      
      <div className="ml-[600px]">
      <h1 className="text-[38px] font-bold mt-[20px] ml-2 ">Manuscript</h1>
     <br></br>
      <CategoryComponent />
    
     <div>
     <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#222222', 
              colorBgBase: '#222222',
              colorTextBase: 'white',
              zIndex: 1,
            }}}>
        <SearchBar />
     </ConfigProvider> 
     </div>
     
      </div>
      
        </div>
      </header>
      <div className="flex justify-between items-center mb-[120px]">
        <div className="relative flex items-center w-3/4">
         
         
        </div>
      </div>
      <div className="articlesScroll flex">
        <div className="w-3/4">
          {articles.map((article, index) => (
            <div
              key={index}
              className={`p-4 mb-4 cursor-pointer rounded-lg hover:bg-[#2F2F2F]  transition duration-300 ease-in-out`}
            >
              <h2 className=" text-xl font-bold mb-2">{article.title}</h2>
              <p className="text-[#7C7C7C] text-sm mb-2">{article.authors}</p>
              <p className="text-[#7C7C7C] text-sm">
                <span className="font-bold">Date Uploaded:</span> {article.dateUploaded} &nbsp;&nbsp;
                <span className="font-bold">Published:</span> {article.datePublished}
              </p>
            </div>
          ))}
        </div>
        <div className="w-1/4 fixed text-right p-4 ml-[800px] mb-[50px]">
          <p className="text-red-500 mr-[12.3px] mb-2 cursor-pointer">Any time</p>
          <p className="text-green-500 mb-2 cursor-pointer">Since 2024</p>
          <p className="text-green-500 mb-2 cursor-pointer">Since 2023</p>
          <p className="text-green-500 cursor-pointer">Since 2022</p>
        </div>
      </div>
    </div>
    <Box sx={{ position: 'fixed', top: 45, left: 1200, width: '16%', zIndex: 9999 }}>
                <Collapse in={open}>
                    <Alert
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => setOpen(false)} // Close the alert when the close button is clicked
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2, color: 'white', backgroundColor: 'green' }}
                    >
                        Download Complete
                    </Alert>
                </Collapse>
            </Box>
    </div>
  );
};

export default ArticleList;
