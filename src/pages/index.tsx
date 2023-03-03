import { Box, Divider, ListItem, UnorderedList } from "@chakra-ui/react";

export default function Home() {
    return (
        <Box m={"auto"} mt={"60px"} w={"60%"}>
            <Box>
                The Kaggle dataset on sold used cars in the period 1983-2020
                contains information on over 370,000 used cars sold in the
                United States. The dataset includes details on various features
                of the cars, such as make, model, year, mileage, price, and
                location of sale. This dataset is frequently used for analysis
                and modeling tasks such as predicting the price of a used car
                based on its features or identifying trends in the used car
                market over time.
            </Box>
            <Divider mt={"20px"} mb={"20px"} />
            Attributes
            <UnorderedList>
                <ListItem> name: Name of the car</ListItem>
                <ListItem> year: Year when the car was bought </ListItem>
                <ListItem>selling_price: Selling price of the car</ListItem>
                <ListItem>
                    km_driven: Number of kilometers the car is driven
                </ListItem>
                <ListItem> fuel: Fuel economy in Highway Conditions</ListItem>
                <ListItem> seller_type: Seller type for the car</ListItem>
                <ListItem> transmission: Type of transmission </ListItem>
                <ListItem> owner: Number of previous owners </ListItem>
                <ListItem> mileage: Mileage of the car engine </ListItem>
                <ListItem> Engine capacity: of the car </ListItem>
                <ListItem> max_power: Maximum power of the engine </ListItem>
                <ListItem> torque: Torque output of the car</ListItem>
                <ListItem> seats: Number of seats in car</ListItem>
            </UnorderedList>
        </Box>
    );
}
