"use client"

import { useState } from "react"
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import * as Location from "expo-location"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

// Define types
type RootStackParamList = {
  MapView: undefined
  BenchDetail: { benchId: string; name: string }
  AddBench: undefined
}

type AddBenchScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>
}

export function AddBenchScreen({ navigation }: AddBenchScreenProps) {
  const [benchName, setBenchName] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [features, setFeatures] = useState<string[]>([""])
  const [images, setImages] = useState<string[]>([])
  const [selectedTier, setSelectedTier] = useState<"basic" | "good" | "premium">("basic")

  const addFeatureField = () => {
    setFeatures([...features, ""])
  }

  const updateFeature = (text: string, index: number) => {
    const updatedFeatures = [...features]
    updatedFeatures[index] = text
    setFeatures(updatedFeatures)
  }

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      const updatedFeatures = [...features]
      updatedFeatures.splice(index, 1)
      setFeatures(updatedFeatures)
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri])
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!")
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri])
    }
  }

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== "granted") {
      alert("Permission to access location was denied")
      return
    }

    const location = await Location.getCurrentPositionAsync({})

    // In a real app, you would use a geocoding service to get the address
    setLocation(`${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`)
  }

  const submitBench = () => {
    if (!benchName.trim()) {
      alert("Please enter a bench name")
      return
    }

    if (!location.trim()) {
      alert("Please enter a location")
      return
    }

    if (images.length === 0) {
      alert("Please add at least one image")
      return
    }

    // In a real app, this would send the data to a backend
    alert("Bench submitted successfully!")
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>BENCH NAME *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a name for this bench"
            placeholderTextColor="#666"
            value={benchName}
            onChangeText={setBenchName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>DESCRIPTION</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe this bench and what makes it special"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>LOCATION *</Text>
          <View style={styles.locationContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Address or coordinates"
              placeholderTextColor="#666"
              value={location}
              onChangeText={setLocation}
            />
            <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
              <Ionicons name="location" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>BENCH TIER</Text>
          <View style={styles.tierContainer}>
            <TouchableOpacity
              style={[
                styles.tierButton,
                selectedTier === "basic" && styles.selectedTierButton,
                { backgroundColor: selectedTier === "basic" ? "#fff" : "#111" },
              ]}
              onPress={() => setSelectedTier("basic")}
            >
              <Text style={[styles.tierButtonText, selectedTier === "basic" && styles.selectedTierText]}>BASIC</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tierButton,
                selectedTier === "good" && styles.selectedTierButton,
                { backgroundColor: selectedTier === "good" ? "#fff" : "#111" },
              ]}
              onPress={() => setSelectedTier("good")}
            >
              <Text style={[styles.tierButtonText, selectedTier === "good" && styles.selectedTierText]}>GOOD</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tierButton,
                selectedTier === "premium" && styles.selectedTierButton,
                { backgroundColor: selectedTier === "premium" ? "#fff" : "#111" },
              ]}
              onPress={() => setSelectedTier("premium")}
            >
              <Text style={[styles.tierButtonText, selectedTier === "premium" && styles.selectedTierText]}>
                PREMIUM
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>FEATURES</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder={`Feature ${index + 1}`}
                placeholderTextColor="#666"
                value={feature}
                onChangeText={(text) => updateFeature(text, index)}
              />
              <TouchableOpacity style={styles.removeButton} onPress={() => removeFeature(index)}>
                <Ionicons name="remove-circle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addFeatureField}>
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.addButtonText}>ADD FEATURE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>PHOTOS *</Text>
          <View style={styles.imagesContainer}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => {
                    const updatedImages = [...images]
                    updatedImages.splice(index, 1)
                    setImages(updatedImages)
                  }}
                >
                  <Ionicons name="close-circle" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 5 && (
              <View style={styles.imageActions}>
                <TouchableOpacity style={styles.imageActionButton} onPress={pickImage}>
                  <Ionicons name="images" size={24} color="#fff" />
                  <Text style={styles.imageActionText}>GALLERY</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageActionButton} onPress={takePhoto}>
                  <Ionicons name="camera" size={24} color="#fff" />
                  <Text style={styles.imageActionText}>CAMERA</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={submitBench}>
          <Text style={styles.submitButtonText}>SUBMIT BENCH</Text>
        </TouchableOpacity>
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
    padding: 16,
    paddingBottom: 30,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff",
    fontFamily: "IBMPlexMono-Bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#111",
    color: "#fff",
    fontFamily: "IBMPlexMono-Regular",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationButton: {
    backgroundColor: "#fff",
    width: 48,
    height: 48,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  tierContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tierButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#333",
  },
  selectedTierButton: {
    borderWidth: 0,
  },
  tierButtonText: {
    fontWeight: "500",
    color: "#fff",
    fontFamily: "IBMPlexMono-Medium",
  },
  selectedTierText: {
    color: "#000",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  removeButton: {
    marginLeft: 8,
    padding: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  addButtonText: {
    marginLeft: 8,
    color: "#fff",
    fontWeight: "500",
    fontFamily: "IBMPlexMono-Medium",
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageWrapper: {
    position: "relative",
    width: 100,
    height: 100,
    margin: 4,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  removeImageButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "transparent",
    borderRadius: 12,
  },
  imageActions: {
    width: 100,
    height: 100,
    margin: 4,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 4,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  imageActionButton: {
    alignItems: "center",
    margin: 4,
  },
  imageActionText: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
    fontFamily: "IBMPlexMono-Regular",
  },
  submitButton: {
    backgroundColor: "#fff",
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "IBMPlexMono-Bold",
  },
})
