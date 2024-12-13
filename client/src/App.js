import './App.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Card, CardBody, Center, Flex, Grid, Heading, Input, Text, useToast } from "@chakra-ui/react";
import { MdOutlineAirlineSeatReclineNormal, MdEventSeat } from "react-icons/md";
import { BallTriangle } from 'react-loader-spinner'


function App() {
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState([]);
  const [count, setCount] = useState(0);
  const [booked, setBooked] = useState([]);
  const toast = useToast();

  const loader = <BallTriangle
  height={100}
  width={100}
  radius={5}
  color="#4fa94d"
  ariaLabel="ball-triangle-loading"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  />

  useEffect(() => {
    getSeats();
  });

  const getSeats = () => {
    axios.get(`https://live-ticket-booking.onrender.com/seats`)
      .then((res) => {
        setSeats(res.data)
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const handleBooking = () => {
    if (count > 7) {
      toast({
        title: "You cannot book more than 7 seats at once.",
        status: "error",
        position: "top",
        duration: 1000,
        isClosable: true,
      });
      return;
    }
    if (count <= 0) {
      toast({
        title: "Enter valid number for book a seat.",
        status: "error",
        position: "top",
        duration: 1000,
        isClosable: true
      });
      return;

    }
    setLoading(true)
    axios.patch(`https://live-ticket-booking.onrender.com/seats/book`, { "seats": Number(count) })
      .then((res) => {
        setBooked(res.data);
        toast({
          title: "Booking Successful",
          status: "success",
          position: "top",
          duration: 3000,
          isClosable: true
        });
        getSeats();
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: error.response.data.message,
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true
        })
      });
  };


  const handleReset = () => {
    setBooked([])
    axios.patch(`https://live-ticket-booking.onrender.com/seats/reset`)
      .then((res) => console.log(res),
      toast({
        title: "All seats are available for booking",
        status: "info",
        position: "top",
        duration: 3000,
        isClosable: true
      })
      )
      .catch((error) => console.log(error));
   
  }

  if (loading) {
    return (
      <Flex h={"100vh"} w={"100vw"} justifyContent={"center"} alignItems={"center"} >
        {loader}
      </Flex>
    )
  }

  return (
    <>
 <Flex as="header" position="fixed" backgroundColor="yellow" 
  w="100%" height={50} justifyContent={"center"} >
  <Heading color={'white'} fontFamily={'IBM Plex Sans'}>VIRTUAL TICKET COUNTER</Heading>
 </Flex>
    <div style={{ display: "flex", justifyContent: "center", backgroundImage: "linear-gradient(to right top, #ff7e5f, #feb47b, #ffcc33, #47e79e, #62a8ea)"
}}>
  <Flex w={"100%"} justifyContent={"space-around"} alignItems={"center"} gap={"30px"} flexDir={{ base: "column", md: "column", lg: "row" }} h={{ base: "auto", md: "auto", lg: "100vh" }} mt={{ base:20, md:20, lg:5}}>
    
  
    
    <Grid
  w={{ base: "80%", md: "50%", lg: "30%" }}
  h={{base: "80%", md: "50%", lg: "80%" }}
  templateColumns="repeat(7, 1fr)"
  gap={2} /* Adjust gap between seats */
  bgColor="white"
  p="10px"
  borderRadius="20px"
  marginLeft={'20px'}
  boxShadow="rgb(85, 91, 255) 0px 0px 0px 3px, rgb(31, 193, 27) 0px 0px 0px 6px, rgb(255, 217, 19) 0px 0px 0px 9px, rgb(255, 156, 85) 0px 0px 0px 12px, rgb(255, 85, 85) 0px 0px 0px 15px"
  maxH="500px" /* Adjust max height as needed */
  overflowY="auto"
>
  {seats.slice(0, 80).map((e) => (
    <Box key={e._id} align="center">
      {e.isBooked ? (
        <MdOutlineAirlineSeatReclineNormal color="red" size="35px" />
      ) : (
        <MdEventSeat color="green" size="35px" />
      )}
      <Text fontSize="20">{e.seatNumber}</Text>
    </Box>
  ))}
</Grid>

    {booked.length > 0 ?  (
    <Flex flexDir={{ base: "column", md: "row", lg: "row" }} justifyContent={"center"} align={"center"} gap={"10px"} p={"10px"} minH={{ base: "100vh", md:"auto" }} borderRadius="10px">
  <Alert
    status='success'
    variant='subtle'
    flexDirection='column'
    alignItems='center'
    justifyContent='center'
    textAlign='center'
    minH='250px'
  >
    <AlertIcon boxSize='40px' mr={0} />
    <AlertTitle mt={4} mb={1} fontSize='md' fontFamily={'IBM Plex Sans'}>
      Booking Successful.
      Your Tickets History
    </AlertTitle>
    <Flex flexDir={{ base: "column", md: "row", lg: "row" }} justifyContent={"center"} align={"center"} gap={"10px"} p={"10px"} flexWrap="wrap" borderRadius="10px">
      {booked?.map((e, i) => (
        <AlertDescription key={i} maxWidth='sm' textAlign="center" fontFamily={'IBM Plex Sans'} w={{ base: "100%", md: "auto" }} borderRadius="10px">
          <Card>
            <CardBody>
              <MdOutlineAirlineSeatReclineNormal color='red' size={"35px"} />
              <Text fontSize={"20px"}>{e}</Text>
            </CardBody>
          </Card>
        </AlertDescription>
      ))}
    </Flex>
  </Alert>
    </Flex>
  ) :( null) }
   
    <Flex
  w={{ base: "90%", md: "60%", lg: "40%" }}
  flexDir="column"
  justifyContent="center"
  alignItems="center"
  gap="15px"
  bgColor="white"
  p="20px"
  borderRadius="10px"
  boxShadow="0px 10px 15px -3px rgba(0,0,0,0.1);"
  marginRight={'10px'}
>
  {/* Legend Section */}
  <Flex
    alignItems="center"
    gap="20px"
    fontFamily="IBM Plex Sans"
    mb="10px"
  >
    <Flex alignItems="center" gap="5px">
      <MdOutlineAirlineSeatReclineNormal color="red" size="30px" />
      <Text fontSize="sm">Booked</Text>
    </Flex>
    <Flex alignItems="center" gap="5px">
      <MdEventSeat color="green" size="30px" />
      <Text fontSize="sm">Available</Text>
    </Flex>
  </Flex>

  {/* Heading */}
  <Heading
    fontFamily="IBM Plex Sans"
    fontSize="lg"
    textAlign="center"
    mb="15px"
  >
    Start Booking Your Seat
  </Heading>

  {/* Input Section */}
  <Flex
    w="100%"
    alignItems="center"
    justifyContent="space-between"
    gap="10px"
    mb="15px"
  >
    <Text
      w="50%"
      fontWeight="bold"
      fontFamily="IBM Plex Sans"
      fontSize="sm"
      textAlign="right"
    >
      Select Seats:
    </Text>
    <Input
      fontFamily="IBM Plex Sans"
      type="number"
      value={count}
      onChange={(e) => setCount(e.target.value)}
      w="50%"
    />
  </Flex>

  {/* Buttons */}
  <Flex
    w="100%"
    justifyContent="space-between"
    alignItems="center"
    gap="15px"
    mb="15px"
  >
    <Button
      onClick={handleBooking}
      colorScheme="teal"
      fontFamily="IBM Plex Sans"
      fontSize="sm"
      flex="1"
    >
      Book Tickets
    </Button>
    <Button
      onClick={handleReset}
      colorScheme="red"
      fontFamily="IBM Plex Sans"
      fontSize="sm"
      flex="1"
    >
      Reset Booking
    </Button>
  </Flex>

  {/* Booked Seats */}
  {booked.length > 0 && (
    <Heading
      as="h4"
      size="sm"
      textAlign="center"
      fontFamily="IBM Plex Sans"
      mt="10px"
    >
      Booked Seats: <span style={{ color: 'teal' }}>{booked.join(", ")}</span>
    </Heading>
  )}
</Flex>

  </Flex>
</div>
</>
  );
}

export default App;
