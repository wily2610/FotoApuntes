import { useState } from 'react';
import {
  ActivityIndicator, Alert, Button, Image, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { analizarApunte } from '../src/gemini';
import { guardar } from '../src/db';
import { setActual } from '../src/store';

export default function Capturar() {
  const router = useRouter();
  const [foto, setFoto] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function procesar(result) {
    if (result.canceled) return; // el usuario canceló: no hacemos nada
    const asset = result.assets[0];
    setFoto(asset.uri);
    setCargando(true);
    try {
      const datos = await analizarApunte(asset.base64, asset.mimeType || 'image/jpeg');
      if (!datos || !Array.isArray(datos.preguntas)) throw new Error('Formato inesperado');
      if (datos.preguntas.length === 0) {
        Alert.alert(
          'No se pudo leer el apunte',
          'La foto parece borrosa o no es un apunte. Intenta con otra más clara.'
        );
        return;
      }
      setActual(datos);
      await guardar(datos);
      router.push('/resumen');
    } catch (e) {
      console.warn(e);
      const esJson = e instanceof SyntaxError || e.message === 'Formato inesperado';
      Alert.alert(
        'Ups',
        esJson
          ? 'No pude entender la respuesta de la IA. Intenta de nuevo con otra foto.'
          : 'No se pudo analizar la imagen. Revisa tu conexión a internet e intenta de nuevo.'
      );
    } finally {
      setCargando(false);
    }
  }

  async function tomarFoto() {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso denegado', 'Activa el permiso de cámara en los ajustes del teléfono.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'], base64: true, quality: 0.2,
    });
    await procesar(result);
  }

  async function elegirGaleria() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], base64: true, quality: 0.2,
    });
    await procesar(result);
  }

  return (
    <ScrollView contentContainerStyle={s.contenedor}>
      <Text style={s.titulo}>FotoApuntes</Text>
      <View style={s.botones}>
        <Button title="Tomar foto" onPress={tomarFoto} disabled={cargando} />
        <Button title="Elegir de galería" onPress={elegirGaleria} disabled={cargando} />
      </View>
      {foto && <Image source={{ uri: foto }} style={s.imagen} resizeMode="contain" />}
      {cargando && (
        <View style={s.cargando}>
          <ActivityIndicator size="large" />
          <Text>Analizando tu apunte…</Text>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  contenedor: { padding: 20, gap: 16, alignItems: 'stretch' },
  titulo: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
  botones: { gap: 10 },
  imagen: { width: '100%', height: 300, backgroundColor: '#eee', borderRadius: 8 },
  cargando: { alignItems: 'center', gap: 8, marginTop: 10 },
});
