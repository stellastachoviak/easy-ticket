import { StyleSheet } from "react-native";

const COLORS = {
  background: "#D7C2A5",
  card: "#FFFFFF",
  text: "#333333",
  textSecondary: "#7A8C8C",
  border: "#8d6138ff",
  used: "#4CAF50",
  received: "#4A90E2",
  none: "#B0B0B0",
  none: "#B0B0B0",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 20,
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  empty: {
    textAlign: "center",
    color: COLORS.textSecondary,
    marginTop: 40,
    fontSize: 16,
  },
});

export default styles;
