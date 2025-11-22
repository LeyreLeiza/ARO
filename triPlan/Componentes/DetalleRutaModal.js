import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { obtenerRutaOSRM, generarRutaConCalles, ordenarRutaPorDistancia } from '../Funcionalidades/mapaHelpers';

const { height } = Dimensions.get('window');

export default function DetalleRutaModal({ visible, onClose, ruta, onStartRoute }) {
    const [totalDuration, setTotalDuration] = useState(null);

    useEffect(() => {
        if (visible && ruta && ruta.puntos_interes && ruta.puntos_interes.length > 0) {
            (async () => {
                try {
                    const { status } = await Location.requestForegroundPermissionsAsync();
                    if (status !== 'granted') return;

                    const location = await Location.getCurrentPositionAsync({});
                    const userLoc = {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    };

                    // 1. Order points by distance from user
                    const orden = ordenarRutaPorDistancia(userLoc, ruta.puntos_interes);

                    // 2. Calculate full route duration (User -> Point 1 -> ... -> Point N)
                    const { totalDuration: durationInSeconds } = await generarRutaConCalles(userLoc, orden);

                    // 3. Convert to minutes
                    const durationInMinutes = Math.round(durationInSeconds / 60);

                    setTotalDuration(durationInMinutes);
                } catch (error) {
                    console.log("Error calculating total duration:", error);
                    setTotalDuration(ruta.duracion);
                }
            })();
        } else {
            setTotalDuration(ruta ? ruta.duracion : 0);
        }
    }, [visible, ruta]);

    if (!ruta) return null;

    const paradas = ruta.puntos_interes ? ruta.puntos_interes.length : 0;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#666" />
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {/* Header */}
                        <Text style={styles.title}>{ruta.nombre}</Text>
                        <Text style={styles.description}>{ruta.descripcion}</Text>

                        {/* Stats Row */}
                        <View style={styles.statsRow}>
                            <View style={styles.statCard}>
                                <Ionicons name="time-outline" size={24} color="#4A90E2" />
                                <Text style={styles.statLabel}>Duración Total</Text>
                                <Text style={styles.statValue}>{totalDuration !== null ? totalDuration : '-'} min</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Ionicons name="location-outline" size={24} color="#4A90E2" />
                                <Text style={styles.statLabel}>Paradas</Text>
                                <Text style={styles.statValue}>{paradas}</Text>
                            </View>
                        </View>

                        {/* Points List */}
                        <Text style={styles.sectionTitle}>Puntos de la ruta</Text>
                        <View style={styles.pointsList}>
                            {ruta.puntos_interes && ruta.puntos_interes.map((punto, index) => (
                                <View key={punto.id || index} style={styles.pointItem}>
                                    <View style={styles.pointBadge}>
                                        <Text style={styles.pointIndex}>{index + 1}</Text>
                                    </View>
                                    <Text style={styles.pointName}>{punto.nombre}</Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Footer Button */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.startButton} onPress={onStartRoute}>
                            <Ionicons name="navigate" size={20} color="white" style={{ marginRight: 10 }} />
                            <Text style={styles.startButtonText}>Iniciar Ruta</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: height * 0.85, // Occupy 85% of screen
        padding: 20,
        paddingBottom: 30,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 5,
    },
    scrollContent: {
        paddingBottom: 80, // Space for footer
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        lineHeight: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 10,
        marginTop: 10,
    },
    difficultyTag: {
        backgroundColor: '#E8F0FE',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    difficultyText: {
        color: '#1A73E8',
        fontWeight: '600',
        fontSize: 14,
    },
    pointsList: {
        marginTop: 5,
    },
    pointItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    pointBadge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    pointIndex: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    pointName: {
        fontSize: 16,
        color: '#333',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    startButton: {
        backgroundColor: '#000', // Black as in design
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    startButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
