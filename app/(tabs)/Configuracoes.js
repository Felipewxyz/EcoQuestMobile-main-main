import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");
export default function Configuracoes() {
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [expandedBanners, setExpandedBanners] = useState(false);
  const [expandedColors, setExpandedColors] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedReadyImage, setSelectedReadyImage] = useState(null);
  // 🔹 Moldura e borda
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [selectedBorderColor, setSelectedBorderColor] = useState(null);
  const [expandedFrames, setExpandedFrames] = useState(false);
  const [expandedBorderColors, setExpandedBorderColors] = useState(false);
  // 🔹 Informações pessoais
  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [initialBannerState, setInitialBannerState] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [showGalleryPopup, setShowGalleryPopup] = useState(false);
  // 🔹 animação na seleção de moldura
  const frameScale = useRef(new Animated.Value(1)).current;
  // banners principais
  const imagens = [
    { id: 1, nome: "Ajuda", uri: require("../../assets/images/bannerajuda.png"), destino: "Ajuda" },
    { id: 2, nome: "Sobre", uri: require("../../assets/images/bannersobre.png"), destino: "Sobre" },
  ];
  // banners do usuário
  const banners = [
    { id: "nulo", uri: require("../../assets/images/proibido.png"), isRemove: true },
    { id: 1, uri: require("../../assets/images/banner1.png") },
    { id: 2, uri: require("../../assets/images/banner2.png") },
    { id: 3, uri: require("../../assets/images/banner3.png") },
    { id: 4, uri: require("../../assets/images/banner4.png") },
    { id: 5, uri: require("../../assets/images/banner5.png") },
  ];
  // cores do banner e da borda
  const cores = [
    { id: "remover", isRemove: true, icon: require("../../assets/images/proibido.png") },
    "#8B0000", "#FF0000", "#FF8C00", "#FFFF00",
    "#ADFF2F", "#32CD32", "#008000", "#006400",
    "#64B5F6", "#0D47A1", "#191970", "#6A5ACD",
    "#FF1493", "#1C1C1C", "#D3D3D3"
  ];
  // molduras
  const molduras = [
    { id: "nulo", uri: require("../../assets/images/proibido.png"), isRemove: true },
    { id: 1, nome: "Moldura 1", uri: require("../../assets/images/moldura1.png") },
    { id: 2, nome: "Moldura 2", uri: require("../../assets/images/moldura2.png") },
    { id: 3, nome: "Moldura 3", uri: require("../../assets/images/moldura3.png") },
    { id: 4, nome: "Moldura 4", uri: require("../../assets/images/moldura4.png") },
    { id: 5, nome: "Moldura 5", uri: require("../../assets/images/moldura5.png") },
  ];
  // carrossel automático
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % imagens.length;
      Animated.timing(scrollX, {
        toValue: width * nextIndex,
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start(() => {
        scrollRef.current?.scrollTo({ x: width * nextIndex, animated: false });
        setCurrentIndex(nextIndex);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };
  // salvar banner, cor e moldura
  const handleSalvar = async () => {
    try {
      // salva apenas o banner
      if (selectedBanner) {
        await AsyncStorage.setItem("bannerSelecionado", JSON.stringify({ type: "banner", value: selectedBanner }));
      } else if (selectedColor) {
        await AsyncStorage.setItem("bannerSelecionado", JSON.stringify({ type: "color", value: selectedColor }));
      }
      // não mexer em moldura/borda aqui
      navigation.navigate("Perfil");
    } catch (error) {
      console.log("Erro ao salvar banner:", error);
    }
  };
  // função para escolher imagem da galeria
  const handleEscolherImagemGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };
  // (você pode implementar handleImagemPronta depois)
  const handleImagemPronta = () => {
    setShowImageModal(true);
  };

  const handleConfirmarImagemPronta = () => {
    if (!selectedReadyImage) {
      Alert.alert("Selecione uma imagem", "Escolha uma das imagens prontas antes de confirmar.");
      return;
    }
    setProfileImage(selectedReadyImage);
    setShowImageModal(false);
  };

  const handleRetirarBorda = async () => {
    try {
      setSelectedBorderColor(null); // remove apenas a borda
      // Não tocar em selectedFrame nem profileImage
    } catch (error) {
      console.log("Erro ao remover borda:", error);
    }
  };

  const handleRetirarMoldura = async () => {
    try {
      setSelectedFrame(null); // remove só a moldura
    } catch (error) {
      console.log("Erro ao remover moldura:", error);
    }
  };
  // 🔹 Salva apenas o banner e vai direto pro Perfil
  const handleSalvarBanner = async () => {
    try {
      let newState = { banner: null, color: null };

      // Se remover
      if (selectedBanner === null && selectedColor === null) {
        await AsyncStorage.removeItem("bannerSelecionado");
      }

      // Se imagem
      else if (selectedBanner) {
        await AsyncStorage.setItem(
          "bannerSelecionado",
          JSON.stringify({ type: "banner", value: selectedBanner })
        );
        newState.banner = selectedBanner;
      }

      // Se cor
      else if (selectedColor) {
        await AsyncStorage.setItem(
          "bannerSelecionado",
          JSON.stringify({ type: "color", value: selectedColor })
        );
        newState.color = selectedColor;
      }

      // Atualiza estado inicial → agora nada mudou novamente
      setInitialBannerState(newState);
      setHasChanges(false);

      // Mostra mensagem "salvo!"
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 1800);

      // Vai para o perfil
      navigation.navigate("Perfil");

    } catch (error) {
      console.log("Erro ao salvar banner:", error);
    }
  };

  const handleSelecionarBanner = (item) => {
    if (item.isRemove) {
      setSelectedBanner(null);
      AsyncStorage.removeItem("bannerSelecionado");
      return;
    }

    setSelectedBanner(item.uri);
    setSelectedColor(null);
  };

  const handleSelecionarCor = (cor) => {
    setSelectedColor(cor);
    setSelectedBanner(null);
  };

  const handleSelecionarMoldura = (item) => {
    if (item.isRemove) {
      setSelectedFrame(null);      // limpa moldura
    } else {
      setSelectedFrame(item);      // seleciona moldura
      setSelectedBorderColor(null); // limpa borda (mutuamente exclusivo)
    }
  };

  const handleSelecionarBorda = (cor) => {
    if (!cor) {                     // caso seja a opção "remover"
      setSelectedBorderColor(null);
    } else {
      setSelectedBorderColor(cor);  // seleciona borda
      setSelectedFrame(null);       // limpa moldura (mutuamente exclusivo)
    }
  };

  const bannersVisiveis = expandedBanners ? banners : banners.slice(0, 2);
  const coresVisiveis = expandedColors ? cores : cores.slice(0, 4);
  const bordasVisiveis = expandedBorderColors ? cores : cores.slice(0, 4);
  const moldurasVisiveis = expandedFrames ? molduras : molduras.slice(0, 2);

  const selectedItem = selectedBanner
    ? { type: "banner", value: selectedBanner }
    : selectedColor
      ? { type: "color", value: selectedColor }
      : null;
  // 🔹 Salvar moldura ou borda (e imagem) de forma independente
  const handleSalvarMolduraOuBorda = async () => {
    try {
      // verifica se há algo selecionado
      if (!selectedFrame && !selectedBorderColor && !profileImage) {
        alert("Selecione uma moldura, cor ou imagem primeiro!");
        return;
      }
      // salva no AsyncStorage
      await AsyncStorage.setItem(
        "molduraSelecionada",
        JSON.stringify({
          frame: selectedFrame,
          borderColor: selectedBorderColor,
          profileImage: profileImage,
        })
      );
      // reset de seleção ou feedback
      Alert.alert("Salvo!", "Alterações de moldura, borda ou imagem foram salvas.");
      navigation.navigate("Perfil");
    } catch (error) {
      console.log("Erro ao salvar moldura/borda/imagem:", error);
    }
  };
  // 🔹 Salvar informações pessoais
  const handleSalvarInfo = async () => {
    try {
      const userData = { nome, usuario, email, senha };
      await AsyncStorage.setItem("userInfo", JSON.stringify(userData));
      navigation.navigate("Perfil");
    } catch (error) {
      console.log("Erro ao salvar informações pessoais:", error);
    }
  };
  // 🔹 Confirmar logout
  const handleConfirmarLogout = async () => {
    try {
      await AsyncStorage.clear();
      setShowLogoutModal(false);
      navigation.navigate("InitialScreen");
    } catch (error) {
      console.log("Erro ao deslogar:", error);
    }
  };
  // 🔹 Carregar informações pessoais salvas
  useEffect(() => {
    const carregarInfo = async () => {
      try {
        const dadosSalvos = await AsyncStorage.getItem("userInfo");
        if (dadosSalvos) {
          const { nome, usuario, email } = JSON.parse(dadosSalvos);
          if (nome) setNome(nome);
          if (usuario) setUsuario(usuario);
          if (email) setEmail(email);
        }
      } catch (error) {
        console.log("Erro ao carregar informações pessoais:", error);
      }
    };

    carregarInfo();
  }, []);
  // 🔹 Função para remover banner
  const handleRetirarBanner = async () => {
    try {
      await AsyncStorage.removeItem("bannerSelecionado");
      Alert.alert("Banner removido", "O banner foi retirado com sucesso.");
    } catch (error) {
      console.log("Erro ao remover banner:", error);
    }
  };
  // 🔹 Detectar automaticamente se houve mudança
  useEffect(() => {
    if (!initialBannerState) return;

    const bannerAtual = {
      banner: selectedBanner,
      color: selectedColor
    };
    // 🔹 Comparação segura para objetos (require/URI)
    const noChanges =
      (bannerAtual.banner === initialBannerState.value && initialBannerState.type === "banner" ||
        bannerAtual.banner === null && initialBannerState.type !== "banner") &&
      (bannerAtual.color === initialBannerState.value && initialBannerState.type === "color" ||
        bannerAtual.color === null && initialBannerState.type !== "color");

    setHasChanges(!noChanges);
  }, [selectedBanner, selectedColor, initialBannerState]);
  // 🔹 Carregar banner salvo ao iniciar
  useEffect(() => {
    const carregarBanner = async () => {
      try {
        const saved = await AsyncStorage.getItem("bannerSelecionado");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.type === "banner") setSelectedBanner(parsed.value);
          if (parsed.type === "color") setSelectedColor(parsed.value);
          setInitialBannerState(parsed); // estado inicial
        } else {
          setInitialBannerState({ banner: null, color: null });
        }
      } catch (error) {
        console.log("Erro ao carregar banner inicial:", error);
      }
    };

    carregarBanner();
  }, []);

  const handleExcluirImagemPronta = () => {
    setSelectedReadyImage(null);
    setProfileImage(null);
    setShowImageModal(false);
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}>
        {/* 🔹 Carrossel */}
        <View style={styles.carouselWrapper}>
          <Animated.ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingTop: 30 }}
          >
            {imagens.map((item) => (
              <TouchableOpacity key={item.id} activeOpacity={0.9} onPress={() => navigation.navigate(item.destino, { fromConfig: true })}>
                <Image source={item.uri} style={styles.bannerImage} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </Animated.ScrollView>

          <View style={styles.dotsContainer}>
            {imagens.map((_, index) => (
              <View key={index} style={[styles.dot, { backgroundColor: index === currentIndex ? "#0D47A1" : "#BDBDBD" }]} />
            ))}
          </View>
        </View>
        {/* 🔹 Preview do banner */}
        <View style={styles.previewContainer}>
          <View style={styles.previewBox}>
            {selectedItem?.type === "banner" ? (
              <Image source={selectedItem.value} style={styles.previewImage} resizeMode="cover" />
            ) : (
              <View style={[styles.previewImage, { backgroundColor: selectedItem?.value || "#DDD" }]} />
            )}
          </View>
          <Text style={styles.previewLabel}>Como seu banner está</Text>
        </View>
        {/* 🔹 Banners do usuário */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="image-outline" size={26} color="#000" style={{ marginRight: 6 }} />
              <Text style={[styles.sectionTitle, { color: "#000" }]}>Seus banners</Text>
            </View>
            <TouchableOpacity onPress={() => setExpandedBanners(!expandedBanners)}>
              <Text style={[styles.arrow, { color: "#000" }]}>
                {expandedBanners ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bannerRow}>
            {bannersVisiveis.map((item) => {
              const isSelected =
                selectedBanner === item.uri || (item.isRemove && selectedBanner === null);

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleSelecionarBanner(item)}
                  style={[
                    styles.bannerOption,
                    isSelected && {
                      borderWidth: 3,
                      borderColor: item.isRemove ? "#E53935" : "#0D47A1",
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  {!item.isRemove ? (
                    <Image source={item.uri} style={styles.bannerThumb} />
                  ) : (
                    <Image
                      source={require("../../assets/images/nulo.png")}
                      style={[styles.bannerThumb, { resizeMode: "contain" }]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        {/* 🔹 Cores sólidas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="color-palette-outline" size={26} color="#000" style={{ marginRight: 6 }} />
              <Text style={[styles.sectionTitle, { color: "#000" }]}>Cores sólidas</Text>
            </View>
            <TouchableOpacity onPress={() => setExpandedColors(!expandedColors)}>
              <Text style={[styles.arrow, { color: "#000" }]}>
                {expandedColors ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.colorsGrid}>
            {coresVisiveis.map((item, index) => {
              const isRemove = typeof item === "object" && item.isRemove;

              const corValor = isRemove ? null : item;

              const isSelected =
                (selectedColor === item) ||
                (isRemove && selectedColor === null);

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (isRemove) {
                      setSelectedColor(null);
                    } else {
                      handleSelecionarCor(item);
                    }
                  }}
                  style={[
                    styles.colorOption,
                    isRemove
                      ? { borderWidth: 2, borderColor: "#AAA", alignItems: "center", justifyContent: "center" }
                      : { backgroundColor: item },

                    // seleção azul normal
                    !isRemove && selectedColor === item && styles.selectedItem,

                    // seleção do remover → vermelho
                    isRemove && selectedColor === null && { borderColor: "#E53935", borderWidth: 3 }
                  ]}
                >
                  {isRemove && (
                    <Image
                      source={item.icon}
                      style={{ width: 35, height: 35, tintColor: "#555" }}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        {/* Mensagem de salvo */}
        {savedMessage && (
          <Text style={{
            textAlign: "center",
            color: "#4CAF50",
            marginBottom: 10,
            fontSize: 16,
            fontWeight: "bold"
          }}>
            Alterações salvas!
          </Text>
        )}
        {/* Botão */}
        <View style={styles.bannerButtonsRow}>
          <TouchableOpacity
            style={[
              styles.bannerButton,
              {
                backgroundColor: hasChanges ? "#0D47A1" : "#9E9E9E",
                opacity: hasChanges ? 1 : 0.6
              }
            ]}
            disabled={!hasChanges}
            onPress={handleSalvarBanner}
          >
            <Text style={styles.bannerButtonText}>Salvar alteração no banner</Text>
          </TouchableOpacity>
        </View>
        {/* 🔹 Preview da Moldura e/ou Borda */}
        <View style={styles.framePreviewContainer}>
          <View
            style={[
              styles.borderCircle,
              selectedBorderColor && { borderColor: selectedBorderColor, borderWidth: 6 },
            ]}
          >
            {/* 🔹 Foto de perfil (galeria ou placeholder) */}
            <Image
              source={
                profileImage
                  ? typeof profileImage === "number"
                    ? profileImage // 🔹 imagem local (require)
                    : { uri: profileImage } // 🔹 imagem da galeria
                  : require("../../assets/images/perfilplaceholder.png") // 🔹 placeholder
              }
              style={styles.profileImage}
            />
          </View>
          {/* 🔹 Moldura fora do círculo */}
          {selectedFrame && (
            <Image
              source={selectedFrame.uri}
              style={styles.frameOutside}
              resizeMode="contain"
            />
          )}

          <Text style={styles.previewLabel}>Como seu perfil está</Text>
          {/* 🔹 Texto adicional */}
          <Text style={styles.chooseText}>
            ESCOLHA SUA IMAGEM DE PERFIL
          </Text>
          {/* 🔹 Botões lado a lado */}
          <View style={styles.imageButtonRow}>
            <TouchableOpacity
              style={[styles.imageButton, { backgroundColor: "#0D47A1" }]}
              onPress={() => setShowGalleryPopup(true)}
            >
              <Text style={styles.imageButtonText}>Imagem da Galeria</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.imageButton, { backgroundColor: "#4CAF50" }]}
              onPress={handleImagemPronta}
            >
              <Text style={styles.imageButtonText}>Imagem Pronta</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* 🔹 Molduras */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="person-circle-outline" size={26} color="#000" style={{ marginRight: 6 }} />
              <Text style={[styles.sectionTitle, { color: "#000" }]}>Suas molduras</Text>
            </View>
            <TouchableOpacity onPress={() => setExpandedFrames(!expandedFrames)}>
              <Text style={[styles.arrow, { color: "#000" }]}>
                {expandedFrames ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.frameOptionsRow}>
            {moldurasVisiveis.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  if (item.isRemove) {
                    setSelectedFrame("nulo");
                  } else {
                    handleSelecionarMoldura(item);
                  }
                }}
                style={[
                  item.isRemove ? styles.frameRemover : styles.frameOption,

                  // 🔹 Moldura normal selecionada → azul
                  !item.isRemove && selectedFrame?.id === item.id && styles.selectedItem,

                  // 🔹 Moldura nula selecionada → vermelho
                  item.isRemove && selectedFrame === "nulo" && styles.selectedRemove,
                ]}
              >
                <Image
                  source={item.uri}
                  style={[
                    styles.frameThumb,
                    item.isRemove && styles.removerIcon
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* 🔹 Cores de borda */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="color-palette-outline" size={26} color="#000" style={{ marginRight: 6 }} />
              <Text style={[styles.sectionTitle, { color: "#000" }]}>Cores sólidas (borda)</Text>
            </View>
            <TouchableOpacity onPress={() => setExpandedBorderColors(!expandedBorderColors)}>
              <Text style={[styles.arrow, { color: "#000" }]}>
                {expandedBorderColors ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.colorsGrid}>
            {bordasVisiveis.map((item, index) => {
              const isRemove = typeof item === "object" && item.isRemove;

              const isSelected =
                (selectedBorderColor === item) ||
                (isRemove && selectedBorderColor === null);

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (isRemove) {
                      setSelectedBorderColor(null);
                    } else {
                      handleSelecionarBorda(item);
                    }
                  }}
                  style={[
                    styles.colorOption,
                    isRemove
                      ? { borderWidth: 2, borderColor: "#AAA", alignItems: "center", justifyContent: "center" }
                      : { backgroundColor: item },

                    // seleção azul normal
                    !isRemove && selectedBorderColor === item && styles.selectedItem,

                    // remover → vermelho
                    isRemove && selectedBorderColor === null && { borderColor: "#E53935", borderWidth: 3 }
                  ]}
                >
                  {isRemove && (
                    <Image
                      source={item.icon}
                      style={{ width: 35, height: 35, tintColor: "#555" }}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        {/* 🔹 Botões finais */}
        <View style={styles.bottomButtonsRow}>
          <TouchableOpacity style={[styles.saveButton, { flex: 1 }]} onPress={handleSalvarMolduraOuBorda}>
            <Text style={styles.saveButtonText}>Salvar alterações</Text>
          </TouchableOpacity>
        </View>
        {/* 🔹 Informações Pessoais */}
        <View style={styles.infoSection}>
          <View style={styles.infoTitleRow}>
            <Ionicons name="folder-outline" size={26} color="#000" style={{ marginRight: 8 }} />
            <Text style={styles.infoTitle}>Informações pessoais</Text>
          </View>

          <View style={styles.infoBox}>
            {/* Nome */}
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={setNome}
            />
            {/* Usuário */}
            <TextInput
              style={styles.input}
              placeholder="Usuário"
              placeholderTextColor="#999"
              value={usuario}
              onChangeText={setUsuario}
            />
            {/* E-mail */}
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {/* Senha */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
                placeholder="Senha"
                placeholderTextColor="#999"
                secureTextEntry={!senhaVisivel}
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
                <Ionicons name={senhaVisivel ? 'eye-off' : 'eye'} size={22} color="#666" />
              </TouchableOpacity>
            </View>
            {/* Botões */}
            <View style={styles.infoButtonsRow}>
              <TouchableOpacity
                style={[styles.infoButton, { backgroundColor: "#4CAF50" }]}
                onPress={handleSalvarInfo}
              >
                <Text style={styles.infoButtonText}>Salvar informações</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.infoButton, { backgroundColor: "#E53935" }]}
                onPress={() => setShowLogoutModal(true)}
              >
                <Text style={styles.infoButtonText}>Deslogar</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* 🔹 Modal de confirmação de logout */}
          {showLogoutModal && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.modalText}>Tem certeza que deseja deslogar?</Text>

                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: "#BDBDBD" }]}
                    onPress={() => setShowLogoutModal(false)}
                  >
                    <Text style={styles.modalButtonText}>Fechar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: "#E53935" }]}
                    onPress={handleConfirmarLogout}
                  >
                    <Text style={styles.modalButtonText}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView >
      {/* 🔹 Pop-up de seleção de imagens prontas */}
      {
        showImageModal && (
          <View style={styles.popupOverlay}>
            <View style={styles.popupBox}>
              <Text style={styles.popupTitle}>Escolha uma imagem de perfil pronta</Text>

              <View style={styles.readyImagesContainer}>
                {[
                  require("../../assets/images/foto1.png"),
                  require("../../assets/images/foto2.png"),
                  require("../../assets/images/foto3.png"),
                  require("../../assets/images/foto4.png"),
                  require("../../assets/images/foto5.png"),
                  require("../../assets/images/foto6.png"),
                ].map((img, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedReadyImage(img)}
                    style={[
                      styles.readyImageWrapper,
                      selectedReadyImage === img && styles.selectedItem,
                    ]}
                  >
                    <Image source={img} style={styles.readyImage} resizeMode="cover" />
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.popupButtonsRow}>
                <TouchableOpacity
                  style={[styles.popupButton, { backgroundColor: "#4CAF50" }]}
                  onPress={() => {
                    if (!selectedReadyImage) {
                      Alert.alert(
                        "Selecione uma imagem",
                        "Escolha uma das imagens prontas antes de confirmar."
                      );
                      return;
                    }
                    setProfileImage(selectedReadyImage);
                    setShowImageModal(false);
                    setSelectedReadyImage(null);
                  }}
                >
                  <Text style={styles.popupButtonText}>Confirmar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.popupButton, { backgroundColor: "#E53935" }]}
                  onPress={handleExcluirImagemPronta}
                >
                  <Text style={styles.popupButtonText}>Excluir</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.popupButton, { backgroundColor: "#BDBDBD" }]}
                  onPress={() => setShowImageModal(false)}
                >
                  <Text style={styles.popupButtonText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      }
      {/* 🔹 Pop-up de seleção da imagem da galeria */}
      {showGalleryPopup && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupBox}>
            <Text style={styles.popupTitle}>Escolha uma ação</Text>

            <View style={styles.popupButtonsRow}>
              <TouchableOpacity
                style={[styles.popupButton, { backgroundColor: "#0D47A1" }]}
                onPress={async () => {
                  setShowGalleryPopup(false);
                  await handleEscolherImagemGaleria();
                }}
              >
                <Text style={styles.popupButtonText}>Galeria</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.popupButton, { backgroundColor: "#E53935" }]}
                onPress={() => {
                  if (profileImage) {
                    setProfileImage(null);
                    AsyncStorage.removeItem("molduraSelecionada"); // só se for da galeria
                  }
                  setShowGalleryPopup(false);
                }}
              >
                <Text style={styles.popupButtonText}>Excluir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.popupButton, { backgroundColor: "#BDBDBD" }]}
                onPress={() => setShowGalleryPopup(false)}
              >
                <Text style={styles.popupButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  carouselWrapper: { position: "relative", width: "100%" },
  bannerImage: { width: width, height: 220, borderRadius: 8 },
  dotsContainer: { position: "absolute", bottom: 10, left: 0, right: 0, flexDirection: "row", justifyContent: "center" },
  dot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 6 },
  previewContainer: { width: "100%", alignItems: "center", marginTop: 20, marginBottom: 25 },
  previewBox: { width: "90%", height: 180, borderRadius: 14, overflow: "hidden", backgroundColor: "#EEE", shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  previewImage: { width: "100%", height: "100%", borderRadius: 14 },
  section: { width: "90%", marginTop: 15 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionTitle: { fontSize: 20, fontWeight: "600", color: "#0D47A1" },
  arrow: { fontSize: 18, color: "#0D47A1" },
  bannerRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  bannerOption: { width: "48%", height: 100, marginBottom: 10, borderRadius: 8, backgroundColor: "#FFF", borderWidth: 2, borderColor: "#DDD", alignItems: "center", justifyContent: "center", padding: 4 },
  bannerThumb: { width: "100%", height: 100, borderRadius: 6 },
  colorsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  colorOption: { width: "22%", height: 60, borderRadius: 8, marginBottom: 10 },
  selectedItem: { borderWidth: 3, borderColor: "#0D47A1" },
  selectedRemove: { borderWidth: 3, borderColor: "#E53935" },
  framePreviewContainer: { alignItems: "center", justifyContent: "center", marginTop: 80, width: 230, height: "auto", position: "relative" },
  frameCircle: { width: 160, height: 160, borderRadius: 80, backgroundColor: "#EEE", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  profileImage: { width: 130, height: 130, borderRadius: 65, zIndex: 1 },
  molduraPreviewImage: { position: "absolute", width: 170, height: 170, borderRadius: 85, zIndex: 10 },
  borderCircle: { width: 160, height: 160, borderRadius: 80, alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", zIndex: 2 },
  frameOption: { width: "48%", height: 220, marginBottom: 12, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#DDD", backgroundColor: "#FFF" },
  frameThumb: { width: "100%", height: "100%", borderRadius: 10 },
  buttonRow: { flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 40 },
  topSaveContainer: { width: "90%", alignItems: "center", marginTop: 10 },
  topSaveButton: { backgroundColor: "#0D47A1", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8 },
  topSaveButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  saveBannerButton: { backgroundColor: "#4CAF50", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: "center", marginTop: 10 },
  saveBannerButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  frameOutside: { position: "absolute", width: 265, height: 265, top: -58, right: -25, zIndex: 3 },
  previewLabel: { marginTop: 45, fontSize: 14, fontWeight: "600", color: "#333" },
  chooseText: { marginTop: 10, fontSize: 11, fontWeight: "600", color: "#333", textAlign: "center", letterSpacing: 0.3 },
  imageButtonRow: { flexDirection: "row", justifyContent: "space-between", width: "130%", marginTop: 15, gap: 15 },
  imageButton: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  imageButtonText: { color: "#FFF", fontSize: 15, fontWeight: "600", textAlign: "center" },
  bottomButtonsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", marginTop: 40, marginBottom: 15, gap: 15 },
  saveButton: { backgroundColor: "#4CAF50", paddingVertical: 14, paddingHorizontal: 10, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  removeButton: { backgroundColor: "#E53935", paddingVertical: 14, paddingHorizontal: 10, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  saveButtonText: { color: "#FFF", fontSize: 15, fontWeight: "bold", textAlign: "center" },
  removeButtonText: { color: "#FFF", fontSize: 15, fontWeight: "bold", textAlign: "center" },
  infoSection: { width: "90%", marginTop: 20, marginBottom: 10, alignItems: "center" },
  infoTitleRow: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", marginBottom: 10 },
  infoTitle: { fontSize: 20, fontWeight: "700", color: "#000" },
  infoBox: { width: "100%", backgroundColor: "#FFF", borderWidth: 2, borderColor: "#000", borderRadius: 14, padding: 18, shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 2 }, shadowRadius: 3, elevation: 2 },
  input: { borderWidth: 1, borderColor: "#CCC", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, marginBottom: 12, color: "#333" },
  passwordContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#CCC", borderRadius: 8, paddingHorizontal: 10, marginBottom: 12 },
  infoButtonsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 15, gap: 12 },
  infoButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  infoButtonText: { color: "#FFF", fontWeight: "700", fontSize: 15, textAlign: "center" },
  modalOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" },
  modalBox: { width: "80%", backgroundColor: "#FFF", padding: 25, borderRadius: 12, alignItems: "center" },
  modalText: { fontSize: 16, fontWeight: "600", color: "#333", textAlign: "center", marginBottom: 20 },
  modalButtonsRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", gap: 10 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  modalButtonText: { color: "#FFF", fontSize: 15, fontWeight: "600" },
  bannerButtonsRow: { flexDirection: "row", justifyContent: "space-between", width: "90%", marginTop: 20, gap: 12 },
  bannerButton: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.15, shadowOffset: { width: 0, height: 2 }, shadowRadius: 3, elevation: 3 },
  bannerButtonText: { color: "#FFF", fontSize: 15, fontWeight: "700", textAlign: "center" },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  readyImagesContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 20 },
  readyImageWrapper: { width: 80, height: 80, borderRadius: 40, overflow: "hidden", borderWidth: 2, borderColor: "#DDD", alignItems: "center", justifyContent: "center" },
  readyImage: { width: "100%", height: "100%", borderRadius: 40 },
  popupOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", zIndex: 9999, elevation: 20 },
  popupBox: { width: "88%", backgroundColor: "#FFF", borderRadius: 16, paddingVertical: 28, paddingHorizontal: 22, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 12, zIndex: 1001 },
  popupTitle: { fontSize: 18, fontWeight: "700", color: "#0D47A1", marginBottom: 15, textAlign: "center" },
  popupButtonsRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 10, gap: 10 },
  popupButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  popupButtonText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  frameOptionsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", width: "100%" },
  frameRemover: { width: "48%", height: 220, marginBottom: 12, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#CCC", backgroundColor: "#FFF" },
  removerIcon: { width: 80, height: 80, resizeMode: "contain" },
  bannerRemovedOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", zIndex: 5000 },
  bannerRemovedBox: { width: "80%", backgroundColor: "#FFFFFF", paddingVertical: 25, paddingHorizontal: 20, borderRadius: 16, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.25, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 8 },
  bannerRemovedTitle: { fontSize: 20, fontWeight: "700", color: "#0D47A1", marginBottom: 10, textAlign: "center" },
  bannerRemovedSubtitle: { fontSize: 15, color: "#444", textAlign: "center", marginBottom: 20 },
  bannerRemovedButton: { backgroundColor: "#0D47A1", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  bannerRemovedButtonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});