import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../theme/app_theme.dart';

class GlassmorphismContainer extends StatelessWidget {
  final Widget child;
  final double? width;
  final double? height;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double borderRadius;
  final double blurStrength;
  final Color? backgroundColor;
  final Color? borderColor;
  final double borderWidth;
  final List<BoxShadow>? boxShadow;

  const GlassmorphismContainer({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius = 20.0,
    this.blurStrength = 15.0,
    this.backgroundColor,
    this.borderColor,
    this.borderWidth = 1.0,
    this.boxShadow,
  });

  @override
  Widget build(BuildContext context) {
    final bool isLight = Theme.of(context).brightness == Brightness.light;

    return Container(
      width: width,
      height: height,
      margin: margin,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: blurStrength, sigmaY: blurStrength),
          child: Container(
            padding: padding ?? EdgeInsets.all(4.w),
            decoration: BoxDecoration(
              color: backgroundColor ??
                  (isLight
                      ? AppTheme.glassSurfaceLight
                      : AppTheme.glassSurfaceDark),
              borderRadius: BorderRadius.circular(borderRadius),
              border: Border.all(
                color: borderColor ??
                    (isLight ? AppTheme.dividerGlass : AppTheme.dividerGlass),
                width: borderWidth,
              ),
              boxShadow: boxShadow ??
                  [
                    BoxShadow(
                      color: AppTheme.cardShadow,
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}

class GlassmorphismCard extends StatelessWidget {
  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double borderRadius;
  final bool showShadow;

  const GlassmorphismCard({
    super.key,
    required this.child,
    this.onTap,
    this.padding,
    this.margin,
    this.borderRadius = 16.0,
    this.showShadow = true,
  });

  @override
  Widget build(BuildContext context) {
    final bool isLight = Theme.of(context).brightness == Brightness.light;

    Widget cardContent = GlassmorphismContainer(
      padding: padding ?? EdgeInsets.all(4.w),
      margin: margin,
      borderRadius: borderRadius,
      boxShadow: showShadow
          ? [
              BoxShadow(
                color: isLight
                    ? AppTheme.cardShadow.withValues(alpha: 0.1)
                    : AppTheme.cardShadow.withValues(alpha: 0.3),
                blurRadius: 15,
                offset: const Offset(0, 5),
              ),
            ]
          : null,
      child: child,
    );

    if (onTap != null) {
      return GestureDetector(
        onTap: onTap,
        child: cardContent,
      );
    }

    return cardContent;
  }
}

class AnimatedGlassmorphismContainer extends StatefulWidget {
  final Widget child;
  final double? width;
  final double? height;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double borderRadius;
  final Duration animationDuration;
  final VoidCallback? onTap;

  const AnimatedGlassmorphismContainer({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius = 20.0,
    this.animationDuration = const Duration(milliseconds: 200),
    this.onTap,
  });

  @override
  State<AnimatedGlassmorphismContainer> createState() =>
      _AnimatedGlassmorphismContainerState();
}

class _AnimatedGlassmorphismContainerState
    extends State<AnimatedGlassmorphismContainer>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: widget.animationDuration,
      vsync: this,
    );

    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.95,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));

    _opacityAnimation = Tween<double>(
      begin: 1.0,
      end: 0.8,
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

  void _handleTapDown(TapDownDetails details) {
    _animationController.forward();
  }

  void _handleTapUp(TapUpDetails details) {
    _animationController.reverse();
    if (widget.onTap != null) {
      widget.onTap!();
    }
  }

  void _handleTapCancel() {
    _animationController.reverse();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: widget.onTap != null ? _handleTapDown : null,
      onTapUp: widget.onTap != null ? _handleTapUp : null,
      onTapCancel: widget.onTap != null ? _handleTapCancel : null,
      child: AnimatedBuilder(
        animation: _animationController,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: Opacity(
              opacity: _opacityAnimation.value,
              child: GlassmorphismContainer(
                width: widget.width,
                height: widget.height,
                padding: widget.padding,
                margin: widget.margin,
                borderRadius: widget.borderRadius,
                child: widget.child,
              ),
            ),
          );
        },
      ),
    );
  }
}
