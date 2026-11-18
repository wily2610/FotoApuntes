import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useActual } from '../src/store';

export default function Quiz() {
  const a = useActual();
  const [i, setI] = useState(0);
  const [elegida, setElegida] = useState(null);
  const [puntos, setPuntos] = useState(0);

  // Reinicia el quiz cuando llega un apunte nuevo
  useEffect(() => {
    setI(0); setElegida(null); setPuntos(0);
  }, [a]);

  if (!a || !a.preguntas || a.preguntas.length === 0) {
    return (
      <View style={s.vacio}>
        <Text>Analiza un apunte para generar el quiz.</Text>
      </View>
    );
  }

  const total = a.preguntas.length;

  if (i >= total) {
    return (
      <View style={s.vacio}>
        <Text style={s.titulo}>¡Terminaste!</Text>
        <Text style={s.puntaje}>{puntos} / {total}</Text>
        <Button title="Repetir quiz" onPress={() => { setI(0); setElegida(null); setPuntos(0); }} />
      </View>
    );
  }

  const p = a.preguntas[i];
  const respondida = elegida !== null;

  function responder(n) {
    if (respondida) return;
    setElegida(n);
    if (n === p.correcta) setPuntos((x) => x + 1);
  }

  function color(n) {
    if (!respondida) return '#f2f2f2';
    if (n === p.correcta) return '#b7e4c7';
    if (n === elegida) return '#f5b7b1';
    return '#f2f2f2';
  }

  return (
    <ScrollView contentContainerStyle={s.contenedor}>
      <Text style={s.progreso}>Pregunta {i + 1} de {total}</Text>
      <Text style={s.pregunta}>{p.pregunta}</Text>
      {p.opciones.map((o, n) => (
        <TouchableOpacity key={n} style={[s.opcion, { backgroundColor: color(n) }]} onPress={() => responder(n)}>
          <Text style={s.textoOpcion}>{o}</Text>
        </TouchableOpacity>
      ))}
      {respondida && (
        <>
          <Text style={s.feedback}>
            {elegida === p.correcta ? '¡Correcto!' : `Incorrecto. Respuesta correcta: ${p.opciones[p.correcta]}`}
          </Text>
          <Button
            title={i + 1 === total ? 'Ver puntaje' : 'Siguiente'}
            onPress={() => { setI(i + 1); setElegida(null); }}
          />
        </>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  contenedor: { padding: 20, gap: 12 },
  vacio: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  progreso: { color: '#666' },
  pregunta: { fontSize: 20, fontWeight: '600' },
  opcion: { padding: 14, borderRadius: 8 },
  textoOpcion: { fontSize: 16 },
  feedback: { fontSize: 16, fontWeight: '600', marginTop: 8 },
  titulo: { fontSize: 24, fontWeight: 'bold' },
  puntaje: { fontSize: 40, fontWeight: 'bold' },
});
