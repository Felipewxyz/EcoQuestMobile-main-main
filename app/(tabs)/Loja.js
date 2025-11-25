import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Modal, Button } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Loja() {
  const router = useRouter();
  const [open, setOpen] = useState([false, false, false]); // controle de cada card

  // Dados de cada card
  const cards = [
    {
      title: "BRONZE",
      color: "#bf7d4e",
      image: require("../../assets/images/bau1.png"),
      flora: 10,
      banner: { comum: 85, epico: 12, lendario: 3 },
      moldura: { comum: 90, epico: 6, lendario: 4 },
    },
    {
      title: "PRATA",
      color: "#6e696a",
      image: require("../../assets/images/bau2.png"),
      flora: 25,
      banner: { comum: 70, epico: 25, lendario: 5 },
      moldura: { comum: 75, epico: 15, lendario: 10 },
    },
    {
      title: "OURO",
      color: "#d78f07",
      image: require("../../assets/images/bau3.png"),
      flora: 40,
      banner: { comum: 40, epico: 35, lendario: 25 },
      moldura: { comum: 55, epico: 25, lendario: 20 },
    },
  ];

  // Mensagens temporárias para cada card
  const [messages, setMessages] = useState([{ banner: "", moldura: "", flora: "" }, { banner: "", moldura: "", flora: "" }, { banner: "", moldura: "", flora: "" }]);

  const showTempMessage = (cardIndex, type, msg) => {
    const newMessages = [...messages];
    newMessages[cardIndex][type] = msg;
    setMessages(newMessages);
    setTimeout(() => {
      const resetMessages = [...messages];
      resetMessages[cardIndex][type] = "";
      setMessages(resetMessages);
    }, 1500);
  };

  // Dentro do seu componente Loja, adicione os estados:
  const [buyModalVisible, setBuyModalVisible] = useState(false);
  const [selectedBau, setSelectedBau] = useState({ nome: "BRONZE", preco: 5.9 });
  const [selectedQuantity, setSelectedQuantity] = useState("1");
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  // Função chamada ao clicar no botão Comprar de um card
  const openBuyModal = (bauNome, bauPreco) => {
    setSelectedBau({ nome: bauNome, preco: bauPreco });
    setSelectedQuantity("1");
    setBuyModalVisible(true);
  };

  // Função para confirmar compra
  const confirmPurchase = () => {
    setBuyModalVisible(false);
    setConfirmationVisible(true);
  };

  // Função para fechar confirmação
  const closeConfirmation = () => {
    setConfirmationVisible(false);
  };

  const cardPreco = (title) => {
    switch (title) {
      case "BRONZE": return 5.90;
      case "PRATA": return 10.50;
      case "OURO": return 19.80;
      default: return 0;
    }
  };

  const getCardPrice = (title) => {
    switch (title) {
      case "BRONZE":
        return 5.90;
      case "PRATA":
        return 10.50;
      case "OURO":
        return 19.80;
      default:
        return 0;
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require("../../assets/images/sacola.png")} style={styles.iconSacola} />
          <Text style={styles.title}>Loja Baú</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => router.push("/Loja")}>
            <Image source={require("../../assets/images/lojabau.png")} style={[styles.headerIcon, styles.selectedIcon]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/LojaEP")}>
            <Image source={require("../../assets/images/lojaep.png")} style={[styles.headerIcon, styles.unselectedIcon]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/LojaFC")}>
            <Image source={require("../../assets/images/lojafc.png")} style={[styles.headerIcon, styles.unselectedIcon]} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ width: "100%" }} contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {cards.map((card, index) => (
          <View key={index} style={styles.itemContainer}>
            <View style={styles.cardRow}>
              <View style={styles.textGroupAligned}>
                <Text style={[styles.bronzeTitleAligned, { color: card.color }]}>
                  {card.title}
                </Text>
                <View style={[styles.priceBoxAligned, { backgroundColor: card.color }]}>
                  <Text style={styles.priceTextAligned}>
                    R$ {getCardPrice(card.title).toFixed(2).replace('.', ',')}
                  </Text>
                </View>
              </View>
              <Image source={card.image} style={styles.itemImage} />
            </View>

            <TouchableOpacity
              onPress={() => {
                const newOpen = [...open];
                newOpen[index] = !newOpen[index];
                setOpen(newOpen);
              }}
              style={styles.moreButton}
            >
              <Text style={styles.moreButtonText}>{open[index] ? "fechar ▲" : "mais ▼"}</Text>
            </TouchableOpacity>

            {open[index] && (
              <View style={styles.expandArea}>
                {/* Banner */}
                <Text style={styles.sectionTitle}>Banner</Text>
                <View style={styles.progressBar}>
                  <TouchableOpacity style={[styles.progressSegment, { flex: card.banner.comum, backgroundColor: "#bf7d4e" }]} onPress={() => showTempMessage(index, "banner", `Comum ${card.banner.comum}%`)}>
                    <Text style={styles.progressText}>{card.banner.comum}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.progressSegment, { flex: card.banner.epico, backgroundColor: "#6e696a" }]} onPress={() => showTempMessage(index, "banner", `Épico ${card.banner.epico}%`)}>
                    <Text style={styles.progressText}>{card.banner.epico}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.progressSegment, { flex: card.banner.lendario, backgroundColor: "#d78f07" }]} onPress={() => showTempMessage(index, "banner", `Lendário ${card.banner.lendario}%`)}>
                    <Text style={styles.progressText}>{card.banner.lendario}</Text>
                  </TouchableOpacity>
                </View>
                {messages[index].banner !== "" && <Text style={styles.clickMsg}>{messages[index].banner}</Text>}

                {/* Moldura de Perfil */}
                <Text style={styles.sectionTitle}>Moldura de Perfil</Text>
                <View style={styles.progressBar}>
                  <TouchableOpacity style={[styles.progressSegment, { flex: card.moldura.comum, backgroundColor: "#bf7d4e" }]} onPress={() => showTempMessage(index, "moldura", `Comum ${card.moldura.comum}%`)}>
                    <Text style={styles.progressText}>{card.moldura.comum}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.progressSegment, { flex: card.moldura.epico, backgroundColor: "#6e696a" }]} onPress={() => showTempMessage(index, "moldura", `Épico ${card.moldura.epico}%`)}>
                    <Text style={styles.progressText}>{card.moldura.epico}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.progressSegment, { flex: card.moldura.lendario, backgroundColor: "#d78f07" }]} onPress={() => showTempMessage(index, "moldura", `Lendário ${card.moldura.lendario}%`)}>
                    <Text style={styles.progressText}>{card.moldura.lendario}</Text>
                  </TouchableOpacity>
                </View>
                {messages[index].moldura !== "" && <Text style={styles.clickMsg}>{messages[index].moldura}</Text>}

                {/* FloraCoins */}
                <Text style={styles.sectionTitle}>FloraCoins</Text>
                <View style={[styles.progressBar, { marginBottom: 16 }]}>
                  <TouchableOpacity style={[styles.progressSegment, { flex: card.flora, backgroundColor: "#53985b" }]} onPress={() => showTempMessage(index, "flora", `FloraCoins ${card.flora}%`)}>
                    <Text style={styles.progressText}>{card.flora}</Text>
                  </TouchableOpacity>
                  <View style={[styles.progressSegment, { flex: 100 - card.flora, backgroundColor: "#d3d3d3" }]} />
                </View>
                {messages[index].flora !== "" && <Text style={styles.clickMsg}>{messages[index].flora}</Text>}

                <TouchableOpacity
                  style={styles.buyButtonFinal}
                  onPress={() => openBuyModal(card.title, cardPreco(card.title))}
                >
                  <Text style={styles.buyButtonFinalText}>Comprar</Text>
                </TouchableOpacity>

                <Modal transparent visible={buyModalVisible} animationType="fade">
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.modalTitle}>Comprar Baú de {selectedBau.nome}</Text>
                      <Text style={styles.modalText}>
                        Qual a quantidade que deseja comprar?
                      </Text>

                      <View style={styles.quantitySelector}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => setSelectedQuantity((q) => Math.max(1, parseInt(q) - 1))}
                        >
                          <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>

                        <Text style={styles.quantityText}>{selectedQuantity}</Text>

                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => setSelectedQuantity((q) => parseInt(q) + 1)}
                        >
                          <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.modalText}>
                        Você está comprando {selectedQuantity} baú(s) de {selectedBau.nome} por R$ {(selectedBau.preco * selectedQuantity).toFixed(2)}
                      </Text>

                      <View style={styles.modalButtons}>
                        <TouchableOpacity
                          style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                          onPress={() => setBuyModalVisible(false)}
                        >
                          <Text>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.modalButton, { backgroundColor: "#53985b" }]}
                          onPress={() => {
                            // Aqui você processa a compra
                            setBuyModalVisible(false);
                          }}
                        >
                          <Text style={{ color: "#fff" }}>Confirmar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            )}
          </View>
        ))
        }
      </ScrollView >
    </View >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", alignItems: "center" },
  header: { width: "100%", backgroundColor: "#53985b", paddingTop: 40, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  iconSacola: { width: 35, height: 35, marginRight: 6, tintColor: "#FFF" },
  title: { fontSize: 26, fontWeight: "bold", color: "#FFFFFF" },
  headerButtons: { flexDirection: "row", gap: 12 },
  headerIcon: { width: 38, height: 38 },
  selectedIcon: { opacity: 1 },
  unselectedIcon: { opacity: 0.4 },
  itemContainer: { width: "80%", marginTop: 30, backgroundColor: "#f3f3f3", padding: 15, borderRadius: 15, justifyContent: "center", alignItems: "center" },
  cardRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 20 },
  textGroupAligned: { justifyContent: "center", alignItems: "center", height: 80 },
  bronzeTitleAligned: { fontSize: 25, fontWeight: "bold", textAlign: "center" },
  priceBoxAligned: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, marginTop: 4 },
  priceTextAligned: { fontSize: 20, fontWeight: "bold", color: "#FFF", textAlign: "center" },
  centsAligned: { fontSize: 14, fontWeight: "bold", color: "#FFF" },
  itemImage: { width: 80, height: 80, resizeMode: "contain" },
  expandButton: { marginTop: 10 },
  expandButtonText: { fontSize: 16, color: "#53985b", fontWeight: "bold", textTransform: "lowercase" },
  expandArea: { width: "80%", marginTop: 10, backgroundColor: "#f3f3f3", borderRadius: 15, padding: 15 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10, marginBottom: 6, color: "#333" },
  progressBar: { flexDirection: "row", height: 30, width: "100%", borderRadius: 10, overflow: "hidden", marginBottom: 12 },
  progressSegment: { justifyContent: "center", alignItems: "center" },
  progressText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  buyButtonFinal: { marginTop: 20, backgroundColor: "#53985b", paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  buyButtonFinalText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  clickMsg: { fontSize: 16, fontWeight: "bold", color: "#53985b", marginBottom: 10, marginTop: 6, textAlign: "center", backgroundColor: "#e6f2eb", paddingVertical: 4, paddingHorizontal: 12, borderRadius: 8 },
  moreButton: { marginTop: 4, paddingHorizontal: 12 },
  moreButtonText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%', // mais largo que antes, mas não exagerado
    backgroundColor: '#f3f3f3',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center'
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    color: '#333'
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  quantityButton: {
    backgroundColor: '#53985b',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 8
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: 'bold'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#d3d3d3'
  },
  confirmButton: {
    backgroundColor: '#53985b'
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
