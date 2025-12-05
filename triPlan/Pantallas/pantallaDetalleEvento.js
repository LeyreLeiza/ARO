import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 🔹 Importamos el hook para acceder al tamaño de letra
import { useFontSize } from '../Componentes/FontSizeContext'; 

const DetalleEvento = ({ route }) => {
  // 🔹 Obtenemos el modificador de tamaño de letra del contexto
  const { fontSizeMod } = useFontSize(); 

  const { evento } = route.params;

  const abrirCompra = () => {
    if (evento.url) {
      Linking.openURL(evento.url);
    }
  };

  const anchoContenedor = (Dimensions.get('window').width - 48) / 2; // padding y margen

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
        {/* 🔹 Aplicamos fontSizeMod */}
        <Text style={[styles.titulo, { fontSize: 24 + fontSizeMod }]}>{evento.nombre}</Text>
        {evento.imagen && <Image source={{ uri: evento.imagen }} style={styles.imagen} />}

        {/* Fila 1: Fecha y Hora */}
        <View style={styles.infoFilaContenedores}>
          <View style={[styles.infoContenedor, { width: anchoContenedor }]}>
            <View style={styles.infoFila}>
              <Ionicons name="calendar-outline" size={24} color="#ff6347" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                {/* 🔹 Aplicamos fontSizeMod */}
                <Text style={[styles.tituloContenedor, { fontSize: 12 + fontSizeMod * 0.5 }]}>Fecha</Text>
                {/* 🔹 Aplicamos fontSizeMod */}
                <Text style={[styles.infoTexto, { fontSize: 14 + fontSizeMod }]}>{new Date(evento.fecha_ini).toLocaleDateString()}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.infoContenedor, { width: anchoContenedor }]}>
            <View style={styles.infoFila}>
              <Ionicons name="time-outline" size={24} color="#ff6347" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                {/* 🔹 Aplicamos fontSizeMod */}
                <Text style={[styles.tituloContenedor, { fontSize: 12 + fontSizeMod * 0.5 }]}>Hora</Text>
                {/* 🔹 Aplicamos fontSizeMod */}
                <Text style={[styles.infoTexto, { fontSize: 14 + fontSizeMod }]}>
                  {new Date(evento.fecha_ini).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Fila 2: Ubicación y Precio */}
        <View style={styles.infoFilaContenedores}>
          <View style={[styles.infoContenedor, { width: anchoContenedor }]}>
            <View style={styles.infoFila}>
              <Ionicons name="location-outline" size={24} color="#ff6347" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                {/* 🔹 Aplicamos fontSizeMod */}
                <Text style={[styles.tituloContenedor, { fontSize: 12 + fontSizeMod * 0.5 }]}>Ubicación</Text>
                {/* 🔹 Aplicamos fontSizeMod */}
                <Text style={[styles.infoTexto, { fontSize: 14 + fontSizeMod }]}>{evento.punto?.nombre || 'N/A'}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.infoContenedor, { width: anchoContenedor }]}>
            <View style={styles.infoFila}>
              <Ionicons name="pricetag-outline" size={24} color="#ff6347" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                {/* 🔹 Aplicamos fontSizeMod */}
                <Text style={[styles.tituloContenedor, { fontSize: 12 + fontSizeMod * 0.5 }]}>Precio</Text>
                {/* 🔹 Aplicamos fontSizeMod */}
                <Text style={[styles.infoTexto, { fontSize: 14 + fontSizeMod }]}>{evento.precio ? `$${evento.precio}` : 'Gratis'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Título antes de la descripción */}
        <View style={[styles.infoFila, { marginTop: 16 }]}>
          <Ionicons name="information-circle-outline" size={24} color="#999" style={{ marginRight: 8 }} />
          {/* 🔹 Aplicamos fontSizeMod */}
          <Text style={[styles.tituloContenedorDescripcion, { fontSize: 14 + fontSizeMod }]}>Información</Text>
        </View>

        {/* Descripción del evento */}
        {/* 🔹 Aplicamos fontSizeMod */}
        <Text style={[styles.descripcion, { fontSize: 14 + fontSizeMod }]}>{evento.descripcion}</Text>

        {/* Botón de comprar entradas al final */}
        <TouchableOpacity
          style={styles.boton}
          onPress={abrirCompra}
          disabled={!evento.url}
        >
          {/* 🔹 Aplicamos fontSizeMod */}
          <Text style={[styles.botonTexto, { fontSize: 16 + fontSizeMod }]}>Comprar Entradas</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, paddingBottom: 40, backgroundColor: '#fff' }, // fondo uniforme blanco
  titulo: { 
    // Se elimina el fontSize fijo de aquí para que solo se use el del estilo en línea
    // fontSize: 24, 
    fontWeight: '700', 
    marginBottom: 12 
  },
  imagen: { width: '100%', height: 220, borderRadius: 16, marginBottom: 12 },
  infoFilaContenedores: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  infoContenedor: {
    flexDirection: 'column',
    backgroundColor: '#fff', // ahora blanco
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee', // opcional, para que parezcan tarjetas
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  infoFila: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  tituloContenedor: { 
    // Se elimina el fontSize fijo de aquí para que solo se use el del estilo en línea
    // fontSize: 12, 
    fontWeight: '400', 
    color: '#999' 
  },
  infoTexto: { 
    // Se elimina el fontSize fijo de aquí para que solo se use el del estilo en línea
    // fontSize: 14, 
    color: '#333', 
    marginTop: 2 
  },
  tituloContenedorDescripcion: { 
    // Se elimina el fontSize fijo de aquí para que solo se use el del estilo en línea
    // fontSize: 14, 
    fontWeight: '400', 
    color: '#999' 
  },
  descripcion: { 
    // Se elimina el fontSize fijo de aquí para que solo se use el del estilo en línea
    // fontSize: 14, 
    color: '#555', 
    marginVertical: 16 
  },
  boton: {
    backgroundColor: '#000000ff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  botonTexto: { 
    color: '#fff', 
    fontWeight: '700', 
    // Se elimina el fontSize fijo de aquí para que solo se use el del estilo en línea
    // fontSize: 16 
  },
});

export default DetalleEvento;