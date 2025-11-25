import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, LayoutAnimation, Platform, UIManager, TextInput } from "react-native";
import { useState } from "react";

export default function Ajuda() {
    const navigation = useNavigation();
    const [expanded, setExpanded] = useState({});
    const [searchText, setSearchText] = useState("");

    const toggleExpand = (key) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const topics = [
        {
            title: "Progresso, Temas e Páginas de Prática",
            qa: [
                {
                    question: "Como funcionam os temas da Home?",
                    answer: "Cada tema tem 1 prática comum e 1 prática extra, com duas barras circulares mostrando o progresso dessas práticas. Cada barra funciona como botão que leva direto para a prática correspondente."
                },
                {
                    question: "O que significa a barra circular de progresso?",
                    answer: "Ela mostra quanto daquela prática você já completou — e quando fica 100%, a prática está concluída."
                },
                {
                    question: "Como funcionam as práticas comuns?",
                    answer: "Cada prática comum tem: um título, uma explicação, 3 tópicos, e em cada um você pode enviar 1 a 3 fotos relacionadas ao que é pedido. Completar todos os tópicos conclui a prática."
                },
                {
                    question: "Como funcionam as práticas extras?",
                    answer: "São quizzes com 3 perguntas e 3 alternativas por pergunta. Ao responder todas, a prática extra é concluída."
                },
                {
                    question: "Como acesso práticas comuns e extras?",
                    answer: "Sempre pela Home, tocando nas barras circulares do tema."
                },
            ]
        },
        {
            title: "Ofensiva (Sequência de Dias)",
            qa: [
                {
                    question: "O que é ofensiva?",
                    answer: "É quantos dias seguidos você completou pelo menos uma prática."
                },
                {
                    question: "O que é o 'máximo de ofensiva'?",
                    answer: "É a maior sequência de dias seguidos que você já conseguiu."
                },
                {
                    question: "Se eu quebrar minha sequência, perco insígnias?",
                    answer: "Não. O que você já conquistou fica salvo."
                },
            ]
        },
        {
            title: "EcoPoints (EP), FloraCoins (FC) e Loja",
            qa: [
                {
                    question: "Para que servem EPs e FCs?",
                    answer: "EPs: compram banners e molduras normais.\nFCs: compram banners e molduras especiais/premium."
                },
                {
                    question: "Como ganho EPs?",
                    answer: "Completando práticas, quizzes, quests e abrindo baús."
                },
                {
                    question: "Como ganho FCs?",
                    answer: "Comprando, eventos ou bônus ocasionais, abrindo baús premium."
                },
                {
                    question: "O que são os tipos de baús?",
                    answer: "Bronze: itens comuns\nPrata: itens comuns e épicos\nOuro: maior chance de épicos e lendários"
                },
                {
                    question: "O que significa comum, épico e lendário?",
                    answer: "É a raridade dos banners/molduras."
                },
                {
                    question: "Posso ver o item antes de comprar?",
                    answer: "Sim, tocando no item aparece a prévia."
                },
            ]
        },
        {
            title: "Banners, Molduras e Personalização",
            qa: [
                {
                    question: "Qual a diferença entre banner e moldura?",
                    answer: "Banner: aparece no topo do seu perfil.\nMoldura: fica ao redor da sua foto de perfil."
                },
                {
                    question: "Como troco minha moldura, banner ou foto?",
                    answer: "Na Página de Configurações, e cada seção tem seu próprio botão 'Salvar'."
                },
                {
                    question: "Posso usar foto da galeria?",
                    answer: "Sim."
                },
            ]
        },
        {
            title: "Perfil e Privacidade",
            qa: [
                {
                    question: "O que aparece no meu perfil?",
                    answer: "Banner, Foto de perfil (com borda/moldura/sem nada), Nome e nome de usuário, Máximo de ofensiva, Total de EPs, Total de FCs"
                },
                {
                    question: "Qual a diferença entre nome e nome de usuário?",
                    answer: "Nome: como você quer aparecer\nUsuário: identificação única no sistema"
                },
                {
                    question: "Como edito meus dados?",
                    answer: "Na Página de Configurações, em Informações Pessoais."
                },
            ]
        },
        {
            title: "Quests e Conquistas",
            qa: [
                {
                    question: "Qual a diferença entre Quests e Conquistas?",
                    answer: "Quests: o que você tem que fazer (tarefas).\nConquistas: o que você ganhou/atingiu com essas quests."
                },
                {
                    question: "Como funciona cada conquista no calendário?",
                    answer: "Depende do mês: Mês concluído → parabéns, Mês não concluído → incentivo, Mês futuro → 'calma', Mês atual → quests diárias, quantas faltam, temporizador para o mês acabar."
                },
                {
                    question: "Como vejo conquistas de outros anos?",
                    answer: "No botão de seleção dentro da página de Conquistas."
                },
            ]
        },
        {
            title: "Insígnias",
            qa: [
                {
                    question: "O que são insígnias?",
                    answer: "Medalhas conquistadas por sequência de dias (ofensiva), passe do app, objetivos especiais."
                },
                {
                    question: "Insígnias bloqueadas mostram seus requisitos?",
                    answer: "Sim, ao tocar nelas."
                },
                {
                    question: "Posso perder uma insígnia?",
                    answer: "Não, uma vez conquistada é sua pra sempre."
                },
            ]
        },
        {
            title: "Configurações e Conta",
            qa: [
                {
                    question: "O que posso mudar na página de configurações?",
                    answer: "Banner, moldura, borda, foto, informações pessoais. Cada área tem um botão próprio de Salvar Alterações."
                },
                {
                    question: "Como deslogar?",
                    answer: "Na seção 'Informações Pessoais'."
                },
            ]
        },
        {
            title: "Página Sobre",
            qa: [
                {
                    question: "O que tem na Página de Sobre?",
                    answer: "Uma explicação sobre atitude, cuidado, desafio, jornada e respeito. E um botão que leva para o cadastro."
                },
            ]
        },
        {
            title: "Página de Ajuda",
            qa: [
                {
                    question: "O que encontro aqui?",
                    answer: "Todas as dúvidas, perguntas e respostas organizadas para você conseguir ajuda sem precisar falar com ninguém."
                },
            ]
        },
    ];

    const filteredTopics = topics.map(topic => {
        // Filtra apenas perguntas que contém o texto da busca
        const filteredQA = topic.qa.filter(item =>
            item.question.toLowerCase().includes(searchText.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchText.toLowerCase())
        );
        // Retorna o tópico só se tiver pelo menos uma pergunta filtrada
        if (filteredQA.length > 0) {
            return { ...topic, qa: filteredQA };
        }
        return null;
    }).filter(topic => topic !== null);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("Configuracoes")}>
                    <Ionicons name="arrow-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Tire suas Dúvidas</Text>
            </View>
            {/* Barra de Pesquisa */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar dúvida..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            </View>
            {/* Tópicos e Perguntas */}
            {filteredTopics.map((topic, tIndex) => (
                <View key={tIndex}>
                    <Text style={styles.topicTitle}>{topic.title}</Text>
                    {topic.qa.map((item, qIndex) => (
                        <View key={qIndex} style={styles.card}>
                            <TouchableOpacity style={styles.questionRow} onPress={() => toggleExpand(`${tIndex}-${qIndex}`)}>
                                <Text style={styles.questionText}>{item.question}</Text>
                                <Ionicons
                                    name={expanded[`${tIndex}-${qIndex}`] ? "chevron-up-outline" : "chevron-down-outline"}
                                    size={24}
                                    color="#000"
                                />
                            </TouchableOpacity>
                            {expanded[`${tIndex}-${qIndex}`] && (
                                <View style={styles.answerContainer}>
                                    <Text style={styles.answerText}>{item.answer}</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        marginBottom: 25,
    },
    title: {
        fontSize: 30,
        fontWeight: "800",
        color: "#000",
        marginLeft: 10,
    },
    topicTitle: {
        fontSize: 26,
        fontWeight: "700",
        color: "#000",
        marginBottom: 10,
        marginTop: 20,
        textAlign: "left",
    },
    card: {
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 8,
        marginBottom: 10,
        overflow: "hidden",
    },
    questionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#F5F5F5",
    },
    questionText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        flex: 1,
        paddingRight: 10,
    },
    answerContainer: {
        padding: 15,
        backgroundColor: "#FFF",
        borderTopWidth: 1,
        borderTopColor: "#EEE",
    },
    answerText: {
        fontSize: 15,
        color: "#555",
        lineHeight: 20,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: "#F5F5F5",
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: "#000",
    },
    searchIcon: {
        marginLeft: 8,
    },

});
