import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Result } from 'antd'; // Using Ant Design for UI

function UnauthorizedAccess() {

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/'; // Update the path based on your routing setup
  };


  return (
    <div style={styles.container}>
      <Result
        status="403"
        title={<span style={styles.title}>403</span>} // Title styled with white color
        subTitle={<span style={styles.subTitle}>Sorry, you are not authorized to access this page.</span>} // Subtitle styled with white color
        extra={
          <Link onClick={handleLogout} to="/">
            <Button onClick={handleLogout} type="primary">Go to LogIn Again</Button>
          </Link>
        }
      />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#333', // Set background to dark to contrast the white text
  },
  title: {
    color: '#fff', // White color for the title
  },
  subTitle: {
    color: '#fff', // White color for the subtitle
  },
};

export default UnauthorizedAccess;
