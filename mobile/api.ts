import { Platform } from "react-native";

export const API_HOST =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ||
  (Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://localhost:3000");
const BASE_URL = `${API_HOST}/api`;

export interface Category {
  _id: string;
  name: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  basePrice: number;
  image?: string;
  sizes?: any[];
  extraIngredientPrices?: any[];
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    _id: "mock-1",
    name: "Margherita",
    description: "Phô mai mozzarella, sốt cà chua, lá basil.",
    basePrice: 90000,
    image:
      "https://images.unsplash.com/photo-1601924582975-7c375b6601b5?auto=format&fit=crop&w=600&q=80",
  },
  {
    _id: "mock-2",
    name: "Pepperoni",
    description: "Xúc xích pepperoni cay nhẹ, phô mai kéo sợi.",
    basePrice: 120000,
    image:
      "https://images.unsplash.com/photo-1548365328-9f547b772014?auto=format&fit=crop&w=600&q=80",
  },
  {
    _id: "mock-3",
    name: "Veggie",
    description: "Nấm, ớt chuông, hành tây, bắp ngọt.",
    basePrice: 100000,
    image:
      "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80",
  },
  {
    _id: "mock-4",
    name: "Hawaiian",
    description: "Dứa, giăm bông, sốt cà chua, phô mai mozzarella.",
    basePrice: 110000,
    image:
      "https://images.unsplash.com/photo-1601924579440-209a8180de87?auto=format&fit=crop&w=600&q=80",
  },
  {
    _id: "mock-5",
    name: "BBQ Chicken",
    description: "Gà nướng, sốt BBQ, hành tây, phô mai cheddar.",
    basePrice: 135000,
    image:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=600&q=80",
  },
  {
    _id: "mock-6",
    name: "Seafood",
    description: "Tôm, mực, sốt trắng, phô mai và rau thơm.",
    basePrice: 150000,
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80",
  },
];

// ===== Categories =====
export async function getCategories(): Promise<Category[]> {
  const url = `${BASE_URL}/categories`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${url} -> ${res.status} ${res.statusText}\n${text}`);
  }

  return res.json();
}

// ===== Menu items =====
export async function getMenuItems(): Promise<MenuItem[]> {
  // Tạm thời chỉ dùng dữ liệu mock, không gọi backend
  return MOCK_MENU_ITEMS;
}

// ===== Register (nếu sau này dùng) =====
export async function registerUser(data: RegisterPayload) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to register");
  return json;
}
