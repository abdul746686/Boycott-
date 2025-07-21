import 'package:flutter/material.dart';
import '../presentation/splash_screen/splash_screen.dart';
import '../presentation/settings_dashboard/settings_dashboard.dart';
import '../presentation/onboarding_flow/onboarding_flow.dart';
import '../presentation/device_control_panel/device_control_panel.dart';
import '../presentation/main_voice_interface/main_voice_interface.dart';
import '../presentation/emergency_features/emergency_features.dart';
import '../presentation/auth_screen/auth_screen.dart';

class AppRoutes {
  // TODO: Add your routes here
  static const String initial = '/';
  static const String splashScreen = '/splash-screen';
  static const String authScreen = '/auth-screen';
  static const String settingsDashboard = '/settings-dashboard';
  static const String onboardingFlow = '/onboarding-flow';
  static const String deviceControlPanel = '/device-control-panel';
  static const String mainVoiceInterface = '/main-voice-interface';
  static const String emergencyFeatures = '/emergency-features';

  static Map<String, WidgetBuilder> routes = {
    initial: (context) => const SplashScreen(),
    splashScreen: (context) => const SplashScreen(),
    authScreen: (context) => const AuthScreen(),
    settingsDashboard: (context) => const SettingsDashboard(),
    onboardingFlow: (context) => const OnboardingFlow(),
    deviceControlPanel: (context) => const DeviceControlPanel(),
    mainVoiceInterface: (context) => const MainVoiceInterface(),
    emergencyFeatures: (context) => const EmergencyFeatures(),
    // TODO: Add your other routes here
  };
}
