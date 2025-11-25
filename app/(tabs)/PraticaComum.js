import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
    findNodeHandle,
} from "react-native";

const BlocoPraticaComum = React.forwardRef(({ titulo, subtitulo, storageKey, descricaoTitulo, descricaoTexto }, ref) => {
    const navigation = useNavigation();
    const [imagemSelecionada, setImagemSelecionada] = useState(null);
    const [opcoesVisiveis, setOpcoesVisiveis] = useState(null);
    const [imagensUsuario, setImagensUsuario] = useState({
        maiorConsumo: [null, null, null],
        consumoMedio: [null, null, null],
        baixoConsumo: [null, null, null],
    });

    const atualizarProgresso = async (novoEstado) => {
        try {
            let progresso = 0;

            // Atualize os tópicos para refletir as novas chaves
            const topicosPreenchidos = [
                novoEstado.maiorConsumo?.some((img) => img !== null),
                novoEstado.consumoMedio?.some((img) => img !== null),
                novoEstado.baixoConsumo?.some((img) => img !== null),
            ];

            const totalPreenchidos = topicosPreenchidos.filter(Boolean).length;

            // Cada tópico vale 1/3 do progresso total
            progresso = totalPreenchidos / 3;

            await AsyncStorage.setItem(storageKey, progresso.toString());
            console.log(`✅ Progresso salvo para ${storageKey}: ${progresso * 100}%`);
        } catch (e) {
            console.log("Erro ao salvar progresso:", e);
        }
    };

    const escolherImagem = async (topico, index) => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permissão necessária", "Autorize o acesso à galeria.");
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets?.length > 0) {
                const novaImagem = result.assets[0].uri;
                setImagensUsuario((prev) => {
                    const novoEstado = {
                        ...prev,
                        [topico]: prev[topico].map((img, i) => (i === index ? novaImagem : img)),
                    };
                    atualizarProgresso(novoEstado);
                    return novoEstado;
                });
            }
        } catch (error) {
            console.log("Erro ao escolher imagem:", error);
            Alert.alert("Erro", "Não foi possível selecionar a imagem.");
        }
    };

    const excluirImagem = (topico, index) => {
        setImagensUsuario((prev) => {
            const novoEstado = {
                ...prev,
                [topico]: prev[topico].map((img, i) => (i === index ? null : img)),
            };
            atualizarProgresso(novoEstado);
            return novoEstado;
        });
        setOpcoesVisiveis(null);
    };

    const abrirOpcoesImagem = (img, topico, index) =>
        setOpcoesVisiveis({ img, topico, index });

    return (
        <View ref={ref} style={{ marginBottom: 40 }}>
            {/* ===== CABEÇALHO ===== */}
            <View style={styles.topoLinha}>
                <TouchableOpacity
                    style={styles.botaoVoltar}
                    onPress={() => navigation.navigate("Home")}
                >
                    <Ionicons name="arrow-back" size={26} color="black" />
                </TouchableOpacity>

                <View style={styles.caixa1}>
                    <View style={styles.textosCaixa1}>
                        <Text style={styles.textoSuperior}>{titulo}</Text>
                        <Text style={styles.textoInferior}>{subtitulo}</Text>
                    </View>
                </View>
            </View>

            {/* ===== CONTEÚDO ===== */}
            <View style={styles.caixaVerde}>
                <Text style={styles.tituloVerde}>{descricaoTitulo}</Text>

                <View style={styles.caixaBranca}>
                    <Text style={styles.textoBrancoCaixa2}>{descricaoTexto}</Text>
                </View>

                <Text style={styles.tituloProgresso}>SEU PROGRESSO</Text>

                {/* ===== UPLOAD DAS IMAGENS ===== */}
                <View style={styles.caixaBranca}>
                    {["maiorConsumo", "consumoMedio", "baixoConsumo"].map((topico) => {
                        // Define os títulos dos tópicos conforme o tema (descricaoTitulo)
                        let tituloTopico = "";
                        switch (descricaoTitulo) {
                            case "Mão na massa: Desligue o Standby":
                                tituloTopico =
                                    topico === "maiorConsumo"
                                        ? "Maior Consumo (E-F)"
                                        : topico === "consumoMedio"
                                            ? "Consumo Médio (C-D)"
                                            : "Baixo Consumo (A-B)";
                                break;

                            case "Roupas também 'bebem' água":
                                tituloTopico =
                                    topico === "maiorConsumo"
                                        ? "Roupas para doar"
                                        : topico === "consumoMedio"
                                            ? "Roupas para customizar"
                                            : "Roupas para trocar ou vender";
                                break;

                            case "Vida Nova às Coisas Velhas":
                                tituloTopico =
                                    topico === "maiorConsumo"
                                        ? "Transforme embalagens"
                                        : topico === "consumoMedio"
                                            ? "Reaproveite móveis e objetos"
                                            : "Reutilize tecidos em pequenas criações";
                                break;

                            default:
                                tituloTopico = topico;
                        }
                        return (
                            <View key={topico}>
                                <Text style={styles.topico}>
                                    <Text style={styles.negrito}>{tituloTopico}</Text>
                                </Text>

                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.scrollHorizontal}
                                >
                                    {(imagensUsuario[topico] || []).map((img, index) => (
                                        <TouchableOpacity
                                            key={`${topico}-${index}`}
                                            onPress={() =>
                                                img
                                                    ? abrirOpcoesImagem(img, topico, index)
                                                    : escolherImagem(topico, index)
                                            }
                                        >
                                            {img ? (
                                                <Image source={{ uri: img }} style={styles.quadradoImagem} />
                                            ) : (
                                                <View style={styles.quadradoCinza}>
                                                    <Ionicons name="add" size={36} color="#777" />
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* ===== MODAIS ===== */}
            <Modal
                visible={!!opcoesVisiveis}
                transparent
                animationType="fade"
                onRequestClose={() => setOpcoesVisiveis(null)}
            >
                <View style={styles.modalFundo}>
                    <View style={styles.modalCaixaOpcoes}>
                        <Text style={styles.modalTitulo}>Escolha uma opção</Text>

                        <TouchableOpacity
                            style={styles.botaoModal}
                            onPress={() => {
                                if (opcoesVisiveis) {
                                    setImagemSelecionada(opcoesVisiveis.img);
                                    setOpcoesVisiveis(null);
                                }
                            }}
                        >
                            <Ionicons name="eye" size={22} color="#4CAF50" />
                            <Text style={styles.textoBotaoModal}>Ver imagem</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.botaoModal}
                            onPress={() => {
                                if (opcoesVisiveis) {
                                    escolherImagem(opcoesVisiveis.topico, opcoesVisiveis.index);
                                    setOpcoesVisiveis(null);
                                }
                            }}
                        >
                            <Ionicons name="refresh" size={22} color="#4CAF50" />
                            <Text style={styles.textoBotaoModal}>Trocar imagem</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.botaoModal, { backgroundColor: "#FCE4EC" }]}
                            onPress={() => {
                                if (opcoesVisiveis) {
                                    excluirImagem(opcoesVisiveis.topico, opcoesVisiveis.index);
                                }
                            }}
                        >
                            <Ionicons name="trash" size={22} color="#E53935" />
                            <Text style={[styles.textoBotaoModal, { color: "#E53935" }]}>
                                Excluir imagem
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.botaoCancelar}
                            onPress={() => setOpcoesVisiveis(null)}
                        >
                            <Text style={styles.textoCancelar}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={!!imagemSelecionada}
                transparent
                animationType="fade"
                onRequestClose={() => setImagemSelecionada(null)}
            >
                <View style={styles.modalFundo}>
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={() => setImagemSelecionada(null)}
                    />
                    <View style={styles.modalConteudo}>
                        <Image source={{ uri: imagemSelecionada }} style={styles.imagemAmpliada} />
                        <TouchableOpacity
                            style={styles.botaoFechar}
                            onPress={() => setImagemSelecionada(null)}
                        >
                            <Ionicons name="close" size={26} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
});

export default function PraticaComum() {
    const scrollRef = useRef(null);
    const blocosRefs = [useRef(null), useRef(null), useRef(null)];
    const route = useRoute();

    const [progresso, setProgresso] = useState({ comum: [0, 0, 0], extra: [0, 0, 0] });
    const [desbloqueados, setDesbloqueados] = useState([true, false, false]);

    // 🔹 PASSO 2: carregar progresso do AsyncStorage
    useFocusEffect(
        React.useCallback(() => {
            const carregarProgresso = async () => {
                try {
                    const chavesComum = ["pratica1", "pratica2", "pratica3"];
                    const chavesExtra = ["extra1", "extra2", "extra3"];

                    const valoresComum = await Promise.all(
                        chavesComum.map(async (key) => {
                            const value = await AsyncStorage.getItem(key);
                            return value ? parseFloat(value) : 0;
                        })
                    );

                    const valoresExtra = await Promise.all(
                        chavesExtra.map(async (key) => {
                            const value = await AsyncStorage.getItem(key);
                            return value ? parseFloat(value) : 0;
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

    // 🔹 PASSO 3: desbloquear as práticas com base em comum + extra
    useEffect(() => {
        const novos = [...desbloqueados];
        if (progresso.comum[0] === 1 && progresso.extra[0] === 1) novos[1] = true;
        if (progresso.comum[1] === 1 && progresso.extra[1] === 1) novos[2] = true;
        setDesbloqueados(novos);
    }, [progresso]);

    // scroll automático (mantém o seu)
    useFocusEffect(
        React.useCallback(() => {
            const scrollTo = route.params?.scrollTo;
            if (scrollTo !== undefined && blocosRefs[scrollTo]?.current && scrollRef.current) {
                const nodeHandle = findNodeHandle(blocosRefs[scrollTo].current);
                const scrollHandle = findNodeHandle(scrollRef.current);
                if (nodeHandle && scrollHandle) {
                    UIManager.measureLayout(
                        nodeHandle,
                        scrollHandle,
                        () => { },
                        (x, y) => scrollRef.current.scrollTo({ y: y - 20, animated: true })
                    );
                }
            }
        }, [route.params])
    );

    return (
        <ScrollView
            ref={scrollRef}
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 60 }}
        >
            <BlocoPraticaComum
                ref={blocosRefs[0]}
                titulo="Prática 1"
                subtitulo="Tema 01"
                storageKey="pratica1"
                descricaoTitulo="Mão na massa: Desligue o Standby"
                descricaoTexto={
                    <Text style={styles.textoBrancoCaixa2}>
                        Mesmo “desligados”, muitos aparelhos continuam gastando energia — esse é o{" "}
                        <Text style={styles.negrito}>modo standby</Text>, que pode representar até{" "}
                        <Text style={styles.negrito}>12% da conta de luz</Text>. Luzinhas acesas e sensores ativos
                        são sinais de que o consumo continua. Desconectar da tomada o que não está em uso é uma
                        atitude simples que economiza energia e reduz emissões de carbono. Inspire-se no{" "}
                        <Text style={styles.negrito}>Selo ENCE</Text> (de A a F) e veja onde agir primeiro:
                    </Text>
                }
            />

            {/* ===== Prática 2 ===== */}
            <View style={{ position: "relative" }}>
                <BlocoPraticaComum
                    ref={blocosRefs[1]}
                    titulo="Prática 2"
                    subtitulo="Tema 02"
                    storageKey="pratica2"
                    descricaoTitulo="Roupas também 'bebem' água"
                    descricaoTexto={
                        <Text style={styles.textoBrancoCaixa2}>
                            Você sabia que uma única camiseta de algodão pode usar <Text style={styles.negrito}>mais de 2.500 litros</Text>{" "}
                            de água para ser produzida? Isso inclui o cultivo do algodão, a fabricação e o {" "}
                            transporte. Nesta prática, o desafio é olhar para o seu armário e perceber quanta água {" "}
                            está guardada lá dentro, parada em roupas que quase nunca são usadas. Ao dar um novo{" "}
                            destino a elas, você reduz o desperdício e ajuda a valorizar cada gota envolvida nesse processo.
                        </Text>
                    }
                />

                {!desbloqueados[1] && (
                    <View style={styles.overlay} pointerEvents="auto">
                        <Text style={styles.overlayText}>
                            Complete a prática anterior para desbloquear esta
                        </Text>
                    </View>
                )}
            </View>

            {/* ===== Prática 3 ===== */}
            <View style={{ position: "relative" }}>
                <BlocoPraticaComum
                    ref={blocosRefs[2]}
                    titulo="Prática 3"
                    subtitulo="Tema 03"
                    storageKey="pratica3"
                    descricaoTitulo="Vida Nova às Coisas Velhas"
                    descricaoTexto={
                        <Text style={styles.textoBrancoCaixa2}>
                            Trazer a natureza para dentro de casa não é só sobre plantas — é sobre dar nova vida ao {" "}
                            que já existe. A reciclagem criativa transforma resíduos em objetos úteis e bonitos, reduzindo{" "}
                             o desperdício e fortalecendo nossa conexão com o meio ambiente.
                        </Text>
                    }
                />

                {!desbloqueados[2] && (
                    <View style={styles.overlay} pointerEvents="auto">
                        <Text style={styles.overlayText}>
                            Complete a prática anterior para desbloquear esta
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", padding: 15 },
    topoLinha: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
    botaoVoltar: { marginRight: 10, padding: 10 },
    caixa1: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#FFF",
        borderColor: "#4CAF50",
        borderWidth: 2,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    textosCaixa1: { flex: 1, marginHorizontal: 10 },
    textoSuperior: { fontSize: 20, fontWeight: "bold", color: "#4CAF50" },
    textoInferior: { fontSize: 17, color: "#333" },
    caixaVerde: { backgroundColor: "#4CAF50", borderRadius: 12, padding: 20 },
    tituloVerde: { color: "#FFF", fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
    caixaBranca: { backgroundColor: "#FFF", borderRadius: 12, padding: 15, marginBottom: 20 },
    textoBrancoCaixa2: { fontSize: 16, color: "#333", lineHeight: 24 },
    negrito: { fontWeight: "bold", color: "#333" },
    tituloProgresso: { fontSize: 18, fontWeight: "bold", color: "#FFF", marginBottom: 15, textAlign: "center" },
    topico: { fontSize: 16, color: "#333", marginBottom: 8 },
    scrollHorizontal: { marginBottom: 15 },
    quadradoCinza: { width: 120, height: 120, borderRadius: 10, backgroundColor: "#EEE", marginRight: 10, justifyContent: "center", alignItems: "center" },
    quadradoImagem: { width: 120, height: 120, borderRadius: 10, marginRight: 10 },
    modalFundo: { flex: 1, backgroundColor: "rgba(0,0,0,0.85)", justifyContent: "center", alignItems: "center" },
    modalCaixaOpcoes: { backgroundColor: "#FFF", width: 280, borderRadius: 16, padding: 20, alignItems: "center" },
    modalTitulo: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 15 },
    botaoModal: { flexDirection: "row", alignItems: "center", backgroundColor: "#E8F5E9", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, width: "100%", marginBottom: 10 },
    textoBotaoModal: { fontSize: 16, color: "#333", marginLeft: 10, fontWeight: "500" },
    botaoCancelar: { marginTop: 5 },
    textoCancelar: { color: "#888", fontSize: 15 },
    modalConteudo: { justifyContent: "center", alignItems: "center" },
    imagemAmpliada: { width: 340, height: 340, borderRadius: 12, backgroundColor: "#DDD", resizeMode: "contain" },
    botaoFechar: { position: "absolute", top: 10, right: 10, padding: 10 },
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
        zIndex: 10, // garante que o overlay fique por cima
    },
    overlayText: {
        color: "#000",
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
        paddingHorizontal: 10,
    },
});