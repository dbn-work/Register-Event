import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    localStorage.clear();
    window.location.href = "/"; // Or redirect to login
  }, []);

  return <div className="settings-page">Logging you out...</div>;
};

export default Logout;
