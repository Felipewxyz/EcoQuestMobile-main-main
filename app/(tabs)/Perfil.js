import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRoute } from "@react-navigation/native";

export default function Perfil() {
  const router = useRouter();
  const [bannerData, setBannerData] = useState(null);
  const [frameData, setFrameData] = useState(null); // moldura/borda selecionada
  const [userInfo, setUserInfo] = useState({ nome: "", usuario: "" });
  const [ecoPoints, setEcoPoints] = useState(0);
  const [floraCoins, setFloraCoins] = useState(0);
  const route = useRoute();
  const { shieldImage } = route.params || {}; // garante que não seja undefined

  useFocusEffect(
    useCallback(() => {
      const carregarConfig = async () => {
        try {
          const banner = await AsyncStorage.getItem("bannerSelecionado");
          const moldura = await AsyncStorage.getItem("molduraSelecionada");
          const userData = await AsyncStorage.getItem("userInfo");
          const ep = await AsyncStorage.getItem("ecopoints");
          const fc = await AsyncStorage.getItem("floracoins");

          setEcoPoints(ep ? Number(ep) : 0);
          setFloraCoins(fc ? Number(fc) : 0);

          if (banner) setBannerData(JSON.parse(banner));

          if (moldura) {
            const parsed = JSON.parse(moldura);
            setFrameData(parsed); // já inclui frame, borderColor e profileImage
          } else {
            setFrameData(null);
          }

          if (userData) {
            const parsedUser = JSON.parse(userData);
            setUserInfo(parsedUser);
          }
        } catch (error) {
          console.log("Erro ao carregar configurações:", error);
        }
      };

      carregarConfig();
    }, [])
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ⚙️ Ícone de Configurações */}
      <Pressable
        style={({ pressed }) => [
          styles.configIcon,
          pressed && { transform: [{ scale: 0.9 }], opacity: 0.7 },
        ]}
        onPress={() => router.push("/(tabs)/Configuracoes")}
      >
        <Ionicons name="settings-outline" size={38} color="#000" />
      </Pressable>
      {/* 🔹 Banner dinâmico */}
      {bannerData?.type === "banner" ? (
        <Image
          source={bannerData.value}
          style={styles.banner}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.banner,
            { backgroundColor: bannerData?.value || "#B4E197" },
          ]}
        />
      )}
      {/* 🔹 Seção verde escura */}
      <View style={styles.greenSection}>
        {/* Container do perfil com moldura para fora */}
        <View style={styles.profileWrapper}>
          {/* Moldura decorativa para fora da foto */}
          {frameData?.frame && (
            <Image
              source={frameData.frame.uri}
              style={styles.frameOutside}
              resizeMode="contain"
            />
          )}
          {/* Foto de perfil com borda colorida (se houver) */}
          <View
            style={[
              styles.profileCircle,
              frameData?.borderColor && {
                borderColor: frameData.borderColor,
                borderWidth: 5,
              },
            ]}
          >

            <Image
              source={
                frameData?.profileImage
                  ? (typeof frameData.profileImage === 'string'
                    ? { uri: frameData.profileImage }
                    : typeof frameData.profileImage === 'number'
                      ? frameData.profileImage
                      : frameData.profileImage && frameData.profileImage.uri
                        ? (typeof frameData.profileImage.uri === 'number'
                          ? frameData.profileImage.uri
                          : { uri: frameData.profileImage.uri })
                        : require("../../assets/images/perfilplaceholder.png"))
                  : require("../../assets/images/perfilplaceholder.png")
              }
              style={styles.profileImage}
            />
          </View>
        </View>
        {/* Info do perfil */}
        <View style={styles.infoBox}>
          <Text style={styles.name}>{userInfo.nome || "Seu nome"}</Text>
          <Text style={styles.username}>
            {userInfo.usuario ? `@${userInfo.usuario}` : "@usuario"}
          </Text>

          {/* Substituindo ícone por imagem recebida via props */}
          {shieldImage && (
            <Image
              source={shieldImage} // aqui será passado da outra página
              style={styles.shieldImage}
              resizeMode="contain"
            />
          )}
        </View>
      </View>
      {/* 🔹 Parte branca com estatísticas */}
      <View style={styles.whiteSection}>
        <View style={styles.statsBox}>
          {/* 1 - Máx de dias */}
          <View style={styles.statRow}>
            <Image
              source={require("../../assets/images/gota.png")}
              style={styles.iconImage}
            />
            <View style={styles.statTextBox}>
              <Text style={styles.statNumber}>211</Text>
              <Text style={styles.statLabel}>máx. de dias seguidos</Text>
            </View>
          </View>
          {/* 2 - EcoPoints */}
          <View style={styles.statRow}>
            <Image
              source={require("../../assets/images/folha.png")}
              style={styles.iconImage}
            />
            <View style={styles.statTextBox}>
              <Text style={styles.statNumber}>{ecoPoints}</Text>
              <Text style={styles.statLabel}>total de EcoPoints</Text>
            </View>
          </View>
          {/* 3 - FloraCoins */}
          <View style={styles.statRow}>
            <Image
              source={require("../../assets/images/flor.png")}
              style={styles.iconImage}
            />
            <View style={styles.statTextBox}>
              <Text style={styles.statNumber}>{floraCoins}</Text>
              <Text style={styles.statLabel}>total de FloraCoins</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  configIcon: { position: "absolute", top: 25, left: 25, zIndex: 3 },
  banner: { width: "100%", height: 285, alignSelf: "center", overflow: "hidden", backgroundColor: "#B4E197" },
  greenSection: { flexDirection: "row", alignItems: "center", backgroundColor: "#7BC47F", height: 110, paddingLeft: 200, paddingRight: 20, marginTop: -70 },
  // Novo container para foto + moldura
  profileWrapper: { position: "absolute", top: -90, left: 10, width: 180, height: 180, alignItems: "center", justifyContent: "center", zIndex: 5 },
  profileCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: "#C4C4C4", borderWidth: 3, borderColor: "#FFFFFF", alignItems: "center", justifyContent: "center", overflow: "hidden", zIndex: 2 },
  profileImage: { width: 130, height: 130, borderRadius: 65 },
  frameOutside: { position: "absolute", width: 240, height: 240, top: -40, left: -22, zIndex: 3 },
  infoBox: { flex: 1, justifyContent: "center" },
  name: { fontSize: 22, fontWeight: "bold", color: "#000" },
  username: { fontSize: 16, color: "#555", marginBottom: 5 },
  levelRow: { flexDirection: "row", alignItems: "center" },
  levelContainer: { backgroundColor: "#FFFFFF", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  levelText: { fontSize: 12, fontWeight: "600" },
  whiteSection: { backgroundColor: "#FFFFFF", alignItems: "center", paddingVertical: 30 },
  statsBox: { backgroundColor: "#F2F2F2", borderRadius: 15, paddingVertical: 45, paddingHorizontal: 25, width: "80%" },
  statRow: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  statTextBox: { marginLeft: 8, justifyContent: "center" },
  statNumber: { fontSize: 34, fontWeight: "bold", color: "#000" },
  statLabel: { fontSize: 15, color: "#555" },
  iconImage: { width: 70, height: 70, resizeMode: "contain" },
  shieldImage: {
    width: 65,        // aumenta o tamanho se quiser
    height: 90,
    position: "absolute",
    top: -15,           // ajusta conforme necessário
    right: -8,         // ou left, depende do layout
    zIndex: 10,       // garante que fique sobre os outros elementos
  }
});