import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

function SequenciaInsignias({ dias, imagens, corFundo, onSelect, selected, bloqueado }) {
  return (
    <View style={styles.sectionContainer}>
      <View style={[styles.titleBox, { backgroundColor: corFundo }]}>
        <Text style={styles.titleText}>Sequência de {dias} dias</Text>
      </View>

      <View style={styles.blockContainer}>
        {imagens.map((imagem, index) => {
          const isSelected = selected === index;
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={bloqueado ? 1 : 0.7} // não clicável se bloqueado
              onPress={() => !bloqueado && onSelect(index)}
              style={{ marginTop: isSelected ? -10 : 0 }} // sobe menos (-10)
            >
              <Image
                source={imagem}
                style={[
                  styles.insigniaImage,
                  bloqueado && { opacity: 0.5 } // visual de bloqueado
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function Insignias() {
  const [selectedIndex, setSelectedIndex] = useState(null); // apenas 1 imagem selecionada
  const navigation = useNavigation();

  // Função para enviar imagem selecionada para a página de perfil
  const enviarParaPerfil = () => {
    if (selectedIndex) {
      const [categoria, idx] = selectedIndex.split("-");
      let selectedImage;

      if (categoria === "100") {
        const imagens = [
          require("../../assets/images/insignia1.png"),
          require("../../assets/images/insignia2.png"),
          require("../../assets/images/insignia3.png"),
        ];
        selectedImage = imagens[idx];
      } else if (categoria === "200") {
        const imagens = [
          require("../../assets/images/insignia4.png"),
          require("../../assets/images/insignia5.png"),
          require("../../assets/images/insignia6.png"),
        ];
        selectedImage = imagens[idx];
      }

      // Navega para a página de perfil passando a imagem selecionada
      navigation.navigate("Perfil", { shieldImage: selectedImage });
    } else {
      alert("Selecione uma insígnia primeiro!");
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: 120 }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Insígnias</Text>
      </View>

      {/* 100 dias */}
      <SequenciaInsignias
        dias={100}
        imagens={[
          require("../../assets/images/insignia1.png"),
          require("../../assets/images/insignia2.png"),
          require("../../assets/images/insignia3.png"),
        ]}
        corFundo="#c49473"
        onSelect={(index) => setSelectedIndex(`100-${index}`)}
        selected={selectedIndex === '100-0' ? 0 : selectedIndex === '100-1' ? 1 : selectedIndex === '100-2' ? 2 : null}
        bloqueado={false}
      />

      {/* 200 dias */}
      <SequenciaInsignias
        dias={200}
        imagens={[
          require("../../assets/images/insignia4.png"),
          require("../../assets/images/insignia5.png"),
          require("../../assets/images/insignia6.png"),
        ]}
        corFundo="#83a648"
        onSelect={(index) => setSelectedIndex(`200-${index}`)}
        selected={selectedIndex === '200-0' ? 0 : selectedIndex === '200-1' ? 1 : selectedIndex === '200-2' ? 2 : null}
        bloqueado={false}
      />

      {/* 300 dias */}
      <SequenciaInsignias
        dias={300}
        imagens={[
          require("../../assets/images/insignia7.png"),
          require("../../assets/images/insignia8.png"),
          require("../../assets/images/insignia9.png"),
        ]}
        corFundo="#156499"
        onSelect={(index) => setSelectedIndex(`300-${index}`)}
        selected={null}  // nenhuma selecionável
        bloqueado={true} // bloqueadas
      />

      <TouchableOpacity style={styles.button} onPress={enviarParaPerfil}>
        <Text style={styles.buttonText}>Selecionar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },

  /* TOPO */
  header: {
    position: "absolute",
    top: -60,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: "#0E4668",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 20,
    zIndex: 10,
  },

  headerText: {
    fontSize: 34,
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  /* Seções */
  sectionContainer: {
    width: "100%",
    marginBottom: 35,
    alignItems: "center",
  },
  titleBox: {
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 15,
  },
  titleText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  blockContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  insigniaImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginHorizontal: 10,
  },

  /* Botão */
  button: {
    backgroundColor: "#0E4668",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 40,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
