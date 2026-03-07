import { Avatar, Box, Flex, Spinner, Text, VStack } from "@chakra-ui/react"
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addGroup } from "../store/slice";
import { Link } from "react-router-dom";
import api from "../api/axios";

const GroupsParticipants = () => {
  const [groups, setGroups] = useState([]);
  const [loading , setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      const res = await api.get(`/api/fetchGroups`, {
        withCredentials: true
      });
      console.log(res.data);
      setGroups(() => res.data)
      dispatch(addGroup(res.data))
      setLoading(false);
    }
    fetchGroup();
  }, [])



  return (
    <VStack spacing={0} align="stretch" overflowY="auto" className="scroll">
      {
        groups?.map((group) => {
          return (
            <Link key={group?.id}  to={`group/${group?.id}`} style={{ textDecoration: 'none' }}  >
              <Flex
                p={2}
                m={2}
                align="center"
                gap={3}
                _hover={{ bg: "gray.800" }}
                cursor="pointer"
                rounded="xl"
              >
                <Avatar size="md" src={Users} />

                <Box flex="1">
                  <Flex justify="space-between">
                    <Text fontWeight="medium" noOfLines={1}>
                      {group?.groupName} (G)
                    </Text>
                  </Flex>

                  <Flex justify="space-between" align="center">
                    {/* <Text fontSize="sm" color="gray.400" noOfLines={1}>
                      {participant?.message}
                    </Text> */}

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
        groups.length === 0 && 
        <Flex h="100vh" mt="-12" justify="center" align="center">
          <Text fontWeight="semibold">No Group yet, Create a Group</Text>
        </Flex>
      }
    </VStack>
  )
}

export default GroupsParticipants;