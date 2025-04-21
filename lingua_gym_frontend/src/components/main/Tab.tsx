import { Tabs, Tab } from '@mui/material';

const TabComponent = ({ 
  labels, 
  value,
  onChange 
}: { 
  labels: string[]; 
  value: number;
  onChange?: (newValue: number) => void; 
}) => {
  const handleChange = (_: React.SyntheticEvent, newVal: number) => {
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