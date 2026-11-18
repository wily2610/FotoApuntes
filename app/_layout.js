import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { iniciarAppCheck } from '../src/firebase';

export default function Layout() {
  useEffect(() => {
    iniciarAppCheck();
  }, []);

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Capturar' }} />
      <Tabs.Screen name="resumen" options={{ title: 'Resumen' }} />
      <Tabs.Screen name="quiz" options={{ title: 'Quiz' }} />
      <Tabs.Screen name="historial" options={{ title: 'Historial' }} />
    </Tabs>
  );
}
