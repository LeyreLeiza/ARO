import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { obtenerRutaOSRM, generarRutaConCalles, ordenarRutaPorDistancia } from '../Funcionalidades/mapaHelpers';

// 🔹 Importamos el contexto
import { useFontSize } from '../Componentes/FontSizeContext';

const { height } = Dimensions.get('window');

export default function DetalleRutaModal({ visible, onClose, ruta, onStartRoute, isCustom, onDelete }) {
    const [totalDuration, setTotalDuration] = useState(null);

    // 🔹 Obtenemos el modificador de tamaño de letra
    const { fontSizeMod } = useFontSize();

    useEffect(() => {
        if (visible && ruta && ruta.puntos_interes && ruta.puntos_interes.length > 0) {
            (async () => {
                try {
                    const { status } = await Location.requestForegroundPermissionsAsync();
                    if (status !== 'granted') {
                        setTotalDuration(ruta.duracion);
                        return;
                    }

                    const enabled = await Location.hasServicesEnabledAsync();
                    if (!enabled) {
                        setTotalDuration(ruta.duracion);
                        return;
                    }

                    const location = await Location.getCurrentPositionAsync({});
                    const userLoc = {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    };

                    const orden = ordenarRutaPorDistancia(userLoc, ruta.puntos_interes);

                    const { totalDuration: durationInSeconds } = await generarRutaConCalles(userLoc, orden);

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
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24 + fontSizeMod} color="#666" />
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {/* Header */}
                        <Text style={[styles.title, { fontSize: 22 + fontSizeMod }]}>{ruta.nombre}</Text>
                        <Text style={[styles.description, { fontSize: 14 + fontSizeMod }]}>{ruta.descripcion}</Text>

                        {/* Stats Row */}
                        <View style={styles.statsRow}>
                            <View style={styles.statCard}>
                                <Ionicons name="time-outline" size={24 + fontSizeMod} color="#4A90E2" />
                                <Text style={[styles.statLabel, { fontSize: 12 + fontSizeMod }]}>Duración Total</Text>
                                <Text style={[styles.statValue, { fontSize: 16 + fontSizeMod }]}>{totalDuration !== null ? totalDuration : '-'} min</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Ionicons name="location-outline" size={24 + fontSizeMod} color="#4A90E2" />
                                <Text style={[styles.statLabel, { fontSize: 12 + fontSizeMod }]}>Paradas</Text>
                                <Text style={[styles.statValue, { fontSize: 16 + fontSizeMod }]}>{paradas}</Text>
                            </View>
                        </View>

                        {/* Points List */}
                        <Text style={[styles.sectionTitle, { fontSize: 16 + fontSizeMod }]}>Puntos de la ruta</Text>
                        <View style={styles.pointsList}>
                            {ruta.puntos_interes && ruta.puntos_interes.map((punto, index) => (
                                <View key={punto.id || index} style={styles.pointItem}>
                                    <View style={styles.pointBadge}>
                                        <Text style={[styles.pointIndex, { fontSize: 14 + fontSizeMod }]}>{index + 1}</Text>
                                    </View>
                                    <Text style={[styles.pointName, { fontSize: 16 + fontSizeMod }]}>{punto.nombre}</Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Footer Button */}
                    <View style={styles.footer}>
                        {isCustom && (
                            <View style={styles.actionButtons}>
                                <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
                                    <Ionicons name="trash-outline" size={20 + fontSizeMod} color="white" />
                                    <Text style={[styles.actionButtonText, { fontSize: 16 + fontSizeMod }]}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        <TouchableOpacity style={styles.startButton} onPress={onStartRoute}>
                            <Ionicons name="navigate" size={20 + fontSizeMod} color="white" style={{ marginRight: 10 }} />
                            <Text style={[styles.startButtonText, { fontSize: 18 + fontSizeMod }]}>Iniciar Ruta</Text>
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
        height: height * 0.85,
        padding: 20,
        paddingBottom: 30,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 5,
    },
    scrollContent: {
        paddingBottom: 80,
    },
    title: {
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    description: {
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
        color: '#888',
        marginTop: 5,
    },
    statValue: {
        fontWeight: 'bold',
        color: '#333',
        marginTop: 2,
    },
    sectionTitle: {
        fontWeight: '600',
        color: '#666',
        marginBottom: 10,
        marginTop: 10,
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
    },
    pointName: {
        color: '#333',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    startButton: {
        backgroundColor: '#000',
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
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        marginHorizontal: 5,
    },
    deleteButton: {
        backgroundColor: '#E24A4A',
    },
    actionButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 5,
    },
});
