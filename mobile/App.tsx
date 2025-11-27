import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  RefreshControl,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ScrollView as HorizontalScrollView,
  Platform,
} from "react-native";
import { API_HOST, getMenuItems, MenuItem } from "./api";

type TabKey = "home" | "menu" | "about" | "cart" | "account" | "order";
const NAV_ITEMS: { key: TabKey; label: string }[] = [
  { key: "home", label: "Trang chủ" },
  { key: "menu", label: "Menu" },
  { key: "cart", label: "Giỏ hàng" },
  { key: "order", label: "Đặt món" },
  { key: "account", label: "Tài khoản" },
  { key: "about", label: "Giới thiệu" },
];

type CartItem = { item: MenuItem; qty: number };
type User = { email: string; name?: string };

export default function App() {
  const topInset = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<TabKey>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([
    { email: "demo@foodfast.dev", name: "Demo User" },
  ]);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [orderForm, setOrderForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setError(null);
      const data = await getMenuItems();
      setItems(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể tải menu từ backend."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item._id === item._id);
      if (existing) {
        return prev.map((c) =>
          c.item._id === item._id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { item, qty: 1 }];
    });
    setTab("cart");
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.item._id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c
        )
        .filter((c) => c.qty > 0)
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (sum, c) => sum + c.item.basePrice * c.qty,
    0
  );

  const handleLogin = () => {
    setAuthMessage(null);
    const email = loginForm.email.trim().toLowerCase();
    const found = registeredUsers.find((u) => u.email === email);
    if (!email) {
      setAuthMessage("Nhập email để đăng nhập.");
      return;
    }
    if (!found) {
      setAuthMessage("Email chưa đăng ký. Vui lòng đăng ký trước.");
      return;
    }
    setUser(found);
    setAuthMessage("Đăng nhập thành công.");
  };

  const handleRegister = () => {
    setAuthMessage(null);
    const email = registerForm.email.trim().toLowerCase();
    const name = registerForm.name.trim() || "User";
    if (!email) {
      setAuthMessage("Email không hợp lệ.");
      return;
    }
    if (registeredUsers.some((u) => u.email === email)) {
      setAuthMessage("Email đã tồn tại, hãy đăng nhập.");
      return;
    }
    const newUser = { email, name };
    setRegisteredUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    setAuthMessage("Đăng ký thành công.");
  };

  const handleLogout = () => {
    setUser(null);
    setAuthMessage("Đã đăng xuất.");
  };

  const handlePlaceOrder = () => {
    setOrderStatus(null);
    if (!cart.length) {
      setOrderStatus("Giỏ hàng đang trống.");
      return;
    }
    if (!orderForm.name || !orderForm.phone || !orderForm.address) {
      setOrderStatus("Vui lòng nhập đủ họ tên, số điện thoại và địa chỉ.");
      return;
    }
    setOrderStatus(
      `Đặt món thành công! Tổng: ${formatPrice(cartTotal)} đ. Chúng tôi sẽ liên hệ sớm.`
    );
    clearCart();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <Text style={styles.errorHint}>
          Kiểm tra server Next.js chạy ở {API_HOST}
        </Text>
      </SafeAreaView>
    );
  }

  const renderHero = () => (
    <View style={styles.hero}>
      <View style={{ flex: 1, gap: 8 }}>
        <Text style={styles.heroKicker}>ST PIZZA</Text>
        <Text style={styles.heroTitle}>Everything is better with a pizza</Text>
        <Text style={styles.heroDesc}>
          Pizza is the missing piece that makes every day complete, a simple yet
          delicious joy in life.
        </Text>
        <View style={styles.heroActions}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={() => setTab("menu")}
          >
            <Text style={styles.buttonPrimaryText}>Order now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonGhost]}
            onPress={() => setTab("about")}
          >
            <Text style={styles.buttonGhostText}>Learn more</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1601924582975-7c375b6601b5?auto=format&fit=crop&w=400&q=80",
        }}
        style={styles.heroImage}
      />
    </View>
  );

  const renderAbout = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>About</Text>
      <Text style={styles.sectionDesc}>
        ST Pizza mang đến hương vị Ý hiện đại, nguyên liệu tươi và quy trình
        nướng chuẩn. Chọn món yêu thích, thêm topping riêng, và tận hưởng giao
        hàng nhanh trong khu vực của bạn.
      </Text>
    </View>
  );

  const renderMenuGrid = () => (
    <FlatList
      data={items}
      keyExtractor={(item) => item._id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
              <Text style={styles.cardPlaceholderText}>No Image</Text>
            </View>
          )}
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            {item.description ? (
              <Text style={styles.cardDesc} numberOfLines={2}>
                {item.description}
              </Text>
            ) : null}
            <Text style={styles.cardPrice}>{formatPrice(item.basePrice)} đ</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.buttonPrimaryText}>Thêm vào giỏ</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListEmptyComponent={
        <Text style={{ textAlign: "center" }}>
          Hiện tại chưa có món nào trong database.
        </Text>
      }
    />
  );

  const renderCart = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Giỏ hàng</Text>
      {!cart.length ? (
        <Text style={styles.sectionDesc}>Chưa có món nào.</Text>
      ) : (
        <>
          {cart.map((c) => (
            <View key={c.item._id} style={styles.cartRow}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.cartTitle}>{c.item.name}</Text>
                <Text style={styles.cartSubtitle}>
                  {formatPrice(c.item.basePrice)} đ x {c.qty}
                </Text>
              </View>
              <View style={styles.cartActions}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateCartQty(c.item._id, -1)}
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateCartQty(c.item._id, 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <View style={styles.cartFooter}>
            <Text style={styles.cartTotalLabel}>Tổng</Text>
            <Text style={styles.cartTotalValue}>{formatPrice(cartTotal)} đ</Text>
          </View>
          <TouchableOpacity
            style={[styles.button, styles.buttonGhost]}
            onPress={clearCart}
          >
            <Text style={styles.buttonGhostText}>Xóa giỏ hàng</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const renderAccount = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {user ? `Xin chào, ${user.name || user.email}` : "Tài khoản của bạn"}
      </Text>
      {authMessage ? <Text style={styles.sectionDesc}>{authMessage}</Text> : null}

      {user ? (
        <View style={styles.authCard}>
          <Text style={styles.sectionLabel}>Thông tin</Text>
          <Text style={styles.authHint}>{user.email}</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={[styles.button, styles.buttonGhost, { flex: 1 }]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonGhostText}>Đăng xuất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary, { flex: 1 }]}
              onPress={() => setTab("order")}
            >
              <Text style={styles.buttonPrimaryText}>Đi tới đặt món</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.authToggle}>
            <TouchableOpacity
              style={[
                styles.authToggleBtn,
                authMode === "login" && styles.authToggleBtnActive,
              ]}
              onPress={() => setAuthMode("login")}
            >
              <Text
                style={[
                  styles.authToggleText,
                  authMode === "login" && styles.authToggleTextActive,
                ]}
              >
                Đăng nhập
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.authToggleBtn,
                authMode === "register" && styles.authToggleBtnActive,
              ]}
              onPress={() => setAuthMode("register")}
            >
              <Text
                style={[
                  styles.authToggleText,
                  authMode === "register" && styles.authToggleTextActive,
                ]}
              >
                Đăng ký
              </Text>
            </TouchableOpacity>
          </View>

          {authMode === "login" ? (
            <View style={styles.authCard}>
              <Text style={styles.sectionLabel}>Chào mừng trở lại</Text>
              <Text style={styles.authHint}>
                Nhập email để đăng nhập nhanh (mock).
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                value={loginForm.email}
                onChangeText={(text) =>
                  setLoginForm((f) => ({ ...f, email: text }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu (không kiểm tra)"
                secureTextEntry
                value={loginForm.password}
                onChangeText={(text) =>
                  setLoginForm((f) => ({ ...f, password: text }))
                }
              />
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleLogin}
              >
                <Text style={styles.buttonPrimaryText}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.authCard}>
              <Text style={styles.sectionLabel}>Tạo tài khoản mới</Text>
              <Text style={styles.authHint}>
                Đăng ký nhanh, dữ liệu lưu cục bộ để demo.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Tên"
                value={registerForm.name}
                onChangeText={(text) =>
                  setRegisterForm((f) => ({ ...f, name: text }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                value={registerForm.email}
                onChangeText={(text) =>
                  setRegisterForm((f) => ({ ...f, email: text }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                secureTextEntry
                value={registerForm.password}
                onChangeText={(text) =>
                  setRegisterForm((f) => ({ ...f, password: text }))
                }
              />
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleRegister}
              >
                <Text style={styles.buttonPrimaryText}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );

  const renderOrder = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Đặt món</Text>
      <Text style={styles.sectionDesc}>
        Nhập thông tin nhận hàng. Đây là form mock, chưa gửi backend.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Họ tên"
        value={orderForm.name}
        onChangeText={(text) => setOrderForm((f) => ({ ...f, name: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        value={orderForm.phone}
        onChangeText={(text) => setOrderForm((f) => ({ ...f, phone: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ"
        value={orderForm.address}
        onChangeText={(text) => setOrderForm((f) => ({ ...f, address: text }))}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Ghi chú (tùy chọn)"
        multiline
        value={orderForm.note}
        onChangeText={(text) => setOrderForm((f) => ({ ...f, note: text }))}
      />
      <View style={styles.cartFooter}>
        <Text style={styles.cartTotalLabel}>Tổng tạm tính</Text>
        <Text style={styles.cartTotalValue}>{formatPrice(cartTotal)} đ</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, styles.buttonPrimary]}
        onPress={handlePlaceOrder}
      >
        <Text style={styles.buttonPrimaryText}>Xác nhận đặt hàng</Text>
      </TouchableOpacity>
      {orderStatus ? (
        <Text style={[styles.sectionDesc, { marginTop: 6 }]}>{orderStatus}</Text>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: topInset }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            load();
          }} />
        }
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.topbar}>
          <View>
            <Text style={styles.brand}>ST Pizza</Text>
            <Text style={styles.brandSub}>
              {user ? `Xin chào, ${user.name || user.email}` : "Pizza your way"}
            </Text>
          </View>
          <View style={styles.topActions}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cart.length}</Text>
              <Text style={styles.badgeLabel}>giỏ</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: "#e53935" }]}>
              <Text style={styles.badgeText}>
                {formatPrice(cartTotal)} đ
              </Text>
              <Text style={styles.badgeLabel}>tạm tính</Text>
            </View>
          </View>
        </View>

        <HorizontalScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.nav}
        >
          {NAV_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.key}
              onPress={() => setTab(item.key)}
              style={[
                styles.navItem,
                tab === item.key && styles.navItemActive,
              ]}
            >
              <Text
                style={[
                  styles.navText,
                  tab === item.key && styles.navTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </HorizontalScrollView>

        {tab === "home" && renderHero()}

        {(tab === "home" || tab === "menu") && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>
                {tab === "menu" ? "Menu hôm nay" : "Khám phá"}
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{items.length}</Text>
                <Text style={styles.badgeLabel}>món</Text>
              </View>
            </View>
            {renderMenuGrid()}
          </>
        )}

        {tab === "cart" && renderCart()}
        {tab === "account" && renderAccount()}
        {tab === "order" && renderOrder()}
        {tab === "about" && renderAbout()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f9",
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  topbar: {
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: 22,
    fontWeight: "800",
    color: "#e53935",
  },
  brandSub: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  topActions: {
    flexDirection: "row",
    gap: 8,
  },
  nav: {
    paddingVertical: 8,
    gap: 10,
  },
  navItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#eceff3",
  },
  navItemActive: {
    backgroundColor: "#111",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  navText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
  },
  navTextActive: {
    color: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
  },
  badge: {
    backgroundColor: "#111",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  badgeLabel: {
    color: "#e4e4e7",
    fontSize: 12,
  },
  hero: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f5",
  },
  heroKicker: {
    fontSize: 13,
    fontWeight: "700",
    color: "#e53935",
    letterSpacing: 0.4,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  heroDesc: {
    fontSize: 14,
    color: "#555",
  },
  heroActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  heroImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
  },
  button: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  buttonPrimary: {
    backgroundColor: "#e53935",
  },
  buttonPrimaryText: {
    color: "#fff",
    fontWeight: "700",
  },
  buttonGhost: {
    backgroundColor: "#f1f1f5",
  },
  buttonGhostText: {
    color: "#111",
    fontWeight: "700",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },
  errorHint: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 24,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    overflow: "hidden",
  },
  cardImage: {
    height: 120,
    width: "100%",
    backgroundColor: "#f2f2f2",
  },
  cardImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardPlaceholderText: {
    color: "#999",
    fontSize: 12,
  },
  cardBody: {
    padding: 12,
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  cardDesc: {
    fontSize: 13,
    color: "#555",
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#e53935",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    marginBottom: 8,
  },
  cartRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f5",
  },
  cartTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },
  cartSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  cartActions: {
    flexDirection: "row",
    gap: 6,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  cartFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  cartTotalLabel: {
    fontSize: 15,
    color: "#444",
  },
  cartTotalValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#e53935",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  sectionDesc: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  authToggle: {
    flexDirection: "row",
    backgroundColor: "#eceff3",
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
    gap: 6,
  },
  authToggleBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  authToggleBtnActive: {
    backgroundColor: "#111",
  },
  authToggleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
  },
  authToggleTextActive: {
    color: "#fff",
  },
  authCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#f0f0f5",
    gap: 8,
  },
  authHint: {
    fontSize: 13,
    color: "#666",
  },
});
