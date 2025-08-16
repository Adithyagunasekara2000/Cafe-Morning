import { useState, useEffect } from "react";
import { Dimensions, ImageBackground, StyleSheet, Text, TextInput, View, TouchableOpacity, FlatList } from "react-native";
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('window');

// Sample playlist
const playlist = [
    { id: '1', title: 'Ocean Breeze', file: require('../assets/music.mp3') },
    { id: '2', title: 'Mountain Echo', file: require('../assets/music.mp3') },
    { id: '3', title: 'Forest Whisper', file: require('../assets/music.mp3') }
];

export default function PlayList() {
    const [searchText, setSearchText] = useState("");
    const [currentTrackId, setCurrentTrackId] = useState(null);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    async function handlePlayPause(track) {
        if (currentTrackId !== track.id) {
            if (sound) {
                await sound.unloadAsync();
            }
            const { sound: newSound } = await Audio.Sound.createAsync(track.file);
            setSound(newSound);
            setCurrentTrackId(track.id);
            await newSound.playAsync();
            setIsPlaying(true);
        } else {
            const status = await sound.getStatusAsync();
            if (status.isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
            } else {
                await sound.playAsync();
                setIsPlaying(true);
            }
        }
    }

    async function handleStop() {
        if (sound) {
            await sound.stopAsync();
            setIsPlaying(false);
        }
    }

    async function handleDownload(track) {
        const uri = FileSystem.documentDirectory + `${track.title}.mp3`;
        const { localUri } = await FileSystem.downloadAsync(track.file, uri);
        alert(`Downloaded "${track.title}" to: ${localUri}`);
    }

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const filteredPlaylist = playlist.filter(track =>
        track.title.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/bg.jpg')}
                style={styles.backgroundImage}
                imageStyle={{ opacity: 0.4 }}
                resizeMode='cover'
            />
            <Text style={styles.head}>PlayList</Text>
            <TextInput
                style={styles.search}
                placeholder="Search..."
                value={searchText}
                onChangeText={text => setSearchText(text)}
            />

            <FlatList
                data={filteredPlaylist}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.trackCard}>
                        <Text style={styles.trackTitle}>{item.title}</Text>
                        <View style={styles.controlRow}>
                            <TouchableOpacity style={styles.controlButton} onPress={() => handlePlayPause(item)}>
                                <Text style={styles.controlText}>
                                    {currentTrackId === item.id && isPlaying ? "⏸" : "▶"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.controlButton} onPress={handleStop}>
                                <Text style={styles.controlText}>⏹</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.controlButton} onPress={() => handleDownload(item)}>
                                <Text style={styles.controlText}>⬇</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    backgroundImage: {
        position: 'absolute',
        width: width,
        height: height,
    },
    head: {
        fontSize: 28,
        color: "#FFD700",
        fontWeight: "bold",
        marginHorizontal: 15,
        textAlign: "center",
        textShadow: "1px 1px 3px rgba(0,0,0,0.5)"
    },
    search: {
        height: 60,
        width: '98%',
        borderColor: "#151111ff",
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: "white",
        alignItems: "center",
        marginLeft: 5,
        marginTop: 20
    },
    trackCard: {
       backgroundColor: 'rgba(64, 53, 53, 0.8)', 
        marginHorizontal: 10,
        marginBottom: 15,
        padding: 15,
        borderRadius: 10
    },
    trackTitle: {
        fontSize: 18,
        color: "#FFD700",
        fontWeight: "600",
        marginBottom: 10
    },
    controlRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },
    controlButton: {
        backgroundColor: "#484846",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8
    },
    controlText: {
        color: "#FFD700",
        fontSize: 20,
        fontWeight: "bold"
    }
});
