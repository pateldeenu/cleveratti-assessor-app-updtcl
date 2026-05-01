import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {
  UIManager,
  findNodeHandle,
  requireNativeComponent,
} from 'react-native';

const NativeDualCameraView = requireNativeComponent('DualCameraView');

const DualCameraView = forwardRef((props, ref) => {
  const nativeRef = useRef(null);

  const dispatchCommand = (commandName, args = []) => {
    const node = findNodeHandle(nativeRef.current);
    if (!node) {
      return;
    }

    const config = UIManager.getViewManagerConfig('DualCameraView');
    UIManager.dispatchViewManagerCommand(
      node,
      config.Commands[commandName],
      args,
    );
  };

  useImperativeHandle(ref, () => ({
    startRecording: path => {
      dispatchCommand('startRecording', [path]);
    },
    stopRecording: () => {
      dispatchCommand('stopRecording', []);
    },
  }));

  return <NativeDualCameraView ref={nativeRef} {...props} />;
});

export default DualCameraView;
