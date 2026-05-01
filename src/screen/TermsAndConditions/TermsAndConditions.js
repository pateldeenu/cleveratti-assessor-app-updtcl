import React, { useEffect, useState } from "react";
import appText from "../../utils/Localization/localization";
import MessageComponet from "../../components/MessageComponet";
import { useDispatch, useSelector } from "react-redux";
import { getContentAPI } from "../../redux/Actions/AllContentAction";
import { useFocusEffect } from "@react-navigation/native";

const TermsAndConditions = ({ navigation }) => {
  const dispatch = useDispatch();
  const [policyText, setPolicyText] = useState("");
  const getPrivacyPolicy = async () => {
    try {
      let policy = await dispatch(getContentAPI());
      setPolicyText(policy.data.Items[0].termsCondition);
    } catch (error) {}
  };

  useFocusEffect(
    React.useCallback(() => {
      getPrivacyPolicy();
    }, [])
  );
  return (
    <MessageComponet
      title={appText.terms_condidtion}
      onPress={() => {
        navigation.goBack();
      }}
      descreption={policyText}
    />
  );
};

export default TermsAndConditions;
