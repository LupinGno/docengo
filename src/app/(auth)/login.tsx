// RF-06: inicio de sesión con máximo 3 intentos. Responsable: Carlos
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { iniciarSesion } from '../../services/auth';
import { estadoInicial, intentosRestantes, registrarExito, registrarFallo } from '../../lib/intentos';
import { mensajeDeError } from '../../lib/errores';
import { estilos } from '../../constants/tema';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [intentos, setIntentos] = useState(estadoInicial);

  async function entrar() {
    if (intentos.bloqueada) return;
    if (!correo.trim() || !contrasena) {
      setError('Escribe tu correo y contraseña.');
      return;
    }
    setCargando(true);
    setError('');
    try {
      await iniciarSesion(correo, contrasena);
      setIntentos(registrarExito());
      // La redirección al mapa la hace app/_layout.tsx al detectar la sesión.
    } catch (err: any) {
      const nuevo = registrarFallo(intentos);
      setIntentos(nuevo);
      setError(
        nuevo.bloqueada
          ? 'Cuenta bloqueada tras 3 intentos. Contacta a soporte para restablecerla.'
          : `${mensajeDeError(err?.code)} Intentos restantes: ${intentosRestantes(nuevo)}.`,
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <View style={estilos.centrado}>
      <Text style={estilos.titulo}>DocenGo</Text>

      <TextInput
        style={estilos.input}
        placeholder="Correo"
        autoCapitalize="none"
        keyboardType="email-address"
        value={correo}
        onChangeText={setCorreo}
      />
      <TextInput
        style={estilos.input}
        placeholder="Contraseña"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />

      {error ? <Text style={estilos.error}>{error}</Text> : null}

      <Pressable
        style={[estilos.boton, (cargando || intentos.bloqueada) && estilos.botonDeshabilitado]}
        onPress={entrar}
        disabled={cargando || intentos.bloqueada}
      >
        {cargando ? <ActivityIndicator color="#fff" /> : <Text style={estilos.textoBoton}>Entrar</Text>}
      </Pressable>

      <Pressable onPress={() => router.push('/registro')}>
        <Text style={estilos.enlace}>¿No tienes cuenta? Regístrate</Text>
      </Pressable>
    </View>
  );
}
