import { Box, Flex, Text, IconButton, Avatar, Input, Divider, InputGroup, InputRightElement, InputLeftElement, Menu, MenuButton, MenuList, MenuItem, Button, Icon, FormLabel, useDisclosure, Modal, ModalContent, ModalCloseButton, ModalBody, Tabs, TabList, Tab, TabPanels, TabPanel, Grid, GridItem, HStack, VStack, } from "@chakra-ui/react";
import { SquareMenu, Plus, SendHorizontal, Delete, Image, Video, ArrowLeft, LogOut } from "lucide-react";
import { connectWebSocket, disconnectWebSocket, getClient } from "./webSocketConnection";
import { useParams, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/uploadFile";
import { useEffect, useState } from "react";
import GroupMessage from "./groupMessage";
import {removeMemberFromGroup} from "../store/slice";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function GroupMessagePage() {
  const { groupId } = useParams();
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("user")));
  const [messageInfo, setMessageInfo] = useState({ senderId: userInfo?.id, receiverId: null, groupId, text: "", imageUrl: "", videoUrl: "" });
  const [socketMessage, setSocketMessage] = useState([]);
  const [hide, setHide] = useState(true);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.chat.groupDetails);
  const group = groups?.find(group => group.id === Number(groupId));

  const navigate = useNavigate();
  const client = getClient();

  useEffect(() => {

    const fetchGroupConversation = async () => {
      const res = await api.get(`/api/group-conversation?groupId=${groupId}`,{
        withCredentials: true
      })
      setSocketMessage(() => res.data)
    };

    fetchGroupConversation();

    connectWebSocket(() => {
      const client = getClient();

      if (!client) return;

      const subscription = client.subscribe(`/topic/messages.${groupId}`, (message) => {
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
        destination: `/app/private/chat.${groupId}`,
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

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const res = await uploadFile(file, "image");

    setMessageInfo((prev) => {
      return {
        ...prev,
        imageUrl: res.data.url,
      }
    })
    console.log(messageInfo);
    
    client.publish({
      destination: `/app/private/chat.${groupId}`,
      body: JSON.stringify(messageInfo)
    })
    setHide(() => true)
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
      destination: `/app/private/chat.${groupId}`,
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
    const res = await api.delete(`/api/delete-all-group-messages?groupId=${groupId}`, {
      withCredentials: true
    })
    toast.success(res.data)
  }

  const deleteIndividualMessage = async (msgId) => {
    // const res = await axios.delete(`${server_url}/api/delete-individual-message?id=${msgId}`, {
    //   withCredentials: true
    // })
    // if (res.status === 200) {
    //   setSocketMessage((prev) => prev.filter(message => message.id !== msgId))
    // }
  }

  const exitFromGroup = async () => {
    const res = await api.put(`/api/exit-from-group?groupId=${group.id}`, null, {
      withCredentials: true
    })
    const member = {
      id : group.id ,userId : userInfo.id
    }
    dispatch(removeMemberFromGroup(member));
  }

  return (
    <Flex
      direction="column"
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
          <Avatar size="sm" name={group?.groupName} cursor="pointer" onClick={onOpen} />
          <Box>
            <Text fontWeight="medium" color="white">{group?.groupName}</Text>
            <Text fontSize="xs" color="gray.400">
              Online
            </Text>
          </Box>
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent bg="#3b5b6e" color="white" w="382px">
            <ModalCloseButton />
            <ModalBody >
              <Flex h="100%" justify="center" align="center" direction="column" mt="2" className="scroll">
                <Avatar size="md" name={group?.groupName} cursor="pointer" />
                <Text fontWeight="semibold" fontSize="lg" color="white" mt="1">{group?.groupName}</Text>
                <Text fontWeight="semibold" fontSize="md" color="white" my="1">Group : {group?.members?.length} members</Text>
                <Divider my="2" />
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
                <Divider my="2" />

                <VStack w="100%" align="flex-start">
                  <Text fontWeight="semibold" fontSize="md">Members: </Text>
                  {
                    group?.members?.map((member) => {
                      return (
                        <Flex
                          key={member?.id}
                          w="100%"
                          p={2}
                          m={2}
                          align="center"
                          gap={3}
                          _hover={{ bg: "gray.800" }}
                          cursor="pointer"
                          rounded="xl"
                        >
                          <Avatar size="sm" name={member?.name} />
                          <Text fontWeight="medium">
                            {member?.name}
                          </Text>
                          {
                            group?.adminId === member.id &&
                            <Text px={4} py={2} bg="green.600" rounded="md" fontWeight="medium" color="green.500" >Group Admin</Text>
                          }
                        </Flex>
                      )
                    })
                  }
                </VStack>

                <Divider />
                <Flex w="100%"
                  p={2}
                  m={2}
                  align="center"
                  _hover={{ bg: "gray.600" }}
                  cursor="pointer"
                  onClick={() => exitFromGroup()} >
                  <Icon as={LogOut} color="red.500" mr="4" />
                  <Text color="red.500" fontWeight="semibold">Exit group</Text>
                </Flex>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Menu>
          <MenuButton as={Button} rightIcon={<SquareMenu size={16} _hover={{ color: "blue.500" }} />}>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => deleteAllMessage()}>
              <Icon as={Delete} mr={4} /> Delete Messages
            </MenuItem>
          </MenuList>
        </Menu>

      </Flex>

      {/* <Flex justify="center" mb={4}>
          <Text fontSize="xs" px={3} py={1} bg="gray.700" borderRadius="md" color="white">
            Today
          </Text>
        </Flex> */}

      <GroupMessage message={socketMessage} senderId={userInfo?.id} onDelete={deleteIndividualMessage} />

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
