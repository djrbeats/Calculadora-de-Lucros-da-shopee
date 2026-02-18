import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  StatusBar,
} from "react-native";

export default function App() {
  const [salePrice, setSalePrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [roas, setRoas] = useState("");
  const [freeShipping, setFreeShipping] = useState(false);
  const [result, setResult] = useState(null);

  const FIXED_FEE = 4.0;

  const calculate = () => {
    const sale = parseFloat(salePrice);
    const cost = parseFloat(costPrice);
    const roasValue = parseFloat(roas);

    if (!sale || !cost || !roasValue) return;

    // Define taxa correta
    const percentFee = freeShipping ? 0.20 : 0.16;

    const platformFee = sale * percentFee + FIXED_FEE;

    // Ads (100% da venda veio de anúncio)
    const adsCost = sale / roasValue;

    // Lucro final
    const finalProfit = sale - platformFee - cost - adsCost;

    const margin = (finalProfit / sale) * 100;

    // Lucro antes de ads
    const profitBeforeAds = sale - platformFee - cost;

    const breakEvenRoas =
      profitBeforeAds > 0 ? sale / profitBeforeAds : 0;

    setResult({
      percentFee,
      platformFee,
      adsCost,
      finalProfit,
      margin,
      breakEvenRoas,
    });
  };

  const isProfit = result && result.finalProfit > 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Calculadora Shopee Ads</Text>
        <Text style={styles.subtitle}>
          Modelo: 100% das vendas via anúncio
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Valor de Venda (R$)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={salePrice}
          onChangeText={setSalePrice}
          placeholder="Ex: 100"
        />

        <Text style={styles.label}>Custo do Produto (R$)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={costPrice}
          onChangeText={setCostPrice}
          placeholder="Ex: 35"
        />

        <Text style={styles.label}>ROAS</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={roas}
          onChangeText={setRoas}
          placeholder="Ex: 3"
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>
            Programa Frete Grátis (20%)
          </Text>
          <Switch
            value={freeShipping}
            onValueChange={setFreeShipping}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={calculate}>
          <Text style={styles.buttonText}>Calcular</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View
          style={[
            styles.resultCard,
            isProfit ? styles.greenBorder : styles.redBorder,
          ]}
        >
          <Text style={styles.resultTitle}>Resultado</Text>

          <Text>
            Taxa aplicada: {(result.percentFee * 100).toFixed(0)}% + R$4
          </Text>

          <Text>
            Total taxa Shopee: R$ {result.platformFee.toFixed(2)}
          </Text>

          <Text>
            Gasto com Ads: R$ {result.adsCost.toFixed(2)}
          </Text>

          <Text
            style={[
              styles.profitText,
              isProfit ? styles.greenText : styles.redText,
            ]}
          >
            {isProfit
              ? `Lucro Final: R$ ${result.finalProfit.toFixed(2)}`
              : `Prejuízo: R$ ${result.finalProfit.toFixed(2)}`}
          </Text>

          <Text
            style={[
              styles.marginText,
              isProfit ? styles.greenText : styles.redText,
            ]}
          >
            Margem Final: {result.margin.toFixed(2)}%
          </Text>

          <Text style={styles.breakEven}>
            ROAS mínimo para empatar:{" "}
            {result.breakEvenRoas > 0
              ? result.breakEvenRoas.toFixed(2)
              : "Impossível lucrar"}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const SHOPEE_ORANGE = "#EE4D2D";
const GREEN = "#1EB980";
const RED = "#E53935";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F4F4F4",
    padding: 20,
  },
  header: {
    backgroundColor: SHOPEE_ORANGE,
    padding: 25,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#FFEDE8",
    marginTop: 5,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
  },
  label: {
    marginTop: 10,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  button: {
    backgroundColor: SHOPEE_ORANGE,
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    borderLeftWidth: 6,
  },
  greenBorder: {
    borderLeftColor: GREEN,
  },
  redBorder: {
    borderLeftColor: RED,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  profitText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  marginText: {
    fontWeight: "bold",
    marginTop: 5,
  },
  breakEven: {
    marginTop: 10,
    fontWeight: "bold",
  },
  greenText: {
    color: GREEN,
  },
  redText: {
    color: RED,
  },
});