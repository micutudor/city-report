import React, { useState, useEffect } from 'react'
import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Pressable, 
  ActivityIndicator, 
  Alert, 
  Button,
  Image
} from 'react-native'

import Modal from 'react-native-modal';

import { useIsFocused } from '@react-navigation/native';

import { getUserComplaints, deleteComplaint, loadComplaint } from '../services/complaint';
import { FontAwesome5 } from 'react-native-vector-icons';

const my_complaints = () => {      
  const [data, updateData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, doRefresh] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalData, updateModalData] = useState('{}');

  const isFocused = useIsFocused();

  useEffect(() => {
    getData();
  }, [refresh, isFocused])

  const getData = async () => {
    setIsLoading(true);
    const json = await getUserComplaints();
    updateData(json.reverse());
    setIsLoading(false);
  }

  const Item = ({ id, date, category, barColor }) => (
    <View style={styles.item}>
      <View style={{flex: 2, alignItems: 'flex-start', flexDirection: 'column'}}>
        <Text style={styles.title}>{date}</Text>
        <Text style={styles.p}>Tip: {category}</Text>
      </View>
      <View style={{flex: 0.1, backgroundColor: barColor}}></View>
      <View style={{flex: 1, justifyContent: 'flex-end', flexDirection: 'row'}}>
          <Pressable 
            style={styles.button} 
            onPress={async (e) => {
              let response = await deleteComplaint(id);
              if (response.type == 'success')
              {
                  Alert.alert(response.message);
                  doRefresh(value => value + 1);
              }
              else
                  console.error(response.message);
            }} 
          >
            <FontAwesome5 name="trash-alt" color="white" size={24} />
          </Pressable>
          <Pressable 
            style={styles.button} 
            onPress={async (e) => {
              let response = await loadComplaint(id);
              console.log(response);
              setShowModal(true);
              updateModalData(response);
            }} 
          >
            <FontAwesome5 name="eye" color="white" size={24} />
          </Pressable>
      </View>
    </View>
  );

  const renderItem = ({ item }) => {
    if (item.status == 0) return <Item id={item.id} date={item.created_at} category={item.category} barColor={'red'} />
    else return <Item id={item.id} date={item.created_at} category={item.category} barColor={'green'} />
  };

  if (isLoading) return <ActivityIndicator size="large" />
  else
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 16, marginTop: 8}}>Sesizările mele</Text>
      <Modal isVisible={showModal}>
        <View style={styles.box}>
          { modalData.photo_path != null &&
            <View style={{flex: 1, justifyContent: 'flex-end', flexDirection: 'row'}}>
              <Image style={{height: '100%', width: '100%'}} source={{uri: 'https://api.inorog.org/assets/uploaded_photos/' + modalData.photo_path}}/>
            </View>
          }
          <View style={{flex: 1, alignItems: 'flex-start', flexDirection: 'column', padding: 5}}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>Sesizarea #{modalData.id}</Text>
            <Text>{modalData.text}</Text>
            {modalData.status == '1' && <Text>Răspuns: {modalData.answer}</Text>}
            <View style={{width: '100%', marginTop: 8}}>
              <Button title="Închide" onPress={(e) => setShowModal(false)}/>
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
    )
}

export default my_complaints

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    flex: 5,
  },
  item: {
    backgroundColor: '#3498db',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
  },
  box: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    marginTop: 100,
    marginBottom: 350,
  },
  button: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    color: 'white',
  },
  p: {
    color: 'white',
  },
})
