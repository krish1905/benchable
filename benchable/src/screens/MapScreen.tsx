"use client"

import { useState, useEffect, useRef } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image } from "react-native"
import MapView, { Marker, Callout, PROVIDER_GOOGLE, type MapStyleElement } from "react-native-maps"
import * as Location from "expo-location"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { mockBenches } from "../data/mockData"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

// Define types for our navigation and location
type RootStackParamList = {
  MapView: undefined
  BenchDetail: { benchId: string; name: string }
  AddBench: undefined
}

type MapScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>
}

type Bench = {
  id: string
  name: string
  latitude: number
  longitude: number
  tier: string
  rating: number
}

// Dark map style
const mapStyle: MapStyleElement[] = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#181818",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1b1b1b",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#2c2c2c",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8a8a8a",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#373737",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#3c3c3c",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#4e4e4e",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3d3d3d",
      },
    ],
  },
]

export function MapScreen({ navigation }: MapScreenProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [benches, setBenches] = useState<Bench[]>(mockBenches)
  const mapRef = useRef<MapView>(null)

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied")
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    })()
  }, [])

  const getBenchMarkerIcon = (tier: string): any => {
    // Use bench-basic.png for all bench types
    return require("../assets/bench-basic.png")
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>BENCHABLE</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddBench")}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addButtonText}>ADD BENCH</Text>
        </TouchableOpacity>
      </View>

      {errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyle}
          showsUserLocation
          initialRegion={
            location
              ? {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.0422,
                  longitudeDelta: 0.0221,
                }
              : {
                  // Center on Kitchener, Ontario
                  latitude: 43.4516,
                  longitude: -80.4925,
                  latitudeDelta: 0.0422,
                  longitudeDelta: 0.0221,
                }
          }
        >
          {benches.map((bench) => (
            <Marker
              key={bench.id}
              coordinate={{
                latitude: bench.latitude,
                longitude: bench.longitude,
              }}
              tracksViewChanges={false}
              image={require("../assets/bench-basic.png")}
            >
              <Callout
                tooltip
                onPress={() => navigation.navigate("BenchDetail", { benchId: bench.id, name: bench.name })}
              >
                <View style={styles.calloutView}>
                  <Text style={styles.calloutTitle}>{bench.name}</Text>
                  <Text style={styles.calloutRating}>★ {bench.rating.toFixed(1)}</Text>
                  <Text style={styles.calloutTier}>{bench.tier.toUpperCase()} TIER</Text>
                  <Text style={styles.calloutAction}>TAP FOR DETAILS</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "IBMPlexMono-Bold",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    marginLeft: 4,
    color: "#fff",
    fontWeight: "500",
    fontFamily: "IBMPlexMono-Medium",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff4040",
    textAlign: "center",
    margin: 20,
    fontFamily: "IBMPlexMono-Regular",
  },
  calloutView: {
    width: 160,
    padding: 10,
    backgroundColor: "#000",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#333",
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
    color: "#fff",
    fontFamily: "IBMPlexMono-Bold",
  },
  calloutRating: {
    color: "#fff",
    marginBottom: 2,
    fontFamily: "IBMPlexMono-Regular",
  },
  calloutTier: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 4,
    fontFamily: "IBMPlexMono-Regular",
  },
  calloutAction: {
    fontSize: 11,
    color: "#fff",
    fontStyle: "italic",
    fontFamily: "IBMPlexMono-Regular",
  },
})
