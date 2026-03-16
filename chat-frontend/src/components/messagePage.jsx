import { Box, Flex, Text, IconButton, Avatar, Input, Divider, InputGroup, InputRightElement, InputLeftElement, Menu, MenuButton, MenuList, MenuItem, Button, Icon, FormLabel, useDisclosure, Modal, ModalContent, ModalCloseButton, ModalBody, Tabs, TabList, Tab, TabPanels, TabPanel, Grid, GridItem, HStack, } from "@chakra-ui/react";
import { SquareMenu, Plus, SendHorizontal, Delete, Heart, Archive, Image, Video, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { connectWebSocket, disconnectWebSocket, getClient } from "./webSocketConnection";
import uploadFile from "../helpers/uploadFile";
import { useParams, useNavigate } from "react-router-dom";
import Message from "./message";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import api from "../api/axios";

export default function MessagePage() {
  const { opponentId } = useParams();

  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("user")));
  const [messageInfo, setMessageInfo] = useState({ senderId: userInfo?.id, receiverId: opponentId, text: "", imageUrl: "", videoUrl: "" });
  const [socketMessage, setSocketMessage] = useState([]);
  const [hide, setHide] = useState(true);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const navigate = useNavigate();
  const client = getClient();
  const participants = useSelector((state) => state.chat.participantsDetails);
  const participant = participants?.filter((participant) => participant.id === Number(opponentId))

  useEffect(() => {

    const fetchConversation = async () => {
      const res = await api.get(
        `/api/conversation?senderId=${userInfo.id}&receiverId=${opponentId}`,
        { withCredentials: true }
      );
      console.log(res);

      setSocketMessage(() => res.data);
    };

    fetchConversation();


    connectWebSocket(() => {
      const client = getClient();

      if (!client) return;

      const subscription = client.subscribe(`/topic/messages.${userInfo?.id}`, (message) => {
        console.log(message);
        const parsed = JSON.parse(message.body);
        setSocketMessage(prev => {
          const updated = [...prev, parsed];
          console.log("Updated:", updated);
          return updated;
        });
        console.log(socketMessage);
      }
      );
      // cleanup unsubscribe
      return () => {
        subscription.unsubscribe();
        disconnectWebSocket();
      };
    });

  }, []);

  const handleText = (e) => {
    const { value } = e.target;
    setMessageInfo((prev) => {
      return {
        ...prev,
        text: value,
      }
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && messageInfo?.text.length > 0) {
      sendMessage();
    }
  }

  const sendMessage = () => {
    if (!client) {
      console.log("not connected");
    }

    if (client) {
      client.publish({
        destination: `/app/private/chat.${opponentId}`,
        body: JSON.stringify(messageInfo)
      })
    }

    setMessageInfo((prev) => {
      return {
        ...prev,
        text: ""
      }
    });
  }

  const handleFavourites = async () => {
    const res = await api.post(`/api/add-favourites-participants?id=${opponentId}`, null, {
      withCredentials: true
    });
    console.log(res);
  }

  const handleArchives = async () => {
    const res = await api.post(`/api/add-archive-participants?id=${opponentId}`, null, {
      withCredentials: true
    });
    console.log(res);
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const res = await uploadFile(file, "image");

    setMessageInfo((prev) => {
      return {
        ...prev,
        imageUrl: res.data.url,
      }
    })

    client.publish({
      destination: `/app/private/chat.${opponentId}`,
      body: JSON.stringify(messageInfo)
    })

    setMessageInfo((prev) => {
      return {
        ...prev,
        imageUrl: ""
      }
    });

  }

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    const res = await uploadFile(file, "video");
   
    setMessageInfo((prev) => {
      return {
        ...prev,
        videoUrl: res.data.url,
      }
    })

    client.publish({
      destination: `/app/private/chat.${opponentId}`,
      body: JSON.stringify(messageInfo)
    })

    setMessageInfo((prev) => {
      return {
        ...prev,
        videoUrl: ""
      }
    });

  }

  const deleteAllMessage = async () => {
    const res = await api.delete(`/api/delete-all-messages?id=${opponentId}`, {
      withCredentials: true
    })
    toast.success(res.data)
    setSocketMessage(prev => {
      const updated = prev.map(message => {return {...message ,text : "This message was deleted" }})
      console.log("Updated:", updated);
      return updated;
    });
  }

  const deleteIndividualMessage = async (msgId) => {
    const res = await api.delete(`/api/delete-individual-message?messageId=${msgId}`, {
      withCredentials: true
    })
    if (res.status === 200) {
      setSocketMessage((prev) => prev.filter(message => message.id !== msgId))
    }
  }

  return (
    <Flex
      direction="column"
      // position="fixed"
      w="100%"
      h="100vh"
      bg="linear-gradient(180deg, #0b141a, #111b21)"
    >
      <Flex
        align="center"
        justify="space-between"
        px={4}
        py={3}
        bg="#202c33"
        borderBottom="1px solid"
        borderColor="gray.700"
      >
        <Button rounded="xl" onClick={() => navigate("/")} title="Back">
          <Icon as={ArrowLeft} size="lg" />
        </Button>

        <Flex align="center" gap={3}>
          <Avatar size="sm" name={participant?.name} cursor="pointer" onClick={onOpen} />
          <Box>
            <Text fontWeight="medium" color="white">{participant?.name}</Text>
            <Text fontSize="xs" color="gray.400">
              Online
            </Text>
          </Box>
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent bg="#3b5b6e" color="white" w="382px">
            <ModalCloseButton />
            <ModalBody >
              <Flex justify="center" align="center" direction="column" mt="2" className="scroll">
                <Avatar size="md" name={participant?.name} cursor="pointer" />
                <Text fontWeight="medium" fontSize="lg" color="white" mt="1">{participant?.name}</Text>
                <Divider mt="4" />
                <Tabs isFitted variant="soft-rounded" mt="2" w="100%" >
                  <TabList mb="2em" mx="xl" w="100%" >
                    <Tab _selected={{
                      bg: "transparent",   // remove background
                      color: "green",      // optional: change text color
                      borderBottom: "3px solid green", rounded: "none"
                    }} color="white" w="50%" >Image</Tab>
                    <Tab _selected={{
                      bg: "transparent",   // remove background
                      color: "green",      // optional: change text color
                      borderBottom: "3px solid green", rounded: "none"
                    }} color="white">Video</Tab>
                  </TabList>
                  <TabPanels>
                    {/* all image display between the coversation*/}
                    <TabPanel display="flex" justify="center" align="center" >
                      {/* <Grid templateColumns="repeat(4,1fr)" gap="2" h="30vh">
                        {
                          socketMessage?.map((msg) => {
                            return (
                              <GridItem >
                                <Box>
                                  <Image src={msg?.imageUrl} />
                                </Box>
                              </GridItem>
                            )
                          })
                        }
                      </Grid> */}
                      {
                        socketMessage?.length === 0 &&
                        <Flex w="xl" justify="center">
                          <Text fontWeight="semibold" fontSize="xl">Empty</Text>
                        </Flex>
                      }
                    </TabPanel>
                    <TabPanel display="flex" justify="center" align="center"  >
                      {
                        socketMessage?.length === 0 &&
                        <Flex w="xl" justify="center">
                          <Text fontWeight="semibold" fontSize="xl">Empty</Text>
                        </Flex>
                      }
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Menu>
          <MenuButton as={Button} rightIcon={<SquareMenu size={16} _hover={{ color: "blue.500" }} />}>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => deleteAllMessage()}>
              <Icon as={Delete} mr={4} /> Clear Messages
            </MenuItem>
            <MenuItem onClick={() => handleFavourites()}>
              <Icon as={Heart} mr={4} /> Add to Favourites
            </MenuItem>
            <MenuItem onClick={() => handleArchives()}>
              <Icon as={Archive} mr={4} /> Mark it as archive
            </MenuItem>
          </MenuList>
        </Menu>

      </Flex>

      {/* <Flex justify="center" mb={4}>
          <Text fontSize="xs" px={3} py={1} bg="gray.700" borderRadius="md" color="white">
            Today
          </Text>
        </Flex> */}

      <Message message={socketMessage} senderId={userInfo?.id} onDelete={deleteIndividualMessage} />

      <Divider borderColor="gray.700" />

      <Box
        display={hide && "none"}
        position="absolute"
        bottom="4rem"
        w="6rem"
        p={2}
        bg="gray.300"
        boxShadow="md"
        borderRadius="xl"
      >
        <HStack spacing={1} justify="center">
          <FormLabel
            htmlFor="uploadImage"
            mr="0"
            cursor="pointer"
            p={2}
            borderRadius="lg"
            _hover={{ bg: "green.200" }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Icon as={Image} boxSize={5} color="purple.500" />
          </FormLabel>

          <Input
            type="file"
            id="uploadImage"
            onChange={handleUploadImage}
            display="none"
          />
          <FormLabel
            htmlFor="uploadVideo"
            mr="0"
            cursor="pointer"
            p={2}
            borderRadius="lg"
            _hover={{ bg: "green.200" }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Icon as={Video} boxSize={5} color="purple.500" />
          </FormLabel>

          <Input
            type="file"
            id="uploadVideo"
            onChange={handleUploadVideo}
            display="none"
          />
        </HStack>
      </Box>
      <Flex
        align="center"
        gap={3}
        px={4}
        py={3}
        bg="#202c33"
      >
        <InputGroup gap="4">
          <InputLeftElement cursor="pointer" _hover={{ color: "blue.400", bg: "gray.400", rounded: "md" }} onClick={() => hide ? setHide(false) : setHide(true)}>
            <Plus />
          </InputLeftElement>
          <Input
            placeholder="Type a message..."
            bg="#2a3942"
            border="none"
            color="white"
            value={messageInfo?.text}
            _focus={{ boxShadow: "none" }}
            onChange={handleText}
            onKeyDown={handleKeyPress}
          />
          <InputRightElement>
            <IconButton
              icon={<SendHorizontal />}
              variant="ghost"
              rounded="lg"
              color="blue.400"
              disabled={messageInfo?.text.length === 0 ? true : false}
              onClick={() => {
                sendMessage();
              }}
            />
          </InputRightElement>
        </InputGroup>
      </Flex>
    </Flex>
  )
}
