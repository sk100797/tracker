import React, { useContext } from "react";
import { Input, Button } from "react-native-elements";

import Spacer from "./Spacer";

import { Context as LocationContext } from "../context/LocationContext";
import useSaveTrack from "../hooks/useSaveTrack";

const TrackForm = () => {
  const {
    state: { name, recording, locations },
    startRecording,
    stopRecording,
    changeName,
  } = useContext(LocationContext);

  const [saveTrack] = useSaveTrack();

  return (
    <React.Fragment>
      <Spacer>
        <Input
          value={name}
          onChangeText={changeName}
          placeholder="Enter Name"
        />
        <Spacer>
          {recording ? (
            <Button title="Stop" onPress={stopRecording} />
          ) : (
            <Button title="Start Recording" onPress={startRecording} />
          )}
        </Spacer>
        <Spacer>
          {!recording && locations.length ? (
            <Button title="Save Recording" onPress={saveTrack} />
          ) : null}
        </Spacer>
      </Spacer>
    </React.Fragment>
  );
};

export default TrackForm;
