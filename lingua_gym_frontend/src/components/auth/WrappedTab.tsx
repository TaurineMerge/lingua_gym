import { useEffect } from "react";
import TabComponent from "../main/Tab";

interface WrappedTabProps {
    labels: string[];
    activeValue: number;
    onTabChange: (newValue: number) => void;
}

const WrappedTab = ({ labels, activeValue, onTabChange }: WrappedTabProps) => {

    useEffect(() => {
        onTabChange(activeValue);
    }, [activeValue, onTabChange]);

    return (
        <TabComponent 
        labels={labels} 
        onChange={onTabChange}
        value={activeValue}
        />
    );
};

export default WrappedTab;
