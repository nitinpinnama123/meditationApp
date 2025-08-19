import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const DailyQuote = () => {
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://dummyjson.com/quotes/random');
      if (response.ok) {
        const data = await response.json();
        setQuote(data.quote);
      } else {
        console.error('Error fetching quote:', response.status);
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
  <View style={styles.container}>
    {loading ? (
      <ActivityIndicator size="small" color="#0000ff" />
    ) : (
      <>
        <Text style={styles.quoteText}>"{quote}"</Text>
      </>
    )}
  </View>
);
}


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // replaced invalid 'border' key
    borderColor: '#ccc',
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 10,
    backgroundColor: '#fff',
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
});
export default DailyQuote;
