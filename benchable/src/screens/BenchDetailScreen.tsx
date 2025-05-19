"use client"

import { useState } from "react"
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { mockBenches } from "../data/mockData"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RouteProp } from "@react-navigation/native"

// Define types
type RootStackParamList = {
  MapView: undefined
  BenchDetail: { benchId: string; name: string }
  AddBench: undefined
}

type BenchDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>
  route: RouteProp<RootStackParamList, "BenchDetail">
}

type Review = {
  userName: string
  userAvatar: string
  rating: number
  text: string
  date: string
}

type Bench = {
  id: string
  name: string
  description: string
  location: string
  rating: number
  tier: string
  features: string[]
  images: string[]
  reviews: Review[]
}

export function BenchDetailScreen({ route, navigation }: BenchDetailScreenProps) {
  const { benchId } = route.params
  const bench = mockBenches.find((b: any) => b.id === benchId) as Bench | undefined

  const [newReview, setNewReview] = useState("")
  const [userRating, setUserRating] = useState(0)

  if (!bench) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Bench not found</Text>
      </SafeAreaView>
    )
  }

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setUserRating(i)} style={styles.starButton}>
          <Ionicons
            name={i <= userRating ? "star" : "star-outline"}
            size={24}
            color={i <= userRating ? "#fff" : "#666"}
          />
        </TouchableOpacity>,
      )
    }
    return stars
  }

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

  const submitReview = () => {
    if (newReview.trim() === "" || userRating === 0) {
      alert("Please enter a review and rating")
      return
    }

    // In a real app, this would send the review to a backend
    alert("Review submitted successfully!")
    setNewReview("")
    setUserRating(0)
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image source={bench.images[0]} style={styles.benchImage} resizeMode="cover" />
          <View style={[styles.tierBadge, { backgroundColor: getTierColor(bench.tier) }]}>
            <Text style={styles.tierText}>{bench.tier.toUpperCase()} TIER</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.benchName}>{bench.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#fff" />
            <Text style={styles.ratingText}>{bench.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({bench.reviews.length} reviews)</Text>
          </View>
          <Text style={styles.location}>{bench.location}</Text>
          <Text style={styles.description}>{bench.description}</Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>FEATURES</Text>
          <View style={styles.featuresList}>
            {bench.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.photosContainer}>
          <Text style={styles.sectionTitle}>PHOTOS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosList}>
            {bench.images.map((image, index) => (
              <Image key={index} source={image} style={styles.photoThumbnail} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.reviewsContainer}>
          <Text style={styles.sectionTitle}>REVIEWS</Text>
          {bench.reviews.map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Image source={review.userAvatar} style={styles.reviewerAvatar} />
                <View>
                  <Text style={styles.reviewerName}>{review.userName}</Text>
                  <View style={styles.reviewRating}>
                    {[...Array(5)].map((_, i) => (
                      <Ionicons
                        key={i}
                        name={i < review.rating ? "star" : "star-outline"}
                        size={14}
                        color={i < review.rating ? "#fff" : "#666"}
                        style={{ marginRight: 2 }}
                      />
                    ))}
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.addReviewContainer}>
          <Text style={styles.sectionTitle}>ADD YOUR REVIEW</Text>
          <View style={styles.ratingInput}>{renderStars(userRating)}</View>
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience with this bench..."
            placeholderTextColor="#666"
            multiline
            value={newReview}
            onChangeText={setNewReview}
          />
          <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
            <Text style={styles.submitButtonText}>SUBMIT REVIEW</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#ff4040",
    textAlign: "center",
    margin: 20,
    fontFamily: "IBMPlexMono-Regular",
  },
  imageContainer: {
    position: "relative",
  },
  benchImage: {
    width: "100%",
    height: 250,
  },
  tierBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  tierText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
    fontFamily: "IBMPlexMono-Bold",
  },
  infoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  benchName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff",
    fontFamily: "IBMPlexMono-Bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 4,
    color: "#fff",
    fontFamily: "IBMPlexMono-Bold",
  },
  reviewCount: {
    fontSize: 14,
    color: "#aaa",
    marginLeft: 4,
    fontFamily: "IBMPlexMono-Regular",
  },
  location: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 12,
    fontFamily: "IBMPlexMono-Regular",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#fff",
    fontFamily: "IBMPlexMono-Regular",
  },
  featuresContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#fff",
    fontFamily: "IBMPlexMono-Bold",
  },
  featuresList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#fff",
    fontFamily: "IBMPlexMono-Regular",
  },
  photosContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  photosList: {
    flexDirection: "row",
  },
  photoThumbnail: {
    width: 120,
    height: 90,
    borderRadius: 4,
    marginRight: 8,
  },
  reviewsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  reviewHeader: {
    flexDirection: "row",
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#fff",
    fontFamily: "IBMPlexMono-Bold",
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: "#aaa",
    marginLeft: 6,
    fontFamily: "IBMPlexMono-Regular",
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#fff",
    fontFamily: "IBMPlexMono-Regular",
  },
  addReviewContainer: {
    padding: 16,
  },
  ratingInput: {
    flexDirection: "row",
    marginBottom: 12,
  },
  starButton: {
    marginRight: 8,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 4,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 16,
    color: "#fff",
    backgroundColor: "#111",
    fontFamily: "IBMPlexMono-Regular",
  },
  submitButton: {
    backgroundColor: "#fff",
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "IBMPlexMono-Bold",
  },
})
