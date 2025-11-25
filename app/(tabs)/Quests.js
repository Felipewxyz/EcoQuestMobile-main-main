import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Quests() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams();
  const [completedPractices, setCompletedPractices] = useState(0);
  const [completedThemes, setCompletedThemes] = useState(0);
  const [ecoPointsQuest, setEcoPointsQuest] = useState(0);

  useEffect(() => {
    const carregarTemas = async () => {
      try {
        const value = await AsyncStorage.getItem("completedThemes");
        const num = value ? Number(value) : 0;
        setCompletedThemes(num);
        console.log("Valor de temas carregado:", num);
      } catch (err) {
        console.log("Erro ao carregar temas:", err);
      }
    };

    carregarTemas();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const carregarEcoPointsQuest = async () => {
        try {
          const temp = await AsyncStorage.getItem("ecoPointsTemp");
          setEcoPointsQuest(temp ? Number(temp) : 0);
        } catch (err) {
          console.log(err);
        }
      };
      carregarEcoPointsQuest();
    }, [])
  );

  // sempre que o usuário voltar pra tela, recarrega o progresso salvo
  useFocusEffect(
    React.useCallback(() => {
      const loadProgress = async () => {
        try {
          const stored = await AsyncStorage.getItem("completedPractices");
          const value = stored ? Number(stored) : 0;
          setCompletedPractices(value);
          console.log("Valor carregado do AsyncStorage:", value);
        } catch (err) {
          console.log("Erro ao carregar progresso:", err);
        }
      };
      loadProgress();
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      const value = await AsyncStorage.getItem("completedThemes");
      const num = value ? Number(value) : 0;
      setCompletedThemes(num);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const imagesList = [
    require("../../assets/images/AnoNovoPlanetaNovo.png"),
    require("../../assets/images/FoliaResponsavel.png"),
    require("../../assets/images/GuardiaDaAgua.png"),
    require("../../assets/images/HeroiDaTerra.png"),
    require("../../assets/images/MaeNatureza.png"),
    require("../../assets/images/ArraiaQuest.png"),
    require("../../assets/images/FeriasEcologicas.png"),
    require("../../assets/images/CavaleiroDoVento.png"),
    require("../../assets/images/PulmoesDoMundo.png"),
    require("../../assets/images/AssombracaoDoLixo.png"),
    require("../../assets/images/EcoDaAlianca.png"),
    require("../../assets/images/RetrospectivaSustentavel.png"),
  ];

  const titlesList = [
    "Ano Novo, Planeta Novo",
    "Folia Responsável",
    "Guardião da Água",
    "Herói da Terra",
    "Mãe Natureza",
    "Arraia Quest",
    "Férias Ecológicas",
    "Cavaleiro do Vento",
    "Pulmões do Mundo",
    "Assombração do Lixo",
    "Eco da Aliança",
    "Retrospectiva Sustentável",
  ];

  const monthsFull = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const currentMonthIndex = new Date().getMonth();
  const monthIndexParam = typeof params?.monthIndex !== "undefined" ? Number(params.monthIndex) : undefined;
  const titleParam = params?.title ? decodeURIComponent(String(params.title)) : undefined;
  const [headerMonthIndex, setHeaderMonthIndex] = useState(monthIndexParam ?? currentMonthIndex);

  // Progresso
  const completedMonths = [0, 1, 2, 4, 5, 7, 8, 9];
  const lockedMonths = [3, 6, 10, 11];

  // Função que calcula quantos dias faltam pro mês acabar
  function getRemainingDaysInMonth() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const diffTime = lastDayOfMonth - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Estado e atualização automática dos dias restantes
  const [remainingDays, setRemainingDays] = useState(getRemainingDaysInMonth());
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingDays(getRemainingDaysInMonth());
    }, 60 * 60 * 1000); // atualiza a cada 1h
    return () => clearInterval(interval);
  }, []);

  // Atualiza o mês automaticamente se virar
  useEffect(() => {
    const interval = setInterval(() => {
      const newMonth = new Date().getMonth();
      setHeaderMonthIndex(newMonth);
    }, 60 * 60 * 1000); // verifica a cada 1h
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof monthIndexParam === "number" && !isNaN(monthIndexParam)) {
      setHeaderMonthIndex(monthIndexParam);
    }
  }, [monthIndexParam]);

  useEffect(() => {
    updateDailyProgress();
  }, [completedPractices, ecoPointsQuest, completedThemes]);

  function updateDailyProgress() {
    let completedCount = 0;

    // Quest 1: completedPractices
    if (completedPractices >= 2) completedCount++;

    // Quest 2: ecoPointsQuest
    if (ecoPointsQuest >= 25) completedCount++;

    // Quest 3: completedThemes
    if (completedThemes >= 1) completedCount++;

    // Atualiza dailyProgress
    setDailyProgress({
      ...dailyProgress,
      completed: completedCount * 10, // cada quest vale 10 "pontos" da barra
    });
  }

  const totalDailyQuests = 3; // número de pequenas quests por dia

  const [dailyProgress, setDailyProgress] = useState({
    completed: 0,
    total: totalDailyQuests * 10 // cada quest vale 10 pontos
  });

  const isCurrent = headerMonthIndex === currentMonthIndex;
  const isFuture = headerMonthIndex > currentMonthIndex;
  const isPast = headerMonthIndex < currentMonthIndex;
  const isLocked = lockedMonths.includes(headerMonthIndex);
  const isCompleted = completedMonths.includes(headerMonthIndex) && !isLocked;

  const isQuests = pathname?.toLowerCase().includes("quests");
  const isConquistas = pathname?.toLowerCase().includes("conquistas");

  const headerTitle = titleParam ?? titlesList[headerMonthIndex];
  const headerMonthFull = monthsFull[headerMonthIndex];
  const headerImage = imagesList[headerMonthIndex];

  const progressPercent = Math.round((dailyProgress.completed / dailyProgress.total) * 100);

  // Texto dinâmico do contador
  const remainingText =
    remainingDays === 1
      ? "Último dia do mês"
      : `${remainingDays} ${remainingDays === 1 ? "dia restante" : "dias restantes"}`;

  return (
    <View style={styles.container}>
      {/* TOPO AZUL */}
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

        {/* cabeçalho com mês e imagem */}
        <View style={styles.questHeaderContainer}>
          <View style={styles.questRow}>
            <View style={styles.titleGroup}>
              <View style={styles.monthContainer}>
                <Text style={styles.monthText}>{headerMonthFull}</Text>
              </View>
              <Text style={styles.questTitleText}>{headerTitle}</Text>
            </View>
            <Image source={headerImage} style={styles.questImage} />
          </View>
        </View>

        {/* QUADRADO PRETO */}
        <View style={styles.dailyQuestContainer}>
          <View style={styles.dailyHeader}>
            <Ionicons name="time-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.daysText}>
              {isCurrent
                ? remainingText
                : isFuture
                  ? "Seu desafio ainda vai começar"
                  : "Tempo esgotado"}
            </Text>
          </View>

          <View style={styles.dailyQuestBox}>
            {isCurrent ? (
              <>
                <Text style={styles.dailyQuestText}>Complete 30 quests diárias</Text>
                <Text style={styles.dailyQuestCompleted}>
                  <Text style={styles.dailyQuestCompleted}>
                    {dailyProgress.completed}/{dailyProgress.total}
                  </Text>
                </Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                </View>
              </>
            ) : isCompleted ? (
              <>
                <Text style={styles.completedText}>Completo</Text>
                <Text style={styles.completedCount}>30/30</Text>
              </>
            ) : isFuture ? (
              <>
                <Text style={styles.dailyQuestText}>Complete 30 quests diárias</Text>
                <Text style={[styles.dailyQuestCompleted, { color: "#FFFFFF" }]}>0/0</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: "0%", backgroundColor: "rgba(255,255,255,0.18)" }]} />
                </View>
              </>
            ) : (
              <>
                <Text style={[styles.dailyQuestText, { color: "#FFFFFF" }]}>❌ Desafio não concluído</Text>
                <Text style={[styles.dailyQuestCompleted, { color: "#FFFFFF" }]}>0/0</Text>
              </>
            )}
          </View>
        </View>
      </View>

      {/* PARTE BRANCA INFERIOR */}
      <ScrollView style={styles.bottomContainer} contentContainerStyle={{ paddingBottom: 40 }}>
        {isCurrent ? (
          <>
            <Text style={styles.dailyTitle}>Quests Diárias</Text>
            <View style={styles.questsBox}>
              {/* trecho do JSX */}
              <View style={styles.questProgressContainer}>
                <View style={styles.textRow}>
                  <Ionicons name="barbell-outline" size={28} color="#1E90FF" style={styles.icon} />
                  <Text style={styles.questDescription}>Complete 2 práticas</Text>
                </View>

                <View style={styles.progressOuter}>
                  <View
                    style={[
                      styles.progressInner,
                      { width: `${(completedPractices / 2) * 100}%` },
                    ]}
                  />
                  <Text style={styles.progressText}>
                    {String(completedPractices).padStart(2, "0")}/02
                  </Text>
                </View>

                <View style={styles.separator} />
              </View>

              {/* Segunda Quest */}
              <View style={styles.questProgressContainer}>
                <View style={styles.textRow}>
                  <Image
                    source={require("../../assets/images/folhaazul.png")}
                    style={[styles.icon, { width: 28, height: 28, tintColor: "#1E90FF" }]}
                  />
                  <Text style={styles.questDescription}>Ganhe 25 EPs</Text>
                </View>
                <View style={styles.progressOuter}>
                  <View style={[styles.progressInner, { width: `${Math.min((ecoPointsQuest / 25) * 100, 100)}%` }]} />
                  <Text style={styles.progressText}>{Math.min(ecoPointsQuest, 25)}/25</Text>
                </View>
                <View style={styles.separator} />
              </View>

              {/* Terceira Quest */}
              <View style={styles.questProgressContainer}>
                <View style={styles.textRow}>
                  <Ionicons name="barbell-outline" size={28} color="#1E90FF" style={styles.icon} />
                  <Text style={styles.questDescription}>Complete 1 tema</Text>
                </View>
                <View style={styles.progressOuter}>
                  <View
                    style={[
                      styles.progressInner,
                      { width: `${(completedThemes / 1) * 100}%` },
                    ]}
                  />
                  <Text style={styles.progressText}>{`${completedThemes}/1`}</Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View style={{ paddingHorizontal: 16, alignItems: "center" }}>
            {isPast && !isCompleted && !isLocked ? (
              <View style={styles.messageBox}>
                <Text style={[styles.messageTitle, { color: "#E84545" }]}>Não desanime</Text>
                <Text style={styles.messageDesc}>
                  O tempo passou, mas a natureza sempre dá novas chances. Continue cultivando bons hábitos!
                </Text>
              </View>
            ) : isLocked && isPast ? (
              <View style={styles.messageBox}>
                <Text style={[styles.messageTitle, { color: "#FF8C00" }]}>Continue tentando</Text>
                <Text style={styles.messageDesc}>
                  Nem sempre conseguimos de primeira — o importante é continuar firme!
                  Cada tentativa é um passo rumo a um planeta melhor
                </Text>
              </View>
            ) : isFuture ? (
              <View style={styles.messageBox}>
                <Text style={[styles.messageTitle, { color: "#1E90FF" }]}>Espere mais um pouco</Text>
                <Text style={styles.messageDesc}>
                  O próximo desafio está germinando — prepare-se para ajudar a natureza em breve!
                </Text>
              </View>
            ) : isCompleted ? (
              <View style={styles.messageBox}>
                <Text style={[styles.messageTitle, { color: "#2E8B57" }]}>Parabéns!</Text>
                <Text style={styles.messageDesc}>
                  Você concluiu este desafio e ajudou o planeta — continue assim!
                </Text>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  headerContainer: { backgroundColor: "#1E90FF", paddingTop: 10, paddingHorizontal: 16, paddingBottom: 20 },
  tabButtonsContainer: { flexDirection: "row", justifyContent: "space-between" },
  tabContainer: { flex: 1, alignItems: "center" },
  tabTouchable: { paddingVertical: 10, width: "100%", alignItems: "center" },
  tabText: { fontSize: 22, fontWeight: "900" },
  tabTextSelected: { color: "#FFFFFF", opacity: 1 },
  tabTextUnselected: { color: "#FFFFFF", opacity: 0.5 },
  tabBar: { height: 5, width: "90%", borderRadius: 3, marginTop: -1 },
  tabBarActive: { backgroundColor: "#FFFFFF", opacity: 1 },
  tabBarInactive: { backgroundColor: "#FFFFFF", opacity: 0.3 },
  questHeaderContainer: { marginTop: 10, marginBottom: 10 },
  questRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  titleGroup: { justifyContent: "center", flex: 1 },
  monthContainer: { backgroundColor: "#FFFFFF", paddingVertical: 3, paddingHorizontal: 10, borderRadius: 8, alignSelf: "flex-start", marginBottom: 6 },
  monthText: { color: "#1E90FF", fontSize: 14, fontWeight: "900" },
  questTitleText: { color: "#FFFFFF", fontSize: 28, fontWeight: "900", lineHeight: 34 },
  questImage: { width: 130, height: 130, borderRadius: 12, resizeMode: "contain", marginLeft: 12 },
  dailyQuestContainer: { marginTop: 10 },
  dailyHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  daysText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
  dailyQuestBox: { backgroundColor: "rgba(0,0,0,0.25)", borderRadius: 10, padding: 14, width: "100%", minHeight: 64 },
  dailyQuestText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
  dailyQuestCompleted: { position: "absolute", right: 14, top: 18, fontSize: 15, fontWeight: "900", color: "#FFFFFF" },
  progressBar: { height: 8, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 6, overflow: "hidden", marginTop: 12 },
  progressFill: { height: "100%", backgroundColor: "#1E90FF" },
  completedText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  completedCount: { position: "absolute", right: 14, top: 16, color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
  bottomContainer: { flex: 1, backgroundColor: "#FFFFFF", padding: 16 },
  messageBox: { backgroundColor: "#F3F9FF", padding: 18, borderRadius: 12, alignItems: "center", marginVertical: 20 },
  messageTitle: { fontSize: 20, fontWeight: "800", marginBottom: 8, textAlign: "center" },
  messageDesc: { fontSize: 15, color: "#375E8C", textAlign: "center" },
  dailyTitle: { color: "#1E90FF", fontSize: 26, fontWeight: "900", marginBottom: 16 },
  questsBox: { borderWidth: 2, borderColor: "rgba(30,144,255,0.4)", borderRadius: 16, padding: 16 },
  questProgressContainer: { marginBottom: 14 },
  textRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  icon: { marginRight: 3 },
  questDescription: { color: "#1E90FF", fontSize: 19, fontWeight: "900" },
  progressOuter: { width: "100%", height: 26, backgroundColor: "rgba(30,144,255,0.2)", borderRadius: 10, overflow: "hidden", justifyContent: "center", alignItems: "center", position: "relative" },
  progressInner: { position: "absolute", left: 0, top: 0, bottom: 0, backgroundColor: "#1E90FF", borderRadius: 10 },
  progressText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 14, textAlign: "center", zIndex: 2 },
  separator: { alignSelf: "stretch", height: 3, backgroundColor: "rgba(30,144,255,0.25)", marginTop: 14, marginBottom: 6, borderRadius: 3 },
});
