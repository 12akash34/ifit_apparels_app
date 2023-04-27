import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../../common/Header';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const Wishlist = () => {
  const items = useSelector(state => state.wishlist);
  const [wishlistItems, setWishlistItems] = useState(items.data);
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Header title={'Wishlist Items'} />
      <FlatList
        data={wishlistItems}
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
                <Image source={{ uri: "http://192.168.43.233:5000/img/" + item.filename }} style={styles.itemImage} />
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
    </View>
  );
};

export default Wishlist;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 55,
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
});
