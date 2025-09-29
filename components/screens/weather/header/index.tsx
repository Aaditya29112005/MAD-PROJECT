import React, { useContext, useState, useEffect } from "react";
import { HStack } from "@/components/ui/hstack";
import { Icon, SearchIcon} from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { ImageBackground } from "@/components/ui/image-background";
import { ThemeContext } from "@/contexts/theme-context";
import Animated, {
  interpolate,
  useAnimatedStyle,
  Extrapolation,
} from "react-native-reanimated";

const Header = ({ height }: { height: number }) => {
  const { colorMode }: any = useContext(ThemeContext);
  
  // State for location and time
  const [location, setLocation] = useState("Getting location...");
  const [locationError, setLocationError] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  
  useEffect(() => {
    const updateTime = () => {
      setCurrentDateTime(new Date());
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentDateTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  // Format time with seconds and AM/PM
  const formatTime = () => {
    return currentDateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Format full date
  const formatFullDate = () => {
    return currentDateTime.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };


  // Animation ranges
  const MAX_HEIGHT = 340;
  const MIN_HEIGHT = 80;
  const FADE_THRESHOLD = 220;
  const GREETING_FADE_POINT = 250;

  // Greeting text animations (top section) - make visible initially
  const greetingTextStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(
      height,
      [MAX_HEIGHT, MIN_HEIGHT],
      [22, 18],
      Extrapolation.CLAMP
    ),
    opacity: interpolate(
      height,
      [GREETING_FADE_POINT, MAX_HEIGHT],
      [0, 1], // Changed: visible at MAX_HEIGHT, fade at GREETING_FADE_POINT
      Extrapolation.CLAMP
    ),
    transform: [{
      translateY: interpolate(
        height,
        [MAX_HEIGHT, MIN_HEIGHT],
        [0, -10],
        Extrapolation.CLAMP
      )
    }],
  }));

  const dateTextStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(
      height,
      [MAX_HEIGHT, MIN_HEIGHT],
      [16, 14],
      Extrapolation.CLAMP
    ),
    opacity: interpolate(
      height,
      [GREETING_FADE_POINT, MAX_HEIGHT],
      [0, 1], // Changed: visible at MAX_HEIGHT, fade at GREETING_FADE_POINT
      Extrapolation.CLAMP
    ),
    transform: [{
      translateY: interpolate(
        height,
        [MAX_HEIGHT, MIN_HEIGHT],
        [0, -8],
        Extrapolation.CLAMP
      )
    }],
  }));

  // Container animations
  const containerStyle = useAnimatedStyle(() => ({
    marginTop: interpolate(
      height,
      [MAX_HEIGHT, MIN_HEIGHT],
      [64, 50],
      Extrapolation.CLAMP
    ),
    paddingHorizontal: interpolate(
      height,
      [MAX_HEIGHT, MIN_HEIGHT],
      [20, 18],
      Extrapolation.CLAMP
    ),
  }));

  // Search icon animation
  const searchIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      height,
      [MAX_HEIGHT, FADE_THRESHOLD],
      [1, 0],
      Extrapolation.CLAMP
    ),
    transform: [{
      scale: interpolate(
        height,
        [MAX_HEIGHT, FADE_THRESHOLD],
        [1, 0.8],
        Extrapolation.CLAMP
      )
    }, {
      rotate: interpolate(
        height,
        [MAX_HEIGHT, FADE_THRESHOLD],
        [0, 15],
        Extrapolation.CLAMP
      ) + 'deg'
    }],
  }));

  // Floating particles
  const particle1Style = useAnimatedStyle(() => ({
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colorMode === "dark" ? 'rgba(242, 237, 255, 0.3)' : 'rgba(255, 255, 255, 0.4)',
    right: interpolate(height, [MAX_HEIGHT, MIN_HEIGHT], [60, 30], Extrapolation.CLAMP),
    top: interpolate(height, [MAX_HEIGHT, MIN_HEIGHT], [120, 60], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(height, [MAX_HEIGHT, MIN_HEIGHT], [1, 0.5], Extrapolation.CLAMP) }],
    opacity: interpolate(height, [200, MAX_HEIGHT], [0, 1], Extrapolation.CLAMP),
  }));

  const particle2Style = useAnimatedStyle(() => ({
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colorMode === "dark" ? 'rgba(242, 237, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)',
    right: interpolate(height, [MAX_HEIGHT, MIN_HEIGHT], [100, 50], Extrapolation.CLAMP),
    top: interpolate(height, [MAX_HEIGHT, MIN_HEIGHT], [80, 40], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(height, [MAX_HEIGHT, MIN_HEIGHT], [1, 0.3], Extrapolation.CLAMP) }],
    opacity: interpolate(height, [180, MAX_HEIGHT], [0, 0.8], Extrapolation.CLAMP),
  }));

  const particle3Style = useAnimatedStyle(() => ({
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colorMode === "dark" ? 'rgba(242, 237, 255, 0.4)' : 'rgba(255, 255, 255, 0.5)',
    right: interpolate(height, [MAX_HEIGHT, MIN_HEIGHT], [140, 70], Extrapolation.CLAMP),
    top: interpolate(height, [MAX_HEIGHT, MIN_HEIGHT], [160, 80], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(height, [MAX_HEIGHT, MIN_HEIGHT], [1, 0.6], Extrapolation.CLAMP) }],
    opacity: interpolate(height, [220, MAX_HEIGHT], [0, 0.6], Extrapolation.CLAMP),
  }));

  // Big time display - uses full space, fades away on scroll
  const timeContentStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: interpolate(height, [MAX_HEIGHT, MIN_HEIGHT], [120, 60], Extrapolation.CLAMP),
    left: 0,
    right: 0,
    opacity: interpolate(height, [GREETING_FADE_POINT, MAX_HEIGHT], [0, 1], Extrapolation.CLAMP),
    transform: [{
      translateY: interpolate(height, [MAX_HEIGHT, MIN_HEIGHT], [0, -50], Extrapolation.CLAMP)
    }, {
      scale: interpolate(height, [MAX_HEIGHT, MIN_HEIGHT], [1, 0.7], Extrapolation.CLAMP)
    }],
  }));

  const timeTextStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(height, [MAX_HEIGHT, MIN_HEIGHT], [56, 32], Extrapolation.CLAMP),
    letterSpacing: interpolate(height, [MAX_HEIGHT, MIN_HEIGHT], [4, 2], Extrapolation.CLAMP),
  }));

  // When scrolled up, greeting covers the whole box
  const expandedGreetingStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: interpolate(height, [GREETING_FADE_POINT, MIN_HEIGHT + 40], [0, 1], Extrapolation.CLAMP), // Changed fade point
    transform: [{
      scale: interpolate(height, [GREETING_FADE_POINT, MIN_HEIGHT + 40], [0.8, 1], Extrapolation.CLAMP)
    }],
  }));

  const expandedGreetingTextStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(height, [GREETING_FADE_POINT, MIN_HEIGHT], [24, 18], Extrapolation.CLAMP), // Reduced size to avoid duplication
    textAlign: 'center',
  }));

  return (
    <Box className="bg-background-0 rounded-b-3xl overflow-hidden flex-1">
      <ImageBackground
        source={
          colorMode === "dark"
            ? require("@/assets/images/liq.jpeg")
            : require("@/assets/images/weather-bg-light.webp")
        }
        className="h-full"
      >
        {/* Floating particles */}
        <Animated.View style={particle1Style} />
        <Animated.View style={particle2Style} />
        <Animated.View style={particle3Style} />

        <Animated.View
          style={[
            {
              margin: 20,
              display: "flex",
              flex: 1,
              flexDirection: "column",
              position: 'relative',
            },
            containerStyle,
          ]}
        >
          {/* Header Section with Greeting */}
          <HStack className="justify-between items-start">
            <VStack className="gap-1 flex-1">
              <HStack className="items-center gap-2">
                <Animated.Text
                  style={[
                    {
                      fontFamily: "dm-sans-bold",
                      color: colorMode === "dark" ? "#F2EDFF" : "#FEFEFF",
                      textShadowColor: 'rgba(0, 0, 0, 0.3)',
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 2,
                    },
                    greetingTextStyle,
                  ]}
                >
                  {getGreeting()}!
                </Animated.Text>
                {locationError && (
                  <Animated.View
                    style={{
                      opacity: interpolate(height, [200, MAX_HEIGHT], [0, 1], Extrapolation.CLAMP),
                    }}
                  >
                    
                  </Animated.View>
                )}
              </HStack>
              <Animated.Text
                style={[
                  {
                    fontFamily: "dm-sans-medium",
                    color: colorMode === "dark" ? "#E5E5E5" : "#F5F5F5",
                    textShadowColor: 'rgba(0, 0, 0, 0.2)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 1,
                  },
                  dateTextStyle,
                ]}
              >
                {formatFullDate()}
              </Animated.Text>
            </VStack>
            
            <Animated.View style={searchIconStyle}>
              <Icon as={SearchIcon} size="xl" className="text-background-700" />
            </Animated.View>
          </HStack>

          {/* Big Time Display - Full Space */}
          <Animated.View style={timeContentStyle}>
            <Animated.Text
              style={[
                {
                  fontFamily: "dm-sans-bold",
                  color: colorMode === "dark" ? "#F2EDFF" : "#FEFEFF",
                  textAlign: 'center',
                  textShadowColor: 'rgba(0, 0, 0, 0.5)',
                  textShadowOffset: { width: 0, height: 3 },
                  textShadowRadius: 6,
                  width: '100%',
                },
                timeTextStyle,
              ]}
            >
              {formatTime()}
            </Animated.Text>
          </Animated.View>

          {/* Expanded Greeting - Covers Whole Box When Scrolled */}
          <Animated.View style={expandedGreetingStyle}>
            <VStack className="items-center gap-2">
              <Animated.Text
                style={[
                  {
                    fontFamily: "dm-sans-bold",
                    color: colorMode === "dark" ? "#F2EDFF" : "#FEFEFF",
                    textShadowColor: 'rgba(0, 0, 0, 0.4)',
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  },
                  expandedGreetingTextStyle,
                ]}
              >
                {getGreeting()}!
              </Animated.Text>
              <Animated.Text
                style={[
                  {
                    fontFamily: "dm-sans-medium",
                    color: colorMode === "dark" ? "#E5E5E5" : "#F5F5F5",
                    textAlign: 'center',
                    fontSize: interpolate(height, [GREETING_FADE_POINT, MIN_HEIGHT], [16, 12], Extrapolation.CLAMP),
                  },
                ]}
              >
                {formatFullDate()}
              </Animated.Text>
            </VStack>
          </Animated.View>
        </Animated.View>
      </ImageBackground>
    </Box>
  );
};

export default Header;