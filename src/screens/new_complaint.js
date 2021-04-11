import React, { useState, useEffect } from 'react';
import { 
  Button, 
  StyleSheet, 
  TextInput, 
  Text, 
  View, 
  Image,
  SafeAreaView, 
  Picker,
  Pressable,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { FontAwesome5 } from 'react-native-vector-icons';

import { createComplaint, uploadComplaintImage } from '../services/complaint';
import { getAddressByCoordinates, getCoordinatesByAddress } from '../services/map';

/* Map */
import MapView, { Marker, Polygon } from 'react-native-maps';
import { isPointInPolygon } from 'geolib';
import * as Location from 'expo-location';
import { cityCoordinates } from '../../data/city';

const new_complaint = () => {
    const [isMarkPlaced, setIsMarkPlaced] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [userCoordinates, updateUserCoordinates] = useState({latitude: 0.0, longitude: 0.0});
    const [address, updateAddress] = useState();

    const [selectedCategory, onChangeSelectedCategory] = useState();
    const [description, onChangeDescription] = useState();

    const [image, setImage] = useState({uri: 'https://i.stack.imgur.com/y9DpT.jpg', type: null});

    useEffect(() => {
      (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Nu ati acordat permisiuni aplicatiei!');
          return;
        }

        setIsLoading(true);      

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        updateUserCoordinates({latitude: location.coords.latitude, longitude: location.coords.longitude});

        setIsLoading(false);
      })();
    }, []);

    useEffect(() => {
      (async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      })();
    }, []);

    useEffect(() => {
      (async () => {
        let address = await getAddressByCoordinates(userCoordinates.latitude, userCoordinates.longitude);
        updateAddress(address.results[0].formatted);
      })();
    }, [userCoordinates])

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage({uri: result.uri, type: result.type})
      }
    };

    if (isMarkPlaced)
      return (
        <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{fontSize: 16, margin: 10}}>TIP SESIZARE:</Text>
          <Picker
            style={{margin: 10}}
            selectedValue={selectedCategory}
            onValueChange={(itemValue, itemIndex) =>
              onChangeSelectedCategory(itemValue)
            }>
            <Picker.Item label="Iluminat public" value="1" />
            <Picker.Item label="Zone verzi și mobilier urban" value="2" />
            <Picker.Item label="Salubrizare străzi" value="3" />
            <Picker.Item label="Reparații străzi și trotuare" value="4" />
            <Picker.Item label="Depozitare deșeuri" value="5" />
            <Picker.Item label="Parcări neregulamentare" value="6" />
            <Picker.Item label="Vehicule abandonate" value="7" />
            <Picker.Item label="Sesizări lucrări investiții" value="8" />
            <Picker.Item label="Transport public / taxi" value="9" />
            <Picker.Item label="Construcții / lucrări neautorizate; organizare de șantier" value="10" />
            <Picker.Item label="Probleme de mediu" value="11" />
            <Picker.Item label="Semnalizare rutieră" value="12" />
            <Picker.Item label="Rețele de apă / canalizare" value="13" />
            <Picker.Item label="Acte de comerț ilicit" value="14" />
            <Picker.Item label="Altele" value="15" />
          </Picker>
          <TextInput
            style={styles.input}
            onChangeText={onChangeDescription}
            value={description}
            placeholder="Descrierea sesizării"
            multiline
            numberOfLines={4}
          />
          <Pressable style={{ flex: 0.5, alignItems: 'center'}} onPress={pickImage}>
            {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />}
          </Pressable>
          <View style={{ flex: 0.2, margin: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Button
              onPress={(e) => { setIsMarkPlaced(false) }}
              title="Modifică locația"
              color="orange"
            />
            <Button
              onPress={async (e) => {
                let response = await createComplaint(selectedCategory, description, userCoordinates.latitude, userCoordinates.longitude);
                
                if (response.type == 'success')
                {
                    response = await uploadComplaintImage(response.message, image);
                    console.log(response);
                    Alert.alert("Sesizare trimisă cu succes!");
                    setIsMarkPlaced(false);

                    setImage({uri: 'https://i.stack.imgur.com/y9DpT.jpg', type: null});
                    onChangeDescription(null);
                    onChangeSelectedCategory(1);

                    updateUserCoordinates({latitude: location.coords.latitude, longitude: location.coords.longitude});
                }
                else console.error(response.message);
              }}
              title="Trimite sesizarea"
              color="green"
            />
          </View>
        </SafeAreaView>
      )
    else
    {
      if (isLoading) return <ActivityIndicator size="large"/>
      else
        return (
          <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
            <MapView style={styles.map}
              initialRegion={{
                latitude: userCoordinates.latitude,
                longitude: userCoordinates.longitude,
                latitudeDelta: 0.03, // abscisa
                longitudeDelta: 0.03, // ordonata
              }}
            >
              <Polygon 
                styles={{flex: 1}}
                coordinates={cityCoordinates}
                strokeColor="#c0392b" // fallback for when `strokeColors` is not supported by the map-provider
                fillColor="rgba(192, 57, 43, 0.3)"
                strokeWidth={6}
              />
              <Marker 
                draggable
                coordinate={{latitude: userCoordinates.latitude, longitude: userCoordinates.longitude}}
                onDragEnd={async (e) => {
                  updateUserCoordinates({latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude});
                }}
              />
            </MapView>
            <View style={styles.overlayBtn}>
                <Button 
                  title="Marcheaza locatia" 
                  onPress={(e) => { 
                    if (isPointInPolygon({ latitude: userCoordinates.latitude, longitude: userCoordinates.longitude }, cityCoordinates))
                      setIsMarkPlaced(true);
                    else
                      Alert.alert("Sesizările pot fi deschise doar pe raza municipiului Bârlad!");
                  } }/>
            </View>
            <View style={styles.overlaySearchBar}>
              <TextInput
                style={{flex: 4}}
                onChangeText={updateAddress}
                value={address}
                placeholder="Unde?"
              />
              <Pressable 
                style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}
                onPress={async () => {
                  let location = await getCoordinatesByAddress(address);
                  updateUserCoordinates({latitude: location.results[0].geometry.lat, longitude: location.results[0].geometry.lng})
                }}
              >
                <FontAwesome5 name="search" color="grey" size={24} />
              </Pressable>
            </View>
          </SafeAreaView>
        )
    }
}

export default new_complaint

const styles = StyleSheet.create({
    map: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    overlaySearchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: 300,
      height: 40,
      position: 'absolute',
      top: 35,
      backgroundColor: 'white',
      zIndex: 1,
    },
    overlayBtn: {
      width: 250, 
      bottom: 35,
      backgroundColor: 'transparent',
      zIndex: 1,
    },
    button: {
      width: 25,
    },
    input: {
      height: 120,
      margin: 10,
      borderBottomWidth: 0.5,
    },
  })
