import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, LayoutAnimation, Platform, UIManager, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';
import { deleteToken } from '../services/auth';

const DashboardScreen = ({ navigation }) => {
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [user, setUser] = useState(null);

    if (Platform.OS === 'android') {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        await Promise.all([fetchVideos(), fetchUser()]);
        setLoading(false);
    };

    const fetchUser = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            console.error('User fetch error', error);
        }
    };

    const fetchVideos = async () => {
        try {
            const response = await api.get('/videos/dashboard');
            setVideos(response.data);
            setFilteredVideos(response.data);
        } catch (error) {
            console.error('Fetch error', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchVideos();
        setRefreshing(false);
    };

    useEffect(() => {
        const filtered = videos.filter(v =>
            v.title.toLowerCase().includes(search.toLowerCase()) ||
            v.description.toLowerCase().includes(search.toLowerCase())
        );
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFilteredVideos(filtered);
    }, [search, videos]);

    const handleLogout = async () => {
        await deleteToken();
        navigation.replace('Auth');
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
                <View>
                    <Text style={styles.headerSubtitle}>
                        {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'Featured for you'}
                    </Text>
                    <Text style={styles.headerTitle}>Vora</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <Text style={styles.logout}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search videos..."
                    placeholderTextColor="#666"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#ff0050" />
                    <Text style={styles.loaderText}>Syncing your feed...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredVideos}
                    renderItem={renderVideo}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#ff0050"
                            colors={['#ff0050']}
                        />
                    }
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
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerSubtitle: {
        color: '#888',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
    },
    logoutBtn: {
        backgroundColor: 'rgba(255, 0, 80, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    logout: {
        color: '#ff0050',
        fontWeight: 'bold',
        fontSize: 12,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    searchInput: {
        backgroundColor: '#1a1a1a',
        height: 45,
        borderRadius: 25,
        paddingHorizontal: 20,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderText: {
        color: '#666',
        marginTop: 15,
        fontSize: 14,
        letterSpacing: 0.5,
    },
    list: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        marginBottom: 25,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#222',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
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

export default DashboardScreen;
