import { Grid, GridItem, Box, Flex, Image, Text, Avatar } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { ChartArea } from "lucide-react";

const Home = () => {
  const location = useLocation();
  const basePath = location.pathname === "/";

  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "382px 1fr" }} // base: mobile viewport lg: desktop viewport
      h="100vh"
      maxH="100vh"
    >
      {/* Sidebar */}
      <GridItem
        bg="white"
        display={{ base: basePath ? "flex" : "none", lg: "block" }}
      >
        <Sidebar />
      </GridItem>

      {/* Message / Outlet */}

      <GridItem display={basePath ? "none" : "flex"}>
        <Outlet />
      </GridItem>

      {/* Empty state / Welcome */}
      {/* <GridItem display={{ base: "none", lg: basePath ? "none" : "flex" }}>

      </GridItem> */}
      <Flex
        display={{ base: "none", lg: basePath ? "flex" : "none" }}
        w="100%"
        align="center"
        justify="center"
        direction="column"
        gap={2}
      >
        <Avatar src={ChartArea} width="100px" height="100px" alt="logo" />
        <Text
          fontSize="xl"
          fontStyle="italic"
          fontWeight="semibold"
          mt={2}
          color="gray.500"
        >
          Welcome to Real Time Messaging System
        </Text>
        <Text
          fontSize="xl"
          fontStyle="italic"
          fontWeight="semibold"
          mt={2}
          color="gray.500">
          Chat now with your partners
        </Text>
      </Flex>
    </Grid>
  )
}

export default Home;