import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text, } from 'react-native';
import ReadGoalCard from '@/components/library/ReadGoalCard';
import SectionHeader from '@/components/library/SectionHeader';
import SearchLibrary from '@/components/library/search.library';
import CollectionLibrary from '@/components/library/collection.library';
import BookShelfLibrary from '@/components/library/bookshelf.library';
import TagLibrary from '@/components/library/tag.library';

const ReadingScreen = () => {
  return (
    //<SafeAreaView style={styles.container}>
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={{fontSize:40,fontWeight:600}}>Thư viện</Text>
      <SearchLibrary/>
      <ReadGoalCard />

      <View style={styles.section}>
        <SectionHeader title="Reading" />
        <CollectionLibrary/>
      </View>
      <View style={styles.section}>
        <SectionHeader title="Bookshelf" />
        <BookShelfLibrary/>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Tags" />
        <TagLibrary/>
      </View>
    </ScrollView>
    //</SafeAreaView>
  );
};

// Stylesheet bây giờ chỉ chứa các style của riêng màn hình này
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 8,
  },
  horizontalScroll: {
    flexDirection: 'row',
    paddingHorizontal: 4, // Có thể điều chỉnh nếu cần
  },
});

export default ReadingScreen;