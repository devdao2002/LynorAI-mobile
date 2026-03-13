import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, typography } from '../theme';
import ChatScreen from '../screens/ChatScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import IntegrationsScreen from '../screens/IntegrationsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ focused, iconName, label }) {
    // Making the icon large relative to the text for a strong visual hierarchy
    const TEXT_SIZE = 10;
    const ICON_SIZE = 28;

    const anim = useRef(new Animated.Value(focused ? 1 : 0)).current;

    useEffect(() => {
        Animated.spring(anim, {
            toValue: focused ? 1 : 0,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
        }).start();
    }, [focused]);

    const iconTranslateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [8, 0], // Shifts up when focused
    });

    const textTranslateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [10, 0], // Slides up
    });

    const textOpacity = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1], // Fades in
    });

    const textScale = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1], // Expands slightly
    });

    return (
        <View style={styles.iconWrap}>
            <Animated.View style={{ transform: [{ translateY: iconTranslateY }], alignItems: 'center', zIndex: 1 }}>
                <Ionicons
                    name={iconName}
                    size={ICON_SIZE}
                    color={focused ? colors.accent2 : colors.textMuted}
                />
            </Animated.View>

            <Animated.Text
                numberOfLines={1}
                style={[
                    styles.label,
                    {
                        fontSize: TEXT_SIZE,
                        color: focused ? colors.accent2 : colors.textMuted,
                        opacity: textOpacity,
                        transform: [
                            { translateY: textTranslateY },
                            { scale: textScale }
                        ]
                    }
                ]}
            >
                {label}
            </Animated.Text>
        </View>
    );
}

export default function TabNavigator({ bootstrap, chat, docs }) {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
                tabBarItemStyle: styles.tabBarItem,
            }}
        >
            <Tab.Screen
                name="Chat"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} iconName={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} label="Chat" />
                    ),
                }}
            >
                {() => (
                    <ChatScreen
                        messages={chat.messages}
                        streaming={chat.streaming}
                        onSend={chat.sendMessage}
                        sandboxActive={bootstrap.sandbox?.active}
                        documentReady={bootstrap.documentReady}
                    />
                )}
            </Tab.Screen>

            <Tab.Screen
                name="Documents"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} iconName={focused ? 'document-text' : 'document-text-outline'} label="Docs" />
                    ),
                }}
            >
                {() => (
                    <DocumentsScreen
                        uploads={docs.uploads}
                        onPickAndUpload={docs.pickAndUpload}
                        sandboxActive={bootstrap.sandbox?.active}
                    />
                )}
            </Tab.Screen>

            <Tab.Screen
                name="Integrations"
                component={IntegrationsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} iconName={focused ? 'link' : 'link-outline'} label="Connect" />
                    ),
                }}
            />

            <Tab.Screen
                name="Settings"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} iconName={focused ? 'settings' : 'settings-outline'} label="Settings" />
                    ),
                }}
            >
                {() => (
                    <SettingsScreen
                        sandbox={bootstrap.sandbox}
                        version={bootstrap.version}
                        limits={bootstrap.limits}
                    />
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: colors.bgSurface,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        // Give enough height for the big icons
        height: Platform.OS === 'ios' ? 88 : 70,
        paddingBottom: Platform.OS === 'ios' ? 24 : 8,
        paddingTop: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
            },
            android: { elevation: 16 },
        }),
    },
    tabBarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    iconWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50, // Fixed height to prevent layout shifts during animation
    },
    label: {
        fontWeight: '700',
        marginTop: 2,
        letterSpacing: 0.3,
        textTransform: 'uppercase',
        textAlign: 'center',
        width: 100,
    },
});
