import { Tabs, Tab } from '@mui/material';
import { useState } from 'react';

const TabComponent = () => {
  const [value, setValue] = useState(0);

  return (
    <Tabs
      value={value}
      onChange={(_, newVal) => setValue(newVal)}
      textColor="primary"
      indicatorColor="primary"
      sx={{ mb: 2 }}
    >
      <Tab label="Sets" />
      <Tab label="Texts" />
    </Tabs>
  );
};

export default TabComponent;
