import { Avatar, Box, Flex, Spinner, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const FavouritesParticipants = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const server_url = import.meta.env.VITE_SERVER_URL;
    const fetchFavouritesParticipants = async () => {
      setLoading(true);
      const res = await axios.get(`${server_url}/api/favourites-participants`, {
        withCredentials: true
      });
      setParticipants(() => res.data)
      setLoading(false)
    }
    fetchFavouritesParticipants();
  }, [])
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

                <Box flex="1">
                  <Flex justify="space-between">
                    <Text fontWeight="medium" noOfLines={1}>
                      {participant?.name}
                    </Text>
                  </Flex>

                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.400" noOfLines={1}>
                      {participant?.text}
                    </Text>

                    {/* {chat.unread && (
                    <Badge
                      borderRadius="full"
                      bg="green.500"
                      color="white"
                      fontSize="xs"
                    >
                      {chat.unread}
                    </Badge>
                  )} */}
                  </Flex>
                </Box>
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
          <Text fontWeight="semibold">You have no Favourites</Text>
        </Flex>
      }
    </VStack>
  )
}

export default FavouritesParticipants;