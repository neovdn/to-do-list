import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function FakeSplashScreen() {
  return (
    <View style={styles.container}>
      <Image 
        // 1. PASTIKAN PATH INI BENAR
        // Jika file ini di /components dan gambar di /assets, maka ../assets/
        source={require('../assets/splash.png')} 
        style={styles.logo}
        // 2. Gunakan 'contain' agar gambar tidak terpotong meski ukurannya beda
        resizeMode="contain" 
        onLoad={() => console.log("Gambar Berhasil Dimuat!")}
        onError={(e) => console.log("Gambar Gagal: ", e.nativeEvent.error)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Pakai warna yang sedikit berbeda dulu untuk tes posisi (misal: ungu gelap)
    backgroundColor: '#7C5CFC', 
    flex: 1,
    justifyContent: 'center', // Pusatkan vertikal
    alignItems: 'center',     // Pusatkan horizontal
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  logo: {
    // 3. Beri ukuran pasti. Jangan pakai persentase dulu agar stabil.
    width: width * 0.7, 
    height: width * 0.7,
    // borderWidth: 2, // Hapus tanda komentar ini untuk melihat kotak gambar
    // borderColor: 'white',
  },
});