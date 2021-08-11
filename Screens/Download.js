import React, { Component } from 'react'
import {
    Text,
    View,
    Image,
    StyleSheet,
    Platform,
    TouchableOpacity,
    PermissionsAndroid,
    SafeAreaView,
  } from 'react-native';

import RNFetchBlob from 'rn-fetch-blob';

const Download = ({route}) => {


    const checkPermission = async () => {
    
        // Function to check the platform
        // If Platform is Android then check for permissions.
     
        if (Platform.OS === 'ios') {
          downloadFile();
        } else {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'Storage Permission Required',
                message:
                  'Application needs access to your storage to download File',
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              // Start downloading
              downloadFile();
              console.log('Storage Permission Granted.');
            } else {
              // If permission denied then show alert
              Alert.alert('Error','Storage Permission Not Granted');
            }
          } catch (err) {
            // To handle permission related exception
            console.log("++++"+err);
          }
        }
      };

    const downloadFile = () => {
         let date = new Date();
        
         let FILE_URL = route.params.filedata.fileurl;    
 
        let file_ext = getFileExtention(FILE_URL);
       
        file_ext = '.' + file_ext[0];
       
        const { config, fs } = RNFetchBlob;
        let RootDir = fs.dirs.PictureDir;
        let options = {
          fileCache: true,
          addAndroidDownloads: {
            path:
              RootDir+
              '/file_' + 
              Math.floor(date.getTime() + date.getSeconds() / 2) +
              file_ext,
            description: 'downloading file...',
            notification: true,
        useDownloadManager: true,   
          },
        };
        config(options)
          .fetch('GET', FILE_URL)
          .then(res => {
            console.log('res -> ', JSON.stringify(res));
            alert('File Downloaded Successfully.');
          });
      };


      const getFileExtention = fileUrl => {
        // To get the file extension
        return /[.]/.exec(fileUrl) ?
                 /[^.]+$/.exec(fileUrl) : undefined;
      };
      
    return(
<SafeAreaView>
<View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 25, textAlign: 'center' }}>
          React Native File Download Example
        </Text>
       
      </View>
      <Image
        source={{
          uri: route.params.filedata.fileurl,
        }}
        style={{
          width: 300,
          height: 200,
          resizeMode: 'center',
          margin: 5
        }}
      />
      <TouchableOpacity
        // /style={styles.button}
        onPress={checkPermission()}>
        <Text style={styles.text}>
         
        </Text>
      </TouchableOpacity>
    </View>
</SafeAreaView>
    )
}
export default Download;

const styles = StyleSheet.create({
    container: {
      marginTop:250,
        flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
    text: {
      color: 'white',
      fontSize: 20,
      textAlign: 'center',
      fontWeight:'600',
      padding:2,
    },
    button: {
      width: '80%',
      padding: 10,
      height:50,
      backgroundColor: 'black',
      margin: 10,
      marginTop:50
    },
    
  });