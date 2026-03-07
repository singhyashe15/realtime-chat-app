import { Avatar, Box, Flex, Icon, IconButton, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Circle } from "lucide-react";
import moment from "moment";

const AllParticipants = ({participants}) => {
  
  return (
    <VStack spacing={0} align="stretch" overflowY="auto" className="scroll">
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
                    <Text fontSize="xs" color="gray.400">
                      {participant.createdAt !== null && moment(participant?.createdAt).format("hh:mm")}
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
    </VStack>
  )
}

export default AllParticipants;