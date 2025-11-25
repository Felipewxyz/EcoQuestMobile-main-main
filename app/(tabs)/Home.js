import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  findNodeHandle,
  Image,
  InteractionManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
  Modal
} from "react-native";
import Svg, { Circle } from "react-native-svg";

// FUNÇÕES PARA SOMAR MOEDAS =============================
const addEcoPoints = async (amount) => {
  try {
    const stored = await AsyncStorage.getItem("ecopoints");
    const current = stored ? Number(stored) : 0;

    const updated = current + amount;
    await AsyncStorage.setItem("ecopoints", String(updated));

    return updated;
  } catch (error) {
    console.log("Erro ao adicionar EcoPoints:", error);
  }
};

const addFloraCoins = async (amount) => {
  try {
    const stored = await AsyncStorage.getItem("floracoins");
    const current = stored ? Number(stored) : 0;

    const updated = current + amount;
    await AsyncStorage.setItem("floracoins", String(updated));

    return updated;
  } catch (error) {
    console.log("Erro ao adicionar FloraCoins:", error);
  }
};

const RewardPopup = ({ visible, message, icon, onClose }) => {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {icon && <Image source={icon} style={styles.icon} />}
          <Text style={styles.title}>Parabéns! 🎉</Text>
          <Text style={styles.message}>{message}</Text>

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default function Home() {
  const navigation = useNavigation();
  const route = useRoute();
  // refs para cada bloco por tema
  const temaRefs = [
    { extra: useRef(null), comum: useRef(null), extra2: useRef(null), comum2: useRef(null) },
    { extra: useRef(null), comum: useRef(null), extra2: useRef(null), comum2: useRef(null) },
    { extra: useRef(null), comum: useRef(null), extra2: useRef(null), comum2: useRef(null) },
  ];

  const scrollViewRef = useRef(null);
  // progresso separado por tipo
  const [progresso, setProgresso] = useState({
    comum: [0, 0, 0],
    extra: [0, 0, 0],
  });
  // barra de Complete 2 práticas
  const [barraPraticasCompleta, setBarraPraticasCompleta] = useState(false);
  // barra de Complete 1 tema
  const [barraTemaCompleta, setBarraTemaCompleta] = useState(false);
  // controle de temas desbloqueados
  const [desbloqueados, setDesbloqueados] = useState([true, false, false]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupIcon, setPopupIcon] = useState(null);
  const [ecoPoints, setEcoPoints] = useState(0);
  const [floraCoins, setFloraCoins] = useState(0);
  // Limpa o progresso
  useEffect(() => {
    const limparProgresso = async () => {
      try {
        // Reseta progresso exibido nas Quests
        await AsyncStorage.removeItem("completedPractices");
        await AsyncStorage.removeItem("completedThemes");

        // Reseta moedas
        await AsyncStorage.setItem("ecopoints", "0");
        await AsyncStorage.setItem("floracoins", "0");

        // Reseta flags de recompensas (para barras darem recompensa novamente)
        await AsyncStorage.setItem("rewardedComum", JSON.stringify([false, false, false]));
        await AsyncStorage.setItem("rewardedExtra", JSON.stringify([false, false, false]));

        // Reseta progresso das barras comuns
        await AsyncStorage.setItem("pratica1", "0");
        await AsyncStorage.setItem("pratica2", "0");
        await AsyncStorage.setItem("pratica3", "0");

        // Reseta progresso das barras extra
        await AsyncStorage.setItem("extra1", "0");
        await AsyncStorage.setItem("extra2", "0");
        await AsyncStorage.setItem("extra3", "0");

        console.log("App resetado — modo demonstração ativo");
      } catch (err) {
        console.log("Erro ao limpar progresso:", err);
      }
    };

    limparProgresso();
  }, []);
  // animValues separados por tipo e tema
  const animValues = useRef({
    comum: [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)],
    extra: [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)],
  }).current;
  // ================= Carregar progresso =================
  useFocusEffect(
    React.useCallback(() => {
      const carregarProgresso = async () => {
        try {
          const chavesComum = ["pratica1", "pratica2", "pratica3"];
          const valoresComum = await Promise.all(
            chavesComum.map(async (key) => {
              const value = await AsyncStorage.getItem(key);
              return value ? parseFloat(value) : 0;
            })
          );

          const chavesExtra = ["extra1", "extra2", "extra3"];
          const valoresExtra = await Promise.all(
            chavesExtra.map(async (key) => {
              const value = await AsyncStorage.getItem(key);
              const num = parseFloat(value);
              if (isNaN(num)) return 0;
              if (num > 1) return 1;
              if (num < 0) return 0;
              return num;
            })
          );

          setProgresso({ comum: valoresComum, extra: valoresExtra });
          // animar cada barra individualmente
          valoresComum.forEach((p, i) => {
            Animated.timing(animValues.comum[i], {
              toValue: p > 1 ? p / 100 : p,
              duration: 800,
              useNativeDriver: false,
            }).start();
          });

          valoresExtra.forEach((p, i) => {
            Animated.timing(animValues.extra[i], {
              toValue: p,
              duration: 800,
              useNativeDriver: false,
            }).start();
          });
        } catch (error) {
          console.log("Erro ao carregar progresso:", error);
        }
      };

      carregarProgresso();
    }, [])
  );
  // ================= Atualizar desbloqueios =================
  useEffect(() => {
    const novosDesbloqueios = [...desbloqueados];
    // desbloqueia tema 2 se tema 1 estiver completo
    if (progresso.comum[0] === 1 && progresso.extra[0] === 1) {
      novosDesbloqueios[1] = true;
    }
    // desbloqueia tema 3 se tema 2 estiver completo
    if (progresso.comum[1] === 1 && progresso.extra[1] === 1) {
      novosDesbloqueios[2] = true;
    }

    setDesbloqueados(novosDesbloqueios);
  }, [progresso]);
  // ================= Detectar conclusão das barras e dar recompensas =================
  useEffect(() => {
    const verificarConclusao = async () => {
      try {
        // Carregar valores já recompensados (evita dar a mesma recompensa 2x)
        const rewardedComum = await AsyncStorage.getItem("rewardedComum");
        const rewardedExtra = await AsyncStorage.getItem("rewardedExtra");

        let rewardedComumArr = rewardedComum ? JSON.parse(rewardedComum) : [false, false, false];
        let rewardedExtraArr = rewardedExtra ? JSON.parse(rewardedExtra) : [false, false, false];

        // ======== PRÁTICA COMUM → +15 EcoPoints ==========
        for (let i = 0; i < progresso.comum.length; i++) {
          if (progresso.comum[i] === 1 && !rewardedComumArr[i]) {
            rewardedComumArr[i] = true;
            await AsyncStorage.setItem("rewardedComum", JSON.stringify(rewardedComumArr));

            const updated = await addEcoPoints(15);

            // Atualiza o topo em tempo real
            setEcoPoints(updated);

            // Atualiza o valor temporário para a barra de Quests
            await AsyncStorage.setItem("ecoPointsTemp", String(updated));

            // Dispara o pop-up
            setPopupMessage("🎉 Você ganhou +15 EcoPoints!");
            setPopupIcon(require("../../assets/images/folha.png"));
            setPopupVisible(true);
          }
        }

        // ======== PRÁTICA EXTRA → +10 FloraCoins ==========
        for (let i = 0; i < progresso.extra.length; i++) {
          if (progresso.extra[i] === 1 && !rewardedExtraArr[i]) {
            rewardedExtraArr[i] = true;

            await AsyncStorage.setItem("rewardedExtra", JSON.stringify(rewardedExtraArr));

            await addFloraCoins(10);
            setFloraCoins(prev => prev + 10);

            setPopupMessage("Você ganhou 10 FloraCoins!");
            setPopupIcon(require("../../assets/images/flor.png"));
            setPopupVisible(true);
          }
        }
      } catch (error) {
        console.log("Erro ao verificar conclusão:", error);
      }
    };

    verificarConclusao();
  }, [progresso]);
  const handlePracticeComplete = async () => {
    try {
      const stored = await AsyncStorage.getItem("completedPractices");
      const current = stored ? Number(stored) : 0;

      if (current < 2) {
        const newValue = current + 1;
        await AsyncStorage.setItem("completedPractices", String(newValue));
        console.log("Progresso salvo:", newValue);
      } else {
        console.log("Já completou as 2 práticas!");
      }
    } catch (err) {
      console.log("Erro ao salvar progresso:", err);
    }
  };
  // ================= Contar práticas completas (para a tela Quests) =================
  useEffect(() => {
    const atualizarProgressoQuests = async () => {
      try {
        const totalCompletas =
          progresso.comum.filter((p) => p === 1).length +
          progresso.extra.filter((p) => p === 1).length;

        const valorFinal = totalCompletas >= 2 ? 2 : totalCompletas;

        await AsyncStorage.setItem("completedPractices", String(valorFinal));
        console.log("Progresso de quests atualizado:", valorFinal);
      } catch (err) {
        console.log("Erro ao atualizar progresso de Quests:", err);
      }
    };

    atualizarProgressoQuests();
  }, [progresso]);
  // ================= Contar temas completos (para a tela Quests) =================
  useEffect(() => {
    const atualizarProgressoTemas = async () => {
      try {
        // Conta quantos temas estão completos (prática comum + extra = 1)
        let temasCompletos = 0;
        for (let i = 0; i < progresso.comum.length; i++) {
          if (progresso.comum[i] === 1 && progresso.extra[i] === 1) {
            temasCompletos++;
          }
        }
        // Queremos apenas saber se 1 tema foi concluído (para a quest)
        const valorFinal = temasCompletos >= 1 ? 1 : 0;

        await AsyncStorage.setItem("completedThemes", String(valorFinal));
        console.log("Progresso de temas atualizado:", valorFinal);
      } catch (err) {
        console.log("Erro ao atualizar progresso de temas:", err);
      }
    };

    atualizarProgressoTemas();
  }, [progresso]);
  // ================= Scroll automático =================
  useFocusEffect(
    React.useCallback(() => {
      const { scrollTo, bloco } = route.params || {};
      if (typeof scrollTo === "number" && temaRefs[scrollTo]) {
        const blocoAlvo = bloco && temaRefs[scrollTo][bloco] ? bloco : "comum";
        const refAlvo = temaRefs[scrollTo][blocoAlvo]?.current;

        if (refAlvo && scrollViewRef.current) {
          const nodeHandle = findNodeHandle(refAlvo);
          const scrollHandle = findNodeHandle(scrollViewRef.current);

          if (nodeHandle && scrollHandle) {
            InteractionManager.runAfterInteractions(() => {
              UIManager.measureLayout(
                nodeHandle,
                scrollHandle,
                () => { },
                (x, y) => {
                  scrollViewRef.current.scrollTo({ y: y - 40, animated: true });
                }
              );
            });
          }
        }
      }
    }, [route.params])
  );
  // ================= Componentes =================
  const CircleProgress = ({ index, tipo = "comum", size = 140, onPress }) => {
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const animatedStroke = animValues[tipo][index].interpolate({
      inputRange: [0, 1],
      outputRange: [circumference, 0],
    });

    const AnimatedCircle = Animated.createAnimatedComponent(Circle);
    const percent = Math.round((progresso[tipo][index] || 0) * 100);
    const strokeColor = progresso[tipo][index] > 0 ? "#019314" : "#C8C8C8";

    return (
      <Pressable onPress={onPress} style={[styles.circleContainer, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle
            stroke="#E0E0E0"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <AnimatedCircle
            stroke={strokeColor}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={animatedStroke}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.iconInside}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#019314" }}>{percent}%</Text>
        </View>
      </Pressable>
    );
  };

  const BlocoExtra = ({ innerRef, title, index, tipo, onPress }) => (
    <View ref={innerRef} collapsable={false}>
      <View style={styles.themeBox}>
        <View style={styles.themeTextContainer}>
          <Text style={styles.themeTitle}>{title}</Text>
          <Text style={styles.themeSubtitle}>
            {`Tema ${String(index + 1).padStart(2, "0")} - Prática ${tipo}`}
          </Text>
        </View>
        <View style={styles.divider} />
        <Pressable onPress={onPress}>
          <Ionicons name="journal-outline" size={36} color="#019314" />
        </Pressable>
      </View>
    </View>
  );

  const BlocoComum = ({ innerRef, index, tipo = "comum", onPress }) => (
    <View ref={innerRef} collapsable={false}>
      <View style={styles.greenBox}>
        <CircleProgress index={index} tipo={tipo} onPress={onPress} />
      </View>
    </View>
  );

  const temas = [
    "O Poder do Consumo Invisível",
    "A Água que Você Não Vê",
    "A Natureza Dentro de Casa",
  ];

  return (
    <>
      <ScrollView ref={scrollViewRef} style={styles.container}>
        {/* Topo */}
        <View style={styles.topIcons}>
          {/* Máx de dias ou outro valor fixo */}
          <View style={styles.iconItem}>
            <Image source={require("../../assets/images/gota.png")} style={styles.icon} />
            <Text style={styles.iconText}>30</Text>
          </View>

          {/* EcoPoints em tempo real */}
          <View style={styles.iconItem}>
            <Image source={require("../../assets/images/folha.png")} style={styles.icon} />
            <Text style={styles.iconText}>{ecoPoints}</Text>
          </View>

          {/* FloraCoins em tempo real */}
          <View style={styles.iconItem}>
            <Image source={require("../../assets/images/flor.png")} style={styles.icon} />
            <Text style={styles.iconText}>{floraCoins}</Text>
          </View>
        </View>

        {temas.map((t, i) => {
          const bloqueado = !desbloqueados[i];

          return (
            <View key={i} style={{ position: "relative" }}>
              {/* Bloco Extra Comum */}
              <BlocoExtra
                innerRef={temaRefs[i].extra}
                title={t}
                index={i}
                tipo="Comum"
                onPress={() => navigation.navigate("Temas", { scrollTo: i })}
              />
              <BlocoComum
                innerRef={temaRefs[i].comum}
                index={i}
                tipo="comum"
                onPress={() => navigation.navigate("PraticaComum", { scrollTo: i })}
              />
              {/* Bloco Extra Extra */}
              <BlocoExtra
                innerRef={temaRefs[i].extra2}
                title={t}
                index={i}
                tipo="Extra"
                onPress={() => navigation.navigate("Temas", { scrollTo: i })}
              />
              <BlocoComum
                innerRef={temaRefs[i].comum2}
                index={i}
                tipo="extra"
                onPress={() =>
                  navigation.navigate("PraticaExtra", { initialQuiz: i + 1, scrollTo: i })
                }
              />

              {bloqueado && (
                <View style={styles.overlay}>
                  <Text style={styles.overlayText}>
                    Complete o tema anterior para desbloquear esse
                  </Text>
                </View>
              )}
            </View>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
      <RewardPopup
        visible={popupVisible}
        message={popupMessage}
        icon={popupIcon}
        onClose={() => setPopupVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", paddingTop: 40, paddingHorizontal: 20 },
  topIcons: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  iconItem: { flexDirection: "row", alignItems: "center" },
  icon: { width: 50, height: 50, marginRight: 6 },
  iconText: { fontSize: 18, fontWeight: "bold", color: "#000" },
  themeBox: { backgroundColor: "#FFFFFF", borderColor: "#019314", borderWidth: 2, borderRadius: 10, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 80, marginTop: 10 },
  themeTextContainer: { flex: 1 },
  themeTitle: { color: "#019314", fontSize: 16, fontWeight: "bold", opacity: 0.85 },
  themeSubtitle: { color: "#019314", fontSize: 14, fontWeight: "500" },
  divider: { width: 2, height: "80%", backgroundColor: "#019314", marginHorizontal: 12, opacity: 0.8 },
  greenBox: { borderWidth: 2, borderColor: "#019314", borderRadius: 15, paddingVertical: 20, paddingHorizontal: 10, marginTop: 10, marginBottom: 18, alignItems: "center" },
  circleContainer: { alignItems: "center", justifyContent: "center" },
  iconInside: { position: "absolute", top: "50%", left: "50%", transform: [{ translateX: -18 }, { translateY: -12 }] },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(255,255,255,0.8)", justifyContent: "center", alignItems: "center", borderRadius: 10 },
  overlayText: { color: "#000", fontSize: 14, fontWeight: "600", textAlign: "center", paddingHorizontal: 10 },
  popup: {
    width: 290,
    paddingVertical: 30,
    paddingHorizontal: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#7BC47F",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2F7D32",
    marginBottom: 5,
  },
  message: {
    textAlign: "center",
    fontSize: 17,
    color: "#333",
    marginBottom: 25,
    maxWidth: 220,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  }
});