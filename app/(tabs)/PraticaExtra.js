import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/* ===========================================
   COMPONENTE MEMOIZADO DE CADA QUIZ
   =========================================== */
const QuizBlock = React.memo(({ quiz, quizIndex, scrollRef, bloqueado }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const question = quiz.questions[currentQuestion];

  // 🔄 Recupera progresso salvo
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const key = `extra${quizIndex + 1}`;
        const saved = await AsyncStorage.getItem(key);
        if (saved) {
          const progress = Math.min(Math.max(parseFloat(saved) || 0, 0), 1);
          const total = quiz.questions.length;
          const restoredIndex = Math.floor(progress * total);
          if (restoredIndex < total) setCurrentQuestion(restoredIndex);
        }
      } catch (e) {
        console.log("Erro ao carregar progresso extra:", e);
      }
    };
    loadProgress();
  }, []);

  // 💾 Salva progresso automaticamente
  useEffect(() => {
    const saveProgress = async () => {
      try {
        const total = quiz.questions.length;
        let progress = currentQuestion / total;
        if (showModal || quizCompleted) progress = 1;

        const progressoNormalizado = Math.min(Math.max(progress, 0), 1);
        const key = `extra${quizIndex + 1}`;
        await AsyncStorage.setItem(key, JSON.stringify(progressoNormalizado));
      } catch (e) {
        console.log("Erro ao salvar progresso extra:", e);
      }
    };
    saveProgress();
  }, [currentQuestion, showModal, quizCompleted]);

  const handleOptionPress = (index) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === question.correct) setScore((prev) => prev + 1);
  };

  const handleNext = async () => {
    setSelectedOption(null);
    setShowExplanation(false);

    if (currentQuestion + 1 < quiz.questions.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const key = `extra${quizIndex + 1}`;
      await AsyncStorage.setItem(key, JSON.stringify(1));
      setShowModal(true);
    }
  };

  const handleResetQuiz = async () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizCompleted(false);
    setShowModal(false);

    const key = `extra${quizIndex + 1}`;
    await AsyncStorage.setItem(key, JSON.stringify(0));
  };

  return (
    <View style={{ position: "relative" }}>
      <View style={styles.card}>
        <Text style={styles.quizTitle}>{quiz.title}</Text>

        {/* Tela final grande */}
        {quizCompleted ? (
          <View style={styles.finalBox}>
            <Text style={styles.finalTitle}>🎉 Quiz Concluído!</Text>
            <Text style={styles.finalText}>
              Você acertou {score} de {quiz.questions.length} perguntas!
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#019314", marginTop: 10 }]}
              onPress={handleResetQuiz}
            >
              <Text style={styles.modalButtonText}>🔁 Refazer Quiz</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.questionText}>{question.question}</Text>

            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = question.correct === index;
              let backgroundColor = "#FFF";

              if (showExplanation) {
                if (isCorrect) backgroundColor = "#C6F6D5";
                else if (isSelected && !isCorrect) backgroundColor = "#FED7D7";
              } else if (isSelected) {
                backgroundColor = "#E0F2E9";
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.optionButton, { backgroundColor }]}
                  onPress={() => handleOptionPress(index)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              );
            })}

            {showExplanation && (
              <View style={styles.explanationBox}>
                <Text style={styles.explanationTitle}>
                  {selectedOption === question.correct
                    ? "✅ Resposta correta!"
                    : "❌ Resposta incorreta"}
                </Text>
                <Text style={styles.explanationText}>{question.explanation}</Text>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                  <Text style={styles.nextButtonText}>
                    {currentQuestion + 1 < quiz.questions.length
                      ? "Próxima pergunta ➜"
                      : "Finalizar Quiz"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* Modal pequeno */}
        <Modal visible={showModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>🎉 Quiz Concluído!</Text>
              <Text style={styles.modalText}>
                Você acertou {score} de {quiz.questions.length} perguntas!
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  style={[styles.modalButton, { flex: 1, marginRight: 8 }]}
                  onPress={handleResetQuiz}
                >
                  <Text style={styles.modalButtonText}>Refazer Quiz</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { flex: 1, marginLeft: 8, backgroundColor: "#019314" },
                  ]}
                  onPress={() => {
                    setShowModal(false);
                    setQuizCompleted(true);
                  }}
                >
                  <Text style={styles.modalButtonText}>Concluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      {/* Overlay bloqueado */}
      {bloqueado && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>
            Complete o tema anterior para desbloquear esse
          </Text>
        </View>
      )}
    </View>
  );
});

/* ===========================================
   COMPONENTE PRINCIPAL
   =========================================== */
export default function PraticaExtra() {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params;
  const scrollRef = useRef(null);
  const [quizLayouts, setQuizLayouts] = useState([]);
  const [progresso, setProgresso] = useState({ comum: [0, 0, 0], extra: [0, 0, 0] });
  const [desbloqueados, setDesbloqueados] = useState([true, false, false]); // só o primeiro começa desbloqueado

  const quizzes = [
    {
      title: "O Poder do Consumo Invisível",
      questions: [
        {
          question:
            "1. Qual fator mais determina o impacto ambiental do streaming de vídeos?",
          options: [
            "a) O tamanho da tela do dispositivo usado",
            "b) A qualidade de imagem e o tempo total assistido",
            "c) A quantidade de vídeos armazenados no aplicativo",
          ],
          correct: 1,
          explanation:
            "Quanto maior a resolução e o tempo de reprodução, mais energia os servidores e redes consomem.",
        },
        {
          question:
            "2. Por que o ‘consumo invisível’ é considerado um desafio ambiental moderno?",
          options: [
            "a) Porque a maioria das pessoas não percebe que ações digitais também consomem energia",
            "b) Porque só atividades industriais geram poluição real",
            "c) Porque os dispositivos atuais já compensam automaticamente suas emissões",
          ],
          correct: 0,
          explanation:
            "A invisibilidade do impacto digital faz com que as pessoas subestimem seu consumo energético.",
        },
        {
          question:
            "3. Qual ação realmente reduz o impacto ambiental do uso da internet?",
          options: [
            "a) Diminuir a resolução dos vídeos e baixar conteúdos assistidos com frequência",
            "b) Usar o modo avião durante o streaming",
            "c) Assistir sempre em 4K para evitar buffering",
          ],
          correct: 0,
          explanation:
            "Baixar vídeos evita transmissões repetidas e reduzir a resolução diminui o consumo energético.",
        },
      ],
    },
    {
      title: "Pegada Hídrica e Consumo de Água",
      questions: [
        {
          question: "1. O que significa ‘pegada hídrica’ de um produto?",
          options: [
            "a) A água usada apenas na limpeza do produto",
            "b) Toda a água usada durante produção, transporte e consumo",
            "c) A água utilizada apenas na embalagem",
          ],
          correct: 1,
          explanation:
            "A pegada hídrica envolve toda a água usada ao longo do ciclo de vida do produto.",
        },
        {
          question:
            "2. Qual atitude tem maior impacto para reduzir o consumo de água?",
          options: [
            "a) Tomar banhos mais curtos",
            "b) Diminuir o consumo de carne vermelha",
            "c) Usar sabão biodegradável",
          ],
          correct: 1,
          explanation:
            "A pecuária consome muita água; reduzir carne tem um impacto muito maior do que banhos curtos.",
        },
        {
          question:
            "3. Por que comprar roupas com menos frequência ajuda o meio ambiente?",
          options: [
            "a) Porque evita o consumo de água na produção têxtil",
            "b) Porque roupas novas ocupam mais espaço",
            "c) Porque reduz o lixo reciclável",
          ],
          correct: 0,
          explanation:
            "A indústria têxtil consome grandes volumes de água — cada peça nova tem alto custo hídrico.",
        },
      ],
    },
    {
      title: "A Natureza Dentro de Casa",
      questions: [
        {
          question: "1. Qual o principal benefício de ter plantas em casa?",
          options: [
            "a) Melhoram o ar e o bem-estar dos moradores",
            "b) Servem apenas como decoração",
            "c) Diminuem o espaço útil dos cômodos",
          ],
          correct: 0,
          explanation:
            "Plantas purificam o ar, trazem conforto visual e reduzem o estresse.",
        },
        {
          question: "2. Como o uso da luz natural ajuda o meio ambiente?",
          options: [
            "a) Diminui o uso de energia elétrica",
            "b) Evita a necessidade de janelas grandes",
            "c) Mantém a casa mais quente o tempo todo",
          ],
          correct: 0,
          explanation:
            "Aproveitar luz solar reduz o consumo de eletricidade, diminuindo a pegada de carbono.",
        },
        {
          question: "3. Qual hábito sustentável dentro de casa tem mais impacto?",
          options: [
            "a) Reaproveitar potes e embalagens em vez de jogar fora",
            "b) Comprar sempre produtos novos",
            "c) Usar apenas decoração artificial",
          ],
          correct: 0,
          explanation:
            "Reutilizar materiais evita desperdício, reduz a produção e economiza recursos naturais.",
        },
      ],
    },
  ];

  // 🔄 Recarrega progresso sempre que a tela de Prática Extra ganha foco
  useFocusEffect(
    useCallback(() => {
      const carregarProgresso = async () => {
        try {
          const chavesComum = ["pratica1", "pratica2", "pratica3"];
          const chavesExtra = ["extra1", "extra2", "extra3"];

          const valoresComum = await Promise.all(
            chavesComum.map(async (key) => {
              const value = await AsyncStorage.getItem(key);
              const num = parseFloat(value);
              if (isNaN(num)) return 0;
              return Math.min(Math.max(num, 0), 1);
            })
          );

          const valoresExtra = await Promise.all(
            chavesExtra.map(async (key) => {
              const value = await AsyncStorage.getItem(key);
              const num = parseFloat(value);
              if (isNaN(num)) return 0;
              return Math.min(Math.max(num, 0), 1);
            })
          );

          setProgresso({ comum: valoresComum, extra: valoresExtra });
        } catch (e) {
          console.log("Erro ao carregar progresso:", e);
        }
      };

      carregarProgresso();
    }, [])
  );

  // 🔓 Atualiza desbloqueios enquanto o app está aberto
  useEffect(() => {
    const novos = [true, false, false];

    // desbloqueia Tema 2 Extra se Tema 1 (comum + extra) estiver completo
    if (progresso.comum[0] === 1 && progresso.extra[0] === 1) novos[1] = true;

    // desbloqueia Tema 3 Extra se Tema 2 (comum + extra) estiver completo
    if (progresso.comum[1] === 1 && progresso.extra[1] === 1) novos[2] = true;

    setDesbloqueados(novos);
  }, [progresso]);

  // Scroll automático
  useEffect(() => {
    if (
      params?.scrollTo !== undefined &&
      scrollRef.current &&
      quizLayouts[params.scrollTo] !== undefined
    ) {
      setTimeout(() => {
        scrollRef.current.scrollTo({
          y: quizLayouts[params.scrollTo],
          animated: true,
        });
      }, 400);
    }
  }, [params, quizLayouts]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="arrow-back" size={24} color="#019314" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContainer}>
        {quizzes.map((quiz, index) => {
          const bloqueado = !desbloqueados[index];

          return (
            <View
              key={index}
              onLayout={(event) => {
                const { y } = event.nativeEvent.layout;
                setQuizLayouts((prev) => {
                  if (prev[index] !== y) {
                    const newLayouts = [...prev];
                    newLayouts[index] = y;
                    return newLayouts;
                  }
                  return prev;
                });
              }}
              style={{ position: "relative" }}
            >
              <QuizBlock quiz={quiz} quizIndex={index} scrollRef={scrollRef} />

              {/* 🔒 Overlay de bloqueio (fundo branco translúcido) */}
              {bloqueado && (
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                  }}
                >
                  <Text style={{ color: "#019314", fontWeight: "600", fontSize: 16, textAlign: "center" }}>
                    Complete o tema anterior para desbloquear esse
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

/* ===========================================
   ESTILOS
   =========================================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", paddingHorizontal: 20, paddingTop: 40 },
  scrollContainer: { paddingBottom: 80 },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backText: { fontSize: 18, color: "#019314", marginLeft: 6, fontWeight: "600" },
  card: { backgroundColor: "#F9F9F9", borderRadius: 12, padding: 20, marginBottom: 40 },
  quizTitle: { fontSize: 22, fontWeight: "bold", color: "#019314", marginBottom: 16, textAlign: "center" },
  questionText: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 14 },
  optionButton: { padding: 14, borderRadius: 8, borderWidth: 1, borderColor: "#019314", marginVertical: 6 },
  optionText: { fontSize: 16, color: "#333" },
  explanationBox: { marginTop: 20, backgroundColor: "#F0FDF4", borderRadius: 10, padding: 14, borderWidth: 1, borderColor: "#019314" },
  explanationTitle: { fontSize: 16, fontWeight: "700", color: "#019314", marginBottom: 6 },
  explanationText: { fontSize: 15, color: "#333", marginBottom: 12 },
  nextButton: { backgroundColor: "#019314", borderRadius: 8, paddingVertical: 10, alignItems: "center" },
  nextButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "80%", backgroundColor: "#FFF", borderRadius: 16, padding: 24, alignItems: "center" },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#019314", marginBottom: 10 },
  modalText: { fontSize: 16, color: "#333", marginBottom: 20, textAlign: "center" },
  modalButton: { backgroundColor: "#019314", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20 },
  modalButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  finalBox: {
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#019314",
  },
  finalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#019314",
    marginBottom: 10,
    textAlign: "center",
  },
  finalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  // overlay bloqueio
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  overlayText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 10,
  },
});