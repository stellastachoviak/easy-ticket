import React, { useEffect } from 'react'; // ADICIONADO
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store, { store as namedStore, isValidReduxStore } from './redux/store';
import TimeUpdater from './TimeUpdater';

import Login from './screens/Login';
import PrincipalAdm from './screens/CadastrarAluno';
import AppTabs from './screens/AppTabs';
import HistoricoTickets from './screens/HistoricoTickets';
import StatusTicketsHoje from './screens/StatusTicketsHoje';
import EditarAluno from './screens/EditarAluno';
import GerenciarTurmas from './screens/GerenciarTurmas';

import { logoutUser, loadUserFromStorage } from './redux/authSlice';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function LogoutButton({ navigation }) {
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      style={{ marginRight: 10 }}
      onPress={() => {
        Alert.alert('Deslogar', 'Deseja realmente sair?', [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Sim',
            onPress: async () => {
              await dispatch(logoutUser());
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            },
          },
        ]);
      }}
    >
      <Text style={{ color: '#F3E5AB', fontWeight: 'bold' }}>Sair</Text>
    </TouchableOpacity>
  );
}

function DrawerAdmin() {
  return (
    <Drawer.Navigator
      initialRouteName="AdminHome"
      screenOptions={({ navigation }) => ({
        headerRight: () => <LogoutButton navigation={navigation} />,

        headerStyle: {
          backgroundColor: '#6F4E37', 
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: 'PlayfairDisplay_700Bold',
        },

        drawerStyle: {
          backgroundColor: '#F3E5AB', 
        },
        drawerActiveTintColor: '#6F4E37',  
        drawerInactiveTintColor: '#333',  
        drawerLabelStyle: {
          fontFamily: 'Roboto_400Regular', 
          fontSize: 16,
        },
      })}
    >
      <Drawer.Screen
        name="AdminHome"
        component={PrincipalAdm}
        options={{ title: 'Cadastrar aluno' }}
      />
      <Drawer.Screen
        name="StatusTicketsHoje"
        component={StatusTicketsHoje}
        options={{ title: "Status dos Tickets de Hoje" }}
      />
      <Drawer.Screen
        name="HistoricoTickets"
        component={HistoricoTickets}
        options={{ title: "Histórico de Tickets" }}
      />
      <Drawer.Screen
        name="GerenciarTurmas"
        component={GerenciarTurmas}
        options={{ title: "Gerenciar Turmas" }}
      />
    </Drawer.Navigator>
  );
}


function AppNavigator() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector(s => s.auth);

  useEffect(() => { // trocado de React.useEffect
    dispatch(loadUserFromStorage()); // unconditional on mount
  }, [dispatch]);

  if (isLoading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user && <Stack.Screen name="Login" component={Login} />}

      {user?.type === 'admin' && (
        <>
          <Stack.Screen name="DrawerAdmin" component={DrawerAdmin} />
          <Stack.Screen name="EditarAluno" component={EditarAluno} />
        </>
      )}

      {user?.type === 'aluno' && (
        <>
          <Stack.Screen name="AppTabs" component={AppTabs} />
          <Stack.Screen name="EditarAluno" component={EditarAluno} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const validDefault = isValidReduxStore(store);
  const validNamed = isValidReduxStore(namedStore);
  // eslint-disable-next-line no-console
  console.log('STORE VALID (default, named, sameRef):', validDefault, validNamed, store === namedStore);

  if (!validDefault) {
    // Fallback screen prevents cryptic Provider crash
    return (
      <>
        {/* Diagnóstico básico (não usar em produção) */}
        <Text style={{ marginTop: 60, textAlign: 'center', color: 'red', fontSize: 16 }}>
          Erro: Redux store inválido. Veja logs do console.
        </Text>
      </>
    );
  }

  return (
    <Provider store={store}>
      <TimeUpdater />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
