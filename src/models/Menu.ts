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
export class Menu {
  private readonly items: Map<string, FoodItem> = new Map();

  addItem(item: FoodItem): void {
    if (this.items.has(item.id)) {
      throw new Error(`Food item "${item.name}" already exists in menu`);
    }
    this.items.set(item.id, item);
  }

  removeItem(itemId: string): void {
    if (!this.items.has(itemId)) {
      throw new Error(`Food item with id "${itemId}" not found in menu`);
    }
    this.items.delete(itemId);
  }

  getItem(itemId: string): FoodItem | undefined {
    return this.items.get(itemId);
  }

  getAllItems(): FoodItem[] {
    return Array.from(this.items.values());
  }

  getAvailableItems(): FoodItem[] {
    return this.getAllItems().filter((item) => item.available);
  }
}
