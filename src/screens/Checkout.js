import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../common/Header';
import RazorpayCheckout from 'react-native-razorpay';
import {
  CommonActions,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  addItemToCart,
  emptyCart,
  reduceItemFromCart,
  removeItemFromCart,
} from '../redux/slices/CartSlice';
import CustomButton from '../common/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { orderItem } from '../redux/slices/OrderSlice';
import LinearGradient from 'react-native-linear-gradient';

const Checkout = () => {
  const navigation = useNavigation();
  const items = useSelector(state => state.cart);
  const [cartItems, setCartItems] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(0);
  const isFocused = useIsFocused();
  const [selectedAddress, setSelectedAddress] = useState(
    'Please Select Address',
  );
  const dispatch = useDispatch();
  useEffect(() => {
    setCartItems(items.data);
  }, [items]);

  const getTotal = () => {
    let total = 0;
    cartItems.map(item => {
      total = total + item.qty * item.price;
    });
    return total.toFixed(0);
  };
  useEffect(() => {
    getSelectedAddress();
  }, [isFocused]);
  const getSelectedAddress = async () => {
    setSelectedAddress(await AsyncStorage.getItem('MY_ADDRESS'));
  };

  const orderPlace = (paymentId) => {
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    let ampm = "";
    if (hours > 12) {
      ampm = "pm"
    } else {
      ampm = "am"
    }
    const data = {
      items: cartItems,
      // amount: '₹' + getTotal(),
      amount: getTotal(),
      address: selectedAddress,
      paymentId: paymentId,
      paymentStatus: selectedMethod == 3 ? 'Pending' : 'Success',
      createdAt: day + "/" + month + "/" + year + " " + hours + ":" + minutes + " " + ampm,
    };
    dispatch(orderItem(data));
    dispatch(emptyCart([]));
    navigation.navigate('OrderSuccess', {data: data});
  };
  return (
    <View style={styles.container}>
      <Header
        leftIcon={require('../images/back.png')}
        title={'Checkout'}
        onClickLeftIcon={() => {
          navigation.goBack();
        }}
      />
      <ScrollView>
        <Text style={styles.title}>Added Items</Text>
        <View>
          
          <FlatList
            data={cartItems}
            renderItem={({ item, index }) => {
              return (
                <LinearGradient colors={['#ffffff', '#f0f0f4', '#ffffff']}
              style={styles.linearGradient}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.productItem}
                  onPress={() => {
                    navigation.navigate('ProductDetail', { data: item });
                  }}>
                  <Image source={{ uri: "http://192.168.43.233:5000/img/"+item.filename }} style={styles.itemImage} />
                  <View>
                    <Text style={styles.name}>
                      {item.productDisplayName.length > 25
                        ? item.productDisplayName.substring(0, 25) + '...'
                        : item.productDisplayName}
                    </Text>
                    <Text style={styles.desc}>
                      {item.description.length > 30
                        ? item.description.substring(0, 30) + '...'
                        : item.description}
                    </Text>
                    <View style={styles.qtyview}>
                      <Text style={styles.price}>{'₹' + item.price}</Text>
                      <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                          if (item.qty > 1) {
                            dispatch(reduceItemFromCart(item));
                          } else {
                            dispatch(removeItemFromCart(index));
                          }
                        }}>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qty}>{item.qty}</Text>
                      <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                          dispatch(addItemToCart(item));
                        }}>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
                </LinearGradient>
              );
            }}
          />
        </View>
        <View style={styles.totalView}>
          <Text style={styles.title}>Total</Text>
          <Text style={[styles.title, { marginRight: 20 }]}>
            {'₹' + getTotal()}
          </Text>
        </View>
        <Text style={styles.title}>Select Payment Mode</Text>
        <TouchableOpacity
          style={styles.paymentMethods}
          onPress={() => {
            setSelectedMethod(0);
          }}>
          <Image
            source={
              selectedMethod == 0
                ? require('../images/radio_2.png')
                : require('../images/radio_1.png')
            }
            style={[
              styles.img,
              { tintColor: selectedMethod == 0 ? '#4c3f75' : 'black' },
            ]}
          />
          <Text style={styles.paymentMethdodsTxt}>Credit Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.paymentMethods}
          onPress={() => {
            setSelectedMethod(1);
          }}>
          <Image
            source={
              selectedMethod == 1
                ? require('../images/radio_2.png')
                : require('../images/radio_1.png')
            }
            style={[
              styles.img,
              { tintColor: selectedMethod == 1 ? '#4c3f75' : 'black' },
            ]}
          />
          <Text style={styles.paymentMethdodsTxt}>Debit Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.paymentMethods}
          onPress={() => {
            setSelectedMethod(2);
          }}>
          <Image
            source={
              selectedMethod == 2
                ? require('../images/radio_2.png')
                : require('../images/radio_1.png')
            }
            style={[
              styles.img,
              { tintColor: selectedMethod == 2 ? '#4c3f75' : 'black' },
            ]}
          />
          <Text style={styles.paymentMethdodsTxt}>UPI</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.paymentMethods}
          onPress={() => {
            setSelectedMethod(3);
          }}>
          <Image
            source={
              selectedMethod == 3
                ? require('../images/radio_2.png')
                : require('../images/radio_1.png')
            }
            style={[
              styles.img,
              { tintColor: selectedMethod == 3 ? '#4c3f75' : 'black' },
            ]}
          />
          <Text style={styles.paymentMethdodsTxt}>Cash on Delivery</Text>
        </TouchableOpacity>
        <View style={styles.addressView}>
          <Text style={styles.title}>Address</Text>
          <Text
            style={[
              styles.title,
              { textDecorationLine: 'underline', color: '#0269A0FB' },
            ]}
            onPress={() => {
              navigation.navigate('Addresses');
            }}>
            Edit Address
          </Text>
        </View>
        <Text
          style={[
            styles.title,
            { marginTop: 10, fontSize: 16, color: '#636363' },
          ]}>
          {selectedAddress}
        </Text>
        <CustomButton
          bg={'#9396f5'}
          title={'Pay & Order'}
          color={'#fff'}
          onClick={() => {
            var options = {
              description: 'Credits towards consultation',
              image: 'https://i.imgur.com/3g7nmJC.png',
              currency: 'INR',
              key: 'rzp_test_gzK7OJVS7Ll5nq', // Your api key
              amount: getTotal() * 100,
              name: 'Akash S',
              prefill: {
                email: 'void@razorpay.com',
                contact: '9191919191',
                name: 'Razorpay Software',
              },
              theme: { color: '#3E8BFF' },
            };
            RazorpayCheckout.open(options)
              .then(data => {
                // handle success
                // console.log(`Success: ${data.razorpay_payment_id}`);
                orderPlace(data.razorpay_payment_id)
              })
              .catch(error => {
                // handle failure
                console.log(`Error: ${error.code} | ${error.description}`);
              });
          }}
        />
      </ScrollView>
    </View>
  );
};

export default Checkout;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    marginLeft: 20,
    marginTop: 30,
    color: '#000',
  },
  linearGradient: {
    width: Dimensions.get('window').width - 10,
    height: 94,
    marginTop: 12,
    marginLeft: 5,
    // borderWidth: 1,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    // shadowColor: '#4c3f75',
    // shadowOffset: {
    //   width: 5,
    //   height: 5,
    // },
    // shadowOpacity: 0.6,
    // shadowRadius: 20,
    // elevation: 4,
  },
  productItem: {
    width: Dimensions.get('window').width - 12,
    height: 94,
    backgroundColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 0,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    // borderColor: '#c3c3e6',
  },
  itemImage: {
    marginLeft: 3,
    width: 94,
    height: 94,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
    color: '#045d9c',
  },
  desc: {
    marginLeft: 20,
    color: '#9396f5',
  },
  price: {
    color: '#4c3f75',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
    marginTop: 5,
  },
  qtyview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  btn: {
    padding: 5,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 10,
    marginLeft: 10,
  },
  qty: {
    marginLeft: 10,
    fontSize: 18,
  },
  noItems: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalView: {
    width: '100%',
    justifyContent: 'space-between',

    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#B7B7B7',
  },
  paymentMethods: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 20,
    paddingLeft: 20,
  },
  img: {
    width: 24,
    height: 24,
  },
  paymentMethdodsTxt: {
    marginLeft: 15,
    fontSize: 16,
    color: '#000',
  },
  addressView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: 20,
  },
});
