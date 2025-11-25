import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function Conquistas() {
  const router = useRouter();
  const pathname = usePathname();
  const [year, setYear] = useState(2025);
  const animValue = useRef(new Animated.Value(0)).current;
  const [selectedImage, setSelectedImage] = useState(null);
  // Lista de 12 imagens
  const imagesList = [
    { file: "AnoNovoPlanetaNovo.png", title: "Ano Novo, Planeta Novo", src: require("../../assets/images/AnoNovoPlanetaNovo.png"), resumo: "Seu novo ano planta sementes para um planeta renascido." },
    { file: "FoliaResponsavel.png", title: "Folia Responsável", src: require("../../assets/images/FoliaResponsavel.png"), resumo: "Sua folia deixa marcas na memória, não na Terra." },
    { file: "GuardiaDaAgua.png", title: "Guardião da Água", src: require("../../assets/images/GuardiaDaAgua.png"), resumo: "Cada gota que se torna um rio de esperança." },
    { file: "HeroiDaTerra.png", title: "Herói da Terra", src: require("../../assets/images/HeroiDaTerra.png"), resumo: "Suas mãos são o escudo que a Terra esperava." },
    { file: "MaeNatureza.png", title: "Mãe Natureza", src: require("../../assets/images/MaeNatureza.png"), resumo: "Seu cuidado nutre a vida como a natureza sempre fez." },
    { file: "ArraiaQuest.png", title: "Arraia Quest", src: require("../../assets/images/ArraiaQuest.png"), resumo: "Sua festa junina pisa forte mas deixa pegada leve." },
    { file: "FeriasEcologicas.png", title: "Férias Ecológicas", src: require("../../assets/images/FeriasEcologicas.png"), resumo: "Suas férias renovam você sem custo para o planeta." },
    { file: "CavaleiroDoVento.png", title: "Cavaleiro do Vento", src: require("../../assets/images/CavaleiroDoVento.png"), resumo: "Você cavalga com o vento, não contra ele." },
    { file: "PulmoesDoMundo.png", title: "Pulmões do Mundo", src: require("../../assets/images/PulmoesDoMundo.png"), resumo: "Suas mãos guardam o coração verde do planeta." },
    { file: "AssombracaoDoLixo.png", title: "Assombração do Lixo", src: require("../../assets/images/AssombracaoDoLixo.png"), resumo: "Você assusta o lixo para fora do planeta." },
    { file: "EcoDaAlianca.png", title: "Eco da Aliança", src: require("../../assets/images/EcoDaAlianca.png"), resumo: "Seu abraço silencia ameaças e amplifica cantos." },
    { file: "RetrospectivaSustentavel.png", title: "Retrospectiva Sustentável", src: require("../../assets/images/RetrospectivaSustentavel.png"), resumo: "Seu ano deixou histórias, não pegadas." },
  ];

  const months = ["Jan.", "Fev.", "Mar.", "Abr.", "Mai.", "Jun.", "Jul.", "Ago.", "Set.", "Out.", "Nov.", "Dez."];
  // bloqueados agora: Abril(3), Julho(6), Dezembro(11)
  const lockedMonths = [3, 6, 11]; // Novembro removido
  // animação do dígito
  const animateYearChange = (newYear) => {
    Animated.sequence([
      Animated.timing(animValue, { toValue: 1, duration: 200, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(animValue, { toValue: 0, duration: 200, easing: Easing.in(Easing.ease), useNativeDriver: true }),
    ]).start(() => setYear(newYear));
  };

  const handlePreviousYear = () => { if (year === 2025) animateYearChange(2024); };
  const handleNextYear = () => { if (year === 2024) animateYearChange(2025); };

  const translateY = animValue.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });
  const opacity = animValue.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  const isQuests = pathname?.toLowerCase().includes("quests");
  const isConquistas = pathname?.toLowerCase().includes("conquistas");

  const firstDigits = Math.floor(year / 10);
  const lastDigit = year % 10;

  const handleImagePress = (index) => {
    const locked = lockedMonths.includes(index);
    setSelectedImage({ index, locked });
  };

  return (
    <View style={styles.container}>
      {/* header azul */}
      <View style={styles.headerContainer}>
        <View style={styles.tabButtonsContainer}>
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => router.push("/Quests")} style={styles.tabTouchable}>
              <Text style={[styles.tabText, isQuests ? styles.tabTextSelected : styles.tabTextUnselected]}>Quests</Text>
            </TouchableOpacity>
            <View style={[styles.tabBar, isQuests ? styles.tabBarActive : styles.tabBarInactive]} />
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => router.push("/Conquistas")} style={styles.tabTouchable}>
              <Text style={[styles.tabText, isConquistas ? styles.tabTextSelected : styles.tabTextUnselected]}>Conquistas</Text>
            </TouchableOpacity>
            <View style={[styles.tabBar, isConquistas ? styles.tabBarActive : styles.tabBarInactive]} />
          </View>
        </View>
        {/* ano */}
        <View style={styles.yearContainer}>
          <TouchableOpacity onPress={handlePreviousYear} disabled={year === 2024}>
            <Ionicons name="chevron-back" size={42} color="#FFF" style={{ opacity: year === 2024 ? 0.3 : 1 }} />
          </TouchableOpacity>

          <View style={styles.yearInnerContainer}>
            <Text style={styles.yearTextFixed}>{firstDigits}</Text>
            <Animated.Text style={[styles.yearTextAnimated, { opacity, transform: [{ translateY }] }]}>{lastDigit}</Animated.Text>
          </View>

          <TouchableOpacity onPress={handleNextYear} disabled={year === 2025}>
            <Ionicons name="chevron-forward" size={42} color="#FFF" style={{ opacity: year === 2025 ? 0.3 : 1 }} />
          </TouchableOpacity>
        </View>
      </View>
      {/* conteúdo rolável com 12 imagens */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.bottomContainer}>
          <View style={styles.imagesContainer}>
            {imagesList.map((img, index) => {
              const locked = lockedMonths.includes(index);
              return (
                <TouchableOpacity key={index} onPress={() => handleImagePress(index)}>
                  <View style={styles.imageWrapper}>
                    <View style={styles.imageContainer}>
                      <Image source={img.src} style={styles.imageItem} />
                      {locked && (
                        <>
                          <BlurView intensity={45} tint="light" style={styles.blurOverlay} />
                          <Ionicons name="lock-closed" size={50} color="rgba(0,0,0,0.65)" style={styles.lockIcon} />
                        </>
                      )}
                    </View>
                    <Text style={styles.imageLabel}>{months[index]}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
      {/* modal com fechar + ver detalhes */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            {selectedImage && (
              <>
                <Image
                  source={imagesList[selectedImage.index].src}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>
                  {imagesList[selectedImage.index].title}
                </Text>
                <Text style={styles.modalDescription}>
                  {imagesList[selectedImage.index].resumo}
                </Text>

                {(() => {
                  const currentMonth = new Date().getMonth(); // mês atual (0 a 11)
                  const imgMonth = selectedImage.index;
                  const isFutureMonth = imgMonth > currentMonth;
                  const isCurrentMonth = imgMonth === currentMonth;
                  const isLocked = lockedMonths.includes(imgMonth);

                  if (isFutureMonth) {
                    return (
                      <Text style={[styles.modalSubtitle, { color: "#FFA500" }]}>
                        ⏳ Espere mais um pouco...
                      </Text>
                    );
                  } else if (isCurrentMonth) {
                    return (
                      <Text style={[styles.modalSubtitle, { color: "#1E90FF" }]}>
                        🔄 Em andamento!
                      </Text>
                    );
                  } else if (isLocked) {
                    return (
                      <Text style={[styles.modalSubtitle, styles.lockedText]}>
                        Não foi dessa vez... mais sorte na próxima!
                      </Text>
                    );
                  } else {
                    return (
                      <Text style={[styles.modalSubtitle, styles.unlockedText]}>
                        🏆 Conquista recebida!
                      </Text>
                    );
                  }
                })()}

                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                    onPress={() => setSelectedImage(null)}
                  >
                    <Text style={{ color: "#000", fontWeight: "bold" }}>Fechar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: "#1E90FF" }]}
                    onPress={() => {
                      const idx = selectedImage.index;
                      const title = encodeURIComponent(imagesList[idx].title);
                      setSelectedImage(null);
                      router.push(`/Quests?monthIndex=${idx}&title=${title}`);
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      Ver detalhes
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  headerContainer: { backgroundColor: "#1E90FF", paddingTop: 10, paddingHorizontal: 16, paddingBottom: 10 },
  tabButtonsContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  tabContainer: { flex: 1, alignItems: "center" },
  tabTouchable: { paddingVertical: 10, width: "100%", alignItems: "center" },
  tabText: { fontSize: 22, fontWeight: "900" },
  tabTextSelected: { color: "#FFFFFF", opacity: 1 },
  tabTextUnselected: { color: "#FFFFFF", opacity: 0.5 },
  tabBar: { height: 5, width: "90%", borderRadius: 3, marginTop: -1 },
  tabBarActive: { backgroundColor: "#FFFFFF", opacity: 1 },
  tabBarInactive: { backgroundColor: "#FFFFFF", opacity: 0.3 },
  yearContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10, width: "70%", alignSelf: "center" },
  yearInnerContainer: { flexDirection: "row", alignItems: "flex-end", justifyContent: "center" },
  yearTextFixed: { color: "#FFFFFF", fontSize: 28, fontWeight: "900" },
  yearTextAnimated: { color: "#FFFFFF", fontSize: 28, fontWeight: "900", marginLeft: 2 },
  scrollContent: { alignItems: "center", paddingBottom: 20 },
  bottomContainer: { flex: 1, backgroundColor: "#FFFFFF", alignItems: "center", paddingTop: 20 },
  imagesContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", width: "90%" },
  imageWrapper: { alignItems: "center", marginBottom: 14 },
  imageContainer: { position: "relative", borderRadius: 8, overflow: "hidden", width: screenWidth * 0.42 },
  imageItem: { width: "100%", height: 165, borderRadius: 8, resizeMode: "contain" },
  blurOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: 8 },
  lockIcon: { position: "absolute", top: "50%", left: "50%", transform: [{ translateX: -25 }, { translateY: -25 }] },
  imageLabel: { marginTop: 6, fontSize: 16, color: "#000000", fontWeight: "bold" },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalBox: { backgroundColor: "#FFF", padding: 20, borderRadius: 16, alignItems: "center", width: "82%" },
  modalImage: { width: 120, height: 120, borderRadius: 8, marginBottom: 10, resizeMode: "contain" },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#1E90FF", marginBottom: 6, textAlign: "center" },
  modalDescription: { fontSize: 14, color: "#333", marginBottom: 8, textAlign: "center" },
  modalSubtitle: { fontSize: 15, marginBottom: 14, textAlign: "center" },
  unlockedText: { color: "#1E90FF" },
  lockedText: { color: "#E84545" },
  modalButtonsRow: { flexDirection: "row", gap: 10 },
  modalButton: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, marginHorizontal: 6 },
});
