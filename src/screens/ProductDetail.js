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
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomButton from '../common/CustomButton';
import { useDispatch } from 'react-redux';
import { addItemToWishList } from '../redux/slices/WishlistSlice';
import { addItemToCart } from '../redux/slices/CartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AskForLoginModal from '../common/AskForLoginModal';
import { addRecProducts } from '../redux/slices/RecProductsSlice';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
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
  }, []);

  const getRecProducts = async () => {
    try {
      const res = await axios.get('http://192.168.0.104:5000/?in_img_path=' + route.params.data.filename + '&model_run=no')
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
        <Text style={styles.desc}>{route.params.data.description}</Text>
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
          bg={'#FF9A0C'}
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
              <TouchableOpacity
                activeOpacity={1}
                style={styles.productItem}
                onPress={() => {
                  navigation.navigate('ProductDetail', { data: item });
                }}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View>
                  <Text style={styles.name}>
                    {item.productDisplayName.length > 25
                      ? item.productDisplayName.substring(0, 25) + '...'
                      : item.productDisplayName}
                  </Text>
                  <Text style={styles.desc2}>
                    {item.description.length > 30
                      ? item.description.substring(0, 30) + '...'
                      : item.description}
                  </Text>
                  <Text style={styles.price}>{'₹' + item.price}</Text>
                </View>
              </TouchableOpacity>
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
    backgroundColor: '#fff',
  },
  productItem: {
    width: Dimensions.get('window').width,
    height: 100,
    marginTop: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
  },
  desc2: {
    marginLeft: 20,
  },
  price: {
    color: 'green',
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
    color: '#000',
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
  desc: {
    fontSize: 16,

    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },
  price: {
    color: 'green',
    marginLeft: 20,
    marginTop: 15,
    fontSize: 18,
    fontWeight: '800',
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
