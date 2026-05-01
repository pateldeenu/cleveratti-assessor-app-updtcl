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
import { COLORS } from "../../../constants/Theme";
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
    bottom:10
  },

  imageH: {
    width: 30,
    height: 30,
    marginRight:40,
    alignSelf: 'flex-end',
    alignSelf:'flex-end'
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
    // flex: 1,
    height: 2,   
    width:2,
    justifyContent:'flex-end',
    alignSelf:'flex-end',
    marginRight:10,
    borderRadius:8,
    marginTop:34,
  },
  
  videoSmall: {
    height: 2,   
     width:2,
     position:'absolute',
     left:-120,
    borderRadius:8,
    marginTop:0,
 
  },

  ques: {
    fontWeight: "500",
    fontSize: 18,
    color: COLORS.white,
    textAlign: "center",
    alignItems: "center",
  },
  viewMargin: {
    backgroundColor: COLORS.blue,
    height: 50,
    alignItems: "center",
    alignItems: "center",
  },
  container: {
    borderRadius: 10,
    height: normalize(30),
    backgroundColor: COLORS.blue,
    justifyContent: "center",
    marginVertical: normalize(10),
    alignItems: "center",
    width: "20%",
    backgroundColor: COLORS.blue,
    alignSelf:'flex-end',
    marginRight:15,
    top: 10,
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
