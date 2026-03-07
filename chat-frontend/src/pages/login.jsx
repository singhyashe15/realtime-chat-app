import React, { useState } from "react";
import { Box, Text, FormControl, Input, InputGroup, InputRightElement, Button, HStack, Spinner, Link, Flex } from "@chakra-ui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeClosed } from "lucide-react";

const MotionBox = motion.create(Box);
export default function Login() {
  const [client, setClient] = useState({ userName: "" , emailId: "", password: "" });
  const [Loading, setLoading] = useState(false);
  const [hide, setHide] = useState(false);
  const navigate = useNavigate();

  const handlechange = (e) => {
    setClient((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  const toggle = (field) => {
    setHide((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userName , emailId, password} = client;
    console.log(client)
    if (!userName || !emailId || !password) {
      return toast.error("Fill all required fields.");
    }

    try {
      setLoading(true);
      const serverUrl = import.meta.env.VITE_SERVER_URL;
      const res = await axios.post(`${serverUrl}/api/user/login`, client,{
        withCredentials: true
      });
      console.log(res);
      
      if (res.status !== 200) {
        toast.error("Fault Occurred");
      } else{
        const data = {
          id : res.data.id,
          userName : res.data.userName,
          name: res.data.name
        }
        toast.success("Login Successfully")
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/", { replace: true })
      }
    } catch (error) {
      if (error.response?.status === 404 || error.response.status === 501) {
        toast.error(error.response.data.msg)
      }
    }
    setLoading(false);
  }
  return (
    <MotionBox display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" width="100vw" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
      <Text fontSize="2xl" fontWeight="semibold" >Welcome</Text>
      <Flex direction="column" width={['60%', '60%', '30%']} bg="slate.500" color="black" textAlign="center" align="center" justify="center">
        <FormControl p="4"  >
          <Input placeholder="Enter Username" name="userName" my="4" onChange={handlechange} border="1px solid blue" />
          <Input placeholder="Enter registered Email" name="emailId" my="4" onChange={handlechange} border="1px solid blue" />
          <InputGroup my="4">
            <InputRightElement cursor="pointer" onClick={() => toggle('pass')}>
              {
                hide?.pass ? <Eye /> : <EyeClosed />
              }
            </InputRightElement>
            <Input type={hide.pass ? 'text' : 'password'} name='password' id="password" placeholder='Password' onChange={handlechange} border="1px solid blue" />
          </InputGroup>
          <Text fontSize="md" color="blue.300" float="left" cursor="pointer">Forgot Password?</Text>
          <Button
            w="full"
            mt="4"
            colorScheme='teal'
            disabled={Loading}
            leftIcon={Loading && <Spinner size="md" />}
            type='submit'
            onClick={handleSubmit}>
            {Loading ? "Verifying" : "Submit"}
          </Button>
        </FormControl>
        <Text fontSize="sm">
          Don't have an account? <Link ml="2" href="/register">Sign up</Link>
        </Text>
      </Flex>
    </MotionBox>
  )
}