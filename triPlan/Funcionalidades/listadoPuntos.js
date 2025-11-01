import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator, Pressable } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons'; 

const imagenUbicacion = require("../assets/simboloUbicacion.png");

export default function ListaPuntos({ filteredUbis, loading, error, onSelect }) {
    const renderItem = ({ item }) => (
          <Pressable onPress={() => handlePress(item)}>
            <View style={styles.caja}>
                <View style={styles.row}>
                    <Image style={styles.imagenUbi} source={imagenUbicacion} />
                    <View style={styles.textContainer}>
                    <Text style={styles.titulo}>{item.titulo}</Text>
                    <Text style={styles.tipo}>{item.tipo}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name={'chevron-down'}
                            style={styles.icono} size={25}
                        />
                    </View>
                </View>
            </View>
        </Pressable>
    );

    const handlePress = (item) => {
      if(onSelect){
        onSelect(item); // Esto manda el punto seleccionado al padre
      } 
    };



    if (loading) {
        return (
            <View style={{ padding: 10, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#333" />
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#333'}}>Cargando datos...</Text>
            </View>);
    } else if (error) {
        return (
            <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: 'red' }}>Error: {error}</Text>
            </View>
        );
    } else {
        return (
            <FlatList
                data={filteredUbis} 
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ color: '#777', fontSize: 16 }}>No se encontraron ubicaciones</Text>
                </View>
                }
            />
        );
    }
            
}

const styles = StyleSheet.create({
  caja: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imagenUbi: {
    width: 50,
    height: 50,
  },
  textContainer: {
    flexDirection: 'column',
    marginLeft: 15,
    flex: 1,
  },
  iconContainer: {
    marginTop: 10,
    marginRight: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flexWrap: 'wrap',
    overflowWrap: 'break-word',
  },
  tipo: {
    color: '#555',
    fontSize: 14,
  },
  descripcion: {
    fontSize: 12,
    color: '#777',
    margin: 10,
    textAlign: 'justify',
  },
  icono: {
    marginLeft: 'auto', 
    alignSelf: 'center',
    color: '#ccc',
  },
});
