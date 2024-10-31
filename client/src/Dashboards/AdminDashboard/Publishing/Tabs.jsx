import * as React from 'react';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';

export default function TabsSegmentedControls() {
  return (
    <Tabs aria-label="tabs" defaultValue={0} sx={{ position: 'absolute', left:'710px', top:'-27px', maxWidth: '500%', bgcolor: 'transparent' }}>
      <TabList
        disableUnderline
        sx={{
          whiteSpace: 'nowrap',
          p: 0.5,
          gap: 0.5,
          borderRadius: 'xl',
          bgcolor: '#222222',
          color: 'none', // Set text color to white by default
          [`& .${tabClasses.root}`]: {
            transition: 'background-color 0.3s ease', // Smooth transition
            color: 'grey', // Ensure text color remains white
          },
          [`& .${tabClasses.root}[aria-selected="true"]`]: {
            boxShadow: 'md',
            bgcolor: '#1E1E',
            color: 'white', // Ensure selected tab text is white
          },
          [`& .${tabClasses.root}:hover`]: {
            bgcolor: '#333333',
            color: 'white', // Ensure hover state text is white
          },
        }}
      >
        <Tab disableIndicator>New Uploads</Tab>
        <Tab disableIndicator>Revisions</Tab>
        <Tab disableIndicator>Publishing</Tab>
      </TabList>
    </Tabs>
  );
}
