import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { Car, ChevronLeft, ChevronRight, Droplet, Settings, TrendingUp, Heart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Welcome to FuelMate',
    description: 'Track your fuel consumption, expenses, and vehicle maintenance all in one place.',
    icon: <Car size={80} color={Colors.dark.tint} />,
    image: 'https://images.unsplash.com/photo-1590424693420-7ec2743a69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
  },
  {
    id: 2,
    title: 'Add Your Vehicles',
    description: 'Add all your vehicles and track their fuel efficiency separately.',
    icon: <Car size={80} color={Colors.dark.tint} />,
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
  },
  {
    id: 3,
    title: 'Track Fuel Expenses',
    description: 'Log every fuel refill to track your spending and consumption over time.',
    icon: <Droplet size={80} color={Colors.dark.tint} />,
    image: 'https://images.unsplash.com/photo-1596461010918-e512160d8a07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
  },
  {
    id: 4,
    title: 'Analyze Efficiency',
    description: 'Get insights into your fuel efficiency and cost per distance traveled.',
    icon: <TrendingUp size={80} color={Colors.dark.accent} />,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
  },
  {
    id: 5,
    title: 'Made with Love',
    description: 'We hope you enjoy using FuelMate! Start tracking your fuel expenses now.',
    icon: <Heart size={80} color={Colors.dark.danger} />,
    image: 'https://images.unsplash.com/photo-1590424693420-7ec2743a69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
      scrollViewRef.current?.scrollTo({ x: width * (currentIndex + 1), animated: true });
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      scrollViewRef.current?.scrollTo({ x: width * (currentIndex - 1), animated: true });
    }
  };

  const handleFinish = () => {
    router.replace('/');
  };

  const handleSkip = () => {
    router.replace('/');
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        {currentIndex > 0 ? (
          <TouchableOpacity onPress={handlePrevious} style={styles.headerButton}>
            <ChevronLeft size={24} color={Colors.dark.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerButtonPlaceholder} />
        )}

        <View style={styles.paginationContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleSkip} style={styles.headerButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            {slide.image ? (
              <Image source={{ uri: slide.image }} style={styles.slideImage} />
            ) : (
              <View style={styles.iconContainer}>
                {slide.icon}
              </View>
            )}
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          variant="primary"
          icon={currentIndex === slides.length - 1 ? undefined : <ChevronRight size={18} color="#FFFFFF" />}
          iconPosition="right"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerButton: {
    padding: 8,
  },
  headerButtonPlaceholder: {
    width: 40,
  },
  skipText: {
    fontSize: 16,
    color: Colors.dark.text,
    fontWeight: '500',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.border,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.dark.tint,
    width: 16,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 32,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(250, 250, 250, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideImage: {
    width: 280,
    height: 200,
    borderRadius: 16,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 24,
  },
  button: {
    minWidth: 200,
    alignSelf: 'center',
  },
});