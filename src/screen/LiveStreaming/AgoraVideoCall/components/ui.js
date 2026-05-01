import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Divider,
  Input,
  Switch,
  Text,
  Image,
  lightColors,
} from "@rneui/base";
import { COLORS } from "../../../../constants/Theme";
import { CustomeButton } from "../../../../components";
import { ConfigColor } from "../../../AssessmentDetails/Utils";
import normalize from "react-native-normalize";

export const AgoraView = (props) => {
  return (
    <>
      <View {...props} />
    </>
  );
};

export const AgoraText = (props) => {
  return (
    <>
      <Text {...props} />
    </>
  );
};

export const AgoraButton = (props) => {
  return (
    <>
      <Button style={{ width: "60%" }} {...props} />
    </>
  );
};

export const AgoraDivider = (props) => {
  return (
    <>
      <Divider width={1} color={"grey"} {...props} />
    </>
  );
};

export const AgoraTextInput = (props) => {
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const { style, ref, ...others } = props;
  return (
    <>
      <Input
        containerStyle={[AgoraStyle.input, style]}
        placeholderTextColor={"gray"}
        {...others}
        onChangeText={(text) => {
          setValue(text);
          props.onChangeText?.call(this, text);
        }}
        value={value}
      />
    </>
  );
};

export const AgoraSwitch = (props) => {
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const { title, ...others } = props;
  return (
    <>
      <AgoraText children={title} />
      <Switch
        {...others}
        value={value}
        onValueChange={(v) => {
          setValue(v);
          props.onValueChange?.call(this, v);
        }}
      />
    </>
  );
};

export const AgoraImage = (props) => {
  return (
    <>
      <Image {...props} />
    </>
  );
};

export const AgoraDropdown = (props) => {
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <AgoraView style={AgoraStyle.fullWidth}>
      <AgoraText children={props.title} />
      {/* <PickerSelect
        {...props}
        pickerProps={{
          style: AgoraStyle.fullWidth,
          enabled: props.enabled,
          dropdownIconColor: 'gray',
        }}
        value={value}
        // @ts-ignore
        textInputProps={{ style: AgoraStyle.input, chevronUp: true }}
        onValueChange={(v, index) => {
          if (v === null || v === undefined) return;
          setValue(v);
          props.onValueChange?.call(this, v, index);
        }}
      /> */}
    </AgoraView>
  );
};

export const AgoraStyle = StyleSheet.create({
  fullWidth: {
    width: "100%",
  },
  fullSize: {
    flex: 1,
  },

  imageH: {
    width: 50,
    height: 50,
    alignSelf: "center",
  },
  input: {
    height: 50,
    color: "black",
  },
  videoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  videoLarge: {
    flex: 1,
    height: "80%",
  },
  ques: {
    fontWeight: "500",
    fontSize: 15,
    color: COLORS.white,
    textAlign: "center",
    alignItems: "center",
    marginLeft:10
  },
  videoSmall: {
    width: 140,
    height: 160,
  },
  viewMargin: {
    flexDirection:'row',
    backgroundColor: COLORS.blue,
    height: 60,
    alignItems: "center",
    alignItems: "center",
  },
  container: {
    borderRadius: 10,
    height: normalize(45),
    backgroundColor: COLORS.blue,
    justifyContent: "center",
    marginVertical: normalize(10),
    alignItems: "center",
    width: "60%",
    backgroundColor: COLORS.blue,
    alignSelf: "center",
    marginTop: 30,
  },

  float: {
    marginTop: 20,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: lightColors.primary,
  },
});
