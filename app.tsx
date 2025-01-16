// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import SplashScreen from './screens/splashscreen';  // Sesuaikan path-nya
// import LoginMenu from './screens/LoginMenu';
// import LoginForm from './screens/LoginForm';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   const [isSplashScreenVisible, setIsSplashScreenVisible] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsSplashScreenVisible(false);
//     }, 3000); // 3 detik splash screen

//     return () => clearTimeout(timer); // Membersihkan timer jika komponen di-unmount
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
//         {isSplashScreenVisible ? (
//           <Stack.Screen name="SplashScreen" component={SplashScreen} />
//         ) : (
//           <>
//             <Stack.Screen name="LoginMenu" component={LoginMenu} />
//             <Stack.Screen name="LoginForm" component={LoginForm} />
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

