import { Tabs, Tab } from '@mui/material';
import { useState } from 'react';

const TabComponent = ({ 
  labels, 
  onChange 
}: { 
  labels: string[]; 
  onChange?: (newValue: number) => void; 
}) => {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newVal: number) => {
    setValue(newVal);
    if (onChange) onChange(newVal);
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      textColor="primary"
      indicatorColor="primary"
      sx={{ mb: 2 }}
    >
      {labels.map((label, index) => (
        <Tab key={index} label={label} />
      ))}
    </Tabs>
  );
};

export default TabComponent;