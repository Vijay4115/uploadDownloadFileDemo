import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Upload from '../Screens/Upload';
import Download from '../Screens/Download';

const Stack = createNativeStackNavigator();

const MainStack = () =>{

    return(
        <Stack.Navigator>
            <Stack.Screen name="Upload" component={Upload}/>
            <Stack.Screen name="Download" component={Download}/>
            
        </Stack.Navigator>
    )
}
export default MainStack;