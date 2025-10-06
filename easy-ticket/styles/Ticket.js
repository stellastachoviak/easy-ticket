import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Playfair Display",
  },
  alert: {
    marginTop: 10,
    fontSize: 16,
    color: "red",
    textAlign: "center",
    fontFamily: "Playfair Display",
  },
  sucesso: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    marginTop: 10,
    fontFamily: "Playfair Display",
  },
  primaryButton: {
    backgroundColor: "#614326ff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: 140,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default styles