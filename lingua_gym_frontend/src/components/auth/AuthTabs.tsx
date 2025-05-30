import { useAuth } from "../../hooks/auth/UseAuthForm";
import WrappedTab from "./WrappedTab";

export const AuthTabs = () => {
  const { activeTab, handleTabChange } = useAuth();

  return (
    <WrappedTab
      labels={['Войти', 'Зарегистрироваться']}
      activeValue={activeTab}
      onTabChange={handleTabChange}
    />
  );
};