import { Flex, Box, Text, HStack, Image, Button, Icon } from "@chakra-ui/react";
import { Trash } from "lucide-react";
import moment from "moment";

const MessageBubble = ({msg , senderId}) => {
  return (
    <HStack
      maxW="70%"
      color="white"
      p={3}
      rounded="lg"
      bg={msg?.senderId === senderId ? "blue.400" : "gray.500"}
      align="flex-end"
    >
      {msg?.text && (
        <Text>{msg.text}</Text>
      )}

      {msg?.imageUrl && (
        <Image
          src={msg.imageUrl}
          borderRadius="md"
          maxH="200px"
          objectFit="cover"
        />
      )}

      <Text fontSize="xs" opacity={0.7}>
        {moment(msg.createdAt).format("hh:mm")}
      </Text>
    </HStack>
  )
}

const Message = ({ message, senderId, onDelete }) => {
  return (
    <Box
      flex="1"
      px={6}
      py={4}
      overflowY="auto"
      bg="radial-gradient(circle at center, #1f2933, #0b141a)"
    >
      {
        message?.map((msg) => {
          return (
            <Flex
              key={msg?.id}
              justify={msg.senderId === senderId && "flex-end"}
              mb={3}
            >
              {
                msg.senderId === senderId &&
                <>
                  <Button size="sm" variant="ghost" mr="1" onClick={() => onDelete(msg.id)}>
                    <Icon as={Trash} />
                  </Button>
                  <MessageBubble msg={msg} senderId={senderId} />
                </>
              }
              {
                msg.senderId !== senderId &&
                <>
                  <MessageBubble msg={msg} senderId={senderId} />
                  <Button size="sm" variant="ghost" ml="1" onClick={() => onDelete(msg.id)}>
                    <Icon as={Trash} />
                  </Button>
                </>
              }
            </Flex>
          )
        })
      }
    </Box>
  )
}

export default Message;