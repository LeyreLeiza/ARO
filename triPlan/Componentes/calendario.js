import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Calendar from 'react-native-calendar-range-picker';

const MiSelectorRango = ({ visible, onClose, onChangeRange }) => {
  const [rango, setRango] = useState({ startDate: null, endDate: null });

  if (!visible) return null;

  const handleAceptar = () => {
    if (onChangeRange) {
        onChangeRange({
        start: rango.startDate,
        end: rango.endDate
        });
    }
    onClose();
  };

  const handleCancelar = () => {
    setRango({ startDate: null, endDate: null });
    onClose();
  };

  const parseDateLocal = (str) => {
    const [year, month, day] = str.split('-').map(Number);
    return new Date(year, month - 1, day); // month es 0-indexado
  };

  return (
    <View style={styles.modalFondo}>
      <View style={[styles.modalContenido, { height: Dimensions.get('window').height * 0.6 }]}>
        <Calendar
          startDate={rango.startDate ? rango.startDate.toISOString().split('T')[0] : undefined}
          endDate={rango.endDate ? rango.endDate.toISOString().split('T')[0] : undefined}
          onChange={({ startDate, endDate }) =>
            setRango({ startDate: new Date(startDate), endDate: new Date(endDate) })
          }
          style={{ flex: 1 }}
        />

        {rango.startDate && rango.endDate && (
          <Text style={styles.textoRango}>
            {rango.startDate.toLocaleDateString()} → {rango.endDate.toLocaleDateString()}
          </Text>
        )}

        <View style={styles.botonesContainer}>
          <TouchableOpacity style={[styles.boton, { backgroundColor: '#888' }]} onPress={handleCancelar}>
            <Text style={styles.botonTexto}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.boton} onPress={handleAceptar}>
            <Text style={styles.botonTexto}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  modalFondo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContenido: { backgroundColor: '#fff', borderRadius: 12, padding: 16, width: '90%' },
  textoRango: { marginTop: 10, fontSize: 16, textAlign: 'center' },
  botonesContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  boton: { flex: 1, marginHorizontal: 5, padding: 10, backgroundColor: '#007AFF', borderRadius: 6 },
  botonTexto: { color: '#fff', textAlign: 'center', fontWeight: '600' }
});

export default MiSelectorRango;
