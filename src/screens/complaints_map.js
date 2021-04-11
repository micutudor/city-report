import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';

import MapView, { Callout, Marker, Polygon } from 'react-native-maps';
import { cityCoordinates } from '../../data/city';

import { useIsFocused } from '@react-navigation/native';

import { getAllComplaints } from '../services/complaint';

const complaints_map = () => {
  const [markers, updateMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    getComplaints();
  }, [isFocused]);

  const getComplaints = async () => {
    setIsLoading(true);
    const data = await getAllComplaints();
    updateMarkers(data);
    setIsLoading(false);
  }

  const colors = ['red', 'green'];

  if (isLoading) return <ActivityIndicator size="large"/>
  else return (
    <MapView style={styles.map}
      initialRegion={{
        latitude: 46.2333,
        longitude: 27.6667,
        latitudeDelta: 0.03, // abscisa
        longitudeDelta: 0.03, // ordonata
      }}
    >
      <Polygon 
        styles={{flex: 1}}
        coordinates={cityCoordinates}
        strokeColor="#c0392b"
        fillColor="rgba(192, 57, 43, 0.3)"
        strokeWidth={6}
      />
      {markers.map((marker) => { let status = (marker.status == '0') ? 'În rezolvare' : 'Rezolvat'; return (
        <Marker
          key={marker.id}
          coordinate={{latitude: Number(marker.location_latitude), longitude: Number(marker.location_longitude)}}
          pinColor={colors[marker.status]}
        >
          <Callout>
            <Text>Categorie: {marker.category}</Text>
            <Text>Nr. sesizare: {marker.id}</Text>
            <Text>Stadiu sesizare: {status}</Text>
            <Text>Descriere: {marker.text}</Text>
            {marker.status == '1' && <Text>Răspuns: {marker.answer}</Text>}
            <Text>Creat la: {marker.created_at}</Text>
          </Callout>
        </Marker>
      )})}
    </MapView>
  )
}

export default complaints_map

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})
