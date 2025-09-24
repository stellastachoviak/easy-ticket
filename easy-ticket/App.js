import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity, Text, Alert } from 'react-native';

import Login from './screens/Login';
import PrincipalAdm from './screens/TelaAdm'; // 👈 agora importa só a tela
import AppTabs from './screens/AppTabs';
import HistoricoTickets from './screens/HistoricoTickets';
import StatusTicketsHoje from './screens/StatusTicketsHoje';
import EditarAluno from './screens/EditarAluno';
import GerenciarTurmas from './screens/GerenciarTurmas';

import { AuthProvider, useAuth } from './AuthContext';
import { TimeProvider } from './TimeContext';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function LogoutButton({ navigation }) {
  const { logout } = useAuth();

  return (
    <TouchableOpacity
      style={{ marginRight: 10 }}
      onPress={() => {
        Alert.alert('Deslogar', 'Deseja realmente sair?', [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Sim',
            onPress: async () => {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            },
          },
        ]);
      }}
    >
      <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Sair</Text>
    </TouchableOpacity>
  );
}

function DrawerAdmin() {
  return (
    <Drawer.Navigator
      initialRouteName="AdminHome"
      screenOptions={({ navigation }) => ({
        headerRight: () => <LogoutButton navigation={navigation} />,
      })}
    >
      <Drawer.Screen name="AdminHome" component={PrincipalAdm} options={{ title: 'Administração' }} />
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
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user && (
        <Stack.Screen name="Login" component={Login} />
      )}

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
  return (
    <AuthProvider>
      <TimeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </TimeProvider>
    </AuthProvider>
  );
}
