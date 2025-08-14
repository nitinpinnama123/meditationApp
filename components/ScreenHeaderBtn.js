import React from "react";
import { Image, TouchableOpacity, StyleSheet, View } from "react-native"; // ✅ Use from react-native (not react-native-web)
import { COLORS, SIZES } from "../constants/theme";
import icons from "../constants/icons";
import { useRouter } from "expo-router";

const ScreenHeaderBtn = ({ detailPage, handleShare }) => {
  console.log(detailPage);
  const router = useRouter();

  return (
    <View style={styles.btn}>
      {/* Home/Menu Button */}
      <TouchableOpacity
        style={styles.btnContainer}
        onPress={() => router.push("/home")}
      >
        <Image source={icons.menu} style={styles.image} />
      </TouchableOpacity>

      {/* Conditional Buttons */}
      {detailPage ? (
        <>
          {/* Share Button if on detail page */}
          <TouchableOpacity style={styles.btnContainer} onPress={handleShare}>
            <Image source={icons.share} style={styles.image} />
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Settings Button if not on detail page */}
          <TouchableOpacity
            style={styles.btnContainer}
            onPress={() => router.push("/settings")}
          >
            <Image source={icons.settings} style={styles.image} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ScreenHeaderBtn;

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    width: "100%", // ✅ Use '100%' instead of '100vw' in React Native
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  btnContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small / 1.25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
});
