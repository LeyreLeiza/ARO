import React, { useState, useEffect, useRef } from 'react';
import Layout from '../Componentes/layout';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated, LayoutAnimation, Platform, UIManager, Switch, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

// 🔹 Variables globales compartidas
global.usuarioLogueado = global.usuarioLogueado || false;
global.nombreUsuario = global.nombreUsuario || "";
global.idUsuario = global.idUsuario || "";
global.emailUsuario = global.emailUsuario || "";
global.modLetraValor = global.modLetraValor || 0; // Tamaño de letra global

const isFabric = global.nativeFabricUIManager != null;

if (Platform.OS === 'android' && !isFabric) {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}


function OptionItem({ icon, text, onPress, color = "#333", fontSize, showChevron = true, isDestructive = false, rightText }) {
  return (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <View style={styles.optionContent}>
        <View style={[styles.iconContainer, { backgroundColor: isDestructive ? '#ffebee' : '#e3f2fd' }]}>
          <FontAwesome5 name={icon} size={18} color={isDestructive ? '#d32f2f' : '#1976d2'} />
        </View>
        <Text style={[styles.optionText, { fontSize, color: isDestructive ? '#d32f2f' : '#333' }]}>{text}</Text>
      </View>
      <View style={styles.rightContainer}>
        {rightText && <Text style={[styles.rightText, { fontSize: fontSize - 2 }]}>{rightText}</Text>}
        {showChevron && <FontAwesome5 name="chevron-right" size={14} color="#ccc" style={styles.chevron} />}
      </View>
    </TouchableOpacity>
  );
}

function SwitchItem({ icon, text, value, onValueChange, fontSize }) {
  return (
    <View style={styles.optionItem}>
      <View style={styles.optionContent}>
        <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}>
          <FontAwesome5 name={icon} size={18} color="#1976d2" />
        </View>
        <Text style={[styles.optionText, { fontSize }]}>{text}</Text>
      </View>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={value ? "#1976d2" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
}

export default function PantallaConfiguracion({ navigation }) {
  const [estadoUsuario, setEstadoUsuario] = useState(global.usuarioLogueado);
  const [nombre, setNombre] = useState(global.nombreUsuario);
  const [email, setEmail] = useState(global.emailUsuario);
  const [modLetraValor, setModLetraValor] = useState(global.modLetraValor);
  const [isFontAccordionOpen, setIsFontAccordionOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const baseFontSize = 16;

  // 🔹 Refresca datos de usuario cada medio segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setEstadoUsuario(global.usuarioLogueado);
      setNombre(global.nombreUsuario);
      setEmail(global.emailUsuario);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Función para actualizar tamaño de letra
  const cambiarTamanioLetra = (valor) => {
    global.modLetraValor = valor;
    setModLetraValor(valor);
  };

  const toggleFontAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsFontAccordionOpen(!isFontAccordionOpen);
  };

  const handleLogout = () => {
    global.usuarioLogueado = false;
    global.nombreUsuario = "";
    global.emailUsuario = "";
    setEstadoUsuario(false);
    setNombre("");
    setEmail("");
    alert("Sesión cerrada");
  };

  const showInfoAlert = (title) => {
    Alert.alert(title, "Esta funcionalidad estará disponible próximamente.");
  };

  return (
    <Layout navigation={navigation}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

        {/* 🔹 Perfil de Usuario */}
        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <FontAwesome5 name="user" size={30} color="#fff" />
            </View>
            <View style={styles.profileInfo}>
              {estadoUsuario ? (
                <>
                  <Text style={[styles.profileName, { fontSize: 18 + modLetraValor }]}>{nombre}</Text>
                  <Text style={[styles.profileEmail, { fontSize: 14 + modLetraValor }]}>{email || "Usuario registrado"}</Text>
                </>
              ) : (
                <>
                  <Text style={[styles.profileName, { fontSize: 18 + modLetraValor }]}>Invitado</Text>
                  <Text style={[styles.profileEmail, { fontSize: 14 + modLetraValor }]}>Inicia sesión para más opciones</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* 🔹 Configuración General */}
        <Text style={[styles.sectionTitle, { fontSize: 14 + modLetraValor }]}>GENERAL</Text>

        <View style={styles.card}>
          {/* Acordeón de Tamaño de Letra */}
          <TouchableOpacity style={styles.accordionHeader} onPress={toggleFontAccordion}>
            <View style={styles.optionContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}>
                <FontAwesome5 name="text-height" size={18} color="#1976d2" />
              </View>
              <Text style={[styles.optionText, { fontSize: baseFontSize + modLetraValor }]}>Tamaño de letra</Text>
            </View>
            <FontAwesome5 name={isFontAccordionOpen ? "chevron-up" : "chevron-down"} size={14} color="#ccc" />
          </TouchableOpacity>

          {isFontAccordionOpen && (
            <View style={styles.accordionContent}>
              <View style={styles.fontSelector}>
                <TouchableOpacity
                  style={[styles.fontBtn, modLetraValor === -4 && styles.fontBtnSelected]}
                  onPress={() => cambiarTamanioLetra(-4)}
                >
                  <Text style={[styles.fontBtnText, modLetraValor === -4 && styles.fontBtnTextSelected]}>A</Text>
                  <Text style={styles.fontLabel}>Pequeño</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.fontBtn, modLetraValor === 0 && styles.fontBtnSelected]}
                  onPress={() => cambiarTamanioLetra(0)}
                >
                  <Text style={[styles.fontBtnText, { fontSize: 18 }, modLetraValor === 0 && styles.fontBtnTextSelected]}>A</Text>
                  <Text style={styles.fontLabel}>Medio</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.fontBtn, modLetraValor === 4 && styles.fontBtnSelected]}
                  onPress={() => cambiarTamanioLetra(4)}
                >
                  <Text style={[styles.fontBtnText, { fontSize: 22 }, modLetraValor === 4 && styles.fontBtnTextSelected]}>A</Text>
                  <Text style={styles.fontLabel}>Grande</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* 🔹 Preferencias */}
        <Text style={[styles.sectionTitle, { fontSize: 14 + modLetraValor }]}>PREFERENCIAS</Text>
        <View style={styles.card}>
          <SwitchItem
            icon="bell"
            text="Notificaciones"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            fontSize={baseFontSize + modLetraValor}
          />
          <View style={styles.divider} />
          <OptionItem
            icon="globe"
            text="Idioma"
            rightText="Español"
            onPress={() => showInfoAlert("Idioma")}
            fontSize={baseFontSize + modLetraValor}
          />
        </View>

        {/* 🔹 Acciones de Cuenta */}
        <Text style={[styles.sectionTitle, { fontSize: 14 + modLetraValor }]}>CUENTA</Text>
        <View style={styles.card}>
          {!estadoUsuario ? (
            <>
              <OptionItem
                icon="sign-in-alt"
                text="Iniciar sesión"
                onPress={() => navigation.navigate('Login')}
                fontSize={baseFontSize + modLetraValor}
              />
              <View style={styles.divider} />
              <OptionItem
                icon="user-plus"
                text="Registrarse"
                onPress={() => navigation.navigate('Register')}
                fontSize={baseFontSize + modLetraValor}
              />
            </>
          ) : (
            <>
              <OptionItem
                icon="lock"
                text="Cambiar contraseña"
                onPress={() => navigation.navigate('Password change')}
                fontSize={baseFontSize + modLetraValor}
              />
              <View style={styles.divider} />
              <OptionItem
                icon="sign-out-alt"
                text="Cerrar sesión"
                onPress={handleLogout}
                fontSize={baseFontSize + modLetraValor}
                isDestructive={true}
                showChevron={false}
              />
            </>
          )}
        </View>

        {/* 🔹 Información */}
        <Text style={[styles.sectionTitle, { fontSize: 14 + modLetraValor }]}>INFORMACIÓN</Text>
        <View style={styles.card}>
          <OptionItem
            icon="file-alt"
            text="Términos y Condiciones"
            onPress={() => showInfoAlert("Términos y Condiciones")}
            fontSize={baseFontSize + modLetraValor}
          />
          <View style={styles.divider} />
          <OptionItem
            icon="shield-alt"
            text="Política de Privacidad"
            onPress={() => showInfoAlert("Política de Privacidad")}
            fontSize={baseFontSize + modLetraValor}
          />
          <View style={styles.divider} />
          <View style={styles.optionItem}>
            <View style={styles.optionContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#f5f5f5' }]}>
                <FontAwesome5 name="info" size={18} color="#757575" />
              </View>
              <Text style={[styles.optionText, { fontSize: baseFontSize + modLetraValor }]}>Versión</Text>
            </View>
            <Text style={[styles.rightText, { fontSize: 14 + modLetraValor }]}>v1.0.0</Text>
          </View>
        </View>

      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: '#8898aa',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 20,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    color: '#666',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    fontWeight: '500',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    color: '#888',
    marginRight: 8,
  },
  chevron: {
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 64,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  accordionContent: {
    backgroundColor: '#fafafa',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  fontSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fontBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  fontBtnSelected: {
    borderColor: '#1e3a8a',
    backgroundColor: '#eef2ff',
  },
  fontBtnText: {
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  fontBtnTextSelected: {
    color: '#1e3a8a',
  },
  fontLabel: {
    fontSize: 12,
    color: '#888',
  },
});
