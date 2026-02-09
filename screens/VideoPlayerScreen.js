import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = width * 0.5625; // 16:9 aspect ratio

const VideoPlayerScreen = ({ route, navigation }) => {
    const { title, streamUrl, videoId } = route.params;
    const [videoData, setVideoData] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStreamInfo();
        fetchRelatedVideos();
    }, [videoId]);

    const fetchStreamInfo = async () => {
        setLoading(true);
        try {
            const response = await api.get(streamUrl);
            setVideoData(response.data);
        } catch (error) {
            console.error('Stream info error', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedVideos = async () => {
        try {
            const response = await api.get('/videos/dashboard');
            // Filter out current video from related
            const others = response.data.filter(v => v.id !== videoId);
            setRelatedVideos(others);
        } catch (error) {
            console.error('Related videos error', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Video Container */}
                <View style={styles.videoWrapper}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#ff0050" />
                            <Text style={styles.loadingText}>Securing Connection...</Text>
                        </View>
                    ) : (
                        <View style={styles.player}>
                            {videoData?.youtube_id ? (
                                <YoutubePlayer
                                    height={VIDEO_HEIGHT}
                                    play={true}
                                    videoId={videoData.youtube_id}
                                    initialPlayerParams={{
                                        controls: true,
                                        modestbranding: false,
                                        rel: false
                                    }}
                                />
                            ) : (
                                <View style={styles.errorBox}>
                                    <Ionicons name="alert-circle" size={40} color="#ff0050" />
                                    <Text style={styles.errorText}>Video restricted or not found</Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text style={styles.videoTitle}>{title}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>4K ULTRA HD</Text>
                        </View>
                    </View>

                    {/* Security Card */}
                    <LinearGradient
                        colors={['#1a1a1a', '#0a0a0a']}
                        style={styles.securityCard}
                    >
                        <View style={styles.securityHeader}>
                            <Ionicons name="shield-checkmark" size={20} color="#00ffcc" />
                            <Text style={styles.securityTitle}>Vora Masked Stream™</Text>
                        </View>
                        <Text style={styles.securityText}>
                            Your connection is obfuscated. The source URL is protected by advanced AI-First backend shielding to ensure privacy and content integrity.
                        </Text>
                    </LinearGradient>

                    {/* Related Section */}
                    {relatedVideos.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Up Next</Text>
                            {relatedVideos.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.relatedItem}
                                    onPress={() => navigation.replace('VideoPlayer', {
                                        videoId: item.id,
                                        title: item.title,
                                        streamUrl: item.stream_url
                                    })}
                                >
                                    <View style={styles.relatedThumbContainer}>
                                        <Image source={{ uri: item.thumbnail_url }} style={styles.relatedThumb} />
                                        <LinearGradient
                                            colors={['transparent', 'rgba(0,0,0,0.6)']}
                                            style={styles.thumbGradient}
                                        />
                                    </View>
                                    <View style={styles.relatedInfo}>
                                        <Text style={styles.relatedTitle} numberOfLines={2}>{item.title}</Text>
                                        <Text style={styles.relatedAuthor}>Recommended for you</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f0f',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 15,
        paddingBottom: 15,
        backgroundColor: '#0f0f0f',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoWrapper: {
        width: '100%',
        backgroundColor: '#000',
        aspectRatio: 16 / 9,
        justifyContent: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
    },
    loadingText: {
        color: '#ff0050',
        marginTop: 10,
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    player: {
        width: '100%',
    },
    errorBox: {
        alignItems: 'center',
        padding: 40,
    },
    errorText: {
        color: '#888',
        marginTop: 10,
        fontSize: 14,
    },
    content: {
        padding: 20,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    videoTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        marginRight: 10,
    },
    badge: {
        backgroundColor: '#333',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
    },
    securityCard: {
        borderRadius: 15,
        padding: 15,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#222',
    },
    securityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    securityTitle: {
        color: '#00ffcc',
        fontWeight: 'bold',
        marginLeft: 10,
        fontSize: 14,
    },
    securityText: {
        color: '#aaa',
        fontSize: 12,
        lineHeight: 18,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    relatedItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    relatedThumbContainer: {
        width: 140,
        height: 80,
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    relatedThumb: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    thumbGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 30,
    },
    relatedInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    relatedTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    relatedAuthor: {
        color: '#666',
        fontSize: 11,
    }
});

export default VideoPlayerScreen;
