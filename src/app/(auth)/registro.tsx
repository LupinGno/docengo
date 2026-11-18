// RF-05: registro de docente. Responsable: Carlos
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { registrar } from '../../services/auth';
import { validarRegistro } from '../../lib/validacion';
import { mensajeDeError } from '../../lib/errores';
import { estilos } from '../../constants/tema';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function crearCuenta() {
    const problema = validarRegistro(nombre, correo, contrasena);
    if (problema) {
      setError(problema);
      return;
    }
    setCargando(true);
    setError('');
    try {
      await registrar(nombre, correo, contrasena);
    } catch (err: any) {
      setError(mensajeDeError(err?.code));
    } finally {
      setCargando(false);
    }
  }

  return (
    <View style={estilos.centrado}>
      <Text style={estilos.titulo}>Crear cuenta</Text>

      <TextInput style={estilos.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
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
        placeholder="Contraseña (mínimo 8 caracteres)"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />

      {error ? <Text style={estilos.error}>{error}</Text> : null}

      <Pressable style={[estilos.boton, cargando && estilos.botonDeshabilitado]} onPress={crearCuenta} disabled={cargando}>
        {cargando ? <ActivityIndicator color="#fff" /> : <Text style={estilos.textoBoton}>Registrarme</Text>}
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={estilos.enlace}>Ya tengo cuenta</Text>
      </Pressable>
    </View>
  );
}
