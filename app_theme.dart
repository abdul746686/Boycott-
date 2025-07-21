import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// A class that contains all theme configurations for the AI voice assistant application.
class AppTheme {
  AppTheme._();

  // Futuristic Theme Color Palette - Deep Blue to Purple Gradient Design
  // Primary gradient colors matching the futuristic design
  static const Color gradientStartLight = Color(0xFF1a237e); // Deep blue start
  static const Color gradientEndLight = Color(0xFF6a1b9a); // Purple end
  static const Color primaryLight = Color(0xFF1a237e); // Deep blue primary
  static const Color primaryVariantLight =
      Color(0xFF303f9f); // Lighter blue variant
  static const Color secondaryLight = Color(0xFF6a1b9a); // Purple secondary
  static const Color secondaryVariantLight = Color(0xFF8e24aa);
  static const Color accentLight = Color(0xFF00e676); // Bright green accent
  static const Color backgroundLight =
      Color(0xFFF3F4F6); // Light gray background
  static const Color surfaceLight = Color(0xFFFFFFFF); // Pure white surface
  static const Color glassSurfaceLight =
      Color(0x1AFFFFFF); // Glass surface with transparency
  static const Color errorLight = Color(0xFFE53E3E);
  static const Color warningLight = Color(0xFFED8936);
  static const Color voiceActiveLight =
      Color(0xFF667eea); // Voice active gradient
  static const Color onPrimaryLight = Color(0xFFFFFFFF);
  static const Color onSecondaryLight = Color(0xFFFFFFFF);
  static const Color onBackgroundLight = Color(0xFF1A202C);
  static const Color onSurfaceLight = Color(0xFF1A202C);
  static const Color onErrorLight = Color(0xFFFFFFFF);

  // Dark theme colors with same futuristic palette
  static const Color gradientStartDark = Color(0xFF1a237e);
  static const Color gradientEndDark = Color(0xFF6a1b9a);
  static const Color primaryDark = Color(0xFF3f51b5);
  static const Color primaryVariantDark = Color(0xFF303f9f);
  static const Color secondaryDark = Color(0xFF8e24aa);
  static const Color secondaryVariantDark = Color(0xFF7b1fa2);
  static const Color accentDark = Color(0xFF00e676);
  static const Color backgroundDark = Color(0xFF0F172A);
  static const Color surfaceDark = Color(0xFF1E293B);
  static const Color glassSurfaceDark = Color(0x1AFFFFFF);
  static const Color errorDark = Color(0xFFFC8181);
  static const Color warningDark = Color(0xFFFBB040);
  static const Color voiceActiveDark = Color(0xFF667eea);
  static const Color onPrimaryDark = Color(0xFFFFFFFF);
  static const Color onSecondaryDark = Color(0xFFFFFFFF);
  static const Color onBackgroundDark = Color(0xFFF7FAFC);
  static const Color onSurfaceDark = Color(0xFFF7FAFC);
  static const Color onErrorDark = Color(0xFF1A202C);

  // Social login button colors
  static const Color facebookBlue = Color(0xFF3b5998);
  static const Color twitterBlue = Color(0xFF1da1f2);
  static const Color googleRed = Color(0xFFdd4b39);
  static const Color googlePlusRed = Color(0xFFdd4b39);

  // Glass-morphism and modern UI colors
  static const Color glassBlur = Color(0x1AFFFFFF);
  static const Color cardShadow = Color(0x1A000000);
  static const Color dividerGlass = Color(0x33FFFFFF);

  // Text colors for futuristic theme
  static const Color textPrimaryLight = Color(0xFF1A202C);
  static const Color textSecondaryLight = Color(0xFF718096);
  static const Color textDisabledLight = Color(0xFFA0AEC0);
  static const Color textOnGlassLight = Color(0xFF2D3748);

  static const Color textPrimaryDark = Color(0xFFF7FAFC);
  static const Color textSecondaryDark = Color(0xFFE2E8F0);
  static const Color textDisabledDark = Color(0xFFA0AEC0);
  static const Color textOnGlassDark = Color(0xFFE2E8F0);

  /// Light theme with Futuristic Glass-morphism design
  static ThemeData lightTheme = ThemeData(
    brightness: Brightness.light,
    colorScheme: ColorScheme(
      brightness: Brightness.light,
      primary: primaryLight,
      onPrimary: onPrimaryLight,
      primaryContainer: primaryVariantLight,
      onPrimaryContainer: onPrimaryLight,
      secondary: secondaryLight,
      onSecondary: onSecondaryLight,
      secondaryContainer: secondaryVariantLight,
      onSecondaryContainer: onSecondaryLight,
      tertiary: accentLight,
      onTertiary: Color(0xFF1A202C),
      tertiaryContainer: accentLight,
      onTertiaryContainer: Color(0xFF1A202C),
      error: errorLight,
      onError: onErrorLight,
      surface: surfaceLight,
      onSurface: onSurfaceLight,
      onSurfaceVariant: textSecondaryLight,
      outline: dividerGlass,
      outlineVariant: Color(0x33FFFFFF),
      shadow: cardShadow,
      scrim: Color(0x80000000),
      inverseSurface: surfaceDark,
      onInverseSurface: onSurfaceDark,
      inversePrimary: primaryDark,
    ),
    scaffoldBackgroundColor: backgroundLight,
    cardColor: glassSurfaceLight,
    dividerColor: dividerGlass,
    appBarTheme: AppBarTheme(
      backgroundColor: Colors.transparent,
      foregroundColor: textPrimaryLight,
      elevation: 0,
      shadowColor: Colors.transparent,
      surfaceTintColor: Colors.transparent,
      titleTextStyle: GoogleFonts.inter(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: textPrimaryLight,
      ),
    ),
    cardTheme: CardTheme(
      color: glassSurfaceLight,
      elevation: 0,
      shadowColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20.0),
      ),
    ),
    bottomNavigationBarTheme: BottomNavigationBarThemeData(
      backgroundColor: glassSurfaceLight,
      selectedItemColor: primaryLight,
      unselectedItemColor: textSecondaryLight,
      elevation: 0,
      type: BottomNavigationBarType.fixed,
    ),
    floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: voiceActiveLight,
      foregroundColor: onPrimaryLight,
      elevation: 8.0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20.0),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        foregroundColor: onPrimaryLight,
        backgroundColor: primaryLight,
        elevation: 0,
        shadowColor: Colors.transparent,
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 20),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(25.0),
        ),
        textStyle: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: primaryLight,
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 20),
        side: BorderSide(color: glassSurfaceLight, width: 1.5),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(25.0),
        ),
        textStyle: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: primaryLight,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20.0),
        ),
        textStyle: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
      ),
    ),
    textTheme: _buildTextTheme(isLight: true),
    inputDecorationTheme: InputDecorationTheme(
      fillColor: glassSurfaceLight,
      filled: true,
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(25.0),
        borderSide: BorderSide(color: dividerGlass, width: 1.0),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(25.0),
        borderSide: BorderSide(color: dividerGlass, width: 1.0),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(25.0),
        borderSide: BorderSide(color: primaryLight, width: 2.0),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(25.0),
        borderSide: BorderSide(color: errorLight, width: 1.0),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(25.0),
        borderSide: BorderSide(color: errorLight, width: 2.0),
      ),
      labelStyle: GoogleFonts.inter(
        color: textSecondaryLight,
        fontSize: 16,
        fontWeight: FontWeight.w400,
      ),
      hintStyle: GoogleFonts.inter(
        color: textDisabledLight,
        fontSize: 16,
        fontWeight: FontWeight.w400,
      ),
      errorStyle: GoogleFonts.inter(
        color: errorLight,
        fontSize: 12,
        fontWeight: FontWeight.w400,
      ),
    ),
    switchTheme: SwitchThemeData(
      thumbColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryLight;
        }
        return textDisabledLight;
      }),
      trackColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryLight.withValues(alpha: 0.3);
        }
        return textDisabledLight.withValues(alpha: 0.3);
      }),
    ),
    checkboxTheme: CheckboxThemeData(
      fillColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryLight;
        }
        return Colors.transparent;
      }),
      checkColor: WidgetStateProperty.all(onPrimaryLight),
      side: BorderSide(color: dividerGlass, width: 1.0),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(6.0),
      ),
    ),
    radioTheme: RadioThemeData(
      fillColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryLight;
        }
        return textSecondaryLight;
      }),
    ),
    progressIndicatorTheme: ProgressIndicatorThemeData(
      color: voiceActiveLight,
      linearTrackColor: dividerGlass,
      circularTrackColor: dividerGlass,
    ),
    sliderTheme: SliderThemeData(
      activeTrackColor: primaryLight,
      thumbColor: primaryLight,
      overlayColor: primaryLight.withValues(alpha: 0.2),
      inactiveTrackColor: dividerGlass,
      trackHeight: 4.0,
    ),
    tabBarTheme: TabBarTheme(
      labelColor: primaryLight,
      unselectedLabelColor: textSecondaryLight,
      indicatorColor: primaryLight,
      indicatorSize: TabBarIndicatorSize.label,
      labelStyle: GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w600,
      ),
      unselectedLabelStyle: GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w400,
      ),
    ),
    tooltipTheme: TooltipThemeData(
      decoration: BoxDecoration(
        color: textPrimaryLight.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(12),
      ),
      textStyle: GoogleFonts.inter(
        color: surfaceLight,
        fontSize: 14,
        fontWeight: FontWeight.w400,
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
    ),
    snackBarTheme: SnackBarThemeData(
      backgroundColor: textPrimaryLight,
      contentTextStyle: GoogleFonts.inter(
        color: surfaceLight,
        fontSize: 16,
        fontWeight: FontWeight.w400,
      ),
      actionTextColor: accentLight,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16.0),
      ),
      elevation: 8.0,
    ),
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: surfaceLight,
      modalBackgroundColor: surfaceLight,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
    ),
    dialogTheme: DialogThemeData(
      backgroundColor: surfaceLight,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20.0),
      ),
      elevation: 0,
    ),
  );

  /// Dark theme with Futuristic Glass-morphism design
  static ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    colorScheme: ColorScheme(
      brightness: Brightness.dark,
      primary: primaryDark,
      onPrimary: onPrimaryDark,
      primaryContainer: primaryVariantDark,
      onPrimaryContainer: onPrimaryDark,
      secondary: secondaryDark,
      onSecondary: onSecondaryDark,
      secondaryContainer: secondaryVariantDark,
      onSecondaryContainer: onSecondaryDark,
      tertiary: accentDark,
      onTertiary: Color(0xFF1A202C),
      tertiaryContainer: accentDark,
      onTertiaryContainer: Color(0xFF1A202C),
      error: errorDark,
      onError: onErrorDark,
      surface: surfaceDark,
      onSurface: onSurfaceDark,
      onSurfaceVariant: textSecondaryDark,
      outline: dividerGlass,
      outlineVariant: Color(0x33FFFFFF),
      shadow: cardShadow,
      scrim: Color(0x80000000),
      inverseSurface: surfaceLight,
      onInverseSurface: onSurfaceLight,
      inversePrimary: primaryLight,
    ),
    scaffoldBackgroundColor: backgroundDark,
    cardColor: glassSurfaceDark,
    dividerColor: dividerGlass,
    appBarTheme: AppBarTheme(
      backgroundColor: Colors.transparent,
      foregroundColor: textPrimaryDark,
      elevation: 0,
      shadowColor: Colors.transparent,
      surfaceTintColor: Colors.transparent,
      titleTextStyle: GoogleFonts.inter(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: textPrimaryDark,
      ),
    ),
    cardTheme: CardTheme(
      color: glassSurfaceDark,
      elevation: 0,
      shadowColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20.0),
      ),
    ),
    bottomNavigationBarTheme: BottomNavigationBarThemeData(
      backgroundColor: glassSurfaceDark,
      selectedItemColor: primaryDark,
      unselectedItemColor: textSecondaryDark,
      elevation: 0,
      type: BottomNavigationBarType.fixed,
    ),
    floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: voiceActiveDark,
      foregroundColor: onPrimaryDark,
      elevation: 8.0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20.0),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        foregroundColor: onPrimaryDark,
        backgroundColor: primaryDark,
        elevation: 0,
        shadowColor: Colors.transparent,
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 20),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(25.0),
        ),
        textStyle: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: primaryDark,
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 20),
        side: BorderSide(color: glassSurfaceDark, width: 1.5),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(25.0),
        ),
        textStyle: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: primaryDark,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20.0),
        ),
        textStyle: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
      ),
    ),
    textTheme: _buildTextTheme(isLight: false),
    inputDecorationTheme: InputDecorationTheme(
      fillColor: glassSurfaceDark,
      filled: true,
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(25.0),
        borderSide: BorderSide(color: dividerGlass, width: 1.0),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(25.0),
        borderSide: BorderSide(color: dividerGlass, width: 1.0),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(25.0),
        borderSide: BorderSide(color: primaryDark, width: 2.0),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(25.0),
        borderSide: BorderSide(color: errorDark, width: 1.0),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(25.0),
        borderSide: BorderSide(color: errorDark, width: 2.0),
      ),
      labelStyle: GoogleFonts.inter(
        color: textSecondaryDark,
        fontSize: 16,
        fontWeight: FontWeight.w400,
      ),
      hintStyle: GoogleFonts.inter(
        color: textDisabledDark,
        fontSize: 16,
        fontWeight: FontWeight.w400,
      ),
      errorStyle: GoogleFonts.inter(
        color: errorDark,
        fontSize: 12,
        fontWeight: FontWeight.w400,
      ),
    ),
    switchTheme: SwitchThemeData(
      thumbColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryDark;
        }
        return textDisabledDark;
      }),
      trackColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryDark.withValues(alpha: 0.3);
        }
        return textDisabledDark.withValues(alpha: 0.3);
      }),
    ),
    checkboxTheme: CheckboxThemeData(
      fillColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryDark;
        }
        return Colors.transparent;
      }),
      checkColor: WidgetStateProperty.all(onPrimaryDark),
      side: BorderSide(color: dividerGlass, width: 1.0),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(6.0),
      ),
    ),
    radioTheme: RadioThemeData(
      fillColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryDark;
        }
        return textSecondaryDark;
      }),
    ),
    progressIndicatorTheme: ProgressIndicatorThemeData(
      color: voiceActiveDark,
      linearTrackColor: dividerGlass,
      circularTrackColor: dividerGlass,
    ),
    sliderTheme: SliderThemeData(
      activeTrackColor: primaryDark,
      thumbColor: primaryDark,
      overlayColor: primaryDark.withValues(alpha: 0.2),
      inactiveTrackColor: dividerGlass,
      trackHeight: 4.0,
    ),
    tabBarTheme: TabBarTheme(
      labelColor: primaryDark,
      unselectedLabelColor: textSecondaryDark,
      indicatorColor: primaryDark,
      indicatorSize: TabBarIndicatorSize.label,
      labelStyle: GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w600,
      ),
      unselectedLabelStyle: GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w400,
      ),
    ),
    tooltipTheme: TooltipThemeData(
      decoration: BoxDecoration(
        color: textPrimaryDark.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(12),
      ),
      textStyle: GoogleFonts.inter(
        color: backgroundDark,
        fontSize: 14,
        fontWeight: FontWeight.w400,
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
    ),
    snackBarTheme: SnackBarThemeData(
      backgroundColor: textPrimaryDark,
      contentTextStyle: GoogleFonts.inter(
        color: backgroundDark,
        fontSize: 16,
        fontWeight: FontWeight.w400,
      ),
      actionTextColor: accentDark,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16.0),
      ),
      elevation: 8.0,
    ),
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: surfaceDark,
      modalBackgroundColor: surfaceDark,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
    ),
    dialogTheme: DialogThemeData(
      backgroundColor: surfaceDark,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20.0),
      ),
      elevation: 0,
    ),
  );

  /// Helper method to build text theme with Inter font family for multilingual support
  static TextTheme _buildTextTheme({required bool isLight}) {
    final Color textPrimary = isLight ? textPrimaryLight : textPrimaryDark;
    final Color textSecondary =
        isLight ? textSecondaryLight : textSecondaryDark;
    final Color textDisabled = isLight ? textDisabledLight : textDisabledDark;

    return TextTheme(
      // Display styles for large headings with futuristic feel
      displayLarge: GoogleFonts.inter(
        fontSize: 57,
        fontWeight: FontWeight.w800,
        color: textPrimary,
        letterSpacing: -0.25,
      ),
      displayMedium: GoogleFonts.inter(
        fontSize: 45,
        fontWeight: FontWeight.w700,
        color: textPrimary,
        letterSpacing: 0,
      ),
      displaySmall: GoogleFonts.inter(
        fontSize: 36,
        fontWeight: FontWeight.w700,
        color: textPrimary,
        letterSpacing: 0,
      ),

      // Headline styles for section headers
      headlineLarge: GoogleFonts.inter(
        fontSize: 32,
        fontWeight: FontWeight.w700,
        color: textPrimary,
        letterSpacing: 0,
      ),
      headlineMedium: GoogleFonts.inter(
        fontSize: 28,
        fontWeight: FontWeight.w600,
        color: textPrimary,
        letterSpacing: 0,
      ),
      headlineSmall: GoogleFonts.inter(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: textPrimary,
        letterSpacing: 0,
      ),

      // Title styles for cards and dialogs
      titleLarge: GoogleFonts.inter(
        fontSize: 22,
        fontWeight: FontWeight.w600,
        color: textPrimary,
        letterSpacing: 0,
      ),
      titleMedium: GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: textPrimary,
        letterSpacing: 0.15,
      ),
      titleSmall: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: textPrimary,
        letterSpacing: 0.1,
      ),

      // Body styles for main content
      bodyLarge: GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: textPrimary,
        letterSpacing: 0.5,
        height: 1.5,
      ),
      bodyMedium: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: textPrimary,
        letterSpacing: 0.25,
        height: 1.43,
      ),
      bodySmall: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        color: textSecondary,
        letterSpacing: 0.4,
        height: 1.33,
      ),

      // Label styles for buttons and form elements
      labelLarge: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: textPrimary,
        letterSpacing: 0.1,
      ),
      labelMedium: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w600,
        color: textSecondary,
        letterSpacing: 0.5,
      ),
      labelSmall: GoogleFonts.inter(
        fontSize: 11,
        fontWeight: FontWeight.w600,
        color: textDisabled,
        letterSpacing: 0.5,
      ),
    );
  }

  /// Custom gradient decoration for futuristic backgrounds
  static BoxDecoration futuristicGradientDecoration({bool isLight = true}) {
    return BoxDecoration(
      gradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: isLight
            ? [gradientStartLight, gradientEndLight]
            : [gradientStartDark, gradientEndDark],
        stops: const [0.0, 1.0],
      ),
    );
  }

  /// Custom text styles for specific AI voice assistant use cases
  static TextStyle dataTextStyle({required bool isLight}) {
    return GoogleFonts.jetBrainsMono(
      fontSize: 14,
      fontWeight: FontWeight.w400,
      color: isLight ? textPrimaryLight : textPrimaryDark,
      letterSpacing: 0.25,
    );
  }

  static TextStyle apiKeyTextStyle({required bool isLight}) {
    return GoogleFonts.jetBrainsMono(
      fontSize: 12,
      fontWeight: FontWeight.w500,
      color: isLight ? textSecondaryLight : textSecondaryDark,
      letterSpacing: 0.5,
    );
  }

  static TextStyle voiceStatusTextStyle({required bool isLight}) {
    return GoogleFonts.inter(
      fontSize: 16,
      fontWeight: FontWeight.w600,
      color: isLight ? voiceActiveLight : voiceActiveDark,
      letterSpacing: 0.15,
    );
  }

  static TextStyle glassMorphTextStyle({required bool isLight}) {
    return GoogleFonts.inter(
      fontSize: 16,
      fontWeight: FontWeight.w500,
      color: isLight ? textOnGlassLight : textOnGlassDark,
      letterSpacing: 0.15,
    );
  }
}
