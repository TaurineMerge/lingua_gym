import { Tabs, Tab } from '@mui/material';
import { useState } from 'react';

const TabComponent = ({ labels }: { labels: string[] }) => {
  const [value, setValue] = useState(0);

  return (
    <Tabs
      value={value}
      onChange={(_, newVal) => setValue(newVal)}
      textColor="primary"
      indicatorColor="primary"
      sx={{ mb: 2 }}
    >
      <Tab label={ labels[0] } />
      <Tab label={ labels[1] } />
    </Tabs>
  );
};

export default TabComponent;
