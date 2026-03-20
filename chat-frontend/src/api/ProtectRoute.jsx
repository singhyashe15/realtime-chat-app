import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./axios";
import { HStack, Spinner, Text } from "@chakra-ui/react";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/api/protect-route",{
          withCredentials: true
        });
        setIsAuth(true);
      } catch (err) {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);


  if (isAuth === null)
    return (
      <HStack w="100%" justify="center" align="center">
        <Spinner color="teal.500" size="lg" />
        <Text>Loading</Text>
      </HStack>

    )

  // redirect if not logged in
  if (!isAuth) return <Navigate to="/login" replace />;

  // allow access
  return children;
};

export default ProtectedRoute;