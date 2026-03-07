import { useState } from 'react';
import { Box, FormControl, Input, Text, InputGroup, InputRightElement, Button, Link } from '@chakra-ui/react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Eye, EyeClosed, Mail, User } from "lucide-react";

const MotionBox = motion.create(Box);
const Register = () => {
  const [client, setClient] = useState({ name: "", emailId: "", userName: "", password: "" })
  const [hide, setHide] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const serverUrl = import.meta.env.VITE_SERVER_URL;

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
    const { name, emailId, userName, password, cpass } = client;

    if (!name || !emailId || !userName || !password || !cpass) {
      return toast.error("Please fill all required fields.");
    }

    if (password !== cpass) {
      return toast.error("Passwords do not match.");
    }

    if (password.length < 8) {
      toast.error("Password must be at least of 8 Characters");
      return;
    }

    let alpha_count = 0;
    let digit_count = 0;
    let special_count = 0;

    for (let ch of password) {
      alpha_count += (ch - '0' >= 0 && ch - '0' <= 9) && 1;
      digit_count += (ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z') && 1;
      special_count += (ch === '@' || ch === '&' || ch === '$') && 1;
    }

    if (alpha_count == 0 || digit_count === 0 || special_count === 0) {
      toast.error("password must follow the rules");
      return;
    }

    if (userName.length > 0) {
      const res = await axios.get(`${serverUrl}/api/user/validate-username?userName=${userName}`);
      if (res.data === false) {
        setShowError(true);
        setClient((prev) => {
          return {
            ...prev, userName: ""
          }
        })
        return;
      }
    }

    try {
      const res = await axios.post(`${serverUrl}/api/user/signup`, client);
      console.log(res);

      if (res.status === 200) {
        toast.success("Registration Successful! Please verify your email.");
        localStorage.setItem("validateUser", JSON.stringify(res.data));
        navigate("/login")
      }
    } catch (error) {
      toast.error(error.response.data.msg)
    }
  }
  return (
    <MotionBox display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" width="100vw" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
      <Text fontStyle="italic" fontSize="2xl" fontFamily="cursive" >Welcome </Text>
      <Box width={['90%', '70%', '30%']} bg="slate.500" color="black" textAlign="center">
        <form onSubmit={handleSubmit}>
          <FormControl p="8">
            <Input name='name' placeholder='Name' my="4" onChange={handlechange} border="1px solid blue" />
            <InputGroup my="4"  >
              <InputRightElement cursor="pointer">
                <Mail />
              </InputRightElement>
              <Input type='email' name='emailId' id="emailId" placeholder='Email' onChange={handlechange} border="1px solid blue" />
            </InputGroup>
            <InputGroup>
              <InputRightElement cursor="pointer"><User /></InputRightElement>
              <Input type='name' name="userName" placeholder='Enter Username' onChange={handlechange} border="1px solid blue" />
            </InputGroup>
            {
              showError &&
              <Text color="red.300" textAlign="start" fontWeight="semibold">Username already exits</Text>
            }
            <InputGroup my="4" >
              <InputRightElement cursor="pointer" onClick={() => toggle('pass')}>
                {
                  hide?.pass ? <Eye /> : <EyeClosed />
                }
              </InputRightElement>
              <Input type={hide.pass ? 'text' : 'password'} name='password' id="password" placeholder='Password' onChange={handlechange} border="1px solid blue" />
            </InputGroup>
            <InputGroup my="4">
              <InputRightElement cursor="pointer" onClick={() => toggle('cpass')}>
                {
                  hide?.cpass ? <EyeClosed /> : <Eye />
                }
              </InputRightElement>
              <Input type={hide.cpass ? 'password' : 'text'} placeholder='Confirm Password' id="cpassowrd" name='cpass' onChange={handlechange} border="1px solid blue" />
            </InputGroup>
          </FormControl>
          <Text fontSize="sm" textAlign="center" fontWeight="semibold">
            Already have an account? <Link ml="2" href="/login">Login</Link>
          </Text>
          <Button
            m="4"
            colorScheme='teal'
            type='submit' >
            Register
          </Button>
        </form>
      </Box>
    </MotionBox>
  )
};

export default Register;