import React, { useState } from 'react';
import { Select, Typography, Row, Col } from 'antd';
import { ConfigProvider } from 'antd';

const { Option } = Select;

const CategoryComponent = () => {
  // Initial data with multiple occurrences of the categories
  const data = [
    { value: 'machine_learning', label: 'Machine Learning', count: 3400, category: 'Machine Learning' },
    { value: 'cybersecurity', label: 'Cybersecurity', count: 150, category: 'Cybersecurity' },
    { value: 'mobile_app', label: 'Mobile App', count: 2555, category: 'Mobile App' },
    { value: 'blockchain', label: 'Blockchain', count: 672, category: 'Blockchain' },
    { value: 'iot', label: 'IoT', count: 7620, category: 'IoT' },
    { value: 'artificial_intelligence', label: 'Artificial Intelligence', count: 877, category: 'Artificial Intelligence' },
  ];

  // Grouping data by category and counting occurrences
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { items: [], count: 0 };
    }
    acc[item.category].items.push(item);
    acc[item.category].count += item.count;
    return acc;
  }, {});

  // State to store selected value
  const [selectedValue, setSelectedValue] = useState({
    value: 'categories',
    label: 'Categories',
  });

  // Handle selection change
  const handleChange = (value) => {
    setSelectedValue(value); // Update the selected value
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            colorTextBase: 'white',
            colorPrimary: '#222222',
            colorBgBase: '#313131',
            controlOutline: '#1E1E1E',
            colorBorder: '#1E1E1E',
            colorPrimaryBorder: '#222222',
            colorBgContainer: '#222222',
            borderRadius: 7,
            colorPrimaryHover: '#1E1E1E',
            boxShadow: '0px 12px 5.7px -4 rgba(0, 0, 0, 0)',
            algorithm: true, // Enable algorithm
          },
        },
      }}
    >
      <Select
        type="primary"
        labelInValue
        value={selectedValue}
        style={{
          position: 'absolute', zIndex: '10', width: 280, marginLeft: 650, marginTop: 13,
        }}
        onChange={handleChange}
        dropdownRender={(menu) => (
          <div>
            {Object.keys(groupedData).map((category) => (
              <div key={category}>
                <Row
                  justify="space-between"
                  align="middle"
                  style={{
                    cursor: 'pointer',
                    color: 'white',
                    padding: '8px 16px',
                    fontWeight: 'bold',
                    background: '#313131',
                     // Add box-shadow here
                  }}
                >
                  <Col>{category}</Col>
                  <Col>
                    <Typography.Text style={{ fontSize: '12px', color: '#0BF677' }}>
                      {groupedData[category].count}
                    </Typography.Text>
                  </Col>
                </Row>
                {groupedData[category].items.map((item) => (
                  <Option key={item.value} value={item.value} label={item.label}>
                    <Row
                      justify="space-between"
                      align="middle"
                      className="dropdown-item"
                      style={{
                        cursor: 'pointer',
                        color: 'white',
                        padding: '8px 16px',
                        background: 'green',
                        transition: 'background 0.3s',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', // Add box-shadow here
                      }}
                    >
                      <Col>
                        <Typography.Text>{item.label}</Typography.Text>
                      </Col>
                      <Col>
                        {item.count}
                      </Col>
                    </Row>
                  </Option>
                ))}
              </div>
            ))}
          </div>
        )}
      />
    </ConfigProvider>
  );
};

export default CategoryComponent;
