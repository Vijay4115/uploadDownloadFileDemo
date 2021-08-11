// /import 'react-native-gesture-handler';

import React, { Component } from 'react'
// import Upload from './Screens/Upload';
import {NavigationContainer} from '@react-navigation/native'
import MainStack from './Navigator/StackNavigator';
class App extends Component{

    render(){
      
        return(
          <NavigationContainer>
            <MainStack />
          </NavigationContainer>
        )
    }
}
export default App;