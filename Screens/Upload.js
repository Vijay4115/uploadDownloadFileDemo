import React, { useEffect } from 'react'
import { useState } from 'react'

import {FlatList, SafeAreaView,View,Text,Platform,StyleSheet, TouchableOpacity } from 'react-native'
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import firebasetup from '../firebase'
import FilePreview from "react-native-file-viewer"


const Upload = (props) =>{
    var furi = "";
    const [fileuri ,setFileuri ] = useState("")
    const [fileList,setFileList]= useState();
      //const {database} = firebasetup();  // for realtime Database;
    const {storage,db} = firebasetup();

async function selectFile (){
        try{
            const file = await DocumentPicker.pick({
            type:[DocumentPicker.types.allFiles],
            });
           
        
             furi = await file.uri; 
             
             
        const path = await normalizepath(file.uri);
        
        const result = await RNFetchBlob.fs.readFile(path,'base64');

        uploadfileToStorage(result,file);

    }
    catch(error){
        console.log(error);
    }
}

const showPreview = (fileuri) => {

console.log("URL -> ", fileuri);

// db.collection('data').get().then(docs => {
//     docs.forEach(doc => {
       
//        localfileurl = doc.data().localfileUri;
//       console.log( "LocalfileUrl -> " ,localfileurl);
   
//     });
// })


FilePreview.open(fileuri).then(
    console.log("Sucess View")
  )
  .catch(e => console.log(e))


  }

async function normalizepath (path){
    
        if(Platform.OS === 'ios' || Platform.OS==='android'){
            const fileprefix = "file://";
            if(path.startsWith(fileprefix)){
                path = path.substring(fileprefix.length);
                try{
                    path = decodeURI(path)
    
                }
                catch(e){
                    console.log(e);
                }
            }
        }
    
        return path;
        
}
async function uploadfileToStorage (result,file) {

    const uploadTask = storage()
    .ref(`allFiles/${file.name}`)
    .putString(result,'base64',{contentType:file.type});

    uploadTask.on('state_changed', 
  (snapshot) => {
   var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
   console.log(error, "error");
  }, 
  () => {
    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
      saveFileToDatabase(downloadURL,file);
      
    });
  }
);
}
function saveFileToDatabase (downloadURL,file){

   db.collection('data').add({

        filename:file.name,
        filetype:file.type,
        fileurl : downloadURL,
        localfileUri : furi
        
    }).then(console.log("Data added "),
   )
    .catch(error => console.log(error))


    //Insert Data into realtime Database

    // const uniquekey = database().ref().push().key;
    // database().ref(`allFiles/${uniquekey}`).update({
    //     filename:file.name,
    //     filetype:file.type,
    //     fileurl:downloadURL,
    // })
}


useEffect(() => {
   
    setFileList(([]))
    
    
        // For get Data with real time changes from firestore
           db.collection('data').onSnapshot((query)=>{
               let data = [] ;
               query.forEach(element => {
                   data.push(element.data());
                
               });
              
               setFileList(data)
           })

    // For get Data only once from firestore ....

    //    const values = db.collection('data').get().then(documents =>{
    //         documents.forEach(element => {
    //             let helperArr = [];
    //             helperArr.push(element.data())
    //             setFileList((files)=> [...files , ...helperArr])
              
                
    //         });
    //    })

    // for load data from realtime database ;
        // const onChildAdded = database().ref(`allFiles`).on('child_added',(snapshot)=>{
        // let helperArr = [] ;
        // helperArr.push(snapshot.val())  
        // setFileList((files) => [...files , ...helperArr]);

        //})

       // To get Data with live changes from realtime database..
        //return ()=> database().ref(`allFiles`).off('child_added',onChildAdded);

}, [])



    return(
            <SafeAreaView>
                <View style={styles.container}>
                    <Text style={styles.TextHeading}>File Uploding/Downloding</Text>

                    <TouchableOpacity style={styles.touch} onPress={()=>selectFile()}>
                        <Text style={styles.touchtext}>Choose File</Text>
                    </TouchableOpacity>

            <FlatList
                data={fileList}
                keyExtractor = {(item)=>item.filename}
                renderItem = {({item}) => (
                    
                    <View style={{marginTop:50}}>
                    <TouchableOpacity style={{borderWidth:1,height:35,borderRadius:15}}
                    
                    onPress={()=>props.navigation.navigate('Download',{
                        filedata:item
                    })}
                   //onPress= {()=>showPreview(item.localfileUri)}
                    >
                    <Text style={{padding:6,alignSelf:'center',fontWeight:'600'}}>{item.filename}</Text>
                    </TouchableOpacity>
                    </View>
                )}
            />
             
             
                </View>
            </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    container:{
        marginTop:50,
        alignItems:'center',
    },
    TextHeading:{
        fontSize:20,
        alignSelf:'center',
        fontWeight:'600',
        color:'darkgrey',
        marginTop:10,
    },
    touch:{
        marginTop:50,
        backgroundColor:'black',
        width:140,
        height:30,
        borderRadius:15
        },
    touchtext:{
        fontSize:17,
        fontWeight:'600',
        color:'white',
        alignSelf:'center',
        padding:4,
    },
})

export default Upload;