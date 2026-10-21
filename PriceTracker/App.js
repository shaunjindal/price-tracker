import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import OrderScreen from './src/screens/OrderScreen';
import EditPriceScreen from './src/screens/EditPriceScreen';
import { OrderProvider } from './src/context/OrderContext';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <OrderProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.bg },
            headerShadowVisible: false,
            headerTintColor: colors.text,
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Detail" component={ProductDetailScreen} options={{ title: '' }} />
          <Stack.Screen name="Order" component={OrderScreen} options={{ title: 'Order summary' }} />
          <Stack.Screen name="EditPrice" component={EditPriceScreen} options={{ title: 'Change price' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </OrderProvider>
  );
}
