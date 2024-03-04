import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Catalog } from "../../../common/services/products/types";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { DrawerScreenNavigationProp } from "../../navigator/NavigationTypes";
import { t } from "i18next";
import { COLOR_MAPPER } from "../../theme";
import { CustomText } from "../../custom";
import { FONT_MAPPER } from "../../custom/enums";

const CatalogListItem = ({ catalog }: { catalog: Catalog }) => {
  const navigation = useNavigation<DrawerScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <CustomText weight={FONT_MAPPER.FontBold} style={styles.catalogName}>
        {t("catalog")}: {catalog.name}
      </CustomText>
      <View style={styles.imageAndDescWrapper}>
        <View style={styles.imageWrapper}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SingleCatalog", { catalog: catalog })
            }
          >
            <Image
              width={150}
              height={100}
              source={{ uri: catalog.image }}
              alt={catalog.name}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.descWrapper}>
          <CustomText>{catalog.description}</CustomText>
        </View>
      </View>
      <View style={styles.authorContainer}>
        <View style={styles.authorImageWrapper}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AuthorScreen", {
                username: catalog.author_username,
                id: catalog.author_id,
              })
            }
          >
            <Image
              width={60}
              height={60}
              source={{ uri: catalog.author_avatar }}
              alt={catalog.name}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.authorNameWrapper}>
          <CustomText>{catalog.author_name}</CustomText>
        </View>
      </View>
    </View>
  );
};

export default CatalogListItem;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderColor: COLOR_MAPPER.PRIMARY,
    padding: 10,
    borderBottomWidth: 1,
  },
  catalogName: {
    fontSize: 16,
  },
  imageAndDescWrapper: {
    flexDirection: "row",
    paddingVertical: 20,
  },
  imageWrapper: {
    marginHorizontal: 15,
  },
  descWrapper: {
    width: "45%",
  },
  authorContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
  },
  authorImageWrapper: {
    borderRadius: 100,
    overflow: "hidden",
  },
  authorNameWrapper: {
    marginLeft: 10,
  },
});
