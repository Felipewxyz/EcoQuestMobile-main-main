import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function Sobre() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <View style={styles.circle}>
          <Ionicons name="chevron-back" size={22} color="#DCDCDC" />
        </View>
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          QUAIS SÃO OS OBJETIVOS{'\n'}DO APLICATIVO:
        </Text>

        {/* imagens responsivas */}
        <Image source={require('../assets/images/sobre1.png')} style={styles.imagem} />
        <Image source={require('../assets/images/sobre2.png')} style={styles.imagem} />
        <Image source={require('../assets/images/sobre3.png')} style={styles.imagem} />
        <Image source={require('../assets/images/sobre4.png')} style={styles.imagem} />
        <Image source={require('../assets/images/sobre5.png')} style={styles.imagem} />
        <Image source={require('../assets/images/sobre6.png')} style={styles.imagem} />

        <TouchableOpacity
          style={styles.botaoEntrar}
          onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.textoBotao}>CADASTRE-SE</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 0, // tiramos o padding para deixar as imagens encostarem na borda
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
    borderColor: '#DCDCDC',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'stretch', // mantém as imagens coladas nas bordas
    paddingTop: 100,
    paddingBottom: 40,
  },
  logo: {
    width: 280,
    height: 180,
    marginBottom: 20,
    alignSelf: 'center', // ✅ centraliza a logo
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  imagem: {
    width: '100%',
    height: width * 0.63,
    marginVertical: 10,
    resizeMode: 'contain',
  },
  botaoEntrar: {
    backgroundColor: '#019314',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 30,
    width: 260,
    alignSelf: 'center', // ✅ centraliza o botão
  },
  textoBotao: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
