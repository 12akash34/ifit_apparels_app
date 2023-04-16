import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../common/Header';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {useDispatch} from 'react-redux';
import {addProducts} from '../../redux/slices/ProductsSlice';

const Home = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    getProducts();
  }, []);
  const getProducts = () => {
    var arr = [];
    // fetch('https://fakestoreapi.com/products')
    // fetch('http://192.168.0.104:3000/Products')
    //   .then(res => res.json())
    //   .then(json => {
    //     setProducts(json);
    //     // console.log(json);
    //     json.map(item => {
    //       item.qty = 1;
    //     });
    //     dispatch(addProducts(json));
    //   });

    firestore()
    .collection('Products')
    .get()
    .then(querySnapshot => {
      console.log('total : ', querySnapshot.size);
      querySnapshot.forEach(documentSnapshot => {
        arr.push(documentSnapshot.data());
      });
      // console.log("array = ", arr);
      setProducts(arr);
      arr.map(arr => {
        arr.qty = 1;
      });
      dispatch(addProducts(arr));
    });
  };
  return (
    <View style={styles.container}>
      <Header
        leftIcon={require('../../images/menu.png')}
        rightIcon={require('../../images/cart.png')}
        title={'Apparels'}
        onClickLeftIcon={() => {
          navigation.openDrawer();
        }}
        isCart={true}
      />
      <FlatList
        data={products}
        renderItem={({item, index}) => {
          return (
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
                <Text style={styles.price}>{'₹' + item.price}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  desc: {
    marginLeft: 20,
  },
  price: {
    color: 'green',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
    marginTop: 5,
  },
});

// '30823.jpg','34912.jpg','30893.jpg','47067.jpg','59672.jpg','34953.jpg','31886.jpg','12345.jpg','10046.jpg','10048.jpg','10026.jpg','10023.jpg','10016.jpg','10015.jpg','10008.jpg','10006.jpg','10001.jpg','10000.jpg','2306.jpg','2112.jpg','10815.jpg','10812.jpg','10805.jpg','10801.jpg','10796.jpg','10793.jpg','10777.jpg','10720.jpg','10682.jpg','10678.jpg','10675.jpg','10670.jpg','10665.jpg','10576.jpg','10566.jpg','10564.jpg','10410.jpg','10413.jpg','10415.jpg','10421.jpg','10425.jpg','10429.jpg','10437.jpg','10445.jpg','10454.jpg','10451.jpg','10190.jpg','10185.jpg','10255.jpg','10259.jpg','10493.jpg','10473.jpg','10458.jpg','10453.jpg','10449.jpg','10446.jpg','10354.jpg','10363.jpg','10064.jpg','10058.jpg','10029.jpg','10025.jpg','10011.jpg','10357.jpg','10360.jpg','10365.jpg','10464.jpg','10514.jpg','10433.jpg','10435.jpg','10027.jpg','10017.jpg','10003.jpg','10005.jpg','10007.jpg','31161.jpg','31742.jpg'