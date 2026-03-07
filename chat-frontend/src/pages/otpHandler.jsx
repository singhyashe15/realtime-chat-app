import { Box, Button, Image, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRef, useState,useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MotionBox = motion.create(Box);

const OtpHandler = () => {
  const [signedUser,setSignedUser] = useState(JSON.parse(localStorage.getItem("validateUser")));
  const [code, setcode] = useState(["", "", "", "", ""])
  const [time,setTime] = useState(300);
  const [visible ,setVisible] = useState(false);

  const inputref = useRef([])
  const navigate = useNavigate();

  const handleChange = (value, i) => {
    const newcode = [...code]
    if (value.length > 1) {
      const passcode = value.slice(0, 5).split("")
      for (let k = 0; k < 5; k++) {
        newcode[k] = passcode[k] || ""
      }
      setcode(newcode)
      const lastfilled = newcode.findLastIndex((digit) => digit !== "")
      const focusIndex = lastfilled < 4 ? lastfilled + 1 : 0
      inputref.current[focusIndex].focus()
    } else {
      newcode[i] = value
      setcode(newcode)
      if (value && i < 4) {
        inputref.current[i + 1].focus()
      }
    }
  }

  const handleKey = (i, e) => {
    if (e.key === "Backspace" && !code[i] && i > 0)
      inputref.current[i - 1].focus()
  }

  const handleVerify = async () => {
    
    try {
      const server_url = import.meta.env.VITE_SERVER_URL;
      const res = await axios.post(`${server_url}/api/user/validateOtp`, {code: code.join("") , emailId:signedUser.emailId}  , {
        withCredentials: true,
      });
      if (res.status === 200) {
        toast.success("Validated Successfully");
        localStorage.removeItem("validateUser"); // after successfull validation remove the data from localStorage
        navigate("/login");
      } else {
        toast.error("Check Your email");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      toast.error(error)
    }
  }

  useEffect(() => {
    if (time === 0) {
      setVisible(true);
      return;
    }

    const interval = setInterval(() => {
      setTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  let minutes = Math.floor(time/60);
  let seconds = time % 60;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  
  const resendOtp = async()=>{
    const server_url = import.meta.env.VITE_SERVER_URL;
    const res = await axios.get(`${server_url}/api/v1/user/resendOtp`,signedUser);
    if(res.status === 200){
      toast.success("Otp Resent Successfully");
    }
    setTime(300);
    setVisible(false);
  }

  return (
    <MotionBox display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" width="100vw" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
      <Image src="image.png" alt="Logo" boxSize="100px" mb="8" />
      <Box width={['80%', '70%', '40%']} bg="slate.500" textAlign="center" p="4">
        <Text fontSize="lg" fontWeight="semibold" mb="8">Enter the 6-digit Code send to your registered email</Text>
        {
          code.map((otp, index) => {
            return (
              <Input
                key={index}
                ref={(el) => (inputref.current[index] = el)}
                maxLength={5}
                value={otp}
                name="code"
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKey(index, e)}
                w="46px"           
                h="46px"              
                borderRadius="lg"      
                textAlign="center"     
                fontSize="lg"         
                fontWeight="semibold"  
                m={2}             
                focusBorderColor="blue.500"
                border="2px solid teal"
              />
            )
          })
        }
        {
          visible && <Text align="right" cursor="pointer" color="blue.500" onClick={()=>resendOtp()}>
            Resend Otp
          </Text>
        }
        <Text align="right" cursor="pointer" >{minutes}:{seconds} </Text>
        <Button w="full" fontSize="xl" colorScheme="green" rounded="md" fontWeight="semibold" my="4" onClick={handleVerify}>
          Verify Otp
        </Button>
      </Box>
    </MotionBox>
  )
}

export default OtpHandler;