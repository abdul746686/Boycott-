import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:sizer/sizer.dart';

import '../theme/app_theme.dart';
import '../widgets/glassmorphism_container_widget.dart';

enum SocialProvider {
  facebook,
  twitter,
  google,
  googlePlus,
}

class SocialLoginButton extends StatefulWidget {
  final SocialProvider provider;
  final VoidCallback onPressed;
  final double? size;
  final bool isCircular;
  final String? text;
  final bool showText;

  const SocialLoginButton({
    super.key,
    required this.provider,
    required this.onPressed,
    this.size,
    this.isCircular = true,
    this.text,
    this.showText = false,
  });

  @override
  State<SocialLoginButton> createState() => _SocialLoginButtonState();
}

class _SocialLoginButtonState extends State<SocialLoginButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  bool _isPressed = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 150),
      vsync: this,
    );

    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.90,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  Color _getProviderColor() {
    switch (widget.provider) {
      case SocialProvider.facebook:
        return AppTheme.facebookBlue;
      case SocialProvider.twitter:
        return AppTheme.twitterBlue;
      case SocialProvider.google:
      case SocialProvider.googlePlus:
        return AppTheme.googleRed;
    }
  }

  IconData _getProviderIcon() {
    switch (widget.provider) {
      case SocialProvider.facebook:
        return FontAwesomeIcons.facebookF;
      case SocialProvider.twitter:
        return FontAwesomeIcons.twitter;
      case SocialProvider.google:
        return FontAwesomeIcons.google;
      case SocialProvider.googlePlus:
        return FontAwesomeIcons.googlePlusG;
    }
  }

  String _getProviderName() {
    switch (widget.provider) {
      case SocialProvider.facebook:
        return 'Facebook';
      case SocialProvider.twitter:
        return 'Twitter';
      case SocialProvider.google:
        return 'Google';
      case SocialProvider.googlePlus:
        return 'Google+';
    }
  }

  void _handleTapDown(TapDownDetails details) {
    setState(() {
      _isPressed = true;
    });
    _animationController.forward();
  }

  void _handleTapUp(TapUpDetails details) {
    setState(() {
      _isPressed = false;
    });
    _animationController.reverse();
    widget.onPressed();
  }

  void _handleTapCancel() {
    setState(() {
      _isPressed = false;
    });
    _animationController.reverse();
  }

  @override
  Widget build(BuildContext context) {
    final bool isLight = Theme.of(context).brightness == Brightness.light;
    final Color providerColor = _getProviderColor();
    final double buttonSize = widget.size ?? 14.w;

    return GestureDetector(
      onTapDown: _handleTapDown,
      onTapUp: _handleTapUp,
      onTapCancel: _handleTapCancel,
      child: AnimatedBuilder(
        animation: _scaleAnimation,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: widget.isCircular
                ? _buildCircularButton(buttonSize, providerColor, isLight)
                : _buildRectangularButton(providerColor, isLight),
          );
        },
      ),
    );
  }

  Widget _buildCircularButton(
      double buttonSize, Color providerColor, bool isLight) {
    return Container(
      width: buttonSize,
      height: buttonSize,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: providerColor,
        boxShadow: [
          BoxShadow(
            color: providerColor.withValues(alpha: 0.3),
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(buttonSize / 2),
          splashColor: Colors.white.withValues(alpha: 0.2),
          highlightColor: Colors.white.withValues(alpha: 0.1),
          onTap: widget.onPressed,
          child: Center(
            child: FaIcon(
              _getProviderIcon(),
              color: Colors.white,
              size: buttonSize * 0.4,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRectangularButton(Color providerColor, bool isLight) {
    return GlassmorphismContainer(
      borderRadius: 25,
      backgroundColor: providerColor.withValues(alpha: 0.9),
      borderColor: providerColor.withValues(alpha: 0.3),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(25),
          splashColor: Colors.white.withValues(alpha: 0.2),
          highlightColor: Colors.white.withValues(alpha: 0.1),
          onTap: widget.onPressed,
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: 6.w, vertical: 3.h),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                FaIcon(
                  _getProviderIcon(),
                  color: Colors.white,
                  size: 5.w,
                ),
                if (widget.showText || widget.text != null) ...[
                  SizedBox(width: 3.w),
                  Text(
                    widget.text ?? 'Continue with ${_getProviderName()}',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 14.sp,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class SocialLoginRow extends StatelessWidget {
  final Function(SocialProvider) onProviderSelected;
  final List<SocialProvider> providers;
  final double spacing;
  final double? buttonSize;

  const SocialLoginRow({
    super.key,
    required this.onProviderSelected,
    this.providers = const [
      SocialProvider.facebook,
      SocialProvider.twitter,
      SocialProvider.googlePlus,
    ],
    this.spacing = 20.0,
    this.buttonSize,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: providers.map((provider) {
        int index = providers.indexOf(provider);
        return Padding(
          padding: EdgeInsets.only(
            right: index < providers.length - 1 ? spacing : 0,
          ),
          child: SocialLoginButton(
            provider: provider,
            size: buttonSize,
            onPressed: () => onProviderSelected(provider),
          ),
        );
      }).toList(),
    );
  }
}

class SocialLoginColumn extends StatelessWidget {
  final Function(SocialProvider) onProviderSelected;
  final List<SocialProvider> providers;
  final double spacing;

  const SocialLoginColumn({
    super.key,
    required this.onProviderSelected,
    this.providers = const [
      SocialProvider.facebook,
      SocialProvider.google,
      SocialProvider.twitter,
    ],
    this.spacing = 16.0,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: providers.map((provider) {
        int index = providers.indexOf(provider);
        return Padding(
          padding: EdgeInsets.only(
            bottom: index < providers.length - 1 ? spacing : 0,
          ),
          child: SizedBox(
            width: double.infinity,
            child: SocialLoginButton(
              provider: provider,
              onPressed: () => onProviderSelected(provider),
              isCircular: false,
              showText: true,
            ),
          ),
        );
      }).toList(),
    );
  }
}