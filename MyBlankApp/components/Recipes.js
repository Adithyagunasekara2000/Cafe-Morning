import { useState } from "react";
import { Dimensions, ImageBackground, StyleSheet, Text, TextInput, View, FlatList } from "react-native";

const { width, height } = Dimensions.get('window');

export default function Recipes() {
    const [searchText, setSearchText] = useState("");
    const [data] = useState([
        { id: '1', name: 'Coffee Latte', ingredients: ['Espresso', 'Steamed Milk', 'Foamed Milk'], instructions: 'Brew espresso, steam milk, and pour over espresso. Top with foamed milk.' },
        { id: '2', name: 'Cappuccino', ingredients: ['Espresso', 'Steamed Milk', 'Foamed Milk'], instructions: 'Brew espresso, steam milk, and pour over espresso. Top with foamed milk.' },
        { id: '3', name: 'Iced Coffee', ingredients: ['Brewed Coffee', 'Ice', 'Milk or Cream'], instructions: 'Brew coffee, let it cool, pour over ice, and add milk or cream to taste.' },
        { id: '4', name: 'Mocha', ingredients: ['Espresso', 'Steamed Milk', 'Chocolate Syrup'], instructions: 'Brew espresso, steam milk, and mix with chocolate syrup. Top with whipped cream.' },
        { id: '5', name: 'Chai Latte', ingredients: ['Chai Tea', 'Steamed Milk', 'Spices'], instructions: 'Brew chai tea, steam milk, and mix together. Add spices to taste.' },
        { id: '6', name: 'Matcha Latte', ingredients: ['Matcha Powder', 'Steamed Milk', 'Sweetener'], instructions: 'Mix matcha powder with hot water, steam milk, and combine. Sweeten to taste.' },
    ]);

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/bg.jpg')}
                style={styles.backgroundImage}
                imageStyle={{ opacity: 0.5 }}
                resizeMode='cover'
            />

            <View style={styles.content}>
                <Text style={styles.head}>Recipes</Text>
                <TextInput
                    style={styles.search}
                    placeholder="Search..."
                    value={searchText}
                    onChangeText={text => setSearchText(text)}
                />

                <FlatList
                    data={filteredData}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.subHeading}>Ingredients:</Text>
                            {item.ingredients.map((ing, index) => (
                                <Text key={index} style={styles.ingredient}>• {ing}</Text>
                            ))}
                            <Text style={styles.subHeading}>Instructions:</Text>
                            <Text style={styles.instructions}>{item.instructions}</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    backgroundImage: {
        position: 'absolute',
        width: width,
        height: height,
    },
    content: {
        flex: 1,
        padding: 10,
    },
    search: {
        height: 60,
        borderColor: "#ccc",
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: "white",
    },
    head: {
        fontSize: 28,
        color: '#FFD700',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: "rgba(255,255,255,0.8)",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
    },
    itemName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: "#333",
    },
    subHeading: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 5,
        color: "#555",
    },
    ingredient: {
        fontSize: 14,
        color: "#444",
    },
    instructions: {
        fontSize: 14,
        color: "#333",
        marginTop: 5,
    },
});
