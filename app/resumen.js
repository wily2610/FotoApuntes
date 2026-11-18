import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useActual } from '../src/store';

export default function Resumen() {
  const a = useActual();

  if (!a) {
    return (
      <View style={s.vacio}>
        <Text>Aún no has analizado ningún apunte.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={s.contenedor}>
      <Text style={s.titulo}>{a.titulo}</Text>
      <Text style={s.subtitulo}>Resumen</Text>
      <Text style={s.texto}>{a.resumen}</Text>
      <Text style={s.subtitulo}>Conceptos clave</Text>
      {(a.conceptos_clave || []).map((c, i) => (
        <Text key={i} style={s.texto}>• {c}</Text>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  contenedor: { padding: 20, gap: 8 },
  vacio: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold' },
  subtitulo: { fontSize: 18, fontWeight: '600', marginTop: 12 },
  texto: { fontSize: 16, lineHeight: 22 },
});
