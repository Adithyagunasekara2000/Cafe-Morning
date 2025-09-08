import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AestheticCafe() {
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [pickedImage, setPickedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

 
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setPickedImage(result.assets[0]); 
    }
  };

 
  const handleUpload = async () => {
    if (!pickedImage) {
      Alert.alert("Error", "Please select an image first");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Error", "You must be logged in to upload posts");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("location", location);
    formData.append("image", {
      uri: pickedImage.uri,
      name: pickedImage.fileName || "post.jpg",
      type: pickedImage.type || "image/jpeg",
    });

    try {
      setUploading(true);
      const response = await fetch("http://localhost:8080/api/posts/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Upload failed");
      }

      const data = await response.json();
      Alert.alert("Success", "Post uploaded!");
      setPickedImage(null);
      setCaption("");
      setLocation("");
      fetchPosts(); 
    } catch (err) {
      console.error("Upload error:", err.message);
      Alert.alert("Error", err.message);
    } finally {
      setUploading(false);
    }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await fetch("http://localhost:8080/api/posts/all");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Fetch posts error:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Upload a Post</Text>

      <TextInput
        placeholder="Enter caption"
        value={caption}
        onChangeText={setCaption}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>

      {/* Preview selected image */}
      {pickedImage && (
        <Image
          source={{ uri: pickedImage.uri }}
          style={styles.previewImage}
        />
      )}

      <TouchableOpacity
        onPress={handleUpload}
        style={[styles.button, uploading && { opacity: 0.7 }]}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? "Uploading..." : "Upload Post"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.feedTitle}>All Posts</Text>

      {loadingPosts ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            {post.imagePath && (
              <Image
                source={{ uri: `http://localhost:8080/api/posts/images/${post.imagePath}` }}
                style={styles.postImage}
              />
            )}
            <Text style={styles.postCaption}>{post.caption}</Text>
            <Text style={styles.postLocation}>📍 {post.location}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: {
    width: "95%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FFD700",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    width: "95%",
    alignItems: "center",
  },
  buttonText: { fontWeight: "bold", color: "white" },
  previewImage: { width: 200, height: 200, borderRadius: 15, marginVertical: 10 },
  feedTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 20 },
  postCard: {
    width: "95%",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },
  postImage: { width: "100%", height: 200, borderRadius: 10 },
  postCaption: { fontSize: 16, fontWeight: "bold", marginTop: 8 },
  postLocation: { fontSize: 14, color: "gray", marginTop: 4 },
});
