import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { borrar, listar } from '../src/db';
import { setActual } from '../src/store';

export default function Historial() {
  const router = useRouter();
  const [items, setItems] = useState([]);

  const cargar = useCallback(async () => {
    try {
      setItems(await listar());
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Recarga cada vez que se abre la pestaña
  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  function abrir(item) {
    try {
      setActual(JSON.parse(item.json));
      router.push('/resumen');
    } catch (e) {
      console.warn(e);
    }
  }

  async function quitar(id) {
    await borrar(id);
    cargar();
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(it) => String(it.id)}
      contentContainerStyle={s.lista}
      ListEmptyComponent={<Text style={s.vacio}>Todavía no hay apuntes analizados.</Text>}
      renderItem={({ item }) => (
        <View style={s.fila}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => abrir(item)}>
            <Text style={s.titulo}>{item.titulo}</Text>
            <Text style={s.fecha}>{new Date(item.fecha).toLocaleString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => quitar(item.id)}>
            <Text style={s.borrar}>Borrar</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const s = StyleSheet.create({
  lista: { padding: 16, gap: 10 },
  vacio: { textAlign: 'center', marginTop: 40 },
  fila: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: '#f2f2f2', borderRadius: 8, gap: 10 },
  titulo: { fontSize: 16, fontWeight: '600' },
  fecha: { color: '#666', fontSize: 12 },
  borrar: { color: '#c0392b', fontWeight: '600' },
});
