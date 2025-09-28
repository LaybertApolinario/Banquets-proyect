import { StyleSheet, View, Pressable, Text, ColorValue } from "react-native";
import { Href} from "expo-router";
import { useRouter } from 'expo-router';

type Props = {
  label: string;
  variant: ColorValue;
  toGo: Href;
};

export default function Button({ label, variant, toGo }: Props) {
    const router = useRouter();
  return (
    <View style={styles.buttoncontainer}>
      {/* <Link href={toGo} asChild> */}
        <Pressable style={[styles.button, { backgroundColor: variant }]}
            onPress={()=> router.navigate(toGo)}
        >
          <Text style={styles.buttonLabel}>{label}</Text>
        </Pressable>
      {/* </Link> */}
    </View>
  );
}

const styles = StyleSheet.create({
  buttoncontainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    marginBottom: 24,
  },
  button: {
    borderRadius: 12,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 16,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600", // ✅ corregido
  },
});