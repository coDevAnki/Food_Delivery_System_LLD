import { FoodItem } from "./FoodItem";
/**
 * Menu is the container for a restaurant's food items.
 *
 * WHY THIS CLASS EXISTS:
 *   Without Menu, the Restaurant class would directly manage an array/map
 *   of FoodItems, mixing restaurant-level concerns (name, accepting orders)
 *   with menu management (add/remove/find items). Extracting Menu gives each
 *   class a single responsibility.
 *
 * RESPONSIBILITY:
 *   Owns the collection of FoodItems for one restaurant.
 *   Provides lookup, add, remove operations.
 *
 * RELATIONSHIP WITH RESTAURANT:
 *   Composition — Menu cannot exist without a Restaurant.
 *   If the Restaurant is deleted, its Menu goes with it.
 *
 * SOLID:
 *   SRP — Menu only manages the food item collection, not order logic.
 */
export declare class Menu {
    private readonly items;
    addItem(item: FoodItem): void;
    removeItem(itemId: string): void;
    getItem(itemId: string): FoodItem | undefined;
    getAllItems(): FoodItem[];
    getAvailableItems(): FoodItem[];
}
//# sourceMappingURL=Menu.d.ts.map