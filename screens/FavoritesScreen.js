
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, UIManager } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const FavoritesScreen = ({ navigation }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchFavorites();
        });
        return unsubscribe;
    }, [navigation]);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const response = await api.get('/videos/favorites');
            setVideos(response.data);
        } catch (error) {
            console.error('Fetch error', error);
        } finally {
            setLoading(false);
        }
    };

    const renderVideo = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('VideoPlayer', {
                videoId: item.id,
                title: item.title,
                streamUrl: item.stream_url
            })}
        >
            <View style={styles.thumbnailContainer}>
                <Image source={{ uri: item.thumbnail_url }} style={styles.thumbnail} />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradient}
                />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Favorites</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#ff0050" />
                </View>
            ) : videos.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-dislike-outline" size={80} color="#333" />
                    <Text style={styles.emptyText}>No favorites yet.</Text>
                    <Text style={styles.emptySubText}>Videos you like will appear here.</Text>
                </View>
            ) : (
                <FlatList
                    data={videos}
                    renderItem={renderVideo}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -50,
    },
    emptyText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    emptySubText: {
        color: '#666',
        marginTop: 10,
    },
    list: {
        padding: 20,
    },
    card: {
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        marginBottom: 25,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#222',
        elevation: 10,
    },
    thumbnailContainer: {
        position: 'relative',
        width: '100%',
        height: 200,
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
    },
    cardContent: {
        padding: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    desc: {
        fontSize: 14,
        color: '#888',
        lineHeight: 20,
    },
});

export default FavoritesScreen;
