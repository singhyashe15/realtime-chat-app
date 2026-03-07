import { Text,Box, Button, HStack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate()

  const handleLogout = ()=>{
    localStorage.removeItem("user");
    navigate("/");
  }
  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" width="100vw">
      <Box width={['90%', '70%', '30%']} bg="slate.500" color="black" border="2px solid" borderColor="blue.400" borderRadius="lg" boxShadow="md" textAlign="center" p="8">
          <Text fontSize="lg" fontFamily='cursive'>Are ,You Sure Want to Logout </Text>
          <HStack display="flex" justifyContent="center" alignItems="center">
              <Button colorScheme='teal' onClick={()=>handleLogout()}>Yes</Button>
              <Button colorScheme='teal' onClick={()=>navigate('/')}>No</Button>
          </HStack>
      </Box>
    </Box>
  )
}