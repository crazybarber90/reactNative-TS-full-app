import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Product } from "../../../common/services/products/types";
import { Entypo } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import GoogleMap from "../../components/GoogleMap/GoogleMap";
import LeaveCommentModal from "../../components/LeaveCommentModal/LeaveCommentModal";
import { useGetComments } from "../../../common/services/comments/useGetComments";
import { usePostComment } from "../../../common/services/comments/usePostComments";
import CommentSection from "../../components/LeaveCommentModal/CommentSection";
import Toast from "react-native-toast-message";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import { useNavigation } from "@react-navigation/native";
import { DrawerScreenNavigationProp } from "../../navigator/NavigationTypes";
import AddProductToPlanner from "../../components/AddProducToPlanner/AddProductToPlanner";
import { t } from "i18next";
import { CustomText } from "../../custom";
import { FONT_MAPPER } from "../../custom/enums";
import {
  convertToPercent,
  handleDiscount,
  handlePrice,
} from "../../utils/discountUtils";

export interface CommentDataTypes {
  author_name: string;
  comment_content: string;
  comment_parent_id: number | null;
  singleContentId?: number;
}

const SingleProduct = ({ route }: { route: any }) => {
  const { product }: { product: Product } = route.params;

  const [galleryVisible, setGalleryVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const [commentData, setCommentData] = useState<CommentDataTypes>({
    author_name: "",
    comment_content: "",
    comment_parent_id: null,
  });

  const navigation = useNavigation<DrawerScreenNavigationProp>();
  // GET METHOD FOR GETING ALL COMMENTS BASED ON PRODUCT/BLOG/ARTICNE
  const { data: comments } = useGetComments(product.id);

  // const handleAddProductToPlanner = async (plannerId: number) => {

  //   try {
  //     const data = await linkProductToPlanner({
  //       plannerId: plannerId,
  //       contentId: product.id
  //     })

  //     if (data.status === 200) {
  //       Toast.show({
  //         type: 'success',
  //         text1: 'Proizvod dodat u planer'
  //       })
  //     }
  //   } catch (error) {
  //     Toast.show({
  //       type: 'error',
  //       text1: 'LOSEEEEE',
  //     })
  //     console.error(error.message)
  //   }
  // }

  // POST METHOD SENT{prop} TO LeaveCommentModal for SENDING COMMENT ON MODERATION
  const { mutateAsync: postComment, isSuccess } = usePostComment();

  // FUNCTION SENT TO CommentSection component TO SET PARRENT ID OF COMMENT
  const setCommentParentId = (id: number) => {
    setCommentData({ ...commentData, comment_parent_id: id });
  };

  useEffect(() => {
    if (isSuccess) {
      Toast.show({
        type: "success",
        text1: t("commentSuccessSent"),
        text2: t("commentOnModeration"),
      });
    }
  }, [isSuccess]);

  const closeGallery = () => setGalleryVisible(false);
  const openGallery = () => setGalleryVisible(true);

  const productLocations = () => {
    const data = product.content_locations?.map((contLoc) => {
      return product.author_location?.filter(
        (authLoc) => contLoc.user_location_id === authLoc.id
      );
    });

    return data?.flat();
  };

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <View>
            <CustomText style={styles.prodName}>{product.name}</CustomText>
            <View style={{ position: "relative" }}>
              {product.discount !== 0 && product.discount && (
                // badge for discount if there is any
                <View
                  style={{
                    zIndex: 2,
                    position: "absolute",
                    backgroundColor: "red",
                    padding: 5,
                  }}
                >
                  <CustomText style={{ color: "#fff", fontSize: 18 }}>
                    {convertToPercent(product)}
                  </CustomText>
                </View>
              )}
              <Image
                style={{ zIndex: 1, width: "100%", aspectRatio: "6/4" }}
                source={{ uri: product.image }}
              />
            </View>
          </View>

          <View style={styles.priceCatWrapper}>
            <View>
              <CustomText
                // dashed old price, if there is discount
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
                {t("productPrice")}:{" "}
                {handlePrice(product.price, product.currency)}
              </CustomText>
              {product.price &&
                (product.discount !== null || product.discount !== 0) && (
                  <CustomText style={{ fontSize: 16 }}>
                    {/* new price discounted price */}
                    {handleDiscount(
                      product.price,
                      product.currency,
                      product.discount,
                      product.discount_type
                    )}
                  </CustomText>
                )}
            </View>
            <CustomText style={{ fontFamily: FONT_MAPPER.FontBold }}>
              {product.category_name}
            </CustomText>
          </View>

          {product.image_gallery && (
            <ImageGallery
              closeGallery={closeGallery}
              openGallery={openGallery}
              galleryVisible={galleryVisible}
              imageGallery={product.image_gallery}
            />
          )}
          <View>
            <CustomText style={{ paddingVertical: 15 }}>
              {product.description}
            </CustomText>

            <View style={styles.imageAuthorWrapper}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("AuthorScreen", {
                    username: product.author_username,
                    id: product.author_id,
                  })
                }
                style={{ width: "30%" }}
              >
                <Image
                  style={{ width: "100%", aspectRatio: "6/4" }}
                  source={{ uri: product.author_avatar }}
                />
              </TouchableOpacity>
              <CustomText style={{ fontSize: 16 }}>
                {product.author_name}
              </CustomText>
            </View>
          </View>
          <View>
            <View style={styles.entypo}>
              <Entypo name="phone" size={24} color="black" />
              <CustomText>{product.author_phone}</CustomText>
            </View>
            <View style={styles.entypo}>
              <Entypo name="mail" size={24} color="black" />
              <CustomText>{product.author_email}</CustomText>
            </View>
            <View style={styles.entypo}>
              <Entypo name="location-pin" size={24} color="black" />
              <View>
                {productLocations()?.map((loc, index) => (
                  <CustomText key={index}>
                    {loc.country}-{loc.city}-{loc.address}
                  </CustomText>
                ))}
              </View>
            </View>
          </View>

          {/* GOOGLE MAP FOR SHOWING ALL ENTERED ADDRESSES WITH MARKER ON MAP */}
          {productLocations() && (
            <View
              style={{ flex: 1, width: "100%", height: 400, marginBottom: 40 }}
            >
              <GoogleMap coordinates={productLocations()} />
            </View>
          )}

          {/* BUTTON FOR DISPATCH MODAL FOR COMMENTS */}
          <View style={styles.commentWrapper}>
            <CustomText>{t("comments")}</CustomText>
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <CustomText style={styles.leaveCommentBtn}>
                {t("leaveComment")}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>

        {showModal && (
          <LeaveCommentModal
            setShowModal={setShowModal}
            productId={product.id}
            commentData={commentData}
            setCommentData={setCommentData}
            postComment={postComment}
          />
        )}
        <CommentSection
          comments={comments}
          setShowModal={setShowModal}
          setCommentParentId={setCommentParentId}
        />
      </ScrollView>

      <AddProductToPlanner
        showAddProductModal={showAddProductModal}
        setShowAddProductModal={setShowAddProductModal}
        contentId={product.id}
      />
    </>
  );
};

export default SingleProduct;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    position: "relative",
  },
  prodName: {
    fontSize: 22,
    fontFamily: FONT_MAPPER.FontBold,
    paddingVertical: 10,
  },
  priceCatWrapper: {
    paddingVertical: 5,
    fontSize: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageAuthorWrapper: {
    flexDirection: "row",
    padding: 20,
    justifyContent: "flex-start",
    gap: 60,
  },
  entypo: {
    flexDirection: "row",
    fontSize: "16",
    gap: 10,
    marginVertical: 10,
    paddingBottom: 10,
  },
  commentWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 40,
    marginBottom: 40,
    borderBottomWidth: 1,
    borderColor: "black",
  },
  leaveCommentBtn: {
    backgroundColor: "green",
    color: "white",
    padding: 15,
  },
});
