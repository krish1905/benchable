import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, ImageSourcePropType, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"

// Define types
type Badge = {
  id: number
  name: string
  icon: keyof typeof Ionicons.glyphMap
  color: string
}

type Activity = {
  id: number
  type: "review" | "visit" | "photo"
  benchName: string
  date: string
}

type User = {
  name: string
  username: string
  avatar: ImageSourcePropType
  points: number
  level: string
  benchesVisited: number
  reviews: number
  badges: Badge[]
  recentActivity: Activity[]
}

export function ProfileScreen() {
  const { signOut } = useAuth();
  
  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Log Out",
          onPress: () => signOut(),
          style: "destructive"
        }
      ]
    );
  };

  // Mock user data
  const user: User = {
    name: "Krish Garg",
    username: "@krishg",
    avatar: require('../assets/user.png'), // Use local user.png file
    points: 1250,
    level: "Bench Explorer",
    benchesVisited: 47,
    reviews: 32,
    badges: [
      { id: 1, name: "First Bench", icon: "ribbon-outline", color: "#ffffff" },
      { id: 2, name: "Review Pro", icon: "star-outline", color: "#ffffff" },
      { id: 3, name: "Explorer", icon: "compass-outline", color: "#ffffff" },
      { id: 4, name: "Photographer", icon: "camera-outline", color: "#ffffff" },
    ],
    recentActivity: [
      { id: 1, type: "review", benchName: "Victoria Park Bench", date: "2 days ago" },
      { id: 2, type: "visit", benchName: "Kitchener City Hall", date: "5 days ago" },
      { id: 3, type: "photo", benchName: "Waterloo Park", date: "1 week ago" },
      { id: 4, type: "review", benchName: "McLennan Park", date: "2 weeks ago" },
    ],
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image source={user.avatar} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>{user.username}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.benchesVisited}</Text>
              <Text style={styles.statLabel}>BENCHES</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.reviews}</Text>
              <Text style={styles.statLabel}>REVIEWS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.points}</Text>
              <Text style={styles.statLabel}>POINTS</Text>
            </View>
          </View>
        </View>

        <View style={styles.levelContainer}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelLabel}>CURRENT LEVEL</Text>
            <Text style={styles.levelValue}>{user.level.toUpperCase()}</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: "75%" }]} />
            </View>
            <Text style={styles.progressText}>750 POINTS TO NEXT LEVEL</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BADGES</Text>
          <View style={styles.badgesContainer}>
            {user.badges.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}>
                  <Ionicons name={badge.icon} size={24} color="#000" />
                </View>
                <Text style={styles.badgeName}>{badge.name.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
          {user.recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons
                  name={
                    activity.type === "review"
                      ? "chatbubble-outline"
                      : activity.type === "visit"
                        ? "footsteps-outline"
                        : "camera-outline"
                  }
                  size={20}
                  color="#000"
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                  {activity.type === "review"
                    ? "REVIEWED "
                    : activity.type === "visit"
                      ? "VISITED "
                      : "ADDED PHOTO TO "}
                  <Text style={styles.activityBenchName}>{activity.benchName.toUpperCase()}</Text>
                </Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={20} color="#fff" />
            <Text style={styles.settingsText}>SETTINGS</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>LOG OUT</Text>
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
    paddingBottom: 80,
  },
  header: {
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#fff",
    fontFamily: "IBMPlexMono-Bold",
  },
  username: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 16,
    fontFamily: "IBMPlexMono-Regular",
  },
  statsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    paddingVertical: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#fff",
    fontFamily: "IBMPlexMono-Bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#aaa",
    fontFamily: "IBMPlexMono-Regular",
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#333",
  },
  levelContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  levelInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  levelLabel: {
    fontSize: 16,
    color: "#aaa",
    fontFamily: "IBMPlexMono-Regular",
  },
  levelValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "IBMPlexMono-Bold",
  },
  progressContainer: {
    width: "100%",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    marginBottom: 8,
  },
  progress: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#aaa",
    textAlign: "right",
    fontFamily: "IBMPlexMono-Regular",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff",
    fontFamily: "IBMPlexMono-Bold",
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  badgeItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    fontFamily: "IBMPlexMono-Medium",
  },
  activityItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
    justifyContent: "center",
  },
  activityText: {
    fontSize: 14,
    marginBottom: 4,
    color: "#fff",
    fontFamily: "IBMPlexMono-Regular",
  },
  activityBenchName: {
    fontWeight: "500",
    color: "#fff",
    fontFamily: "IBMPlexMono-Medium",
  },
  activityDate: {
    fontSize: 12,
    color: "#aaa",
    fontFamily: "IBMPlexMono-Regular",
  },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  settingsText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#fff",
    fontFamily: "IBMPlexMono-Medium",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 4,
    paddingHorizontal: 12,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#fff",
    fontFamily: "IBMPlexMono-Medium",
  },
})
