import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Planner } from "../../../common/services/models";
import { useNavigation } from "@react-navigation/native";
import { DrawerScreenNavigationProp } from "../../navigator/NavigationTypes";
import { Entypo } from "@expo/vector-icons";
import PlannerItemOptions from "./PlannerItemOptions";
import EditPlannerModal from "../Modals/EditPlannerModal";
import { t } from "i18next";
import { COLOR_MAPPER } from "../../theme";
import Popover from "react-native-popover-view/dist/Popover";
import Loader from "../Loader";
import { CustomText } from "../../custom";
import { FONT_MAPPER } from "../../custom/enums";

const PlannerItem = ({
  planner,
  index,
}: {
  planner: Planner;
  index: number;
}) => {
  const navigation = useNavigation<DrawerScreenNavigationProp>();
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [editPlanner, setEditPlanner] = useState<boolean>(false);
  const touchable = useRef(null);

  return (
    <View style={{ zIndex: 1 }}>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor:
              index % 2 === 0 ? COLOR_MAPPER.PRIMARY : COLOR_MAPPER.SECONDARY,
          },
        ]}
        onPress={() => {
          // console.log("KLIKNUTO")
          navigation.navigate("SinglePlanner", { id: planner.id });
        }}
      >
        <View style={{ gap: 10 }}>
          <CustomText
            weight={FONT_MAPPER.FontBold}
            style={{ fontSize: 17, color: "white" }}
          >
            {t("planner")}: {planner.title}
          </CustomText>
          <CustomText
            style={{ paddingLeft: 15, width: "100%", color: "white" }}
          >
            {planner?.description?.slice(0, 30)}
          </CustomText>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => setShowOptions(true)}
            style={{
              width: 40,
              alignItems: "flex-end",
            }}
          >
            <Entypo
              ref={touchable}
              name="dots-three-vertical"
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <Popover
            from={touchable}
            isVisible={showOptions}
            onRequestClose={() => setShowOptions(false)}
          >
            <PlannerItemOptions
              planner={planner}
              openEditPlanner={setEditPlanner}
              setShowOptions={setShowOptions}
            />
          </Popover>
        </View>
      </TouchableOpacity>

      {/* {showOptions && (
        <PlannerItemOptions
          planner={planner}
          openEditPlanner={setEditPlanner}
          closeOptions={setShowOptions}
          index={index}
          scrollY={scrollY}
        />
      )} */}
      {editPlanner && (
        <EditPlannerModal
          planner={planner}
          closeEditPlanner={setEditPlanner}
          editPlannerState={editPlanner}
        />
      )}
    </View>
  );
};

export default PlannerItem;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 2,
    paddingVertical: 5,
    paddingHorizontal: 10,
    position: "relative",
  },
});
