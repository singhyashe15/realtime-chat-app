import { Avatar, Box, Button, Checkbox, CheckboxGroup, Divider, Flex, HStack, Icon, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { Menu as MenuIcon, SearchIcon, MessageSquarePlus, Users, LogOut } from 'lucide-react';
import { useEffect, useState } from "react";
import axios from "axios";
import ArchiveParticipants from "./archiveParticipants";
import FavouritesParticipants from "./favouritesParticipants";
import GroupsParticipants from "./groupsParticipants";
import AllParticipants from "./allParticipants";
import { addParticipant } from "../store/slice";
import { useDispatch } from "react-redux";

const list = [
  { index: 0, value: "All" }, { index: 1, value: "Archive" }, { index: 2, value: "Favourites" }, { index: 3, value: "Groups" }
]

const Sidebar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState(false);
  const [hide, setHide] = useState(true);
  const [searchByName, setSearchByName] = useState("");
  const [searchUserList, setSearchUserList] = useState([]);
  const [groupInfo, setGroupInfo] = useState({ groupName: "", members: [] });
  const [participants, setParticipants] = useState([]);
  const [messageFeatures, setMessageFeature] = useState({ showArchiveMessage: false, showFavouritesMessage: false, showAllMessage: true, showGroupsMessage: false })
  const { onClose: grouponClose, onOpen: groupOpen, isOpen: groupIsOpen } = useDisclosure();
  const { onClose: profileonClose, onOpen: profileonOpen, isOpen: profileIsOpen } = useDisclosure();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const server_url = import.meta.env.VITE_SERVER_URL;
      const res = await axios.get(`${server_url}/api/search-user?name=${searchByName}`, {
        withCredentials: true
      });
      console.log(res);
      setSearchUserList(() => res.data);
    }

    searchByName.length > 0 && fetchUser();
  }, [searchByName])

  useEffect(() => {
    const server_url = import.meta.env.VITE_SERVER_URL;
    const fetchParticipants = async () => {
      setLoading(true);
      const res = await axios.get(`${server_url}/api/all-participants`, {
        withCredentials: true
      });
      console.log(res);
      setParticipants(() => res.data)
      dispatch(addParticipant(res.data))
      setLoading(false);
    }
    fetchParticipants();
  }, [])

  const handleFeature = (feature) => {
    setMessageFeature((prev) => {
      const resetAll = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      return {
        ...resetAll,
        [feature]: true
      };
    })
  }

  const handleGroup = (value) => {
    setGroupInfo(prev => {
      const isPresent = prev.members.includes(value);

      return {
        ...prev,
        members: isPresent
          ? prev.members.filter(id => id !== value) // remove
          : [...prev.members, value]                // add
      };
    });
    console.log(groupInfo);

  }

  const submitGroupInfo = async () => {
    const server_url = import.meta.env.VITE_SERVER_URL;
    console.log(groupInfo);
    const res = await axios.post(`${server_url}/api/add-group`, groupInfo, {
      withCredentials: true
    });
    console.log(res);
    if (res.status === 200) {
      onClose();
    }
  }

  return (
    <Box
      w={{ base: "100%", lg: "382px" }}
      h="100vh"
      position="fixed"
      bg="#111b21"
      color="white"
      borderRight="1px solid"
      borderColor="gray.700"
    >
      {/* Header */}
      <Flex justify="space-between" align="center" p={4}>
        <Text fontSize="xl" fontWeight="semibold">
          Chats
        </Text>
        <HStack spacing={4}>
          <Menu>
            <MenuButton as={Button} iconSpacing="0.5" rightIcon={<MenuIcon size={16} _hover={{ color: "blue.500" }} />}>
            </MenuButton>
            <MenuList fontWeight="semibold">
              <MenuItem color="black" onClick={() => setHide(hide ? false : true)} >
                <Icon as={MessageSquarePlus} mr={4} />Start a New Chat
              </MenuItem>
              <MenuItem onClick={groupOpen} color="black">
                <Icon as={Users} mr={4} />Create a Group Chat
              </MenuItem>
              <MenuItem color="black" onClick={profileonOpen} >
                <Avatar size="sm" name="Prashant" />
                <Text ml="2">
                  Profile
                </Text>
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Search */}
      <Box px={4} pb={3} display={hide && "none"}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="white" />
          </InputLeftElement>
          <Input
            placeholder="Search"
            value={searchByName}
            bg="gray.800"
            border="none"
            _focus={{ boxShadow: "none" }}
            onChange={(e) => setSearchByName(e.target.value)}
          />
        </InputGroup>
      </Box>

      <Modal isOpen={groupIsOpen} onClose={grouponClose} >
        <ModalContent bg="#3b5b6e" color="white" w="382px" maxH="500px" >
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="semibold" mt="4">New Group</Text>
            <Input placeholder="Add a Group Name" my={4} name="groupName" value={groupInfo.groupName} onChange={(e) => setGroupInfo(prev => { return { ...prev, groupName: e.target.value } })} />
            <Text fontWeight="semibold" >Select Members</Text>
            <Box maxH="200px" overflowY="auto" className="scroll" pr={2}>
              <CheckboxGroup my="2">
                <Stack spacing={4}>
                  {participants?.map((member) => (
                    <Checkbox
                      key={member?.id}
                      value={member?.name}
                      name="member"
                      my="2"
                      onChange={() => handleGroup(member?.id)}
                    >
                      <Text ml="10">{member?.name}</Text>
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => submitGroupInfo()}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={profileIsOpen} onClose={profileonClose}>
        <ModalContent bg="#3b5b6e" color="white" w="382px">
          <ModalCloseButton />
          <ModalBody >
            <Flex justify="center" align="center" direction="column" mt="2" className="scroll">
              <Avatar size="md" name={user?.name} cursor="pointer" />
              <Text fontWeight="medium" fontSize="lg" color="white" mt="1">{user?.name}</Text>
              <Divider my="2" />
              {/* <Tabs isFitted variant="soft-rounded" mt="2" w="100%" >
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
                  {/* <TabPanel display="flex" justify="center" align="center" >
                  </TabPanel> */}
                {/* </TabPanels> */}
              {/* </Tabs> */} 
              <Divider my="2" />
              <Button rounded="md"  bg="gray.300"  _hover={{bg : "red.400"}}>
                <Icon as={LogOut} color="red.700" mr="4" />
                <Text fontWeight="semibold">
                  LogOut
                </Text>
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Filters */}
      <HStack px={4} spacing={2} pb={3}>
        {
          list.map((li) => {
            return (
              <Box
                key={li.index}
                px={4}
                py={1}
                borderRadius="full"
                bg={focus === li.index ? "green.300" : "gray.700"}
                color={focus === li.index ? "black" : "gray.300"}
                fontSize="sm"
                fontWeight="semibold"
                cursor="pointer"
                onClick={() => { setFocus(() => li.index); handleFeature("show" + li.value + "Message") }}
              >
                {li.value}
              </Box>
            )
          })
        }
      </HStack>

      <Divider borderColor="gray.700" />

      {/* {
        searchUserList.length > 0 &&
        <FavouritesMessage />
      } */}

      {
        messageFeatures?.showAllMessage &&
        <AllParticipants participants={participants} />
      }

      {
        messageFeatures?.showFavouritesMessage &&
        <FavouritesParticipants />
      }

      {
        messageFeatures?.showGroupsMessage &&
        <GroupsParticipants />
      }

      {
        messageFeatures?.showArchiveMessage &&
        <ArchiveParticipants />
      }
    </Box>
  )
}

export default Sidebar;