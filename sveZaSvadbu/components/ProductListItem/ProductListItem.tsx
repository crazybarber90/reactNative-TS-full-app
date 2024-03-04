import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Product } from "../../../common/services/products/types";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { ProductPageScreenNavigationProp } from "../../navigator/NavigationTypes";
import { COLOR_MAPPER } from "../../theme";
import { CustomText } from "../../custom";
import { FONT_MAPPER } from "../../custom/enums";
import {
  convertToPercent,
  handleDiscount,
  handlePrice,
} from "../../utils/discountUtils";

const ProductListItem = ({ product }: { product: Product }) => {
  const navigation = useNavigation<ProductPageScreenNavigationProp>();
  return (
    <View style={styles.container}>
      <CustomText weight={FONT_MAPPER.FontBold} style={styles.productName}>
        {product.name}
      </CustomText>
      <View style={styles.imageAndDescWrapper}>
        <View style={styles.imageWrapper}>
          {product.discount !== 0 && product.discount && (
            // badge for discount on price, if there is any
            <View
              style={{
                zIndex: 2,
                position: "absolute",
                backgroundColor: "red",
                padding: 5,
              }}
            >
              <CustomText style={{ color: "#fff", fontSize: 16 }}>
                {convertToPercent(product)}
              </CustomText>
            </View>
          )}

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SingleProduct", { product: product })
            }
            style={{ zIndex: 1 }}
          >
            <Image
              width={160}
              height={130}
              source={{ uri: product.image }}
              alt={product.name}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.descWrapper}>
          <CustomText style={{ fontSize: 16 }}>
            {product?.description?.slice(0, 80)}
          </CustomText>
          <View>
            <CustomText
              // dashed old price when there is discount on price
              style={[
                { fontSize: 16 },
                product.discount !== 0 &&
                product.discount !== null &&
                product.discount &&
                product.price !== "Na Upit" &&
                product.price
                  ? {
                      textDecorationLine: "line-through",
                      textDecorationStyle: "solid",
                      textDecorationColor: "red",
                      color: "gray",
                    }
                  : null,
              ]}
            >
              {handlePrice(product.price, product.currency)}
            </CustomText>

            {/* new discounted price, handleDiscount -> function that calculate discount */}
            {product.price &&
              (product.discount !== null || product.discount !== 0) && (
                <CustomText style={{ fontSize: 16 }}>
                  {handleDiscount(
                    product.price,
                    product.currency,
                    product.discount,
                    product.discount_type
                  )}
                </CustomText>
              )}
          </View>
        </View>
      </View>
      <View style={styles.authorContainer}>
        <View style={styles.authorImageWrapper}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AuthorScreen", {
                username: product.author_username,
                id: product.author_id,
              })
            }
          >
            <Image
              width={60}
              height={60}
              source={{ uri: product.author_avatar }}
              alt={product.name}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.authorNameWrapper}>
          <CustomText>{product.author_name}</CustomText>
        </View>
      </View>
    </View>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: COLOR_MAPPER.PRIMARY,
    padding: 10,
    marginBottom: 35,
  },
  productName: {
    fontSize: 16,
  },
  imageAndDescWrapper: {
    flexDirection: "row",
    paddingVertical: 20,
    // backgroundColor: "red",
  },
  imageWrapper: {
    marginHorizontal: 5,
    position: "relative",
  },
  descWrapper: {
    width: "45%",
    justifyContent: "space-between",
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
