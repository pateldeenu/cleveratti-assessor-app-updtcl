import React, { useEffect, useState } from "react";
import MessageComponet from "../../components/MessageComponet";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

const PrivacyPolicy = ({ navigation }) => {
  const dispatch = useDispatch();
  const [policyText, setPolicyText] = useState("");
  const getPrivacyPolicy = async () => {
    setPolicyText(`Before the examination starts
  Arrive at the examination venue at least 15 minutes before the start of the examination / 35 minutes before a digital examination.
 Law: The examination starts at the moment the book control begins, and you must therefore be present by 8.20 a.m. for regular written examinations and 8.10 a.m. at digital examinations.
 When using a laptop at digital examinations, the laptop has to be set up as soon as possible. If you are taking a law exam, the laptop must be set up before the book control.
 Coats, backpacks, bags, etc. must be placed as directed. Mobile phones, mp3 players, smartwatches and other electronic devices must be turned off and put away, and cannot be stored in coats or pockets.
 If support material, other than that which is specifically permitted, is found at or by the desk, it may be treated as an attempt to cheat and relevant procedures for cheating will be followed. 
 The head invigilator will provide information about examination support materials that you are permitted to use during the examination. All dictionaries must be approved by the faculty before the exam and will be handed out in the exam venue by the invigilators.`);
    // try {
    //   let policy = await dispatch(getContentAPI());
    //   consoleLog('policy', policy.data.Items[0]);
    //   setPolicyText(policy.data.Items[0].privacyPolicy)
    // } catch (error) {
    //   consoleLog('policy err', error)
    // }
  };

  useFocusEffect(
    React.useCallback(() => {
      getPrivacyPolicy();
    }, [])
  );
  return (
    <MessageComponet
      title={"Instructions"}
      onPress={() => {
        navigation.goBack();
      }}
      descreption={policyText}
    />
  );
};

export default PrivacyPolicy;
