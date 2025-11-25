import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Cadastro() {
  const navigation = useNavigation();
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // 🔹 Escolher imagem de perfil
  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da sua permissão para acessar as fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFotoPerfil(result.assets[0].uri);
    }
  };

  const handleCadastro = async () => {
    if (!nome || !usuario || !email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      const URL = "https://ecoquest-backend-zfi8.onrender.com/api";

      const body = {
        name: nome,
        username: usuario,
        email: email,
        password: senha
      };

      const response = await fetch(`${URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // 🔎 LOGS PARA DESCOBRIR O ERRO
      console.log("STATUS DA RESPOSTA →", response.status);
      const text = await response.text();
      console.log("RESPOSTA COMPLETA →", text);

      if (response.status !== 201) {
        const erro = JSON.parse(text);

        // se o backend mandou detalhes de validação
        if (erro.details && erro.details[0]?.message) {
          Alert.alert("Erro", erro.details[0].message);
        } else {
          Alert.alert("Erro", erro.message || "Erro ao cadastrar usuário");
        }

        return; // para não cair no catch
      }

      const result = JSON.parse(text);

      Alert.alert("Sucesso", "Usuário criado com ID: " + result.userId);
      navigation.navigate("Login");

    } catch (error) {
      console.log("ERRO NO CATCH →", error);
      Alert.alert("Erro", "Falha ao enviar dados: " + error.message);
    }
  };

  // 🔹 Interface
  return (
    <ImageBackground
      source={require('../assets/images/fundo2.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <View style={styles.circle}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </View>
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <TouchableOpacity style={styles.fotoContainer} onPress={escolherImagem}>
            {fotoPerfil ? (
              <Image source={{ uri: fotoPerfil }} style={styles.fotoPerfil} />
            ) : (
              <View style={styles.fotoPlaceholder}>
                <Ionicons name="person-outline" size={60} color="#156499" />
                <Text style={styles.textoFoto}>Adicionar foto de perfil</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.title}>CADASTRE-SE AQUI</Text>

          <TextInput
            style={styles.input}
            placeholder="adicione seu nome"
            placeholderTextColor="#666"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            style={styles.input}
            placeholder="crie seu nome de usuário"
            placeholderTextColor="#666"
            value={usuario}
            onChangeText={setUsuario}
          />
          <TextInput
            style={styles.input}
            placeholder="adicione seu email"
            keyboardType="email-address"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.ContainerPassword}>
            <TextInput
              style={styles.inputSenha}
              placeholder="crie sua senha"
              secureTextEntry={!senhaVisivel}
              placeholderTextColor="#666"
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
              <Ionicons
                name={senhaVisivel ? 'eye-off' : 'eye'}
                size={22}
                color="#666"
                style={styles.EyeIcon}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.ButtonCadastro} onPress={handleCadastro}>
            <Text style={styles.ButtonText}>CONCLUIR CADASTRO</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 2,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 260,
    height: 160,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    color: '#156499',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 16,
    width: 260,
    fontSize: 15,
    alignSelf: 'center',
  },
  inputSenha: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 15,
  },
  ContainerPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 0,
    marginBottom: 30,
    alignSelf: 'center',
  },
  ButtonCadastro: {
    backgroundColor: '#019314',
    paddingVertical: 16,
    borderRadius: 8,
    width: 260,
    alignItems: 'center',
    alignSelf: 'center',
  },
  ButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  EyeIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  fotoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    width: 200,
    height: 180,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  fotoPerfil: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  fotoPlaceholder: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoFoto: {
    color: '#156499',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
});
