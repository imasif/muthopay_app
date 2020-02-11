import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image
} from 'react-native';
import { Camera, Permissions, FaceDetector, DangerZone, ImageManipulator } from 'expo';
import ignoreWarnings from 'react-native-ignore-warnings';

const landmarkSize = 2;

export default class FaceScreen extends React.Component {
  static defaultProps = {
    countDownSeconds: 5,
    motionInterval: 500, //ms between each device motion reading
    motionTolerance: 1, //allowed variance in acceleration
  }

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.front,
    faces: [],
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    whiteBalance: 'auto',
    ratio: '16:9',
    ratios: [],
    barcodeScanning: false,
    faceDetecting: false,
    newPhotos: false,
    permissionsGranted: false,
    pictureSize: undefined,
    pictureSizes: [],
    pictureSizeId: 0,
    showGallery: false,
    showMoreOptions: false,

    faceDetected: {}, //when true, we've found a face
    countDownSeconds: 5, //current available seconds before photo is taken
    countDownStarted: false, //starts when face detected
    pictureTaken: false, //true when photo has been taken
    countTakenPicture: 0,
    motion: null, //captures the device motion object 
    detectMotion: false, //when true we attempt to determine if device is still

    getFace: true

  }

  rollAngleWise= {
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });

    // ignoreWarnings([
    //     'ImageManipulator.manipulate is deprecated in favor of manipulateAsync, which has the same API except for the method name'
    // ]);
  }

  renderFace({ bounds, faceID, rollAngle, yawAngle, smilingProbability }) {
    return (
      <View
        key={faceID}
        transform={[
          { perspective: 600 },
          { rotateZ: `${rollAngle.toFixed(0)}deg` },
          { rotateY: `${yawAngle.toFixed(0)}deg` },
        ]}
        style={[
          styles.face,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
          {
            borderWidth:2,
            borderColor:'#fff',
            borderStyle: 'solid'
          }
        ]}>
        {/* Image on top texts */}
        {/* <Text style={styles.faceText}>ID: {faceID}</Text> */}
        {/* <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text> */}
        {/* <Text style={styles.faceText}>{this.state.countTakenPicture > 0 && `Picture Taken: ${this.state.countTakenPicture}`}</Text> */}
        {/* <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text> */}
        {/* <Text style={styles.faceText}>smiling:{smilingProbability}</Text> */}
      </View>
    );
  }

  renderSmile({ faceID, yawAngle, rollAngle, leftMouthPosition, rightMouthPosition, bottomMouthPosition }) {
    if (leftMouthPosition && rightMouthPosition && bottomMouthPosition ) {
      const rotateZ = rollAngle ? rollAngle.toFixed(0) : 0
      const rotateY = yawAngle ? yawAngle.toFixed(0) : 0
      
      const monthRect = {
        left: leftMouthPosition.x - 5,
        top: leftMouthPosition.y - 10,
        width: rightMouthPosition.x - leftMouthPosition.x + 10,
        height: bottomMouthPosition.y - leftMouthPosition.y + 20,
      }
      

      return (
          <View
            key={`smile-${faceID}`}
            transform={[
              { perspective: 600 },
              { rotateZ: `${rotateZ}deg` },
              { rotateY: `${rotateY}deg` },
            ]}
            style={[
              styles.smile,
              monthRect,
            ]}>
          </View>
      );
    }
  }  

  onFacesDetected = async ({ faces }) => {
    // if(this.state.getFace == true){
      // console.log(faces)
      // this.setState({ faces });

    //   let rollAngleWise = this.rollAngleWise;

      if (faces.length === 1){

        if(Object.keys(this.rollAngleWise).length === 1){
          this.setState({getFace:false});
          return;
        }
        this.setState({
          faces,
          faceDetected: {isDetected:true,'meassage':'Single face Detected'},
        });
        
        // if (!this.state.faceDetected && !this.state.countDownStarted){
        //   this.initCountDown();
        // }

        //***Take photo */

        // -10
        let rollAngle = faces[0].rollAngle;
        if(rollAngle > -30 && rollAngle < 30){
          let currPhoto = Math.round(rollAngle/3).toString();
        //   let condition = Object.keys(this.rollAngleWise).length > 0 && currPhoto in this.rollAngleWise;
        let photo  = await this.camera.takePictureAsync();

        // console.log('photo h/w',photo.width, photo.height)

        photo = await ImageManipulator.manipulateAsync(
            photo.uri,
            [{ resize: { width: 1200, height: 1600 } }],
                { compress: 0.4, format: "jpg", base64: false }
        );


        //   console.log('base64',base64);

        //   console.log('currPhoto in rollAngleWise',condition);
          // console.log(rollAngle,currPhoto, condition);
          // let countTakenPicture = Object.keys(this.rollAngleWise).length;
          
            //*** checks if our object is empty */
          if(Object.keys(this.rollAngleWise).length === 0 && this.rollAngleWise.constructor === Object){
            this.rollAngleWise[currPhoto] = [];
            this.rollAngleWise[currPhoto].push(photo);
          }else{
            //*** checks if our object has expsting key  */
            if(currPhoto in this.rollAngleWise){
                this.rollAngleWise[currPhoto].push(photo);
              }else{
                this.rollAngleWise[currPhoto] = [];
                this.rollAngleWise[currPhoto].push(photo);
            }
                    
            // this.setState({countTakenPicture});
            // this.setState({rollAngleWisePhoto});

            // console.log(rollAngle,currPhoto, rollAngleWise[currPhoto], currPhoto in rollAngleWise);
            // console.log('this.rollAngleWise',this.rollAngleWise);
          }

          // if(countTakenPicture === 1){
          //   this.setState({getFace:false});
          // }

        //   console.log('rollAngleWise[currPhoto],', currPhoto , this.rollAngleWise[currPhoto]);
        //   console.log('rollAngleWise', this.rollAngleWise);

        }

          // let currRollAnglePhoto = rollAngleWisePhoto[1];


        //   if(currRollAnglePhoto === ''){
        //     if(faces[0].rollAngle >= -3 && faces[0].rollAngle < 0){
        //       if (this.camera) {
        //         let photo = await this.camera.takePictureAsync();
        //         rollAngleWisePhoto[1] = photo;

        //         this.setState({rollAngleWisePhoto});
        
        //         console.log(photo);
        //       }
        //     }
        //   }
        // // -9
        //   currRollAnglePhoto = rollAngleWisePhoto[2];
        //   if(currRollAnglePhoto === ''){
        //     if(faces[0].rollAngle > -1 && faces[0].rollAngle < 3){
        //       if (this.camera) {
        //         let photo = await this.camera.takePictureAsync();
        //         rollAngleWisePhoto[2] = photo;

        //         this.setState({rollAngleWisePhoto});
        
        //         console.log(photo);
        //       }
        //     }
        //   }
        // // -8
        //   currRollAnglePhoto = rollAngleWisePhoto[2];
        //   if(currRollAnglePhoto === ''){
        //     if(faces[0].rollAngle > 4 && faces[0].rollAngle < 8){
        //       if (this.camera) {
        //         let photo = await this.camera.takePictureAsync();
        //         rollAngleWisePhoto[2] = photo;

        //         this.setState({rollAngleWisePhoto});
        
        //         console.log(photo);
        //       }
        //     }
        //   }


      }
      else if(faces.length > 1){
        this.setState({
          faceDetected: {isDetected:false,'meassage':'Single face please'},
        });
      }
      else {
        this.setState({
          faceDetected: {isDetected:false,'meassage':'No face detected'},
        });
        // this.cancelCountDown();
      }
    // }else{
    //   console.log('reached limit(5) for faces.')
    // }
    
  };

  onCameraReady = () => {
    console.info('Cam is ready');
  };

  onFaceDetectionError = state => console.warn('Faces detection error:', state);

  landmarkSize = 10;

  renderLandmarksOfFace(face) {
    console.log('renderLandmarksOfFace',face);
    const renderLandmark = position =>
      position &&
      <View
        style={[
          styles.landmark,
          {
            left: position.x - landmarkSize / 2,
            top: position.y - landmarkSize / 2,
          },
        ]}
      />;
    return (
      <View key={`landmarks-${face.faceID}`}>
        {console.log('face', face)}
        {renderLandmark(face.leftEyePosition)}
        {renderLandmark(face.rightEyePosition)}
        {renderLandmark(face.leftEarPosition)}
        {renderLandmark(face.rightEarPosition)}
        {renderLandmark(face.leftCheekPosition)}
        {renderLandmark(face.rightCheekPosition)}
        {renderLandmark(face.leftMouthPosition)}
        {renderLandmark(face.mouthPosition)}
        {renderLandmark(face.rightMouthPosition)}
        {renderLandmark(face.noseBasePosition)}
        {renderLandmark(face.bottomMouthPosition)}
      </View>
    );
  }

  renderFaces() {
    return (
      <View style={styles.facesContainer} pointerEvents="none">
        {this.state.faces.map(this.renderFace.bind(this))}
      </View>
    );
  }

  renderLandmarks() {
    return (
      <View style={styles.facesContainer} pointerEvents="none">
        {this.state.faces.map(this.renderLandmarksOfFace)}
      </View>
    );
  }
  
  renderSmiles() {
    return (
      <View style={styles.facesContainer} pointerEvents="none">
        {this.state.faces.map(this.renderSmile)}
      </View>
    );
  }
  
  retakePhoto(){
      this.rollAngleWise = {};
      this.setState({getFace:true});
    //   console.log('rollAngleWise',this.rollAngleWise);
    this.forceUpdate();
    console.log('retake click');
  }

  _compressImage = async (localUri) => {
    const manipResult = await ImageManipulator.manipulateAsync(
        localUri,
    //   [{ rotate: 90}, { flip: { vertical: true }}],
        { format: 'jpg' }
    );
    // this.setState({ image: manipResult });
    console.log('manipResult',manipResult);
  }

  next(){
    let {navigate} = this.props.navigation,
    {mobile} = this.props.navigation.state.params,
    $this = this;

    console.log('mobile',mobile);

    // navigate('QrScanScreen');

    let {rollAngleWise} = this;

    console.log('rollAngleWise',rollAngleWise);

    // data.append('name', 'testName'); // you can append anyone.
    // data.append('photos', []);

    // {
    //     uri: 'photo.uri',
    //     type: 'image/jpeg', // or photo.type
    //     name: 'testPhotoName'
    // }
    let dataArr = [];
    Object.keys(rollAngleWise).map(function(i,d){
        console.log(i,rollAngleWise[i]);
        let uri = rollAngleWise[i];

        console.log('uri',uri);

        for(let i = 0; i < uri.length; i++){
            let obj = {};
            obj['uri'] = uri[i].uri;
            obj['type'] = 'image/jpeg';
            //format rand_time
            obj['name'] = Math.floor((Math.random(0,1) * 10000098 + Math.random(0,1) * 10058)).toString() + '_' + Date.now();

            dataArr.push(obj);
            
        }

    });

    console.log('dataArr after',dataArr);

    const data = new FormData();


    for(let i = 0; i < dataArr.length; i++){
        data.append('photos', dataArr[i], dataArr[i].name);
    }

    // data.append('phone','+88'+mobile);

    // console.log('data',data);
    navigate('InfoScreen', {data, phone:'+88'+mobile});

  }

  render() {
    const { hasCameraPermission } = this.state;
    let {rollAngleWise} = this;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{flex:1, height:'100%', width:'100%', position: 'absolute', backgroundColor:'#000'}}>
          {
            this.state.getFace == false &&
            <View style={{flex:1, height:'100%', width:'100%', position: 'absolute', backgroundColor:'rgba(255,255,255,0.9)',
              zIndex:2, justifyContent: 'center',}}>
                <Text
                style={{
                    color:'#000',
                    fontSize:24,
                    flex:1,
                    textAlign:'center',
                    top:'30%',
                    justifyContent:'center'
                }}>Face Captured Sucessfully! {'\n'}</Text>

                <TouchableHighlight
                    style={{
                        borderWidth:1,
                        borderColor:'rgba(0,0,0,0.2)',
                        alignItems:'center',
                        justifyContent:'center',
                        width:120,
                        height:180,
                        backgroundColor:'rgba(41, 171, 226,1)',
                        borderBottomRightRadius: 90,
                        borderTopRightRadius: 90,
                        position:'absolute',
                        left:0,
                        bottom:'22%'
                    }}
                    onPress={()=>this.retakePhoto()}>
                    <Text style={{color:'#fff', fontSize:24}}>Retake</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={{
                        borderWidth:1,
                        borderColor:'rgba(0,0,0,0.2)',
                        alignItems:'center',
                        justifyContent:'center',
                        width:120,
                        height:180,
                        backgroundColor:'rgba(41, 171, 226,1)',
                        borderBottomLeftRadius: 90,
                        borderTopLeftRadius: 90,
                        position:'absolute',
                        right:0,
                        bottom:'22%'
                    }}
                    onPress={() => this.next()}>
                    <Text style={{color:'#fff', fontSize:24}}>Next</Text>
                </TouchableHighlight>
            </View>
          }
          <View style={{flex:1, height:'100%', width:'100%', position: 'absolute', backgroundColor:'#000'}}>
            <View
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').width * 4 / 3,
              }}>
              <Camera
                style={{ flex: 1 }}
                type={this.state.type}
                faceDetectorSettings={{
                  mode: FaceDetector.Constants.Mode.fast,
                  detectLandmarks: FaceDetector.Constants.Mode.smilingProbability,
                  runClassifications: FaceDetector.Constants.Mode.all,
                }}
                ref={ref => { this.camera = ref; }}
                // faceDetectionLandmarks={
                //   FaceDetector.Constants.Mode.all
                // }
                // faceDetectionClassifications={
                //   FaceDetector.Constants.Classifications.all
                // }
                onFacesDetected={this.onFacesDetected}
                onCameraReady={this.onCameraReady}>

                {/* Display face detecion true/false */}
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    position: 'absolute',
                    bottom: 0,
                    width:'100%',
                    justifyContent: 'flex-end'
                  }}>
                    <Text
                      style={styles.textStandard}>
                      {'  '}{this.state.faceDetected.meassage}{'  '}
                    </Text>
                </View>

                {/* <View
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: 'rgba(74, 167, 224,1)',
                      alignSelf: 'flex-end',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignContent: 'center',
                      margin: 10,
                    }}
                    onPress={() => {
                      this.setState({
                        type: this.state.type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back,
                      });
                    }}>
                    <Text
                      style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                      {' '}Flip{' '}
                    </Text>
                  </TouchableOpacity>
                </View> */}
                {this.renderFaces()}
                {/* {this.renderLandmarks()} */}
                {/* {this.renderSmiles()} */}
              </Camera>

              {/* <View style={{
                position:'absolute',
                bottom: 0,
                backgroundColor: '#f00',
                height:'40%',
                width: '100%'

              }}> */}
                {/* <Text>Hello World!</Text> */}
                {/* <Text>Image uri: {this.state.rollAngleWisePhoto[11].uri}</Text> */}
                {/* will loop rollAngleWisePhoto */}
              {/* </View> */}
              
                
            </View>


            <View style={{
              position:'absolute',
              bottom: 0,
              backgroundColor: '#000',
              height:'20%',
              width: '100%'

              }}>
                {/* <Text>Hello World!</Text> */}
                {/* <Text>Image uri: {this.state.rollAngleWisePhoto[11].uri}</Text> */}
                {/* will loop rollAngleWisePhoto */}

                <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={true}>

                {Object.keys(rollAngleWise).map(key => (
                  rollAngleWise[key] != '' &&
                  <Image style={{width: 100,height:100}} key={key} source={{uri: rollAngleWise[key][0].uri}} />
                  // console.log('ImageUri', this.state.rollAngleWisePhoto[key])

                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      );
    }
  }
}

// const HomeScreen = ({ navigation }) => <CameraExample />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    position: 'absolute',
    justifyContent: 'center',
  },
  smile: {
    position: 'absolute',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 1,    
    borderColor: 'violet',    
  },  
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: 'absolute',
    backgroundColor: 'green',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  textStandard: {
    fontSize: 18, 
    marginBottom: 10,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    textAlign: 'right'
  },
});

// const App = StackNavigator(
//   {
//     Home: {
//       screen: CameraExample,
//       navigationOptions: {
//         header: null,
//       },
//     }
//   },
//   {
//     headerMode: 'screen',
//   }
// );
