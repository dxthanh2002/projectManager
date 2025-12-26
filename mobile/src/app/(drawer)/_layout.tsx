import { Drawer } from 'expo-router/drawer';
import { CustomDrawerContent } from '@/components/CustomDrawerContent';

export default function DrawerLayout() {
    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerType: 'front',
                drawerStyle: {
                    width: '85%',
                    maxWidth: 320,
                },
            }}
        >
            <Drawer.Screen
                name="(tabs)"
                options={{
                    drawerLabel: 'Home',
                    title: 'ManagerCheck',
                }}
            />
        </Drawer>
    );
}
