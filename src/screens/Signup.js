import {View, Text, StyleSheet, TextInput} from 'react-native';
import React, {useState} from 'react';
import CustomButton from '../common/CustomButton';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const Signup = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const addUser = () => {
    firestore()
      .collection('Users')
      .add({
        name: name,
        email: email,
        mobile: mobile,
        password: pass,
      })
      .then(() => {
        console.log('User added!');
        navigation.navigate('Login');
      });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{'Sign up'}</Text>
      <TextInput
        placeholder="Enter Name"
        style={styles.input}
        value={name}
        onChangeText={txt => setName(txt)}
      />
      <TextInput
        placeholder="Enter Email"
        style={styles.input}
        value={email}
        onChangeText={txt => setEmail(txt)}
      />
      <TextInput
        placeholder="Enter Mobile"
        style={styles.input}
        value={mobile}
        onChangeText={txt => setMobile(txt)}
      />
      <TextInput
        placeholder="Enter password"
        style={styles.input}
        value={pass}
        onChangeText={txt => setPass(txt)}
      />
      <TextInput
        placeholder="Enter Confirm Password"
        style={styles.input}
        value={confirmPass}
        onChangeText={txt => setConfirmPass(txt)}
      />
      <CustomButton
        bg={'#E27800'}
        title={'Sign up'}
        color={'#fff'}
        onClick={() => {
          addUser();
        }}
      />
      <Text
        style={styles.loginText}
        onPress={() => {
          navigation.navigate('Login');
        }}>
        {'Login'}
      </Text>
    </View>
  );
};

export default Signup;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    color: '#000',
    fontSize: 40,
    marginLeft: 20,
    marginTop: 50,
    marginBottom: 50,
  },
  input: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    paddingLeft: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
  loginText: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 18,
    textDecorationLine: 'underline',
  },
});

// 30823.jpg|34912.jpg|30893.jpg|47067.jpg|59672.jpg|34953.jpg|31886.jpg|12345.jpg|10046.jpg|10048.jpg|10026.jpg|10023.jpg|10016.jpg|10015.jpg|10008.jpg|10006.jpg|10001.jpg|10000.jpg|2306.jpg|2112.jpg|10815.jpg|10812.jpg|10805.jpg|10801.jpg|10796.jpg|10793.jpg|10777.jpg|10720.jpg|10682.jpg|10678.jpg|10675.jpg|10670.jpg|10665.jpg|10576.jpg|10566.jpg|10564.jpg|10410.jpg|10413.jpg|10415.jpg|10421.jpg|10425.jpg|10429.jpg|10437.jpg|10445.jpg|10454.jpg|10451.jpg|10190.jpg|10185.jpg|10255.jpg|10259.jpg|10493.jpg|10473.jpg|10458.jpg|10453.jpg|10449.jpg|10446.jpg|10354.jpg|10363.jpg|10064.jpg|10058.jpg|10029.jpg|10025.jpg|10011.jpg|10357.jpg|10360.jpg|10365.jpg|10464.jpg|10514.jpg|10433.jpg|10435.jpg|10027.jpg|10017.jpg|10003.jpg|10005.jpg|10007.jpg|31161.jpg|31742.jpg