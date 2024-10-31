import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { AutoComplete, ConfigProvider, Input } from 'antd';
import { faBlackboard } from '@fortawesome/free-solid-svg-icons';
const renderTitle = (title) => (
  <span>
    {title}
    <a
      style={{
        float: 'right',
      }}
      href="https://www.google.com/search?q=antd"
      target="_blank"
      rel="noopener noreferrer"
    >
      more
    </a>
  </span>
);
const renderItem = (title, count) => ({
  value: title,
  label: (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {title}
      <span>
        <UserOutlined /> {count}
      </span>
    </div>
  ),
});
const options = [
  {
    label: renderTitle('Libraries'),
    options: [renderItem('AntDesign', 10000), renderItem('AntDesign UI', 10600)],
  },
  {
    label: renderTitle('Solutions'),
    options: [renderItem('AntDesign UI FAQ', 60100), renderItem('AntDesign FAQ', 30010)],
  },
  {
    label: renderTitle('Articles'),
    options: [renderItem('AntDesign design language', 100000)],
  },
];
const App = () => (
  <ConfigProvider
  theme={{
    components: {

      AutoComplete: {
        colorPrimary: '#222222', 
        algorithm: true, // Enable algorithm (Mahalaga to di gagana ang style kapag wala to)
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

        
      }
    },
  }}
>
  <AutoComplete
    
    type="primary"
    popupClassName="certain-category-search-dropdown"
    popupMatchSelectWidth={980}
   
    style={{
      width: 1003,
      
    }}
    options={options}
    size="large"
    
  >
   
    <Input size="large" type="primary" placeholder="Search"  className="pl-10 ml-[-12px]"/>
  
  </AutoComplete>
  </ConfigProvider>
);
export default App;