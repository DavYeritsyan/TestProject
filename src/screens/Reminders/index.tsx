import React from 'react';
import {
  View,
  Text,
  StyleSheet,

} from 'react-native';

const RemindersScreen = () => {


  return (
    <View style={styles.container}>
      <Text>Reminders</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  }
});

export default RemindersScreen;
