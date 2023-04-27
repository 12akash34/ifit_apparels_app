import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import { useNavigation, useRoute, useScrollToTop } from '@react-navigation/native';
import CustomButton from '../common/CustomButton';
import { useDispatch } from 'react-redux';
import { addItemToWishList } from '../redux/slices/WishlistSlice';
import { addItemToCart } from '../redux/slices/CartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AskForLoginModal from '../common/AskForLoginModal';
import { addRecProducts } from '../redux/slices/RecProductsSlice';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
const ProductDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const [recproducts, setRecProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const checkUserStatus = async () => {
    let isUserLoggedIn = false;
    const status = await AsyncStorage.getItem('IS_USER_LOGGED_IN');
    console.log(status);
    if (status == null) {
      isUserLoggedIn = false;
    } else {
      isUserLoggedIn = true;
    }
    console.log(isUserLoggedIn);
    return isUserLoggedIn;
  };

  useEffect(() => {
    getRecProducts();
    // addRec();
  }, [route]);

  const getRecProducts = async () => {
    try {
      const res = await axios.get('http://192.168.43.233:5000/?in_img_path=' + route.params.data.filename + '&model_run=no')
      // const res = await axios.get('http://192.168.43.233:5000/?in_img_path=' + route.params.data.filename + '&model_run=no')
      // console.log(res.data);
      var arr = [];
      res.data.forEach(element => {
        // console.log(element.img_path);
        arr.push(element.img_path);
      });
      var arr2 = [];
      firestore()
        .collection('Products')
        // Filter results
        .where('filename', 'in', arr)
        .get()
        .then(querySnapshot => {
          console.log('total : ', querySnapshot.size);
          querySnapshot.forEach(documentSnapshot => {
            arr2.push(documentSnapshot.data());
          });
          setRecProducts(arr2);
          dispatch(addRecProducts(arr2));
        });
    } catch (error) {
      console.log(error.message);
    }
  }

  const addRec = () => {
    firestore()
      .collection('Products')
      .add({
        srid: route.params.data.srid,
        id: route.params.data.id,
        gender: route.params.data.gender,
        masterCategory: route.params.data.masterCategory,
        subCategory: route.params.data.subCategory,
        articleType: route.params.data.articleType,
        baseColour: route.params.data.baseColour,
        season: route.params.data.season,
        year: route.params.data.year,
        usage: route.params.data.usage,
        productDisplayName: route.params.data.productDisplayName,
        filename: route.params.data.filename,
        price: route.params.data.price,
        description: route.params.data.description,
        rating: {
          rate: route.params.data.rating.rate,
          count: route.params.data.rating.count
        },
        image: route.params.data.image,
      })
      .then(() => {
        console.log('RecProd added!');
      });
  };

  return (
    <View style={styles.container}>
      <Header
        leftIcon={require('../images/back.png')}
        rightIcon={require('../images/cart.png')}
        title={'Product Detail'}
        onClickLeftIcon={() => {
          navigation.goBack();
        }}
        isCart={true}
      />
      <ScrollView>
        <Image source={{ uri: route.params.data.image }} style={styles.banner} />
        <Text style={styles.title}>{route.params.data.productDisplayName}</Text>
        <Text style={styles.desc2}>{route.params.data.description}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.price, { color: '#000' }]}>{'Price:'}</Text>
          <Text style={styles.price}>{' ₹' + route.params.data.price}</Text>
          <View style={styles.qtyView}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                if (qty > 1) {
                  setQty(qty - 1);
                }
              }}>
              <Text style={{ fontSize: 18, fontWeight: '600' }}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{qty}</Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                setQty(qty + 1);
              }}>
              <Text style={{ fontSize: 18, fontWeight: '600' }}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={() => {
            if (checkUserStatus()) {
              dispatch(addItemToWishList(route.params.data));
            } else {
              setModalVisible(true);
            }
          }}>
          <Image
            source={require('../images/wishlist.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        <CustomButton
          bg={'#9396f5'}
          title={'Add To Cart'}
          color={'#fff'}
          onClick={() => {
            if (checkUserStatus()) {
              dispatch(
                addItemToCart({
                  category: route.params.data.gender + "'s " + route.params.data.subCategory,
                  description: route.params.data.description,
                  id: route.params.data.id,
                  image: route.params.data.image,
                  filename: route.params.data.filename,
                  price: route.params.data.price,
                  qty: qty,
                  rating: route.params.data.rating,
                  productDisplayName: route.params.data.productDisplayName,
                }),
              );
            } else {
              setModalVisible(true);
            }
          }}
        />
        <Text style={styles.other_title}>You may also Like this !</Text>
        <FlatList
          data={recproducts}
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
                    <Text style={styles.price}>{'₹' + item.price}</Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            );
          }}
        />
      </ScrollView>
      <AskForLoginModal
        modalVisible={modalVisible}
        onClickLogin={() => {
          setModalVisible(false);
          navigation.navigate('Login');
        }}
        onClose={() => {
          setModalVisible(false);
        }}
        onClickSignup={() => {
          setModalVisible(false);
          navigation.navigate('Signup');
        }}
      />
    </View>
  );
};

export default ProductDetail;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
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
  banner: {
    width: '100%',
    height: 260,
    resizeMode: 'center',
  },
  title: {
    fontSize: 20,
    color: '#045d9c',
    fontWeight: '600',
    marginLeft: 20,
    marginTop: 15,
  },
  other_title: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginLeft: 20,
    marginTop: 15,
  },
  desc2: {
    fontSize: 16,
    color: '#9396f5',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },
  wishlistBtn: {
    position: 'absolute',
    right: 20,
    top: 100,
    backgroundColor: '#E2DFDF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  icon: {
    width: 24,
    height: 24,
  },
  qtyView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 20,
  },
  btn: {
    padding: 4,
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
});
