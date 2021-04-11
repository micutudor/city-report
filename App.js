import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, ActivityIndicator, Image } from 'react-native';

/* Vector icons */
import Icon from 'react-native-vector-icons/FontAwesome5';

/* Screens */
import { 
  NewComplaintScreen, 
  MyComplaintsScreen, 
  ComplaintsMapScreen, 
  NewsScreen, 
  SettingsScreen
} from './src/screens/index';

/* Navigation */
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

/* Services */
import { saveAuthToken, deleteAuthToken, getAuthToken } from './src/services/storage';
import { registerUser } from './src/services/user';

const Tab = createBottomTabNavigator();

export default function App() {
  const [userToken, setUserToken] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [firstName, onChangeFirstName] = useState();
  const [lastName, onChangeLastName] = useState();
  const [email, onChangeEmail] = useState();
  const [phoneNo, onChangePhoneNo] = useState();

  saveAuthToken('dIzVAzIHBWwfa7G3QihJFbpjd1kNggye');

  useEffect(() => {
    auth();
  }, []);

  const auth = async () => {
    setIsLoading(true);
    const token = await getAuthToken();
    setUserToken(token);
    setIsLoading(false);
  }

  if (isLoading) return <ActivityIndicator size="large" />
  if (userToken == null) 
    return (
      <SafeAreaView style={styles.container}>
        <Image style={{height: 193, width: 300}} source={{uri: 'http://turismbarlad.ro/wp-content/themes/UnderConstruction/img/part-pmclb.png'}}/>
        <Text style={{marginBottom: 16, fontWeight: 'bold'}}>Serviciul e-sesizări</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeFirstName}
          placeholder="Prenume"
          value={firstName}
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeLastName}
          placeholder="Nume"
          value={lastName}
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          placeholder="E-mail"
          value={email}
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangePhoneNo}
          placeholder="Telefon"
          value={phoneNo}
        />
        <Button
          onPress={async (e) => { 
            let response = await registerUser(firstName, lastName, email, phoneNo);
    
            if (response.type == 'success')
            {
              saveAuthToken(response.message);
              setUserToken(response.message);
            }
            else console.error(response.message);
          }}
          title="Intră în cont"
          color="#3498db"
        />
      </SafeAreaView>
    )
  else 
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
    
                switch (route.name) {
                  /*case 'Setari': {
                    iconName = 'cog';
                    break;
                  }
                  */
                  case 'Harta sesizari': {
                    iconName = 'map-marked';
                    break;
                  }
                  case 'Sesizare noua': {
                    iconName = 'map-marker-alt';
                    break;
                  }
                  case 'Sesizarile mele': {
                    iconName = 'list';
                    break;
                  }
                  case 'Buletin de stiri': {
                    iconName = 'newspaper';
                    break;
                  }
                }

                return <Icon name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: '#3498db',
              inactiveTintColor: 'gray',
              keyboardHidesTabBar: true,
            }}
        >
          <Tab.Screen name="Sesizare noua" component={NewComplaintScreen} />
          <Tab.Screen name="Sesizarile mele" component={MyComplaintsScreen} />
          <Tab.Screen name="Harta sesizari" component={ComplaintsMapScreen} />
          <Tab.Screen name="Buletin de stiri" component={NewsScreen} />
{/*          <Tab.Screen name="Setari" component={SettingsScreen} /> */}
        </Tab.Navigator>
      </NavigationContainer>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16
  },
  input: {
    height: 40,
    borderBottomWidth: 0.5,
    marginBottom: 8
  },
});
