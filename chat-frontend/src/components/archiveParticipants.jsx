import { Avatar, Box, Button, Flex, Spinner, Text, VStack } from "@chakra-ui/react"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ArchiveParticipants = () => {
  const [participants, setParticipants] = useState([]);
  const [loading , setLoading] = useState(false);
  const server_url = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchArchiveParticipants = async () => {
      setLoading(true);
      const res = await axios.get(`${server_url}/api/archive-participants`, {
        withCredentials: true
      });
      setParticipants(() => res.data)
      setLoading(false);
    }
    fetchArchiveParticipants();
  }, [])

  const unArchived = async(id) => {
    const res = await axios.get(`${server_url}/api/unarchived?id=${id}` , {
      withCredentials: true
    })
    if(res.status === 200){
      setParticipants((prev) => prev.filter((participant) => participant.id !== id));
    }
  }

  return (
    <VStack spacing={0} align="stretch" overflowY="auto">
      {
        participants.map((participant) => {
          return (
            <Link key={participant?.id} to={`/${participant?.id}`} style={{ textDecoration: 'none' }}>
              <Flex
                p={2}
                m={2}
                align="center"
                gap={3}
                _hover={{ bg: "gray.800" }}
                cursor="pointer"
                rounded="xl"
              >
                <Avatar size="md" name={participant?.name} />

                <VStack gap="2">
                  <Flex justify="space-between">
                    <Text fontWeight="medium" noOfLines={1}>
                      {participant?.name}
                    </Text>
                  </Flex>

                  <Flex justify="space-between" align="center" direction="row" >
                    <Text fontSize="sm" color="gray.400" noOfLines={1}>
                      
                    </Text>

                    <Button fontSize="small" py="-1"  onClick={() => unArchived(participant?.id)}>unarchived</Button>
                  </Flex>
                </VStack>
              </Flex>
            </Link>
          )
        })
      }
      {
        loading &&
        <Flex h="100vh" mt="-12" justify="center" align="center">
          <Spinner size="md" />
        </Flex>
      }
      {
        participants.length === 0 &&
        <Flex h="100vh" mt="-12" justify="center" align="center">
          <Text fontWeight="semibold">None of the members are archived</Text>
        </Flex>
      }
    </VStack>
  )
}

export default ArchiveParticipants;