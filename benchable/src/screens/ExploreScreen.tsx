"use client"

import { useState } from "react"
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, TextInput, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { mockBenches } from "../data/mockData"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

// Define types
type RootStackParamList = {
  MapView: undefined
  BenchDetail: { benchId: string; name: string }
  AddBench: undefined
}

type MainTabParamList = {
  Map: { screen?: string; params?: any }
  Explore: undefined
  Profile: undefined
}

type ExploreScreenProps = {
  navigation: NativeStackNavigationProp<MainTabParamList>
}

type Bench = {
  id: string
  name: string
  location: string
  tier: string
  rating: number
  reviews: Array<any>
  images: string[]
}

export function ExploreScreen({ navigation }: ExploreScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "premium" | "good" | "basic">("all")

  const filteredBenches = mockBenches.filter((bench: Bench) => {
    const matchesSearch =
      bench.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bench.location.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeFilter === "all") return matchesSearch
    return matchesSearch && bench.tier === activeFilter
  })

  const renderBenchItem = ({ item }: { item: Bench }) => (
    <TouchableOpacity
      style={styles.benchCard}
      onPress={() => navigation.navigate('Map', {
        screen: 'BenchDetail',
        params: { benchId: item.id, name: item.name }
      })}
    >
      <Image source={item.images[0]} style={styles.benchImage} />
      <View style={styles.benchInfo}>
        <Text style={styles.benchName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#fff" />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({item.reviews.length})</Text>
        </View>
        <Text style={styles.benchLocation}>{item.location}</Text>
        <View style={[styles.tierBadge, { backgroundColor: getTierColor(item.tier) }]}>
          <Text style={styles.tierText}>{item.tier.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const getTierColor = (tier: string): string => {
    switch (tier) {
      case "premium":
        return "#ffffff" // White
      case "good":
        return "#aaaaaa" // Light gray
      case "basic":
        return "#555555" // Dark gray
      default:
        return "#333333" // Very dark gray
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.title}>EXPLORE BENCHES</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search benches by name or location"
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === "all" && styles.activeFilter]}
            onPress={() => setActiveFilter("all")}
          >
            <Text style={[styles.filterText, activeFilter === "all" && styles.activeFilterText]}>ALL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === "premium" && styles.activeFilter]}
            onPress={() => setActiveFilter("premium")}
          >
            <Text style={[styles.filterText, activeFilter === "premium" && styles.activeFilterText]}>PREMIUM</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === "good" && styles.activeFilter]}
            onPress={() => setActiveFilter("good")}
          >
            <Text style={[styles.filterText, activeFilter === "good" && styles.activeFilterText]}>GOOD</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === "basic" && styles.activeFilter]}
            onPress={() => setActiveFilter("basic")}
          >
            <Text style={[styles.filterText, activeFilter === "basic" && styles.activeFilterText]}>BASIC</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={filteredBenches}
        renderItem={renderBenchItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.benchList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#666" />
            <Text style={styles.emptyText}>NO BENCHES FOUND</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    padding: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "IBMPlexMono-Bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 12,
    backgroundColor: "#111",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#fff",
    fontFamily: "IBMPlexMono-Regular",
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: "#111",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  activeFilter: {
    backgroundColor: "#fff",
  },
  filterText: {
    color: "#fff",
    fontFamily: "IBMPlexMono-Medium",
  },
  activeFilterText: {
    color: "#000",
  },
  benchList: {
    padding: 16,
    paddingBottom: 80,
  },
  benchCard: {
    flexDirection: "row",
    backgroundColor: "#111",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
  },
  benchImage: {
    width: 120,
    height: 120,
  },
  benchInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  benchName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#fff",
    fontFamily: "IBMPlexMono-Bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: "500",
    color: "#fff",
    fontFamily: "IBMPlexMono-Medium",
  },
  reviewCount: {
    fontSize: 12,
    color: "#aaa",
    marginLeft: 4,
    fontFamily: "IBMPlexMono-Regular",
  },
  benchLocation: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 8,
    fontFamily: "IBMPlexMono-Regular",
  },
  tierBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tierText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "500",
    fontFamily: "IBMPlexMono-Medium",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#fff",
    fontFamily: "IBMPlexMono-Bold",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    fontFamily: "IBMPlexMono-Regular",
  },
})
