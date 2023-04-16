import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Header from '../common/Header';
import {useSelector} from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';

const Orders = ({navigation}) => {
  const ordersList = useSelector(state => state.order);
  // console.log(ordersList);
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
        data={ordersList.data} 
        renderItem={({item, index}) => {
          return (
             <View style={styles.orderItems}>
              <FlatList 
                data={item.items} 
                renderItem={({item,index}) => {
                return(
                    <View style={styles.productItems}>
                      <image 
                        source={{uri:item.image}} 
                        style={styles.item} 
                      />
                      <View style={styles.nameView}>
                        <Text>
                            {item.productDisplayName.length > 20
                              ? item.productDisplayName.substring(0, 20)
                              : item.productDisplayName}
                        </Text> 
                        <Text>
                            {item.description.length > 30
                              ? item.description.substring(0, 30)
                              : item.description}
                        </Text>  
                        <Text style={{color: 'green'}}>
                          {'Rs.' + item.price}</Text>
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
    alignSelf: 20,
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