import React, { useState, useEffect } from 'react'
import { 
  StyleSheet, 
  Button,
  Text, 
  View, 
  SafeAreaView, 
  FlatList, 
  ActivityIndicator, 
  Pressable, 
  Image 
} from 'react-native'

import { getAllNews, getNews } from '../services/news';

import Modal from 'react-native-modal';

const news = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, updateModalData] = useState('{}');
  const [isLoading, setIsLoading] = useState(false);
  const [newsData, updateNewsData] = useState('{}');

  useEffect(() => {
    getData();
  }, [])

  const getData = async() => {
    setIsLoading(true);
    const data = await getAllNews();
    updateNewsData(data.reverse());
    setIsLoading(false);
  }

  const Item = ({ id, header, datetime, image }) => (
    <View style={styles.item}>
      <View style={{flex: 0.5, justifyContent: 'flex-end', flexDirection: 'row'}}>
        <Image style={styles.image} source={{ uri: image }} />
      </View>
      <View style={{flex: 1, alignItems: 'flex-start', flexDirection: 'column', padding: 5}}>
        <Text style={styles.title}>{header}</Text>
        <Text style={styles.published}>Publicat pe {datetime}</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <Pressable 
      onPress={async (e) => {
        const data = await getNews(item.id);
        updateModalData(data);
        setShowModal(true); 
      }}> 
      <Item id={item.id} datetime={item.created_at} header={item.header} image={item.photo_path} />
    </Pressable>
  );
  
  if (isLoading) return <ActivityIndicator size="large" />
  else
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 16, marginTop: 8}}>Noutăți</Text>
        <Modal isVisible={showModal}>
        <View style={styles.box}>
          { modalData.photo_path != null &&
            <View style={{flex: 1, justifyContent: 'flex-end', flexDirection: 'row'}}>
              <Image style={{height: '100%', width: '100%'}} source={{uri: modalData.photo_path}}/>
            </View>
          }
          <View style={{flex: 1, alignItems: 'flex-start', flexDirection: 'column', padding: 5}}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>{modalData.header}</Text>
            <Text>{modalData.text}</Text>
            <View style={{width: '100%', marginTop: 8}}>
              <Button title="Închide" onPress={(e) => setShowModal(false)}/>
            </View>
          </View>
        </View>
        </Modal>
        <FlatList
          data={newsData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
    );
}

export default news

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    flex: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  item: {
    backgroundColor: '#3498db',
    height: 100,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
  },
  box: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 100,
    marginBottom: 200,
    marginHorizontal: 25,
  },
  button: {
    padding: 8,
  },
  title: {
    fontSize: 12,
    color: 'white',
  },
  published: {
    fontSize: 12,
    fontStyle: 'italic',
    color: 'white',
  },
  p: {
    color: 'white',
  },
});
