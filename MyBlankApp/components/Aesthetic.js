import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Asset } from "expo-asset";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function AestheticCafe() {
  const [liked, setLiked] = useState(false);
  const [localUri, setLocalUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadAsset = async () => {
      try {
        const asset = Asset.fromModule(require("../assets/bg.jpg"));
        await asset.downloadAsync();
        setLocalUri(asset.localUri);
      } catch (error) {
        console.error("Error loading asset:", error);
        // Fallback for web - use a placeholder image
        setLocalUri("https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
      } finally {
        setLoading(false);
      }
    };
    loadAsset();
  }, []);

  const handleDownload = async () => {
    if (!localUri) {
      Alert.alert("Error", "Image not available for download");
      return;
    }

    setDownloading(true);

    try {
      if (Platform.OS === 'web') {
        // Web-specific download logic
        const response = await fetch(localUri);
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `aesthetic_cafe_${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        Alert.alert("✨ Success!", "Image downloaded to your Downloads folder");
      } else {
        // Mobile download logic (original code for when running on mobile)
        const { MediaLibrary, FileSystem } = require('expo-media-library');
        
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Please grant media library permission to save images."
          );
          return;
        }

        const timestamp = new Date().getTime();
        const filename = `aesthetic_cafe_${timestamp}.jpg`;
        const fileUri = `${FileSystem.documentDirectory}${filename}`;

        await FileSystem.copyAsync({
          from: localUri,
          to: fileUri,
        });

        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync("Aesthetic Cafe", asset, false);

        Alert.alert(
          "✨ Success!",
          "Image saved to your gallery in 'Aesthetic Cafe' album"
        );
      }
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("❌ Download Failed", "Could not save image");
    } finally {
      setDownloading(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = async () => {
    try {
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: 'Aesthetic Cafe',
            text: 'Check out this beautiful aesthetic image!',
            url: localUri,
          });
        } else {
          // Fallback for browsers without native share
          await navigator.clipboard.writeText(localUri);
          Alert.alert("✨ Copied!", "Image URL copied to clipboard");
        }
      } else {
        // Mobile share logic would go here
        Alert.alert("Share", "Share functionality for mobile");
      }
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={["#b76196ff", "#eac0e6ff", "#c0bbbfff"]} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading beautiful images...</Text>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Aesthetic Cafe</Text>
      </View>

      <Text style={styles.subtitle}>Discover Beautiful Moments</Text>

      {/* Platform indicator */}
      <View style={styles.platformIndicator}>
        <Text style={styles.platformText}>
          Running on {Platform.OS} • {Platform.OS === 'web' ? 'Web Download Available' : 'Mobile Gallery Save'}
        </Text>
      </View>

      {/* Main Image Container */}
      {localUri && (
        <View style={styles.imageWrapper}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: localUri }} style={styles.image} resizeMode="cover" />
            
            {/* Gradient Overlay */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={styles.gradientOverlay}
            />

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, liked && styles.likedButton]}
                onPress={handleLike}
                activeOpacity={0.7}
              >
                <AntDesign
                  name={liked ? "heart" : "hearto"}
                  size={24}
                  color={liked ? "#ff6b6b" : "white"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
                activeOpacity={0.7}
              >
                <Feather name="share-2" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, downloading && styles.downloadingButton]}
                onPress={handleDownload}
                activeOpacity={0.7}
                disabled={downloading}
              >
                {downloading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Feather name="download" size={24} color="white" />
                )}
              </TouchableOpacity>
            </View>

            {/* Image Info */}
            <View style={styles.imageInfo}>
              <Text style={styles.imageTitle}>Aesthetic Moment</Text>
              <Text style={styles.imageDescription}>
                Captured beauty • Tap ❤️ to like • ⬇️ to {Platform.OS === 'web' ? 'download' : 'save'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Bottom Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <AntDesign name="heart" size={20} color="#ff6b6b" />
          <Text style={styles.statText}>{liked ? "1" : "0"} Likes</Text>
        </View>
        <View style={styles.statItem}>
          <Feather name="eye" size={20} color="#4ecdc4" />
          <Text style={styles.statText}>Beautiful</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialIcons name="devices" size={20} color="#FFD700" />
          <Text style={styles.statText}>{Platform.OS}</Text>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>💡 How it works:</Text>
        <Text style={styles.instructionText}>
          {Platform.OS === 'web' 
            ? "• Click download to save to your Downloads folder\n• Use share to copy link or share natively\n• For mobile experience, run on device/emulator"
            : "• Download saves to gallery\n• Share opens native sharing\n• Images saved in 'Aesthetic Cafe' album"
          }
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: Platform.OS === 'web' ? 20 : (StatusBar.currentHeight || 40),
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    color: "#FFD700",
    fontWeight: "bold",
    marginHorizontal: 15,
    ...(Platform.OS === 'web' && {
      textShadow: "1px 1px 3px rgba(0,0,0,0.3)"
    }),
  },
  subtitle: {
    fontSize: 16,
    color: "#a8a8a8",
    marginBottom: 15,
    fontStyle: "italic",
  },
  platformIndicator: {
    backgroundColor: "rgba(255,215,0,0.1)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.3)",
  },
  platformText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "500",
  },
  loadingText: {
    color: "#FFD700",
    marginTop: 20,
    fontSize: 16,
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageContainer: {
    width: Math.min(width * 0.85, 400),
    height: Math.min(height * 0.4, 300),
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    ...(Platform.OS === 'web' && {
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    }),
    ...(Platform.OS !== 'web' && {
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
    }),
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  actionButtons: {
    position: "absolute",
    top: 15,
    right: 15,
    flexDirection: "column",
    gap: 12,
  },
  actionButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    ...(Platform.OS === 'web' && {
      cursor: "pointer",
      backdropFilter: "blur(10px)",
    }),
  },
  likedButton: {
    backgroundColor: "rgba(255,107,107,0.2)",
  },
  downloadingButton: {
    backgroundColor: "rgba(78,205,196,0.3)",
  },
  imageInfo: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 80,
  },
  imageTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    ...(Platform.OS === 'web' && {
      textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
    }),
  },
  imageDescription: {
    color: "#e0e0e0",
    fontSize: 14,
    opacity: 0.9,
    ...(Platform.OS === 'web' && {
      textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
    }),
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: Math.min(width * 0.8, 300),
    marginTop: 20,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    color: "#a8a8a8",
    fontSize: 14,
    fontWeight: "500",
  },
  instructions: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  instructionTitle: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  instructionText: {
    color: "#a8a8a8",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "left",
  },
});