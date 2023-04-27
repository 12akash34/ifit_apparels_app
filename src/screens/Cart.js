import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../common/Header';
import {useNavigation} from '@react-navigation/native';
import {
  addItemToCart,
  reduceItemFromCart,
  removeItemFromCart,
} from '../redux/slices/CartSlice';
import CheckoutLayout from '../common/CheckoutLayout';
import LinearGradient from 'react-native-linear-gradient';

const Cart = () => {
  const items = useSelector(state => state.cart);
  const [cartItems, setCartItems] = useState([]);

  const navigation = useNavigation();
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
  return (
    <View style={styles.container}>
      <Header
        title={'Cart Items'}
        leftIcon={require('../images/back.png')}
        onClickLeftIcon={() => {
          navigation.goBack();
        }}
      />
      <FlatList
        data={cartItems}
        renderItem={({item, index}) => {
          return (
            <LinearGradient colors={['#ffffff', '#f0f0f4', '#ffffff']}
                style={styles.linearGradient}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.productItem}
              onPress={() => {
                navigation.navigate('ProductDetail', {data: item});
              }}>
              <Image source={{uri: item.image}} style={styles.itemImage} />
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
                    <Text style={{fontSize: 18, fontWeight: '600'}}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qty}>{item.qty}</Text>
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={() => {
                      dispatch(addItemToCart(item));
                    }}>
                    <Text style={{fontSize: 18, fontWeight: '600'}}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
            </LinearGradient>
          );
        }}
      />
      {cartItems.length < 1 && (
        <View style={styles.noItems}>
          <Text>No Items in Cart</Text>
        </View>
      )}
      {cartItems.length > 0 && (
        <CheckoutLayout items={cartItems.length} total={getTotal()} />
      )}
    </View>
  );
};

export default Cart;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});
