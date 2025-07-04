import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Logout = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  useEffect(() => {
    setCurrentUser(null);
    navigate("/login");
  }, [navigate]);

  return null; // or a loading spinner if you want
};

export default Logout;
