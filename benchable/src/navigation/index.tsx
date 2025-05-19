import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import { MapScreen } from "../screens/MapScreen"
import { BenchDetailScreen } from "../screens/BenchDetailScreen"
import { ProfileScreen } from "../screens/ProfileScreen"
import { ExploreScreen } from "../screens/ExploreScreen"
import { AddBenchScreen } from "../screens/AddBenchScreen"

// Define the stack param list to fix typing issues
export type RootStackParamList = {
  MapView: undefined
  BenchDetail: { benchId: string; name: string }
  AddBench: undefined
}

export type MainTabParamList = {
  Map: { screen?: string; params?: any }
  Explore: undefined
  Profile: undefined
}

const Tab = createBottomTabNavigator<MainTabParamList>()
const Stack = createNativeStackNavigator<RootStackParamList>()

export function MapStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontFamily: "IBMPlexMono-Bold",
        },
        contentStyle: {
          backgroundColor: "#000",
        },
      }}
    >
      <Stack.Screen name="MapView" component={MapScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="BenchDetail"
        component={BenchDetailScreen}
        options={({ route }) => ({
          title: route.params?.name || "BENCH DETAILS",
        })}
      />
      <Stack.Screen name="AddBench" component={AddBenchScreen} options={{ title: "ADD NEW BENCH" }} />
    </Stack.Navigator>
  )
}

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap | undefined;

          if (route.name === "Map") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "Explore") {
            iconName = focused ? "compass" : "compass-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopColor: "#333",
          borderTopWidth: 1,
          paddingTop: 5,
          height: 80,
          paddingBottom: 5,
          position: 'relative',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          marginBottom: 0,
          fontFamily: 'IBMPlexMono-Medium',
        },
        headerStyle: {
          backgroundColor: "#000",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontFamily: 'IBMPlexMono-Bold',
        },
      })}
    >
      <Tab.Screen name="Map" component={MapStack} options={{ headerShown: false }} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
} 