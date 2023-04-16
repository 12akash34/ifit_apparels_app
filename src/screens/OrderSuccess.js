import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';


const OrderSuccess = () => {
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <View style={StyleSheet.container}>
        <Image source={require('../images/checked.png')} style={styles.icon} />
      <Text style={styles.msg}>Order Placed Successfully...</Text>
      <Text style={styles.msg}>Id : {route.params.data.paymentId}</Text>
      <View style={styles.cen_box}>
        <Text
          style={styles.btn}
          onPress={() => {
            navigation.navigate('Main');
          }}>
          Go To Home
        </Text>
      </View>
    </View>
  );
};

export default OrderSuccess;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '100%',
    marginTop: 100,
    height: 120,
    resizeMode: 'center',
  },
  msg: {
    marginTop: 20,
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
  cen_box: {
    alignItems: 'center',
  },
  btn: {
    padding: 10,
    fontSize: 18,
    borderWidth: 1,
    color: '#000',
    width: 200,
    marginTop: 20,
    textAlign: 'center',
  },
})