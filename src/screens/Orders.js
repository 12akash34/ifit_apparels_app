import {View, Text, StyleSheet, Image} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../common/Header';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { FlatList } from 'react-native-gesture-handler';

const Orders = ({navigation}) => {
  const ordersList = useSelector(state => state.order);
  const [orderList, setOrderList] = useState([]);
  useEffect(() => {
    getOrderList();
  }, []);
  const getOrderList = () => {
    var arr = [];
    
    firestore()
      .collection('Orders')
      .get()
      .then(querySnapshot => {
        console.log('total : ', querySnapshot.size);
        // querySnapshot.forEach(documentSnapshot => {
        //   arr.push(documentSnapshot.data());
        // });
        const arr = querySnapshot.docs.map((prod) => prod.data());
        arr.map((arr, i) => {
          arr.sr_no = i;
        });
        // console.log("array = ", arr);
        setOrderList(arr);
        // dispatch(addOrderList(arr));
      });
  };
  return ( 
    <View style={styles.container}>
      <Header
        leftIcon={require('../images/back.png')}
        title={'Orders'}
        onClickLeftIcon={() => {
          navigation.goBack();
        }}
      />
      <FlatList 
        data={orderList} 
        renderItem={({item, index}) => {
          return (
             <View style={styles.orderItems}>
              <Text style={{fontSize: 16}}>{item.sr_no + 1}. {item.createdAt}   <Text style={{color: 'green'}}>Total : ₹{item.amount}</Text></Text>
              <FlatList 
                data={item.items} 
                renderItem={({item,index}) => {
                return(
                    <View style={styles.productItems}>
                      <Image 
                        source={{uri: "http://192.168.43.233:5000/img/"+item.filename}} 
                        style={styles.item} 
                      />
                      <View style={styles.nameView}>
                        <Text style={{fontSize: 18}}>
                            {item.productDisplayName.length > 20
                              ? item.productDisplayName.substring(0, 20)
                              : item.productDisplayName}
                        </Text> 
                        <Text style={{fontSize: 14}}>
                            {item.description.length > 30
                              ? item.description.substring(0, 30)
                              : item.description}
                        </Text>  
                        <Text style={{color: 'green'}}>
                          {'₹' + item.price}</Text>
                      </View>     
                    </View>  
                  );  
                }}
              /> 
            </View>
          );
        }}
      />
    </View>       
  );
}; 

export default Orders;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  orderItems: {
    width: '90%',
    backgroundColor: '#fff',
    // alignSelf: 20,
    marginTop: 20,
    borderWidth: 0.3,
    padding: 10,
    borderRadius: 10,
    borderColor: '#7D7D7DF2'
  },
  productItems: {
    width: '95%',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
  },
  nameView: {
    marginLeft: 10,
  },
});